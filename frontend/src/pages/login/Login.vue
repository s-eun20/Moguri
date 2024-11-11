<template>
  <div class="login-container">
    <div class="login-box">
      <img src="@/assets/img/Moguri.png" alt="Moguri Logo" class="moguri-logo" />
      <h2 class="login-title">로그인</h2>
      <form @submit.prevent="login" class="login-form">
        <div class="input-group">
          <input type="text" v-model="email" required placeholder="이메일" />
        </div>
        <div class="input-group">
          <input type="password" v-model="password" required placeholder="비밀번호" />
        </div>
        <button type="submit" class="login-button">로그인</button>
        
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
      <div class="divider">
        <span>또는</span>
      </div>
      <div class="social-login">
        <button @click="kakaoLogin" class="social-button kakao">
          <img src="@/assets/img/kakao-logo.png" alt="Kakao" />
        </button>
        <button @click="googleLogin" class="social-button google">
          <img src="@/assets/img/google-logo.png" alt="Google" />
        </button>
        <button @click="naverLogin" class="social-button naver">
          <img src="@/assets/img/naver-logo.png" alt="Naver" />
        </button>
      </div>
      <p class="register-link">
        계정이 없으신가요? <router-link to="/register">회원가입</router-link>
      </p>
    </div>
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
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.moguri-logo {
  width: 80px;
  height: auto;
  display: block;
  margin: 0 auto 20px;
}

.login-title {
  color: #333;
  font-size: 24px;
  text-align: center;
  margin-bottom: 30px;
}

.login-form {
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 20px;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input[type="text"]:focus,
input[type="password"]:focus {
  border-color: #FECD72;
  outline: none;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #FECD72;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #f0b300;
}

.divider {
  text-align: center;
  margin: 20px 0;
  color: #777;
  position: relative;
}

.divider span {
  background-color: white;
  padding: 0 10px;
  position: relative;
  z-index: 1;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  border-top: 1px solid #ddd;
  z-index: 0;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 30px;  /* 간격을 조금 더 늘렸습니다 */
  margin-bottom: 20px;
}

.social-button {
  background: none;  /* 배경 제거 */
  border: none;
  padding: 0;
  cursor: pointer;
  transition: transform 0.3s;
}

.social-button:hover {
  transform: scale(1.1);
}

.social-button img {
  width: 40px;  /* 이미지 크기를 조금 키웠습니다 */
  height: 40px;
}

.error {
  color: #e74c3c;
  text-align: center;
  margin-top: 10px;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: #555;
}

.register-link a {
  color: #FECD72;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>