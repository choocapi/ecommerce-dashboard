import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      isLoading: false,

      setAccessToken: (accessToken) => {
        set({ accessToken });
      },
      clearState: () => {
        set({ accessToken: null, user: null, isLoading: false });
      },

      register: async (email, password, firstName, lastName) => {
        try {
          set({ isLoading: true });

          //  gọi api
          await authService.signUp(email, password, firstName, lastName);

          toast.success("Đăng ký thành công! Bạn sẽ được chuyển sang trang đăng nhập.");
        } catch (error) {
          console.error(error);
          toast.error("Đăng ký không thành công");
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email, password) => {
        try {
          set({ isLoading: true });

          const { accessToken } = await authService.signIn(email, password);
          get().setAccessToken(accessToken);

          await get().fetchMe();

          toast.success("Đăng nhập thành công!");
        } catch (error) {
          console.error(error);
          if (error === "USER_NOT_VERIFIED") {
            toast.error("Email chưa được xác thực. Vui lòng xác thực email để đăng nhập.");
          } else {
            toast.error("Đăng nhập không thành công!");
          }

          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          get().clearState();
          await authService.signOut();
          toast.success("Logout thành công!");
        } catch (error) {
          console.error(error);
          toast.error("Lỗi xảy ra khi logout. Hãy thử lại!");
          throw error;
        }
      },

      fetchMe: async () => {
        try {
          set({ isLoading: true });
          const user = await authService.fetchMe();

          set({ user });
        } catch (error) {
          console.error(error);
          set({ user: null, accessToken: null });
          toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!");
        } finally {
          set({ isLoading: false });
        }
      },

      refreshUser: async () => {
        try {
          const user = await authService.fetchMe();
          set({ user });
        } catch (error) {
          console.error("Failed to refresh user:", error);
        }
      },

      refresh: async () => {
        try {
          set({ isLoading: true });
          const { user, fetchMe, setAccessToken } = get();
          const accessToken = await authService.refresh();

          setAccessToken(accessToken);

          if (!user) {
            await fetchMe();
          }
        } catch (error) {
          console.error(error);
          get().clearState();
        } finally {
          set({ isLoading: false });
        }
      },

      // Initialize auth state - call on app mount
      initialize: async () => {
        const { user, refresh } = get();

        // If we don't have user info but might have a valid refresh token (in cookie)
        // try to refresh and get user info
        if (!user) {
          try {
            await refresh();
          } catch (error) {
            // Silently fail - user is not logged in
            console.log("No active session");
          }
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist user and accessToken, not isLoading
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
);
