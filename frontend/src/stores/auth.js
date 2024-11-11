import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import router from '@/router';
const AUTH_KEY = 'auth';
const initState = {
  token: '',
  user: {
    memberId: '',
    email: '',
    nickname: '',
    roles: [],
    cottonCandy: '0',
  },
};
export const useAuthStore = defineStore('auth', () => {
  const state = ref({ ...initState });
  const isLoading = ref(false);
  const errorMessage = ref('');
  const isLogin = computed(() => !!state.value.user.nickname);
  const nickname = computed(() => state.value.user.nickname);
  const email = computed(() => state.value.user.email);
  const cottonCandy = computed(() => state.value.user.cottonCandy);
  const login = async (member) => {
    let isError = false;
    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        member
      );
      console.log('로그인 성공:', response.data);
      state.value.token = response.data.token;
      state.value.user = { ...response.data.user };
      localStorage.setItem(AUTH_KEY, JSON.stringify(state.value));
      router.push('/');
    } catch (error) {
      console.error('로그인 실패:', error);
      errorMessage.value = '로그인 실패. 다시 시도하세요.';
      isError = true;
    } finally {
      isLoading.value = false;
      return isError;
    }
  };
  const logout = () => {
    localStorage.clear();
    state.value = { ...initState };
    router.push('/');
  };
  const load = () => {
    const auth = localStorage.getItem(AUTH_KEY);
    console.log('로컬 스토리지에서 로드된 데이터:', auth);
    if (auth) {
      try {
        state.value = JSON.parse(auth);
        // user 객체가 존재하는지 확인
        if (
          !state.value.user ||
          !state.value.user.nickname ||
          !state.value.user.memberId ||
          !state.value.user.cottonCandy
        ) {
          state.value = { ...initState };
        }
      } catch (error) {
        console.error('로컬 스토리지 데이터 파싱 오류:', error);
        state.value = { ...initState }; // 초기 상태로 리셋
      }
    }
  };
  const updateCottonCandy = async (amount) => {
    const userId = state.value.user.memberId;
    if (!userId) {
      console.error('사용자 ID가 정의되지 않았습니다.');
      return;
    }
    const newCottonCandyAmount =
      parseInt(state.value.user.cottonCandy) + amount;
    state.value.user.cottonCandy = newCottonCandyAmount.toString();
    localStorage.setItem(AUTH_KEY, JSON.stringify(state.value));
    try {
      await axios.patch(
        `http://localhost:8080/api/members/${userId}/cotton-candy`,
        {
          cottonCandy: newCottonCandyAmount,
        }
      );
      console.log('코튼 캔디 업데이트 성공', newCottonCandyAmount);
    } catch (error) {
      console.error('코튼 캔디 업데이트 실패:', error);
    }
  };
  const getCottonCandy = async () => {
    const userId = state.value.user.memberId;
    if (!userId) {
      console.error('사용자 ID가 정의되지 않았습니다.');
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8080/api/members/${userId}/cotton-candy`
      );
      const cottonCandyAmount = response.data.data;
      state.value.user.cottonCandy = cottonCandyAmount;
      localStorage.setItem(AUTH_KEY, JSON.stringify(state.value));
      console.log('코튼 캔디 가져오기 성공:', cottonCandyAmount);
    } catch (error) {
      console.error('코튼 캔디 가져오기 실패:', error);
    }
  };
  load();
  return {
    state,
    isLogin,
    nickname,
    email,
    login,
    logout,
    cottonCandy,
    isLoading,
    getCottonCandy,
    updateCottonCandy,
    load,
  };
});
