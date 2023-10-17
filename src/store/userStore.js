import { create } from 'zustand'

const useUserStore = create((set) => ({
  userInfo: {},
  token: '',
  setUserInfo: (data) => {
    set((state) => {
      state.userInfo = data.user
      state.token = data.token
    })
  }
}))

export default useUserStore
