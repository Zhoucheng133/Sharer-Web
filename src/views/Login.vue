<template>
  登录
</template>

<script lang="ts" setup>
import { checkAuth } from '../hooks/auth';

checkAuth(false);
</script>