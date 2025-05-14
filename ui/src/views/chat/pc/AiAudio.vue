<template>
  <div class="call-container">
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
        {{ isCalling ? '通话中...' : '等待通话开始' }}
      </div>
      <div class="ai-response-container" v-if="isCalling">
        <div class="ai-response-text">{{ aiResponseText }}</div>
      </div>
    </div>
    <!-- 操作按钮组 -->
    <div class="action-buttons">
      <template v-if="!isCalling">
        <button @click="connectConversation" class="call-button-audio start">
          <span class="button-icon">📞</span>
          <span class="button-text">开始通话</span>
        </button>
      </template>
      <template v-else>
        <button v-if="conversationalMode === 'manual'"
                @mousedown="startRecording"
                @mouseup="stopRecording"
                @mouseleave="isRecording ? stopRecording : null"
                class="call-button-audio start">
          <span class="button-icon">
            {{ isRecording ? '⬆️' : '🎤' }}
          </span>
          <span class="button-text">
            {{ isRecording ? '松手发送' : '按住说话' }}
          </span>
        </button>
        <button v-else class="call-button-audio start">
          <span class="button-icon">📞</span>
          <span class="button-text">实时对话中</span>
        </button>
        <button @click="disconnectConversation" class="call-button-audio end">
          <span class="button-icon">📞</span>
          <span class="button-text">结束通话</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
// @ts-ignore
import {RealtimeClient} from 'openai-realtime-api-beta';
import {WavStreamPlayer, WavRecorder} from 'wavtools';

interface CustomVoice {
  id: string;
  file_id: string;
  created_at: number;
}

interface AudioFormatType {
  value: string;
  label: string;
}

const emit = defineEmits(['close']);
const isCalling = ref(false);
const isAISpeaking = ref(false);
const isRecording = ref(false);
const client = ref<RealtimeClient | null>(null);
const wsUrl = ref('wss://api.stepfun.com/v1/realtime');
const apiKey = ref('gTWpvu3Odj7HqKzeacQOFsFmo4vAAkqVkwGKD76vdcXtn61rQQ8BvZ6x5GBxtIgI');
const modelName = ref('step-1o-audio');
const selectedVoice = ref({name: '默认音色', value: 'default'});
const allVoices = ref([{name: '默认音色', value: 'default'}]);
const conversationalMode = ref('manual');
const inputAudioFormat = ref({value: 'wav', label: 'WAV'});
const outputAudioFormat = ref({value: 'wav', label: 'WAV'});
const wavRecorder = ref(new WavRecorder({sampleRate: 24000}));
const wavStreamPlayer = ref(new WavStreamPlayer({sampleRate: 24000}));
const aiResponseText = ref('');
// 从 localStorage 加载保存的设置
onMounted(() => {
  const savedWsUrl = localStorage.getItem('wsUrl');
  const savedModelName = localStorage.getItem('modelName');
  const savedApiKey = localStorage.getItem('apiKey');

  if (savedWsUrl) wsUrl.value = savedWsUrl;
  if (savedModelName) modelName.value = savedModelName;
  if (savedApiKey) apiKey.value = savedApiKey;
});

watch([apiKey, modelName, wsUrl], ([newApiKey, newModelName, newWsUrl]) => {
  localStorage.setItem('wsUrl', newWsUrl);
  localStorage.setItem('modelName', newModelName);
  localStorage.setItem('apiKey', newApiKey);
  fetchCustomVoices();
}, {deep: true});

// 获取自定义音色
async function fetchCustomVoices() {
  if (!apiKey.value) return;
  try {
    const domain = new URL(wsUrl.value).origin;
    const httpDomain = domain.replace('ws://', 'http://').replace('wss://', 'https://');
    const response = await fetch(`${httpDomain}/v1/audio/voices?limit=100`, {
      headers: {
        Authorization: `Bearer ${apiKey.value}`
      }
    });

    const data = await response.json();
    if (data.object === 'list' && data.data) {
      allVoices.value = [
        {name: '默认音色', value: 'default'},
        ...data.data.map((voice: CustomVoice) => ({
          name: `自定义音色-${voice.id}`,
          value: voice.id
        }))
      ];
    }
  } catch (error) {
    console.error('获取自定义音色出错:', error);
  }
}

async function initClient() {
  // WebSocket 中转服务 url
  let wsProxyUrl = 'wss://ai.vnppp.com/websocket';

  // 构建查询参数
  const params = new URLSearchParams();

  if (apiKey.value) params.append('apiKey', apiKey.value);
  if (modelName.value) params.append('model', modelName.value);
  if (wsUrl.value) params.append('wsUrl', encodeURIComponent(wsUrl.value));

  const queryString = params.toString();
  if (queryString) {
    wsProxyUrl += `?${queryString}`;
  }

  client.value = new RealtimeClient({url: wsProxyUrl});

  client.value.on('realtime.event', (event: any) => {
    if (event.source === 'server') {
      if (event.event.type === 'response.done') {
        isAISpeaking.value = false;
      }
      if (event.event.type === 'response.done') {
        isAISpeaking.value = false;
      }
      if (event.event.type === 'response.audio_transcript.delta') {
        console.log(event.event)
        isAISpeaking.value = true;
        aiResponseText.value += event.event.delta;
      }
    }
  });

  client.value.on('conversation.updated', (data: any) => {
    const {delta} = data;
    if (delta?.audio) {
      wavStreamPlayer.value.add16BitPCM(delta.audio, 'current');
      isAISpeaking.value = true;
    }
  });
}

async function checkMicrophonePermission() {
  try {
    // 请求麦克风权限
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    stream.getTracks().forEach(track => track.stop()); // 获取权限后立即停止流
    return true;
  } catch (error) {
    console.error('麦克风权限请求失败:', error);
    return false;
  }
}

async function connectConversation() {
  if (!apiKey.value || !modelName.value) {
    alert('请设置服务器信息后再连接');
    return;
  }

  try {
    // 检查麦克风权限
    const hasPermission = await checkMicrophonePermission();
    if (!hasPermission) {
      alert('需要麦克风权限才能进行实时对话');
      return;
    }

    await initClient();
    await wavRecorder.value.begin();  // 可能在这里抛出错误
    await wavStreamPlayer.value.connect();
    await client.value?.connect();

    if (client.value) {
      client.value.sendUserMessageContent([
        {
          type: 'input_text',
          text: '你好！'
        }
      ]);

      if (conversationalMode.value === 'realtime') {
        await wavRecorder.value.record(data => client.value?.appendInputAudio(data.mono));
      }
    }

    isCalling.value = true;
  } catch (error) {
    console.error('连接错误:', error);

  }
}

async function disconnectConversation() {
  client.value?.disconnect();
  await wavRecorder.value.end();
  wavStreamPlayer.value.interrupt();
  client.value = null;
  isCalling.value = false;
  isAISpeaking.value = false;
  isRecording.value = false;
  aiResponseText.value = '';
}

async function startRecording() {
  isRecording.value = true;
  await wavRecorder.value.record(data => client.value?.appendInputAudio(data.mono));
}

async function stopRecording() {
  isRecording.value = false;
  await wavRecorder.value.pause();
  client.value?.createResponse();
}

function toggleVAD() {
  conversationalMode.value = conversationalMode.value === 'manual' ? 'realtime' : 'manual';
  if (conversationalMode.value === 'realtime' && client.value?.isConnected() && !isRecording.value) {
    startRecording();
  } else if (conversationalMode.value === 'manual' && isRecording.value) {
    stopRecording();
  }
}

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

.close-button {
  position: absolute;
  top: 30px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  color: #888;
  cursor: pointer;
  transition: color 0.3s;
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

.ai-response-container {
  margin-top: 16px;
  padding: 16px;
  background-color: #f0f8ff;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  margin: 16px 0;
}

.ai-response-text {
  font-size: 17px;
  line-height: 1.55;
  color: #333;
  word-break: break-word;
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