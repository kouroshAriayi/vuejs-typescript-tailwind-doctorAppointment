<template>
    <div class="login-form-container w-screen h-screen bg-gradient-to-bl from-green-600 via-green-700 to-slate-200 flex justify-center items-center">
        <AppointmentForm 
            @submit="loginHandler"
            type="login"
            buttonText="ورود" 
            buttonColor="green" 
        />
    </div>
</template>

<script setup lang="ts">
import AppointmentForm from '@/components/AppointmentForm.vue';
import router from '@/router';
import { useAuthStore } from '@/stores/auth';
import type { RegisterUser } from '@/types/types';
import { useToast } from 'vue-toastification';

const userStore = useAuthStore()
const toast = useToast()

const loginHandler = async (data: RegisterUser) => {
    const result = await userStore.loginUser(data)

    if(!result.success) {
        toast.error(result.message, {toastClassName: 'toast-container'})
        return;
    }

    toast.success(result.message, {toastClassName: 'toast-container'})
    router.push('/dashboard')
}
</script>

<style scoped>
</style>