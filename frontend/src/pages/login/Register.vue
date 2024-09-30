<template>
  <div class="register-container">
    <div class="register-box">
      <img src="@/assets/img/너구리샘플.png" alt="Moguri Logo" class="moguri-logo" />
      <h2 class="register-title">회원가입</h2>
      <form @submit.prevent="register" class="register-form">
        <div class="input-group">
          <input type="text" v-model="email" required placeholder="이메일" />
        </div>
        <div class="input-group">
          <input type="text" v-model="nickname" required placeholder="닉네임" />
        </div>
        <div class="input-group">
          <input type="password" v-model="password" required placeholder="비밀번호" />
        </div>
        <div class="input-group">
          <input type="password" v-model="confirmPassword" required placeholder="비밀번호 확인" />
        </div>
        <button type="submit" class="register-button">회원가입</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
      <p class="login-link">
        이미 계정이 있으신가요? <router-link to="/login">로그인</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('dlugr12008@naver.com');
    const nickname = ref('이혁짱');
    const password = ref('1234');
    const confirmPassword = ref('1234');
    const errorMessage = ref('');
    const router = useRouter();

    const register = async () => {
      if (password.value !== confirmPassword.value) {
        errorMessage.value = '비밀번호가 일치하지 않습니다.';
        return;
      }
      try {
        await axios.post('http://localhost:8080/api/members', {
          email: email.value,
          nickName: nickname.value,
          password: password.value,
        });
        alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.'); // 팝업창 추가
        router.push('/login'); // 회원가입 성공 시 로그인 페이지로 이동
      } catch (error) {
        console.error('회원가입 실패:', error);
        errorMessage.value = '회원가입 실패. 다시 시도하세요.';
      }
    };

    return {
      email,
      nickname,
      password,
      confirmPassword,
      register,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.register-box {
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

.register-title {
  color: #333;
  font-size: 24px;
  text-align: center;
  margin-bottom: 30px;
}

.register-form {
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

.register-button {
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

.register-button:hover {
  background-color: #f0b300;
}

.error {
  color: #e74c3c;
  text-align: center;
  margin-top: 10px;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #555;
}

.login-link a {
  color: #FECD72;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
