import { defineStore } from "pinia";
import { ref } from "vue";
import type { AppointmentsProps } from "@/types/types";
import { getAppointments, removeAppointmentApi, reserveAppointmentApi } from "@/api/appointments";

export const useAppointmentsStore = defineStore("appointments", () => {
    const allAppointments = ref<AppointmentsProps[]>([])
    const isFetching = ref(false)
    const isLoaded = ref(false)

    async function fetchAppointments() {
        if(isFetching.value) return

        if(isLoaded.value) return

        isFetching.value = true

        try {
            allAppointments.value = await getAppointments()
            isLoaded.value = true
        }
        finally {
            isFetching.value = false
        }
    }

    async function reserveAppointment(appointmentId: number, userId: string) {
        try {
            const updatedAppointment = await reserveAppointmentApi(appointmentId, userId)

            const index = allAppointments.value.findIndex(item => item.id === appointmentId)

            if (index !== -1) {
                allAppointments.value[index] = updatedAppointment
            }

            return {
                success: true,
                message: "نوبت با موفقیت رزرو شد"
            }
        } catch(error) {
            console.log(error)
            return {
                success: false,
                message: "خطا در رزرو نوبت"
            }
        }
    }

    async function removeAppointment(appointmentId: number) {
        try {
            const updatedAppointment = await removeAppointmentApi(appointmentId)

            const index = allAppointments.value.findIndex(item => item.id === appointmentId)

            if (index !== -1) {
                allAppointments.value[index] = updatedAppointment
            }

            return {
                success: true,
                message: "رزرو نوبت با موفقیت لغو شد!!!"
            }
        } catch(error) {
            console.log(error);
            return {
                success: false,
                message: "خطا در لغو رزرو نوبت"
            }
        }
    }

    return {
        allAppointments,
        fetchAppointments,
        reserveAppointment,
        removeAppointment
    };
});