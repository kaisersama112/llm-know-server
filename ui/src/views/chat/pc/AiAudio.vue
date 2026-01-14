<template>
  <div class="call-container">
    <!-- 品牌标识 -->
    <div class="brand-logo">
      <span class="logo-text">Call</span>
      <span class="logo-ai">AI</span>
    </div>

    <button @click="emitCloseEvent" class="close-button">
      <span class="close-icon">×</span>
    </button>
    <div class="call-content">
      <div class="audio-visualization">
        <div class="visual-circle" :class="{ active: isCalling }">
          <div class="ripple"></div>
          <div class="ripple delay-1"></div>
          <div class="ripple delay-2"></div>
          <div class="icon-wrapper">
            <span class="audio-icon">
              {{ isAISpeaking ? '🔊' : isRecording ? '🎤' : '🔊' }}
            </span>
          </div>
        </div>
      </div>
      <div class="call-status">
        {{ isCalling ? 'In call...' : 'Waiting to start call' }}
      </div>
      <div class="ai-response-container" v-if="isCalling">
        <div class="ai-response-text" v-if="aiResponseText.length > 0">
          <div v-for="(message, index) in aiResponseText" :key="index" class="message">
            <span class="role"
                  :class="{ 'agent-role': message.role == 'agent', 'user-role': message.role == 'user' }">
              {{ !(message.role !== 'agent') ? 'Agent: ' : 'User: ' }}
            </span>
            <span class="content">{{ message.content }}</span>
          </div>
        </div>
        <div v-else>
          <p></p>
        </div>
      </div>
    </div>
    <!-- 操作按钮组 -->
    <div class="action-buttons">
      <template v-if="!isCalling">
        <button @click="startCall" class="call-button-audio start">
          <span class="button-icon">📞</span>
          <span class="button-text">Start Call</span>
        </button>
      </template>
      <template v-else>
        <button @click="endCall" class="call-button-audio end">
          <span class="button-icon">📞</span>
          <span class="button-text">End Call</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted} from 'vue';
import {RetellWebClient} from "retell-client-js-sdk";
import Retell from 'retell-sdk';

const emit = defineEmits(['close']);
const isCalling = ref(false);
const isAISpeaking = ref(false);
const isRecording = ref(false);
interface Message {
  role: string;
  content: string;
}

const aiResponseText = ref<Message[]>([]);
// 添加通话状态标记
const isCallInProgress = ref(false);
const agent_id = "agent_d722981c6b81c7e211cbcf6b0d";
const api_key = "key_7901d40261d47d67b674c57aa968";
const client = new Retell({
  apiKey: api_key,
});

const retellWebClient = new RetellWebClient();

async function getCallStatus() {
  const webCallResponse = await client.call.createWebCall(
      {
        agent_id: agent_id
      }
  );
  console.log(webCallResponse.access_token);
  console.log(webCallResponse.agent_id);
  return webCallResponse;
}

function handleBeforeUnload() {
  if (isCalling.value) {
    try {
      retellWebClient.stopCall();
      console.log("页面关闭时已结束通话");
    } catch (error) {
      console.error("页面关闭时结束通话失败:", error);
    }
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
})

onUnmounted(() => {
  retellWebClient.removeAllListeners();
  window.removeEventListener('beforeunload', handleBeforeUnload);

})


// 监听通话事件
function listenCallEvents() {
  console.log("开始监听通话事件");

  retellWebClient.on("call_ended", () => {
    console.log("收到 call_ended 事件");
    // 确保状态被清理
    manageCallState(false);
  });

  retellWebClient.on("agent_stop_talking", () => {
    console.log("收到 agent_stop_talking 事件");
    // 明确标记 AI 停止讲话
    isAISpeaking.value = false;
    isRecording.value = false;
  });

  retellWebClient.on("error", (error) => {
    console.error("通话错误:", error);
    // 发生错误时也要确保状态被清理
    manageCallState(false);
    retellWebClient.stopCall();
  });
}

// 开始通话
async function startCall() {
  try {
    // 首先检查是否有通话正在进行
    if (isCalling.value || isCallInProgress.value) {
      console.warn("通话已在进行中，无法重复开始");
      return;
    }

    // 标记通话正在建立中
    isCallInProgress.value = true;

    console.log("开始通话...");
    manageCallState(true);

    let createCallResponse = await getCallStatus();
    console.log("获取通话状态成功");

    await retellWebClient.startCall({
      accessToken: createCallResponse.access_token,
      sampleRate: 24000,
      captureDeviceId: "default",
      playbackDeviceId: "0ec1807fd0fe6e51b990660ec4e2ebb78sdfcba51e279815d00c423ce03407ff",
      emitRawAudioSamples: false,
    });

    console.log("通话建立成功");

    // 确保通话建立成功后状态正确同步
    manageCallState(true);

    // 开始通话后监听事件
    listenCallEvents();
  } catch (error) {
    console.error("开始通话失败:", error);
    // 即使失败也要确保状态被清理
    manageCallState(false);
  } finally {
    // 标记通话建立过程结束
    isCallInProgress.value = false;
    console.log("通话建立过程结束");
  }
}

// 结束通话
function endCall() {
  try {
    // 检查是否有通话在进行或建立中
    if (!isCalling.value && !isCallInProgress.value) {
      console.warn("没有通话在进行，无法结束通话");
      return;
    }

    console.log("结束通话...");
    // 首先清理状态
    manageCallState(false);

    // 然后停止通话
    retellWebClient.stopCall();

    // 添加日志调试
    console.log("通话已结束");
  } catch (error) {
    console.error("结束通话失败:", error);
    // 即使失败也要确保状态被清理
    manageCallState(false);
  }
}

// 通话状态管理
const manageCallState = (isStarting:any) => {
  if (isStarting) {
    isCalling.value = true;
    isAISpeaking.value = true;
    isRecording.value = true;
  } else {
    isCalling.value = false;
    isAISpeaking.value = false;
    isRecording.value = false;
    aiResponseText.value = [];
  }
};
// 关闭通话组件
const emitCloseEvent = () => emit('close');
</script>
<style scoped>
.call-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  padding: 24px;
  position: relative;
}

/* 品牌标识 */
.brand-logo {
  position: absolute;
  top: 35px;
  left: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
}

.logo-ai {
  font-size: 24px;
  font-weight: 700;
  color: #4dabf7;
}

/* 关闭按钮 */
.close-button {
  position: absolute;
  top: 35px;
  right: 24px;
  background: none;
  border: none;
  font-size: 35px;
  color: #888;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #333;
}

.call-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
}

.audio-visualization {
  margin: 24px 0;
}

.visual-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e9f5ff 0%, #cce0ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.visual-circle.active {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 15px rgba(0, 123, 255, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
  }
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  transform: scale(0);
  animation: ripple 2s linear infinite;
}

.delay-1 {
  animation-delay: 0.5s;
}

.delay-2 {
  animation-delay: 1s;
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.icon-wrapper {
  position: relative;
  z-index: 1;
}

.audio-icon {
  font-size: 36px;
  font-weight: bold;
  color: #007bff;
}

.call-status {
  margin: 12px 0;
  font-size: 20px;
  color: #444;
  font-weight: 500;
}

/* AI响应容器 */
.ai-response-container {
  width: 100%;
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.ai-response-text {
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  word-break: break-word;
}

.message {
  margin-bottom: 12px;
}

.message:last-child {
  margin-bottom: 0;
}

.role {
  font-weight: 600;
  margin-right: 8px;
}

.agent-role {
  color: #4dabf7;
}

.user-role {
  color: #f44336;
}

.call-duration {
  font-size: 16px;
  color: #666;
  margin: 8px 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 24px;
  margin-bottom: 12px;
}

.call-button-audio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 50px;
  border: none;
  background-color: #4dabf7;
  color: white;
  cursor: pointer;
  min-width: 140px;
  transition: all 0.3s;
  font-weight: 500;
  box-shadow: 0 5px 15px rgba(77, 171, 247, 0.4);
}

.call-button-audio:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(77, 171, 247, 0.6);
}

.call-button-audio.end {
  background-color: #f44336;
  box-shadow: 0 5px 15px rgba(244, 67, 54, 0.4);
}

.call-button-audio.end:hover {
  box-shadow: 0 8px 20px rgba(244, 67, 54, 0.6);
}

.button-icon {
  font-size: 28px;
  margin-bottom: 8px;
}

.button-text {
  font-size: 16px;
}
</style>
