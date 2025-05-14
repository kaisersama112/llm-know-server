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
      <div v-if="isCalling" class="call-duration">
        00:00
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
import {RealtimeClient} from './lib/openai-realtime-api-beta';
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
  let wsProxyUrl = 'ws://47.253.197.95:5005';

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
    if (error.message.includes('media stream')) {
      alert('无法访问麦克风。请检查麦克风设置并确保已授权访问。');
    } else {
      alert('连接失败，请检查设置');
    }
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.call-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

.audio-visualization {
  margin: 20px 0;
}

.visual-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.visual-circle.active {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
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
  font-size: 30px;
}

.call-status {
  margin: 10px 0;
  font-size: 18px;
}

.call-duration {
  font-size: 16px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.call-button-audio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 50px;
  border: none;
  background-color: #4CAF50;
  color: white;
  cursor: pointer;
  min-width: 120px;
  transition: all 0.3s;
}

.call-button-audio:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(76, 175, 80, 0.4);
}

.call-button-audio.end {
  background-color: #f44336;
}

.button-icon {
  font-size: 24px;
  margin-bottom: 5px;
}

.button-text {
  font-size: 16px;
}
</style>