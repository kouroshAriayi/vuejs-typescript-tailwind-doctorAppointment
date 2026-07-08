<script setup lang="ts">
import VueButton from "@/components/VueButton.vue";
import { useAppointmentsStore } from "@/stores/appointments";
import { computed, onMounted, ref } from "vue";
import { useToast } from "vue-toastification";
import { useAuthStore } from "@/stores/auth";
import type { AppointmentsProps } from "@/types/types";
import { useDoctorsStore } from "@/stores/doctors";

const userStore = useAuthStore();
const appointmentsStore = useAppointmentsStore();
const doctorStore = useDoctorsStore();

const error = ref(false)
const loading = ref(true)

const toast = useToast()

onMounted(async() => {
    try {
        await Promise.all([
        doctorStore.fetchDoctors(),
        appointmentsStore.fetchAppointments(),
        ])
    } catch {
        error.value = true
    } finally {
        loading.value = false
    }
});

// تبدیل دیتا برای نمایش
const resolvedAppointments = computed<AppointmentsProps[]>(() => {
    return appointmentsStore.allAppointments
        .filter((booking) => {
            return booking.user_id === userStore.user?.id
        })
});

// گرفتن مشخصات دکتر مورد نظر
const doctorMap = computed(() => {
    return new Map(
        doctorStore.doctors.map(doctor => [doctor.id, doctor])
    )
})

// حذف رزرو
const removeAppointmentHandler = async(appointmentId: number) => {
    const result = await appointmentsStore.removeAppointment(appointmentId);
    if(result.success) {
        toast.success(result.message)
    } else {
        toast.error(result.message)
    }
};

// logout
const removeHandler = async() => {
    const result = await userStore.logoutUser();
    if(result.success) {
        toast.success(result.message)
    } else {
        toast.error(result.message)
    }
};

</script>

<template>
    <div v-if="loading" class="w-full h-screen flex justify-center items-center">
        <h2 class="text-center text-gray-800 font-bold">در حال بارگزاری...</h2>
    </div>
    <div v-if="error" class="w-full h-screen flex justify-center items-center">
        <h2 class="text-center text-gray-800 font-bold">مشکلی رخ داده است!!!</h2>
    </div>
    <div v-if="!loading && !error && userStore.user" class="dashboard-container w-screen h-screen flex justify-center items-center bg-gradient-to-bl from-gray-600 via-gray-700 to-slate-200">
        <div class="dashboard-content flex flex-col justify-center items-center px-2 py-1 md:px-4 md:py-2 w-full md:w-3/4 rounded bg-white/50">
            <h2 class="text-2xl md:text-3xl text-bold mb-4">صفحه داشبورد {{ userStore.user.username }}</h2>

             <h3 v-if="!resolvedAppointments.length" class="text-lg md:text-xl mb-3">شما نوبتی رزرو نکرده اید</h3>

             <ul v-else class="mb-3 space-y-2 w-full bg-gradient-to-bl from-gray-300 via-white to-slate-200 px-1 py-1 md:px-2 md:py-2 ">
                <li 
                    v-for="item in resolvedAppointments" :key="`${item.doctor_id}-${item.user_id}`"
                    class="w-full flex justify-between items-center space-x-1"
                >
                    <span class="flex-1 text-sm md:text-2xl text-bold">{{ doctorMap.get(item.doctor_id)?.name }}</span>
                    <span class="flex-1 text-xs md:text-xl text-bold">{{ item.date }}</span>
                    <span class="flex-1 text-xs md:text-xl text-bold">{{ item.time }}</span>
                    <VueButton @click="removeAppointmentHandler(item.id)" text="لغو کردن" color="red" />
                </li>
             </ul>

             <div class="flex justify-evenly items-center w-full">
                <router-link class="underline text-sm md:text-xl" to="/login" @click="removeHandler">خارج شدن از حساب</router-link>
                <router-link class="underline text-sm md:text-xl" to="/appointments">رفتن به صفحه نوبت دهی</router-link>
             </div>
        </div>
    </div>

    <div v-if="!loading && !error && !userStore.user" class="dashboard-container w-screen h-screen flex justify-center items-center bg-gradient-to-bl from-gray-600 via-gray-700 to-slate-200">
        <div class="dashboard-content flex flex-col justify-center items-center px-4 py-2 w-3/4 rounded bg-white/50">
            <h2 class="text-3xl text-bold mb-4">شما وارد حساب کاربری نشده اید</h2>
            <router-link class="underline" to="/login">صفحه ورود</router-link>
        </div>
    </div>
</template>