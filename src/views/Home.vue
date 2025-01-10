<template>
  主页
</template>

<script lang="ts" setup>
import { checkAuth } from '../hooks/auth';

checkAuth(true);
</script>