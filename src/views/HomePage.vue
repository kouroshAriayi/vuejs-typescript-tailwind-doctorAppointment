<script setup lang="ts">
import VueButton from '@/components/VueButton.vue';
import ClinicImg from '@/assets/images/dental-clinic.jpg';
import { onMounted, ref } from 'vue';
import { useAppointmentsStore } from '@/stores/appointments';

const appointmentStore = useAppointmentsStore();
const error = ref(false)
const loading = ref(true)

onMounted(async() => {
    try {
        await appointmentStore.fetchAppointments();
    } catch{
        error.value = true
    } finally {
        loading.value = false
    }
})
</script>

<template>
        <div class="appointment relative w-screen h-screen flex flex-col justify-center items-center overflow-hidden">
           <div class="appointment-background absolute inset-0 bg-cover bg-center" :style="{backgroundImage: `url(${ClinicImg})`}"></div>
            <!-- Dark Overlay -->
            <div class="absolute inset-0 bg-black/60"></div>
          
            <div class="p-4 rounded bg-gray-300 w-[100%] md:w-[60%] flex flex-col justify-center items-center z-10">
                <h2 class="appointment-title text-center text-white mb-4 text-xl md:text-2xl font-bold">به سایت نوبت دهی دکتر خوش آمدید</h2>
                <span class="appointment-desc text-center text-white mb-4 text-lg md:text-xl">برای نوبت گرفتن، ابتدا وارد حساب کاربری خود شوید و در صورت عضو نبودن، ثبت
                    نام کنید
                </span>
                <div class="appointment-btns-list w-screen flex justify-center items-center space-x-5">
                    <VueButton text="ثبت نام" color="blue" to="/signup" />
                    <VueButton text="ورود" color="green" to="/login" />
                </div>
            </div>
        </div>
</template>

<style scoped>
    .appointment-background {
        filter: blur(3px)
    }
</style>