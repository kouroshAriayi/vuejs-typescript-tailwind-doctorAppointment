import type { RegisterUser } from "@/types/types";
import { supabase } from "./supabase";

async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (error) throw error

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single()

    if (profileError) throw profileError

    return profile
}

async function logout() {
    const {error} = await supabase.auth.signOut();

    if(error) throw error;
}

async function getCurrentUser() {
    const { data: authData } = await supabase.auth.getUser()

    if (!authData.user) return;

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

    if (error) throw error;
    return data;
}

async function register(user: RegisterUser) {
    const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password
    });

    if (error) throw error;

    const { error: profileError } = await supabase
        .from("profiles")
        .insert({
            id: data.user!.id,
            username: user.username,
            phone: user.phone,
        });

    if (profileError) throw profileError;

    return data.user;
}

export {
    login,
    logout,
    getCurrentUser,
    register
}

