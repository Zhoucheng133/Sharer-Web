<template>
  <div class="preview_bg">
    <div class="preview_title_bar"></div>
    <div class="preview_content">
      <div class="preview_media">
        <video ref="playerContainer" controls playsinline>
          <source src="http://127.0.0.1:8080/api/raw?path=video.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script lang="ts" setup>
import "../styles/preview.css";
import Plyr from "plyr";
import 'plyr/dist/plyr.css';
import { onMounted, ref } from "vue";
const playerContainer = ref<HTMLDivElement | null>(null);
onMounted(()=>{
  if (playerContainer.value) {
    new Plyr(playerContainer.value, {
      i18n: {
        restart: '重新开始',
        rewind: '倒退 {seektime} 秒',
        play: '播放',
        pause: '暂停',
        fastForward: '快进 {seektime} 秒',
        mute: '静音',
        unmute: '取消静音',
        volume: '音量',
        settings: '设置',
        captions: '字幕',
        disabled: '已禁用',
        enabled: '已启用',
        loop: '循环播放',
        speed: '播放速度',
        normal: '正常',
        quality: '质量',
        download: '下载',
        fullscreen: '全屏',
        exitFullscreen: '退出全屏',
      },
      controls: [
        'play',
        'progress',
        'current-time',
        'mute',
        'volume',
        'settings', // 启用设置选项
        'fullscreen',
      ],
    });
    return {
      playerContainer,
    };
  }
})
</script>