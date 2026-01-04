import { create } from "zustand";
import toast from "react-hot-toast";
import { api } from "../components/api/url";

export const useUrlStore = create((set) => ({
    urls: [],
    loading: false,
    error: null,
    latestShortUrl: "",

    /* ---------- FETCH ---------- */
    fetchUrls: async () => {
        try {
            set({ loading: true, error: null });
            const res = await api.get("/url/shorten");

            set({
                urls: res.data.urls || [],
                loading: false,
            });
        } catch (err) {
            set({
                loading: false,
                error: err.response?.data?.message || "Failed to fetch URLs",
            });
        }
    },

    /* ---------- CREATE ---------- */
    createUrl: async ({ longUrl, customUrl }) => {
        try {
            set({ loading: true, error: null });

            const res = await api.post("/url/shorten", {
                longUrl,
                customUrl,
            });

            // ✅ EXACT backend structure
            const newUrl = res.data.data;

            if (!newUrl?._id || !newUrl?.shortenedUrl) {
                throw new Error("Invalid server response");
            }

            set((state) => ({
                urls: [newUrl, ...state.urls], // 🔥 instantly show
                latestShortUrl: newUrl.shortenedUrl,
                loading: false,
            }));

            toast.success(res.data.message || "URL created successfully");
            return { success: true };

        } catch (err) {
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Add URL failed";

            console.error("CREATE URL ERROR:", err.response?.data || err);

            toast.error(msg);
            set({ loading: false, error: msg });

            return { success: false };
        }
    },

    /* ---------- DELETE ---------- */
    deleteUrl: async (id) => {
        try {
            set({ loading: true });

            await api.delete("/url/shorten", {
                data: { id },
            });

            set((state) => ({
                urls: state.urls.filter((u) => u._id !== id),
                loading: false,
            }));

            toast.success(" URL deleted");
        } catch (err) {
            toast.error("Delete failed");
            set({ loading: false });
        }
    },

    clearLatest: () => {
        set({ latestShortUrl: "" });


    }

}));
