<template>
  <div class="bg">
    <div class="drag_box">
      <i class="pi pi-cloud-upload icon"></i>
      <div class="label">{{ t('dragToUpload') }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<style scoped>
.label{
  margin-top: 20px;
}
.icon{
  font-size: 40px;
}
.drag_box{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.bg{
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>