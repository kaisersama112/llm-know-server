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

            <span class="audio-icon">🎤</span>
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
        <button @click="startCall" class="call-button-audio start">
          <span class="button-icon">📞</span>
          <span class="button-text">开始通话</span>
        </button>
      </template>
      <template v-else>
        <button @click="endCall" class="call-button-audio end">
          <span class="button-icon">📞</span>
          <span class="button-text">结束通话</span>
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, ref, onMounted } from 'vue';

const emit = defineEmits(['close']);
const isCalling = ref(false);

const emitCloseEvent = () => emit('close');


let client: WebSocket | null = null;
function sendSessionUpdate() {
  if (!client) return;
  const sessionUpdateEvent = {
    event_id: 'unique_event_id',
    type: 'session.update',
    session: {
      modalities: ["text", "audio"],
      instructions: '你是由阶跃星辰提供的AI聊天助手，你擅长中文，英文，以及多种其他语言的对话。',
      voice: 'linjiajiejie',
      input_audio_format: 'pcm16',
      output_audio_format: 'pcm16',
      turn_detection: {
        type: 'server_vad'
      }
    }
  };
  client.send(JSON.stringify(sessionUpdateEvent));
}
const mediaStream = ref<MediaStream | null>(null);
const audioContext = ref<AudioContext | null>(null);
const sourceNode = ref<MediaStreamAudioSourceNode | null>(null);
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
async function startCall() {
  try {
    isCalling.value = true;
    mediaStream.value = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext.value = new AudioContext();
    sourceNode.value = audioContext.value.createMediaStreamSource(mediaStream.value);

    const processor = audioContext.value.createScriptProcessor(4096, 1, 1);
    sourceNode.value.connect(processor);
    processor.connect(audioContext.value.destination);

    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const base64Audio = arrayBufferToBase64(inputData.buffer); // 假设有一个函数可以转换ArrayBuffer到Base64
      const appendEvent = {
        event_id: 'unique_event_id',
        type: 'input_audio_buffer.append',
        audio: base64Audio
      };
      client?.send(JSON.stringify(appendEvent));
    };

    setTimeout(() => { // 模拟用户结束讲话
      const commitEvent = {
        event_id: 'unique_event_id',
        type: 'input_audio_buffer.commit'
      };
      client?.send(JSON.stringify(commitEvent));
    }, 5000); // 示例：5秒后模拟结束讲话
  } catch (error) {
    console.error('无法访问麦克风:', error);
    alert('无法访问麦克风，请允许权限');
  }
}
function handleServerEvent(data: any) {
  if (data.type === 'response.audio.delta') {
    const audioBlob = base64ToArrayBuffer(data.delta); // 假设有一个函数可以转换Base64到ArrayBuffer
    playAudio(audioBlob);
  } else if (data.type === 'response.audio.done') {
    console.log('音频内容已全部接收完毕');
  }
}

function playAudio(blob: ArrayBuffer) {
  const url = URL.createObjectURL(new Blob([blob], { type: 'audio/pcm' }));
  const audioPlayer = new Audio(url);
  audioPlayer.play();
}
function endCall() {
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop());
    mediaStream.value = null;
  }

  if (audioContext.value) {
    audioContext.value.close();
    audioContext.value = null;
  }

  if (client) {
    client.close();
    client = null;
  }

  isCalling.value = false;
}
onMounted(() => {
  const apiKey = 'gTWpvu3Odj7HqKzeacQOFsFmo4vAAkqVkwGKD76vdcXtn61rQQ8BvZ6x5GBxtIgI';
  client = new WebSocket(`wss://api.stepfun.com/v1/realtime?authorization=Bearer%20${apiKey}&model=step-1o-audio`);
  // 初始化WebSocket连接
  // client = new WebSocket('wss://api.stepfun.com/v1/realtime');

  client.onopen = () => {
    console.log('Connected to the server.');
    sendSessionUpdate();
  };

  client.onmessage = (event) => {
    const data = JSON.parse(event.data);
    handleServerEvent(data);
  };
});
</script>

<style scoped lang="scss">
.call-container {
  width: 100%;
  height: 100%;
  padding: 10px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: 400px;
  background: #f5f7fb;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);


  .call-content {
    width: 100%;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .audio-visualization {

      margin: 2rem 0;

      .visual-circle {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        background: #e8eefb;
        transition: all 0.3s ease;
        position: relative;

        &.active {
          background: #007bff20;

          .ripple {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid #007bff;
            animation: ripple 2s infinite;

            &.delay-1 {
              animation-delay: 0.66s;
            }

            &.delay-2 {
              animation-delay: 1.32s;
            }
          }
        }
      }

      .icon-wrapper {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

        .audio-icon {
          font-size: 2.5rem;
        }
      }
    }

    .call-status {
      font-size: 1.2rem;
      color: #4a5568;
      font-weight: 500;
    }

  }


  .call-duration {
    font-size: 1.8rem;
    font-weight: bold;
    color: #2d3748;
  }

  .action-buttons {
    width: 100%;
    height: 20%;
    display: flex;
    align-items: center;
    justify-content: center;

    .call-button-audio {
      padding: 1rem 2rem;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      transition: all 0.3s ease;
      font-size: 1.1rem;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      &.start {
        background: #10b981;
        color: white;
      }

      &.end {
        background: #ef4444;
        color: white;
      }

      &.close {
        background: #f1f5f9;
        color: #64748b;
      }

      .button-icon {
        font-size: 1.4rem;
      }
    }

    @keyframes ripple {
      0% {
        opacity: 1;
        transform: scale(0);
      }
      100% {
        opacity: 0;
        transform: scale(1.5);
      }
    }
  }
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  border: none;
  background: #f1f5f9;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #e2e8f0;
    transform: rotate(90deg) scale(1.1);
  }

  .close-icon {
    font-size: 1.8rem;
    line-height: 1;
    color: #64748b;
  }
}


.visual-circle.active {
  .ripple {
    border-width: 3px;
    animation: ripple 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;


    &::after {
      content: '';
      position: absolute;
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
      border-radius: 50%;
      background: radial-gradient(circle, #007bff33 20%, transparent 60%);
    }
  }


  @for $i from 1 through 3 {
    .ripple:nth-child(#{$i}) {
      animation-delay: $i * 0.4s;
    }
  }
}


.icon-wrapper {
  transition: transform 0.3s ease;

  .audio-icon {
    display: inline-block;
    animation: pulse 2s ease-in-out infinite;
  }
}


@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}


.call-button-audio {
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s;
  }

  &:active::after {
    width: 150px;
    height: 150px;
  }
}


.close-button {
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55),
  background 0.2s ease;

  &:hover {
    transform: rotate(180deg) scale(1.1);
    background: #ff444480;

    .close-icon {
      color: white;
    }
  }
}


.call-status {
  position: relative;

  &::after {
    content: '...';
    animation: dots 1.5s infinite steps(4, end);
  }
}

@keyframes dots {
  0%, 20% {
    content: "";
  }
  40% {
    content: ".";
  }
  60% {
    content: "..";
  }
  80%, 100% {
    content: "...";
  }
}
</style>