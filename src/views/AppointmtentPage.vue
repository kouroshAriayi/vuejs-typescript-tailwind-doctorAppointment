<template>
    <div class="appointments-container w-screen h-screen flex justify-center items-center bg-gradient-to-bl from-pink-400 via-pink-600 to-slate-200">
        <h1 
            v-if="loading" 
            class="font-bold text-2xl md:text-3xl text-center text-white"
        >
            در حال بارگزاری...
        </h1>
        <h1 
            v-if="error" 
            class="font-bold text-2xl md:text-3xl text-center text-red-400"
        >
            مشکلی در بارگزاری پیش آمده است!!!
        </h1>

        <div 
            class="appointments-content w-3/4 flex flex-col space-y-4 justify-center items-center"
            v-if="authStore.user && !loading && !error"
        >
            <h2 class="text-3xl text-bold text-gray-200">لیست نوبت ها</h2>

            <div class="w-full">
                <div v-for="(doctor, index) in doctorStore.doctors" :key="doctor.id">
                
                <button @click="toggle(index)" class="w-full flex justify-between items-center cursor-pointer p-4 bg-gray-300">
                    {{ doctor.name }}
                    <ChevronDownIcon v-if="openIndex !== index" class="w-6 h-6 p-1 rounded-full bg-gray-100" />
                    <ChevronUpIcon v-else class="w-6 h-6 p-1 rounded-full bg-gray-100" />
                </button>

                <div 
                    v-if="openIndex === index" class="bg-gray-100 space-y-2 text-center w-full"
                    v-for="appointment in doctorAppointments(doctor.id)"
                    :key="appointment.id"
                >
                    <div class="flex justify-between p-1 md:p-2 items-center bg-white w-full">
                        <span class="text-xs md:text-xl">ساعت {{ appointment.time }}</span>
                        <span class="text-xs md:text-xl">تاریخ {{ appointment.date }}</span>
                        <VueButton 
                            @click="reservationHandler(appointment.id, authStore.user?.id)" 
                            :disabled="appointment.status === 'reserved'" 
                            :text="appointment.status === 'reserved' ? 'رزرو شده' : 'رزرو کردن'" 
                            color="pink"
                        />
                    </div>
                </div>
                <hr />

                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed, onMounted, ref } from 'vue';
    import { ChevronDownIcon } from '@heroicons/vue/24/outline';
    import { ChevronUpIcon } from '@heroicons/vue/24/outline';
    import VueButton from '@/components/VueButton.vue';
    import { useAppointmentsStore } from '@/stores/appointments';
    import { useToast } from 'vue-toastification';
    import { useDoctorsStore } from '@/stores/doctors';
    import { useAuthStore } from '@/stores/auth';
    const authStore = useAuthStore()

    const toast = useToast()

    const appointmentsStore = useAppointmentsStore()
    const doctorStore = useDoctorsStore();
    const error = ref(false)
    const loading = ref(true)

    onMounted(async () => {
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
    })

    const doctorAppointments = computed(() => 
        (doctorId: number) => {
            return appointmentsStore.allAppointments.filter(
                appointment => appointment.doctor_id === doctorId
            )
        }
    )
    
    const openIndex = ref<number | null>(0)
    const toggle = (index: number) => {
        openIndex.value = openIndex.value === index ? null : index
    }

    const reservationHandler = async(appointmentId: number, userId: string) => {
        const result = await appointmentsStore.reserveAppointment(appointmentId, userId)

        if (result.success) {
            toast.success(result.message)
        } else {
            toast.error(result.message)
        }
    }
</script>