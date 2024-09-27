<template>
  <div class="login-container">
    <img src="@/assets/모구리.png" alt="Moguri Logo" class="moguri-logo" />
    <h2 class="login-title"></h2>
    <form @submit.prevent="login" class="login-form">
      <div class="input-group">
        <label for="email">이메일:</label>
        <input type="text" v-model="email" required />
      </div>
      <div class="input-group">
        <label for="password">비밀번호:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit" class="login-button">로그인</button>
      
      <!-- 로그인 실패 메시지 표시 -->
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      
    </form>
    <p class="quick-login-title">간편 로그인</p>
    <div class="social-login">
      <img @click="kakaoLogin" src="@/assets/kakao-logo.png" alt="Kakao Logo" class="kakao-logo" />
      <img @click="googleLogin" src="@/assets/google-logo.png" alt="Google Logo" class="google-logo" />
      <img @click="naverLogin" src="@/assets/naver-logo.png" alt="Naver Logo" class="naver-logo" />
    </div>
    <p class="register-link">
      아직 계정이 없으신가요? <router-link to="/register">회원가입</router-link>
    </p>

    <!-- 팝업창은 이제 필요 없음, 주석 처리 -->
    <!-- 
    <div v-if="isPopupVisible" class="popup">
      <div class="popup-content">
        <p>{{ errorMessage }}</p>
        <button @click="closePopup">닫기</button>
      </div>
    </div>
    -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const email = ref('user1@example.com');
const password = ref('');


const login = async () => {
  try {
    authStore.errorMessage = ''; // 오류 메시지 초기화
    // 로그인 시도, 라우터 전달
    const result = await authStore.login({ username: email.value, password: password.value }, router);  // 팝업을 표시
    if (result){
      authStore.errorMessage = '로그인이 실패했습니다.';
    }
  } catch (error) {
    console.error('로그인 중 오류 발생:', error.message);
    authStore.errorMessage = error.message || "로그인이 실패했습니다.";
  }
};



const kakaoLogin = () => {
  console.log("카카오톡 로그인 시도");
  // 카카오톡 로그인 처리 로직 추가
};

const googleLogin = () => {
  console.log("구글 로그인 시도");
  // 구글 로그인 처리 로직 추가
};

const naverLogin = () => {
  console.log("네이버 로그인 시도");
  // 네이버 로그인 처리 로직 추가
};

const errorMessage = computed(() => authStore.errorMessage);
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  background: white; /* 배경을 반투명하게 설정 */
  max-width: 500px;
  margin: auto;
  position: relative; /* 자식 요소를 위한 위치 설정 */
  z-index: 1; /* 로그인 박스보다 아래에 있게 설정 */
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.login-box {
  padding: 20px; /* 로그인 박스 안의 패딩 */
  border: 1px solid #ccc; /* 테두리 */
  border-radius: 8px; /* 모서리 둥글게 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* 그림자 */
  width: 100%; /* 박스 너비 조정 */
  background-color: #fff; /* 배경색 */
  position: relative; /* 위치 설정 */
  z-index: 2; /* 최상단에 표시 */
}

/* 나머지 스타일은 동일하게 유지 */

.moguri-logo {
  width: 120px;
  height: auto;
  margin-bottom: 15px;
}

.login-title {
  color: #333;
  font-family: 'BMJUA', sans-serif;
  margin-bottom: 20px;
  text-align: center;
}

.login-form {
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

input[type="text"],
input[type="password"] {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.2s;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #FECD72;
}

.login-button {
  background-color: #FECD72;
  border: none;
  padding: 12px; /* 버튼 패딩 조정 */
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s;
  width: 100%;
}

.login-button:hover {
  background-color: #f0b300;
}

.quick-login-title {
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.social-login {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
}

.kakao-logo,
.naver-logo {
  width: 60px;
  height: 60px;
  cursor: pointer;
}

.google-logo {
  width: 100px;
  height: 60px;
  cursor: pointer;
}

.error {
  color: #e74c3c;
  margin-top: 10px;
  text-align: center;
}

.register-link {
  margin-top: 15px;
  color: #555;
  text-align: center;
}

/* 팝업 스타일 */
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* 팝업을 최상단에 표시 */
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
}

.popup-content button {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #FECD72;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.popup-content button:hover {
  background-color: #f0b300;
}
</style>