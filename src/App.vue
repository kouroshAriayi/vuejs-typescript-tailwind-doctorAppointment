<template>
    <router-view />
</template>

<script setup lang="ts">
    import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
    const userStore = useAuthStore();

    onMounted(() => {
        userStore.fetchCurrentUser();
    })
</script>