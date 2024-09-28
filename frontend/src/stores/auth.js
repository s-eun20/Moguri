// stores/auth.js
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';

const AUTH_KEY = 'auth';

const initState = {
  token: '',
  user: {
    email: '',
    nickname: '',
    roles: [],
  },
};

export const useAuthStore = defineStore('auth', () => {
  const state = ref({ ...initState });
  const isLoading = ref(false);
  const errorMessage = ref('');

  const isLogin = computed(() => !!state.value.user.nickname);
  const nickname = computed(() => state.value.user.nickname);
  const email = computed(() => state.value.user.email);

 // 로그인 메서드
 const login = async (member, router) => { // router 인자 추가
  let isError = false;
  isLoading.value = true; // 요청 시작 시 로딩 시작
  errorMessage.value = ''; // 에러 메시지 초기화
  try {
    const response = await axios.post('http://localhost:8080/api/auth/login', member);
    console.log('로그인 성공:', response.data);
    
    // 로그인 정보 업데이트
    state.value.token = response.data.token; // 예시로 토큰만 업데이트
    state.value.user = { ...response.data.user }; // 사용자 정보 업데이트
    
    // 로컬 스토리지에 저장
    localStorage.setItem(AUTH_KEY, JSON.stringify(state.value));
   
    // 로그인 성공 후 라우터 이동
    router.push('/'); // 라우터 이동 추가
  } catch (error) {
    console.error('로그인 실패:', error);
    errorMessage.value = '로그인 실패. 다시 시도하세요.';  // 에러 메시지를 스토어에 저장
    isError = true;

  } finally {
    isLoading.value = false; // 요청 종료 시 로딩 끝
  return isError
  }

};

// 로그아웃 메서드
const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  state.value = { ...initState };
  router.push('/login'); // router를 사용하여 페이지 이동
};

  // 로컬스토리지에서 인증 정보 로드
  const load = () => {
    const auth = localStorage.getItem(AUTH_KEY);
    if (auth) {
      state.value = JSON.parse(auth);
      if (!state.value.user.nickname) {
        // 닉네임이 없으면 초기 상태로 설정
        state.value = { ...initState };
      }
    }
  };

  load(); // 애플리케이션 시작 시 로드

  return {
    state,
    isLogin,
    nickname,
    email,
    login,
    logout,
    isLoading, // 로딩 상태 추가
  };
});
