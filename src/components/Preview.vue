<template>
  <div :class=" preview().exit ? 'preview_bg_hide' : 'preview_bg'">
    <div class="preview_title_bar">
      <div class="preview_title">{{ preview().previewFile }}</div>
      <div class="preview_tools">
        <Button label="下载" size="small" style="margin-right: 10px;" @click="preview().download" />
        <Button icon="pi pi-times" variant="text" rounded aria-label="Filter" size="small" @click="preview().closePreview" />
      </div>
    </div>
    <div class="preview_content">
      <div class="preview_media" v-if="preview().previewType==Types.Video">
        <video ref="playerContainer" controls playsinline>
          <source :src="preview().previewUrl" />
        </video>
      </div>
      <div class="preview_image" v-else-if="preview().previewType==Types.Image">
        <img :src="preview().previewUrl" alt="" class="preview_image">
      </div>
      <div class="preview_audio" v-else-if="preview().previewType==Types.Audio">
        <audio ref="playerContainer" controls playsinline>
          <source :src="preview().previewUrl" />
        </audio>
      </div>
      <div v-else-if="preview().previewType==Types.Pdf">
        <iframe class="preview_pdf" :src="preview().previewUrl" frameborder="0"></iframe>
      </div>
      <div class="preview_other" v-else>
        <img :src="getAsset({
          name: preview().previewFile,
          size: 0,
          isDir: false,
          selected: false,
        })" alt="" style="height: 100px;" />
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
import preview from "../hooks/preview";
import { getAsset, Types } from "../hooks/static";
import { Button } from "primevue";
const playerContainer=ref(null);

window.addEventListener("keydown", (e)=>{
  if(e.key=='Escape'){
    preview().closePreview();
  }
})

onMounted(()=>{
  if((preview().previewType==Types.Video || preview().previewType==Types.Audio) && playerContainer.value){
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
        'settings',
        'fullscreen',
      ],
    });
    return {
      playerContainer,
    };
  }
})
</script>