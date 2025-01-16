<template>
  <div>
    <img :src="getAsset(props.file)" alt="" style="height: 30px;">
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["file"])

import { getAsset } from "../hooks/static";

</script>