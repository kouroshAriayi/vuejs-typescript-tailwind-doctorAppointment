import { getDoctors } from "@/api/doctors";
import type { DoctorsProps } from "@/types/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useDoctorsStore = defineStore('doctors', () => {
    const error = ref<string | null>(null)
    const doctors = ref<DoctorsProps[]>([])
    const loading = ref<boolean>(false)

    async function fetchDoctors() {
        error.value = null
        loading.value = true
        try{
            doctors.value = await getDoctors()
        } catch(err) {
            console.log(err)
            error.value = 'خطا در دریافت لیست دکتر ها'
        } finally {
            loading.value = false
        }
    }

    return {
        doctors,
        fetchDoctors,
        loading,
        error
    }
})