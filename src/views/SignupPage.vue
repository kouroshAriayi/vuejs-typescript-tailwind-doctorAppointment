<template>
        <div 
        class="signup-form-container w-screen h-screen bg-gradient-to-bl from-blue-600 via-blue-700 to-slate-200 flex flex-col justify-center items-center"
        >
            <AppointmentForm 
                @submit="signupHandler" 
                type="register"
                buttonText="ثبت نام" 
                buttonColor="blue" 
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

const signupHandler = async(userData: RegisterUser) => {
    const result = await userStore.registerUser(userData);

    if(!result.success) {
        toast.error(result.message, {toastClassName: 'toast-container'})
        return;
    }

    toast.success(result.message, {toastClassName: 'toast-container'})
    router.push('/login')
}
</script>