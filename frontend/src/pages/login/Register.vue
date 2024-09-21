<template>
    <div class="register-container">
      <h2>모구리 회원가입</h2>
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
      const email = ref('');
      const nickname = ref('');
      const password = ref('');
      const confirmPassword = ref('');
      const errorMessage = ref('');
      const router = useRouter();
  
      const register = async () => {
        if (password.value !== confirmPassword.value) {
          errorMessage.value = '비밀번호가 일치하지 않습니다.';
          return;
        }
        try {
          await axios.post('http://localhost:8080/api/register', {
            email: email.value,
            nickname: nickname.value,
            password: password.value,
          });
          router.push('/login');
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
  .register-container {
    max-width: 400px;
    margin: auto;
    background-color: #FFD580; /* 연한 배경색 */
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
  }
  
  input[type="text"], input[type="password"] {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
  }
  
  .register-button {
    background-color: #DABF00; /* 진한 버튼 색상 */
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .register-button:hover {
    background-color: #BFA700; /* 호버 시 진한 색상 */
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  