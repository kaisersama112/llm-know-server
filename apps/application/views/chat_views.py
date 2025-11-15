# coding=utf-8
"""
    @project: maxkb
    @AuthorCODEX
    @filechat_views.py
    @date2025/11/14 9:53
    @desc:这是open ai的聊天接口
"""

import json
import os

import httpx
from django.http import JsonResponse, StreamingHttpResponse
from django.utils.translation import gettext_lazy as _
from django.views import View
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.views import APIView

from application.serializers.chat_message_serializers import ChatMessageSerializer, OpenAIChatSerializer
from application.serializers.chat_serializers import ChatSerializers, ChatRecordSerializer
from application.swagger_api.chat_api import ChatApi, VoteApi, ChatRecordApi, ImproveApi, ChatRecordImproveApi, \
    ChatClientHistoryApi, OpenAIChatApi
from common.auth import TokenAuth, has_permissions, OpenAIKeyAuth
from common.constants.authentication_type import AuthenticationType
from common.constants.permission_constants import Permission, Group, Operate, \
    RoleConstants, ViewPermission, CompareConstants
from common.response import result
from common.util.common import query_params_to_single_dict
from dataset.serializers.file_serializers import FileSerializer

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


class Openai(APIView):
    authentication_classes = [OpenAIKeyAuth]

    @action(methods=['POST'], detail=False)
    @swagger_auto_schema(operation_summary=_("OpenAI Interface Dialogue"),
                         operation_id=_("OpenAI Interface Dialogue"),
                         request_body=OpenAIChatApi.get_request_body_api(),
                         tags=[_("OpenAI Dialogue")])
    def post(self, request: Request, application_id: str):
        return OpenAIChatSerializer(data={'application_id': application_id, 'client_id': request.auth.client_id,
                                          'client_type': request.auth.client_type}).chat(request.data)


class OpenAIChatProxy(View):
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        if not OPENAI_API_KEY:
            return JsonResponse({"message": "Missing OPENAI_API_KEY"}, status=500)

        try:
            body = json.loads(request.body.decode('utf-8') or '{}')
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON payload"}, status=400)

        history = body.get('history') or []
        prompt = body.get('prompt') or ''
        effort = body.get('effort') or 'medium'
        if not prompt:
            return JsonResponse({"message": "Prompt is required"}, status=400)

        # 过滤非法 history
        normalized_history = [
            item for item in history
            if isinstance(item, dict) and item.get('role') and item.get('content')
        ]

        # 之前已有多少条用户消息（不含当前这一条）
        user_turns = sum(1 for item in normalized_history if item.get('role') == 'user')

        # 当前这一轮的完整 messages（给 /v1/responses 用）
        inputs = [*normalized_history, {'role': 'user', 'content': prompt}]

        def build_simple_response(message: str):
            """简单 SSE 输出 create_ai 或提示语"""
            def generator():
                payload = json.dumps({"delta": message}, ensure_ascii=False)
                yield f"data: {payload}\n\n".encode('utf-8')
                yield b"data: [DONE]\n\n"

            return StreamingHttpResponse(generator(), content_type='text/event-stream')

        normalized = prompt.lower()

        # === 0. 关键词直接触发创建 AI（最高优先级） ===
        if ('创建' in prompt) or ('作成' in prompt) or ('create' in normalized):
            return build_simple_response('create_ai')

        # === 1. 判断上一轮是否问过“要不要创建 AI”，如果这轮是肯定回答，则直接 create_ai ===

        # 找出最后一条助手消息
        last_assistant_msg = None
        for item in reversed(normalized_history):
            if item.get('role') == 'assistant':
                last_assistant_msg = item.get('content') or ''
                break

        asked_create_ai = False
        if last_assistant_msg:
            la_lower = last_assistant_msg.lower()
            # 根据你实际的提问文案来判断，这里是一个大概的规则
            if (
                ('创建' in last_assistant_msg and 'ai' in la_lower)
                or ('专属 ai' in last_assistant_msg)
                or ('create' in la_lower and 'ai' in la_lower)
            ):
                asked_create_ai = True

        is_yes = False
        # 这里加一层轮次判断，你说“第四轮判断”，就限制在 user_turns >= 3 时再触发
        if asked_create_ai and user_turns >= 2:
            try:
                timeout = httpx.Timeout(15.0, read=15.0)
                with httpx.Client(timeout=timeout) as client:
                    classify_payload = {
                        "model": "gpt-4o-mini",  # 轻量模型做意图分类即可
                        "messages": [
                            {
                                "role": "system",
                                "content": (
                                    "你是一个意图分类器，只能回答 'yes' 或 'no'。"
                                    "AI 在上一轮问用户是否需要创建一个 AI 助手。"
                                    "现在给你用户的这一句回复，请判断用户是否明确同意创建 AI。"
                                    "同意、可以、好、没问题、帮我创建、试试、开始吧等 = yes。"
                                    "拒绝、没兴趣、否定、不相关或听不懂 = no。"
                                    "只输出小写 'yes' 或 'no'，不要输出其他任何内容。"
                                )
                            },
                            {
                                "role": "user",
                                "content": (
                                    f"AI 上一轮的提问：{last_assistant_msg}\n"
                                    f"用户这一轮的回答：{prompt}"
                                )
                            }
                        ]
                    }
                    resp = client.post(
                        "https://api.openai.com/v1/chat/completions",
                        headers={
                            "Authorization": f"Bearer {OPENAI_API_KEY}",
                            "Content-Type": "application/json",
                        },
                        json=classify_payload,
                    )
                    resp.raise_for_status()
                    data = resp.json()
                    content = (
                        data.get("choices", [{}])[0]
                        .get("message", {})
                        .get("content", "")
                        .strip()
                        .lower()
                    )
                    if "yes" in content:
                        is_yes = True
            except httpx.HTTPError:
                # 分类失败就当没触发，继续正常对话
                is_yes = False

        # 如果判定为“同意创建 AI” ➜ 直接返回 create_ai
        if is_yes:
            return build_simple_response('create_ai')

        # === 2. 到了第 4 句用户消息时，让 OpenAI 在回答末尾顺带问要不要创建 AI ===

        extra_system_message = None
        # user_turns == 3：说明之前有 3 条 user 消息，这一条是第 4 条
        if user_turns == 2:
            extra_system_message = {
                "role": "system",
                "content": (
                    "在本轮对话中，请先正常、完整地回答用户的问题。"
                    "然后在回答的最后，用一句简短的中文补充一句："
                    "“顺便一提，我也可以帮你创建一个专属 AI，需要我帮忙吗？”。"
                    "请务必把这句话放在回答的最后一行，不要放在开头，需要对应用户prompt的语言。"
                )
            }

        if extra_system_message:
            inputs_for_openai = [extra_system_message, *inputs]
        else:
            inputs_for_openai = inputs

        # === 3. 正常走 /v1/responses 的流式对话 ===

        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json",
            "Accept": "text/event-stream"
        }
        payload = {
            "model": "gpt-5",
            "stream": True,
            "input": inputs_for_openai,
            "reasoning": {"effort": effort}
        }

        def stream():
            timeout = httpx.Timeout(60.0, read=None)
            try:
                with httpx.Client(timeout=timeout) as client:
                    with client.stream(
                        "POST",
                        "https://api.openai.com/v1/responses",
                        headers=headers,
                        json=payload,
                    ) as resp:
                        resp.raise_for_status()
                        for chunk in resp.iter_bytes():
                            if chunk:
                                yield chunk
            except httpx.HTTPError as exc:
                message = f"data: [error] {str(exc)}\n\n"
                yield message.encode('utf-8')

        return StreamingHttpResponse(stream(), content_type='text/event-stream')


class ChatView(APIView):
    authentication_classes = [TokenAuth]

    class Export(APIView):
        authentication_classes = [TokenAuth]

        @action(methods=['POST'], detail=False)
        @swagger_auto_schema(operation_summary=_("Export conversation"),
                             operation_id=_("Export conversation"),
                             manual_parameters=ChatApi.get_request_params_api(),
                             tags=[_("Application/Conversation Log")]
                             )
        @has_permissions(
            ViewPermission([RoleConstants.ADMIN, RoleConstants.USER, RoleConstants.APPLICATION_KEY],
                           [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                           dynamic_tag=keywords.get('application_id'))])
        )
        def post(self, request: Request, application_id: str):
            return ChatSerializers.Query(
                data={**query_params_to_single_dict(request.query_params), 'application_id': application_id,
                      'user_id': request.user.id}).export(request.data)

    class Open(APIView):
        authentication_classes = [TokenAuth]

        @action(methods=['GET'], detail=False)
        @swagger_auto_schema(operation_summary=_("Get the session id according to the application id"),
                             operation_id=_("Get the session id according to the application id"),
                             manual_parameters=ChatApi.OpenChat.get_request_params_api(),
                             tags=[_("Application/Chat")])
        @has_permissions(
            ViewPermission([RoleConstants.ADMIN, RoleConstants.USER, RoleConstants.APPLICATION_ACCESS_TOKEN,
                            RoleConstants.APPLICATION_KEY],
                           [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                           dynamic_tag=keywords.get('application_id'))],
                           compare=CompareConstants.AND)
        )
        def get(self, request: Request, application_id: str):
            return result.success(ChatSerializers.OpenChat(
                data={'user_id': request.user.id, 'application_id': application_id}).open())

    class OpenWorkFlowTemp(APIView):
        authentication_classes = [TokenAuth]

        @action(methods=['POST'], detail=False)
        @swagger_auto_schema(operation_summary=_("Get the workflow temporary session id"),
                             operation_id=_("Get the workflow temporary session id"),
                             request_body=ChatApi.OpenWorkFlowTemp.get_request_body_api(),
                             tags=[_("Application/Chat")])
        def post(self, request: Request):
            return result.success(ChatSerializers.OpenWorkFlowChat(
                data={**request.data, 'user_id': request.user.id}).open())

    class OpenTemp(APIView):
        authentication_classes = [TokenAuth]

        @action(methods=['POST'], detail=False)
        @swagger_auto_schema(operation_summary=_("Get a temporary session id"),
                             operation_id=_("Get a temporary session id"),
                             request_body=ChatApi.OpenTempChat.get_request_body_api(),
                             tags=[_("Application/Chat")])
        @has_permissions(RoleConstants.ADMIN, RoleConstants.USER)
        def post(self, request: Request):
            return result.success(ChatSerializers.OpenTempChat(
                data={**request.data, 'user_id': request.user.id}).open())

    class Message(APIView):
        authentication_classes = [TokenAuth]

        @action(methods=['POST'], detail=False)
        @swagger_auto_schema(operation_summary=_("dialogue"),
                             operation_id=_("dialogue"),
                             request_body=ChatApi.get_request_body_api(),
                             tags=[_("Application/Chat")])
        @has_permissions(
            ViewPermission([RoleConstants.ADMIN, RoleConstants.USER, RoleConstants.APPLICATION_KEY,
                            RoleConstants.APPLICATION_ACCESS_TOKEN],
                           [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                           dynamic_tag=keywords.get('application_id'))])
        )
        def post(self, request: Request, chat_id: str):
            return ChatMessageSerializer(data={'chat_id': chat_id, 'message': request.data.get('message'),
                                               're_chat': (request.data.get(
                                                   're_chat') if 're_chat' in request.data else False),
                                               'stream': (request.data.get(
                                                   'stream') if 'stream' in request.data else True),
                                               'application_id': (request.auth.keywords.get(
                                                   'application_id') if request.auth.client_type == AuthenticationType.APPLICATION_ACCESS_TOKEN.value else None),
                                               'client_id': request.auth.client_id,
                                               'form_data': (request.data.get(
                                                   'form_data') if 'form_data' in request.data else {}),

                                               'image_list': request.data.get(
                                                   'image_list') if 'image_list' in request.data else [],
                                               'document_list': request.data.get(
                                                   'document_list') if 'document_list' in request.data else [],
                                               'audio_list': request.data.get(
                                                   'audio_list') if 'audio_list' in request.data else [],
                                               'client_type': request.auth.client_type,
                                               'node_id': request.data.get('node_id', None),
                                               'runtime_node_id': request.data.get('runtime_node_id', None),
                                               'node_data': request.data.get('node_data', {}),
                                               'chat_record_id': request.data.get('chat_record_id'),
                                               'child_node': request.data.get('child_node')}
                                         ).chat()

    @action(methods=['GET'], detail=False)
    @swagger_auto_schema(operation_summary=_("Get the conversation list"),
                         operation_id=_("Get the conversation list"),
                         manual_parameters=ChatApi.get_request_params_api(),
                         responses=result.get_api_array_response(ChatApi.get_response_body_api()),
                         tags=[_("Application/Conversation Log")]
                         )
    @has_permissions(
        ViewPermission([RoleConstants.ADMIN, RoleConstants.USER, RoleConstants.APPLICATION_KEY],
                       [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                       dynamic_tag=keywords.get('application_id'))])
    )
    def get(self, request: Request, application_id: str):
        return result.success(ChatSerializers.Query(
            data={**query_params_to_single_dict(request.query_params), 'application_id': application_id,
                  'user_id': request.user.id}).list())

    class Operate(APIView):
        authentication_classes = [TokenAuth]

        @action(methods=['DELETE'], detail=False)
        @swagger_auto_schema(operation_summary=_("Delete a conversation"),
                             operation_id=_("Delete a conversation"),
                             tags=[_("Application/Conversation Log")])
        @has_permissions(ViewPermission(
            [RoleConstants.ADMIN, RoleConstants.USER],
            [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.MANAGE,
                                            dynamic_tag=keywords.get('application_id'))],
            compare=CompareConstants.AND),
            compare=CompareConstants.AND)
        def delete(self, request: Request, application_id: str, chat_id: str):
            return result.success(
                ChatSerializers.Operate(
                    data={'application_id': application_id, 'user_id': request.user.id,
                          'chat_id': chat_id}).delete())

    class ClientChatHistoryPage(APIView):
        authentication_classes = [TokenAuth]

        @action(methods=['GET'], detail=False)
        @swagger_auto_schema(operation_summary=_("Get client conversation list by paging"),
                             operation_id=_("Get client conversation list by paging"),
                             manual_parameters=result.get_page_request_params(
                                 ChatClientHistoryApi.get_request_params_api()),
                             responses=result.get_page_api_response(ChatApi.get_response_body_api()),
                             tags=[_("Application/Conversation Log")]
                             )
        @has_permissions(
            ViewPermission([RoleConstants.APPLICATION_ACCESS_TOKEN],
                           [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                           dynamic_tag=keywords.get('application_id'))])
        )
        def get(self, request: Request, application_id: str, current_page: int, page_size: int):
            return result.success(ChatSerializers.ClientChatHistory(
                data={'client_id': request.auth.client_id, 'application_id': application_id}).page(
                current_page=current_page,
                page_size=page_size))

        class Operate(APIView):
            authentication_classes = [TokenAuth]

            @action(methods=['DELETE'], detail=False)
            @swagger_auto_schema(operation_summary=_("Client deletes conversation"),
                                 operation_id=_("Client deletes conversation"),
                                 tags=[_("Application/Conversation Log")])
            @has_permissions(ViewPermission(
                [RoleConstants.APPLICATION_ACCESS_TOKEN],
                [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                dynamic_tag=keywords.get('application_id'))],
                compare=CompareConstants.AND),
                compare=CompareConstants.AND)
            def delete(self, request: Request, application_id: str, chat_id: str):
                return result.success(
                    ChatSerializers.Operate(
                        data={'application_id': application_id, 'user_id': request.user.id,
                              'chat_id': chat_id}).logic_delete())

            @action(methods=['PUT'], detail=False)
            @swagger_auto_schema(operation_summary=_("Client modifies dialogue summary"),
                                 operation_id=_("Client modifies dialogue summary"),
                                 request_body=ChatClientHistoryApi.Operate.ReAbstract.get_request_body_api(),
                                 tags=[_("Application/Conversation Log")])
            @has_permissions(ViewPermission(
                [RoleConstants.APPLICATION_ACCESS_TOKEN],
                [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                dynamic_tag=keywords.get('application_id'))],
                compare=CompareConstants.AND),
                compare=CompareConstants.AND)
            def put(self, request: Request, application_id: str, chat_id: str):
                return result.success(
                    ChatSerializers.Operate(
                        data={'application_id': application_id, 'user_id': request.user.id,
                              'chat_id': chat_id}).re_abstract(request.data))

    class Page(APIView):
        authentication_classes = [TokenAuth]

        @action(methods=['GET'], detail=False)
        @swagger_auto_schema(operation_summary=_("Get the conversation list by page"),
                             operation_id=_("Get the conversation list by page"),
                             manual_parameters=result.get_page_request_params(ChatApi.get_request_params_api()),
                             responses=result.get_page_api_response(ChatApi.get_response_body_api()),
                             tags=[_("Application/Conversation Log")]
                             )
        @has_permissions(
            ViewPermission([RoleConstants.ADMIN, RoleConstants.USER, RoleConstants.APPLICATION_KEY],
                           [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                           dynamic_tag=keywords.get('application_id'))])
        )
        def get(self, request: Request, application_id: str, current_page: int, page_size: int):
            return result.success(ChatSerializers.Query(
                data={**query_params_to_single_dict(request.query_params), 'application_id': application_id,
                      'user_id': request.user.id}).page(current_page=current_page,
                                                        page_size=page_size))

    class ChatRecord(APIView):
        authentication_classes = [TokenAuth]

        class Operate(APIView):
            authentication_classes = [TokenAuth]

            @action(methods=['GET'], detail=False)
            @swagger_auto_schema(operation_summary=_("Get conversation record details"),
                                 operation_id=_("Get conversation record details"),
                                 manual_parameters=ChatRecordApi.get_request_params_api(),
                                 responses=result.get_api_array_response(ChatRecordApi.get_response_body_api()),
                                 tags=[_("Application/Conversation Log")]
                                 )
            @has_permissions(
                ViewPermission([RoleConstants.ADMIN, RoleConstants.USER, RoleConstants.APPLICATION_KEY,
                                RoleConstants.APPLICATION_ACCESS_TOKEN],
                               [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                               dynamic_tag=keywords.get('application_id'))])
            )
            def get(self, request: Request, application_id: str, chat_id: str, chat_record_id: str):
                return result.success(ChatRecordSerializer.Operate(
                    data={'application_id': application_id,
                          'chat_id': chat_id,
                          'chat_record_id': chat_record_id}).one(request.auth.current_role))

        @action(methods=['GET'], detail=False)
        @swagger_auto_schema(operation_summary=_("Get a list of conversation records"),
                             operation_id=_("Get a list of conversation records"),
                             manual_parameters=ChatRecordApi.get_request_params_api(),
                             responses=result.get_api_array_response(ChatRecordApi.get_response_body_api()),
                             tags=[_("Application/Conversation Log")]
                             )
        @has_permissions(
            ViewPermission([RoleConstants.ADMIN, RoleConstants.USER, RoleConstants.APPLICATION_KEY],
                           [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                           dynamic_tag=keywords.get('application_id'))])
        )
        def get(self, request: Request, application_id: str, chat_id: str):
            return result.success(ChatRecordSerializer.Query(
                data={'application_id': application_id,
                      'chat_id': chat_id, 'order_asc': request.query_params.get('order_asc')}).list())

        class Page(APIView):
            authentication_classes = [TokenAuth]

            @action(methods=['GET'], detail=False)
            @swagger_auto_schema(operation_summary=_("Get the conversation history list by page"),
                                 operation_id=_("Get the conversation history list by page"),
                                 manual_parameters=result.get_page_request_params(
                                     ChatRecordApi.get_request_params_api()),
                                 responses=result.get_page_api_response(ChatRecordApi.get_response_body_api()),
                                 tags=[_("Application/Conversation Log")]
                                 )
            @has_permissions(
                ViewPermission([RoleConstants.ADMIN, RoleConstants.USER, RoleConstants.APPLICATION_KEY],
                               [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                               dynamic_tag=keywords.get('application_id'))])
            )
            def get(self, request: Request, application_id: str, chat_id: str, current_page: int, page_size: int):
                return result.success(ChatRecordSerializer.Query(
                    data={'application_id': application_id,
                          'chat_id': chat_id, 'order_asc': request.query_params.get('order_asc')}).page(current_page,
                                                                                                        page_size))

        class Vote(APIView):
            authentication_classes = [TokenAuth]

            @action(methods=['PUT'], detail=False)
            @swagger_auto_schema(operation_summary=_("Like, Dislike"),
                                 operation_id=_("Like, Dislike"),
                                 manual_parameters=VoteApi.get_request_params_api(),
                                 request_body=VoteApi.get_request_body_api(),
                                 responses=result.get_default_response(),
                                 tags=[_("Application/Chat")]
                                 )
            @has_permissions(
                ViewPermission([RoleConstants.ADMIN, RoleConstants.USER, RoleConstants.APPLICATION_KEY,
                                RoleConstants.APPLICATION_ACCESS_TOKEN],
                               [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                               dynamic_tag=keywords.get('application_id'))])
            )
            def put(self, request: Request, application_id: str, chat_id: str, chat_record_id: str):
                return result.success(ChatRecordSerializer.Vote(
                    data={'vote_status': request.data.get('vote_status'), 'chat_id': chat_id,
                          'chat_record_id': chat_record_id}).vote())

        class ChatRecordImprove(APIView):
            authentication_classes = [TokenAuth]

            @action(methods=['GET'], detail=False)
            @swagger_auto_schema(operation_summary=_("Get the list of marked paragraphs"),
                                 operation_id=_("Get the list of marked paragraphs"),
                                 manual_parameters=ChatRecordImproveApi.get_request_params_api(),
                                 responses=result.get_api_response(ChatRecordImproveApi.get_response_body_api()),
                                 tags=[_("Application/Conversation Log/Annotation")]
                                 )
            @has_permissions(
                ViewPermission([RoleConstants.ADMIN, RoleConstants.USER],
                               [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                               dynamic_tag=keywords.get('application_id'))]
                               ))
            def get(self, request: Request, application_id: str, chat_id: str, chat_record_id: str):
                return result.success(ChatRecordSerializer.ChatRecordImprove(
                    data={'chat_id': chat_id, 'chat_record_id': chat_record_id}).get())

        class Improve(APIView):
            authentication_classes = [TokenAuth]

            @action(methods=['PUT'], detail=False)
            @swagger_auto_schema(operation_summary=_("Annotation"),
                                 operation_id=_("Annotation"),
                                 manual_parameters=ImproveApi.get_request_params_api(),
                                 request_body=ImproveApi.get_request_body_api(),
                                 responses=result.get_api_response(ChatRecordApi.get_response_body_api()),
                                 tags=[_("Application/Conversation Log/Annotation")]
                                 )
            @has_permissions(
                ViewPermission([RoleConstants.ADMIN, RoleConstants.USER],
                               [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                               dynamic_tag=keywords.get('application_id'))],

                               ), ViewPermission([RoleConstants.ADMIN, RoleConstants.USER],
                                                 [lambda r, keywords: Permission(group=Group.DATASET,
                                                                                 operate=Operate.MANAGE,
                                                                                 dynamic_tag=keywords.get(
                                                                                     'dataset_id'))],
                                                 compare=CompareConstants.AND
                                                 ), compare=CompareConstants.AND)
            def put(self, request: Request, application_id: str, chat_id: str, chat_record_id: str, dataset_id: str,
                    document_id: str):
                return result.success(ChatRecordSerializer.Improve(
                    data={'chat_id': chat_id, 'chat_record_id': chat_record_id,
                          'dataset_id': dataset_id, 'document_id': document_id}).improve(request.data))

            @action(methods=['POST'], detail=False)
            @swagger_auto_schema(operation_summary=_("Add to Knowledge Base"),
                                 operation_id=_("Add to Knowledge Base"),
                                 manual_parameters=ImproveApi.get_request_params_api_post(),
                                 request_body=ImproveApi.get_request_body_api_post(),
                                 tags=[_("Application/Conversation Log/Add to Knowledge Base")]
                                 )
            @has_permissions(
                ViewPermission([RoleConstants.ADMIN, RoleConstants.USER],
                               [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                               dynamic_tag=keywords.get('application_id'))],

                               ), ViewPermission([RoleConstants.ADMIN, RoleConstants.USER],
                                                 [lambda r, keywords: Permission(group=Group.DATASET,
                                                                                 operate=Operate.MANAGE,
                                                                                 dynamic_tag=keywords.get(
                                                                                     'dataset_id'))],
                                                 compare=CompareConstants.AND
                                                 ), compare=CompareConstants.AND)
            def post(self, request: Request, application_id: str, dataset_id: str):
                return result.success(ChatRecordSerializer.PostImprove().post_improve(request.data))

            class Operate(APIView):
                authentication_classes = [TokenAuth]

                @action(methods=['DELETE'], detail=False)
                @swagger_auto_schema(operation_summary=_("Delete a Annotation"),
                                     operation_id=_("Delete a Annotation"),
                                     manual_parameters=ImproveApi.get_request_params_api(),
                                     responses=result.get_api_response(ChatRecordApi.get_response_body_api()),
                                     tags=[_("Application/Conversation Log/Annotation")]
                                     )
                @has_permissions(
                    ViewPermission([RoleConstants.ADMIN, RoleConstants.USER],
                                   [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                                   dynamic_tag=keywords.get('application_id'))],

                                   ), ViewPermission([RoleConstants.ADMIN, RoleConstants.USER],
                                                     [lambda r, keywords: Permission(group=Group.DATASET,
                                                                                     operate=Operate.MANAGE,
                                                                                     dynamic_tag=keywords.get(
                                                                                         'dataset_id'))],
                                                     compare=CompareConstants.AND
                                                     ), compare=CompareConstants.AND)
                def delete(self, request: Request, application_id: str, chat_id: str, chat_record_id: str,
                           dataset_id: str,
                           document_id: str, paragraph_id: str):
                    return result.success(ChatRecordSerializer.Improve.Operate(
                        data={'chat_id': chat_id, 'chat_record_id': chat_record_id,
                              'dataset_id': dataset_id, 'document_id': document_id,
                              'paragraph_id': paragraph_id}).delete())

    class UploadFile(APIView):
        authentication_classes = [TokenAuth]

        @action(methods=['POST'], detail=False)
        @swagger_auto_schema(operation_summary=_("Upload files"),
                             operation_id=_("Upload files"),
                             manual_parameters=ChatRecordApi.get_request_params_api(),
                             tags=[_("Application/Conversation Log")]
                             )
        @has_permissions(
            ViewPermission([RoleConstants.ADMIN, RoleConstants.USER, RoleConstants.APPLICATION_KEY,
                            RoleConstants.APPLICATION_ACCESS_TOKEN],
                           [lambda r, keywords: Permission(group=Group.APPLICATION, operate=Operate.USE,
                                                           dynamic_tag=keywords.get('application_id'))])
        )
        def post(self, request: Request, application_id: str, chat_id: str):
            files = request.FILES.getlist('file')
            file_ids = []
            debug = request.data.get("debug", "false").lower() == "true"
            meta = {'application_id': application_id, 'chat_id': chat_id, 'debug': debug}
            for file in files:
                file_url = FileSerializer(data={'file': file, 'meta': meta}).upload()
                file_ids.append({'name': file.name, 'url': file_url, 'file_id': file_url.split('/')[-1]})
            return result.success(file_ids)
