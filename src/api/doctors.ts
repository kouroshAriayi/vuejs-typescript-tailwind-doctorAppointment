import { supabase } from "./supabase";

export async function getDoctors() {
    const {data, error} = await supabase.from("doctors").select("*");

    if(error) throw error;

    return data;
}