import { create } from "zustand";
import { api } from "../components/api/url";


export const useForgotPasswordStore = create((set, get) => ({
    email: "",
    otp: "",
    newPassword: "",
    step: 1, // 1=email, 2=otp, 4=reset, 3=success
    loading: false,
    error: "",
    resendDisabled: false,
    countdown: 30,

    setField: (key, value) => set({ [key]: value }),

    /* ===== SEND OTP ===== */
    sendOtp: async () => {
        const { email } = get();
        if (!email) return set({ error: "Email is required" });

        try {
            set({ loading: true, error: "" });
            await api.post("/user/forgot-password/request", { email });

            set({
                step: 2,
                resendDisabled: true,
                countdown: 30,
                loading: false,
            });
        } catch (err) {
            set({
                loading: false,
                error: err.response?.data?.message || "Failed to send OTP",
            });
        }
    },

    /* ===== VERIFY OTP ===== */
    verifyOtp: async () => {
        const { email, otp } = get();
        if (!otp) return set({ error: "OTP is required" });

        try {
            set({ loading: true, error: "" });
            await api.post("/user/forgot-password/verify", { email, otp });

            set({ step: 4, loading: false });
        } catch (err) {
            set({
                loading: false,
                error: err.response?.data?.message || "Invalid OTP",
            });
        }
    },

    /* ===== RESET PASSWORD ===== */
    resetPassword: async () => {
        const { email, otp, newPassword } = get();
        if (newPassword.length < 8)
            return set({ error: "Password must be at least 8 characters" });

        try {
            set({ loading: true, error: "" });
            await api.post("/user/forgot-password/reset", {
                email,
                otp,
                newPassword,
            });

            set({ step: 3, loading: false });
        } catch (err) {
            set({
                loading: false,
                error: err.response?.data?.message || "Password reset failed",
            });
        }
    },

    /* ===== OTP TIMER ===== */
    tick: () => {
        const { countdown } = get();
        if (countdown > 1) {
            set({ countdown: countdown - 1 });
        } else {
            set({ resendDisabled: false, countdown: 30 });
        }
    },

    resetAll: () =>
        set({
            email: "",
            otp: "",
            newPassword: "",
            step: 1,
            error: "",
            loading: false,
        }),
}));
