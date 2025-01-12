<template>
  <div :class=" preview().exit ? 'preview_bg_hide' : 'preview_bg'">
    <div class="preview_title_bar">
      <div class="preview_title">{{ preview().previewFile }}</div>
      <div class="preview_tools">
        <Button label="下载" size="small" style="margin-right: 10px;"/>
        <Button icon="pi pi-times" variant="text" rounded aria-label="Filter" size="small" @click="preview().closePreview" />
      </div>
    </div>
    <div class="preview_content">
      <div class="preview_media" v-if="previewType==Types.Video">
        <video ref="playerContainer" controls playsinline>
          <source ref="mediaSource" :src="preview().previewUrl" />
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
import { nextTick, ref, watch } from "vue";
import preview from "../hooks/preview";
import { Types } from "../hooks/static";
import { storeToRefs } from "pinia";
import { Button } from "primevue";
const playerContainer=ref(null);
const mediaSource=ref<any>(null);

const {previewType}=storeToRefs(preview());

window.addEventListener("keydown", (e)=>{
  if(e.key=='Escape'){
    preview().closePreview();
  }
})

watch(previewType, async (newVal)=>{
  if(newVal==Types.Video){
    await nextTick();
    if(playerContainer.value){
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
  }
})
</script>