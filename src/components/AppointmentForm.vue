<template>
    <form
    @submit.prevent="submitHandler"
    class="login-form flex flex-col justify-center items-center p-3 w-2/3 md:w-3/4 mx-0 my-auto bg-white rounded">
        <input 
            v-if="type === 'register'"
            v-model="username" 
            type="text" 
            class="username-input block w-[100%] mb-1 bg-transparent border-0 p-2 rounded text-lg text-gray-600" 
            placeholder="نام کاربری"
        >
        <span
            v-if="type === 'register' && username && username.trim().length <= 3" 
            id="username-error-span" 
            class="w-[100%] text-red-600 text-xs md:text-sm mb-5"
        >
            نام کاربری باید بیشتر از سه حرف باشد
        </span>
        
        <input 
            v-model="email" 
            type="email" 
            class="username-input block w-[100%] mb-1 bg-transparent border-0 p-2 rounded text-lg text-gray-600" 
            placeholder="ایمیل"
        >
        <span 
            v-if="email && !isEmailValid" 
            id="username-error-span" 
            class="w-[100%] text-red-600 text-xs md:text-sm mb-5"
        >
            ایمیل را درست وارد کنید!!!
        </span>

        <input 
            v-if="type === 'register'"
            v-model="phone" 
            type="phone" 
            class="username-input block w-[100%] mb-1 bg-transparent border-0 p-2 rounded text-lg text-gray-600"
            placeholder="شماره همراه"
        >
        <span 
            v-if="type === 'register' && phone && !isPhoneValid" 
            id="username-error-span" 
            class="w-[100%] text-red-600 text-xs md:text-sm mb-5"
        >
            شماره موبایل اشتباه است!!!
        </span>

        <input 
            v-model="password" 
            type="password" 
            class="password-input block w-[100%] mb-1 bg-transparent border-0 p-2 rounded text-lg text-gray-600" 
            placeholder="رمز"
        >
        <span 
            v-if="password && password.trim().length < 10" 
            id="password-error-span" 
            class="w-[100%] text-red-600 text-xs md:text-sm mb-5"
        >
            رمز نباید کمتر از ده کارامتر باشد
        </span>
        
        <VueButton 
            :text="props.buttonText"
            :color="props.buttonColor"
            :disabled="
                loading
                || isButtonDisabled"
            :loading="loading"
            fullWidth
        />

        <div class="w-full flex items-center space-x-4 my-4">
            <span v-if="type === 'register'">قبلا ثبت نام کرده اید؟</span>
            <span v-else>هنوز ثبت نام نکرده اید؟</span>
            <router-link 
                class="p-1 text-white rounded" 
                :class="type === 'register' ? 'bg-green-400 hover:bg-green-500' : 'bg-blue-400 hover:bg-blue-500'"
                :to="type === 'register' ? '/login' : '/signup'"
            >
                صفحه {{ type === 'register' ? 'ورود' : 'ثبت نام' }}
            </router-link>
        </div>
    </form>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import VueButton from './VueButton.vue';
import { isValidEmail, isValidPhone } from '@/utils/validators.ts';
import type { RegisterUser } from '@/types/types.ts';
import { useAuthStore } from '@/stores/auth.ts';

    interface FormProps {
        type: 'login' | 'register';
        buttonText: string;
        buttonColor: 'blue' | 'green' | 'red' | 'gray';
    }

    const props = defineProps<FormProps>()

    const emit = defineEmits<{
        submit: [RegisterUser]
    }>()

    const userStore = useAuthStore();
    const username = ref('')
    const password = ref('')
    const email = ref('')
    const phone = ref('')

    const isButtonDisabled = computed(() => {
        if(props.type === 'register') {
            return (
                username.value.trim().length <= 3 ||
                password.value.trim().length < 10 ||
                !isValidEmail(email.value) ||
                !isValidPhone(phone.value)   
            )
        } else if(props.type === 'login') {
            return (
                password.value.trim().length < 10 ||
                !isValidEmail(email.value)
            )
        
        } else true
    })

    const loading = computed(() => {
        return props.type === "login"
            ? userStore.isLoggingIn
            : userStore.isRegistering
    })

    const isEmailValid = computed(() => 
        isValidEmail(email.value) 
    )

    const isPhoneValid = computed(() => 
        isValidPhone(phone.value) 
    )

    const submitHandler = () => {
            emit('submit', {
            username: username.value.trim(),
            email: email.value.trim(),
            phone: phone.value.trim(),
            password: password.value.trim(),
        })
    }
</script>

<style scoped>
input {
        box-shadow: inset 1px 1px 10px #000;
    }
</style>