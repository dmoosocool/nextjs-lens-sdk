import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { z } from 'zod'
import { access } from 'fs'


type AuthStore = {
  accessToken?: string
  refreshToken?: string

  setAccessToken: (accessToken?: string) => void;
  setRefreshToken: (refreshToken?: string) => void;
  init: () => void
  clearTokens: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist((set, get)=>({
    accessToken: undefined,
    refreshToken: undefined,

    setAccessToken: (accessToken?: string) => set({ accessToken }),
    setRefreshToken: (refreshToken?: string) => set({ refreshToken }),

    init: () => {
      set({
        accessToken: get().accessToken, 
        refreshToken: get().refreshToken,
      })
    },

    clearTokens: () => {
      set({
        accessToken: undefined,
        refreshToken: undefined,
      })
    }
  }), {
    name: 'lens-auth-store',
    storage: createJSONStorage(()=> localStorage),
    partialize: (state) => ({
      accessToken: state.accessToken,
      refreshToken: state.refreshToken,
    })
  })
)
