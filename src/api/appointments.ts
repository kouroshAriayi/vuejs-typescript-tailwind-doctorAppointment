import { supabase } from "./supabase";

async function getAppointments() {
    const { data, error } = await supabase.from("appointments").select("*");

    if (error) throw error;

    return data;
}

async function reserveAppointmentApi(appointmentId: number, userId: string) {
    const {data, error} = await supabase
        .from("appointments")
        .update({status: "reserved", user_id: userId})
        .eq("id", appointmentId)
        .select()
        .single();

    if(error) throw error;

    return data;
}

async function removeAppointmentApi(appointmentId: number) {
    const {data, error} = await supabase
        .from("appointments")
        .update({status: 'available', user_id: null})
        .eq("id", appointmentId)
        .select()
        .single();

    if(error) throw error;

    return data;
}

export {
    getAppointments,
    reserveAppointmentApi,
    removeAppointmentApi
}