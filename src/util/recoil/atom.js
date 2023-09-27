import { atom } from 'recoil';

// 초기값은 로그인되지 않은 상태로 설정
export const userState = atom({
  key: "userData",
  default: {
      user_id: null,
      user_name: "",
      email: "",
      introduction: "",
      profileImage: null,
  },
});

export const bookmarkFoldersState = atom({
  key: "bookmarkFoldersState",
  default: [],
});

export const modalState = atom({
  key:"modalState",
  default:false
})