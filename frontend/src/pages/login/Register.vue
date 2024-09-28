<template>
  <div class="register-container">
    <h2 class="register-title">모구리 회원가입</h2>
    <form @submit.prevent="register">
      <div class="input-group">
        <label for="email">이메일:</label>
        <input type="text" v-model="email" required />
      </div>
      <div class="input-group">
        <label for="nickname">닉네임:</label>
        <input type="text" v-model="nickname" required />
      </div>
      <div class="input-group">
        <label for="password">비밀번호:</label>
        <input type="password" v-model="password" required />
      </div>
      <div class="input-group">
        <label for="confirmPassword">비밀번호 확인:</label>
        <input type="password" v-model="confirmPassword" required />
      </div>
      <button type="submit" class="register-button">회원가입</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p>계정이 있으신가요? <router-link to="/login">로그인</router-link></p>
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

<style>
/* 스타일링 부분은 변경하지 않았습니다. */
.register-container {
  max-width: 500px; /* 로그인 화면과 동일한 최대 너비 */
  margin: auto;
  padding: 30px; /* 패딩은 동일하게 유지 */
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.register-title {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
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
}

.register-button {
  background-color: #FECD72;
  border: none;
  padding: 12px; /* 로그인 화면과 동일하게 조정 */
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
  transition: background-color 0.3s;
  width: 100%;
}

.register-button:hover {
  background-color: #f0b300;
}

.error {
  color: #e74c3c;
  margin-top: 10px;
}
</style>
