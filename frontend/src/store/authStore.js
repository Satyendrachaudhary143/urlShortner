import { create } from "zustand";
import { api } from "../components/api/url";

export const useAuthStore = create((set) => ({
    /* ================= GLOBAL STATE ================= */
    loading: false,
    error: null,

    user: null,
    authChecked: false,

    /* ================= SIGNUP / OTP STATE ================= */
    step: 1,            // 1 = register, 2 = otp
    tempEmail: "",

    /* ================= REGISTER ================= */
    register: async (formData) => {
        set({ loading: true, error: null });

        try {
            const res = await api.post("/user/register", formData);


            set({
                step: 2,
                tempEmail: formData.email,
                loading: false,
            });

            return true;
        } catch (err) {
            set({
                error:
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Registration failed",
                loading: false,
            });
            return false;
        }
    },

    /* ================= VERIFY OTP ================= */
    verifyOtp: async ({ email, otp }) => {
        set({ loading: true, error: null });

        try {
            await api.post("/user/verify-otp", { email, otp });

            // ✅ OTP verify ≠ login
            // reset signup flow only
            set({
                step: 1,
                tempEmail: "",
                loading: false,
            });

            return true;
        } catch (err) {
            set({
                error:
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Invalid OTP",
                loading: false,
            });
            return false;
        }
    },

    /* ================= RESEND OTP ================= */
    resendOtp: async (email) => {
        set({ loading: true, error: null });

        try {
            await api.post("/user/resend-otp", { email });
            set({ loading: false });
            return true;
        } catch (err) {
            set({
                error:
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Failed to resend OTP",
                loading: false,
            });
            return false;
        }
    },

    /* ================= LOGIN ================= */
    login: async (credentials) => {
        set({ loading: true, error: null });

        try {
            await api.post("/user/login", credentials);

            // get logged-in user
            const res = await api.get("/user/me");

            set({
                user: res.data.user,
                authChecked: true,
                loading: false,
            });

            return true;
        } catch (err) {
            set({
                error:
                    err.response?.data?.message ||
                    "Invalid email or password",
                loading: false,
            });
            return false;
        }
    },

    /* ================= CHECK AUTH (REFRESH) ================= */
    checkAuth: async () => {
        try {
            const res = await api.get("/user/me");
            set({
                user: res.data.user,
                authChecked: true,
            });
        } catch {
            set({
                user: null,
                authChecked: true,
            });
        }
    },

    /* ================= LOGOUT ================= */
    logout: async () => {
        try {
            await api.get("/user/logout");
        } finally {
            set({
                user: null,
                authChecked: true,
            });
        }
    },

    /* ================= RESET SIGNUP FLOW ================= */
    resetSignupFlow: () =>
        set({
            step: 1,
            tempEmail: "",
            loading: false,
            error: null,
        }),
}));
