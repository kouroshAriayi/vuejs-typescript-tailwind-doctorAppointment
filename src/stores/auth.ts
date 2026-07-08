import { getCurrentUser, login, logout, register } from "@/api/auth";
import type { Profile, RegisterUser } from "@/types/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
    const isLoggingIn = ref(false)
    const isRegistering = ref(false)
    const isLoggingOut = ref(false)
    const error = ref<string | null>(null)
    const user = ref<Profile | null>(null)

    ////////////////////
const initialized = ref(false)
    ///////////////////

    async function registerUser(newUser: RegisterUser) {
        isRegistering.value = true
        error.value = null

        try{
            await register(newUser)
            ////////////////
            user.value = null
            ////////////
            return {
                success: true,
                message: 'ثبت نام با موفقیت انجام شد'
            }
        } catch(err: any) {
            if (err.code === "over_email_send_rate_limit") {
                return {
                    success: false,
                    message: "تعداد درخواست‌های ثبت‌نام بیش از حد مجاز است. چند دقیقه دیگر دوباره تلاش کنید."
                }
        }

            if (err.message === "User already registered") {
                return {
                success: false,
                message: "این ایمیل قبلاً ثبت شده است."
                }
            }

            return {
                success: false,
                message: "خطایی در ثبت‌نام رخ داد."
            }
        } finally {
            isRegistering.value = false
        }
    }

    async function loginUser(currentUser: RegisterUser) {
        isLoggingIn.value = true
        error.value = null

        try{
            user.value = await login(currentUser.email, currentUser.password)
            return {
                success: true,
                message: 'ورود با موفقیت انجام شد'
            }
        } catch(err: unknown) {
            if (!(err instanceof Error)) {
                return {
                    success:false,
                    message:'خطایی رخ داد'
                }
            }

             if (err.message === "Invalid login credentials") {
                return {
                    success: false,
                    message: "ایمیل یا رمز عبور اشتباه است."
                }
            }

            if (err.message === "Email not confirmed") {
                return {
                    success: false,
                    message: "ابتدا ایمیل خود را تأیید کنید."
                }
            }

            return {
                success: false,
                message: "خطایی در ورود به سایت رخ داد."
            }
        } finally {
            isLoggingIn.value = false
        }
    }

    async function logoutUser() {
        isLoggingOut.value = true

        try{
            await logout();
            user.value = null;
            initialized.value = false;
            return {
                success: true,
                message: 'با موفقیت از حساب خود خارج شدید'
            }
        } catch(error) {
            console.log(error);
            return {
                success: false,
                message: 'مشکلی رخ داده است!!!'
            }
        } finally {
            isLoggingOut.value = false
        }
    }

    // async function fetchCurrentUser() {
    //     try {
    //         user.value = await getCurrentUser()
    //         error.value = null
    //     } catch (err) {
    //         console.log(err);
    //         error.value = 'خطا در دریافت کاربر'
    //     }
    // }

    async function fetchCurrentUser() {
        if(initialized.value) return;
        try {
            user.value = await getCurrentUser()
            error.value = null
            initialized.value = true
        } catch (err) {
            console.log(err);
            error.value = 'خطا در دریافت کاربر'
        }
    }

    return {
        registerUser,
        loginUser,
        logoutUser,
        fetchCurrentUser,
        user,
        isLoggingIn,
        isLoggingOut,
        isRegistering,
        error
    }
})