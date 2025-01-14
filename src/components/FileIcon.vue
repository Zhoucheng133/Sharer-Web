<template>
  <div>
    <img :src="getAsset(props.file)" alt="" height="25px">
  </div>
</template>

<script setup lang="ts">
const props = defineProps(["file"])

import { getAsset } from "../hooks/static";

</script>