import { create } from "zustand";

// interface: 로그인 유저 정보 상태 구조 //
interface AuthStore {
    accessToken: string | null;

    setAccessToken: (accessToken: string) => void;
    clearAuth: () => void;
}

// function: 로그인 유저 정보 스토어 생성 함수 //
const useStore = create<AuthStore>(set => ({
    accessToken: null,

    setAccessToken: (accessToken: string) => set(state => ({ ...state, accessToken})),
    clearAuth: () => set({accessToken: null })
}));

export default useStore;