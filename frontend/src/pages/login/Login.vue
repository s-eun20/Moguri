<template>
    <div class="login-container">
      <h2>모구리 로그인</h2>
      <form @submit.prevent="login">
        <div class="input-group">
          <label for="username">이메일:</label>
          <input type="text" v-model="username" required />
        </div>
        <div class="input-group">
          <label for="password">비밀번호:</label>
          <input type="password" v-model="password" required />
        </div>
        <button type="submit" class="login-button">로그인</button>
      </form>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p>아직 계정이 없으신가요? <router-link to="/register">회원가입</router-link></p>
      <p v-if="nickname">안녕하세요, {{ nickname }}님!</p>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const username = ref('');
      const password = ref('');
      const errorMessage = ref('');
      const nickname = ref(''); // 닉네임을 저장할 변수
      const router = useRouter();
  
      const login = async () => {
        try {
          const response = await axios.post('http://localhost:8080/api/login', {
            username: username.value,
            password: password.value,
          });
          console.log('로그인 성공:', response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
          nickname.value = response.data.nickname; // 닉네임 저장
          router.push('/home'); // 원하는 페이지로 이동
        } catch (error) {
          console.error('로그인 실패:', error);
          errorMessage.value = '로그인 실패. 다시 시도하세요.';
        }
      };
  
      return {
        username,
        password,
        login,
        errorMessage,
        nickname,
      };
    },
  };
  </script>
  
  <style>
  .login-container {
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
  
  .login-button {
    background-color: #FECD72; /* 버튼 색상 */
    border: none;
    padding: 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }
  
  .login-button:hover {
    background-color: #f0b300; /* 버튼 호버 효과 */
  }
  
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  