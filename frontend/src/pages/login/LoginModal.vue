<template>
  <div>
    <div class="modal-overlay" v-if="showModal" @click.self="closeModal">
      <div class="login-box">
        <button class="close-modal" @click="closeModal">&times;</button> <!-- 오른쪽 상단에 닫기 버튼 추가 -->
        <img src="@/assets/img/Moguri.png" alt="Moguri Logo" class="moguri-logo" />
        <h2 class="login-title">로그인</h2>
        <form @submit.prevent="login" class="login-form">
          <div class="input-group">
            <input type="text" v-model="email" required placeholder="이메일" />
          </div>
          <div class="input-group">
            <input type="password" v-model="password" required placeholder="비밀번호" />
          </div>
          <button type="submit" class="login-button" :disabled="authStore.isLoading">
            <span v-if="authStore.isLoading">로딩 중...</span>
            <span v-else>로그인</span>
          </button>
          <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
        <p class="register-link">
          계정이 없으신가요? 
          <router-link to="/register" @click="closeModal">회원가입</router-link> <!-- 회원가입 클릭 시 모달 닫기 -->
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(); // emit 정의
const authStore = useAuthStore();
const router = useRouter();
const email = ref();
const password = ref('');
const errorMessage = computed(() => authStore.errorMessage);

// 로그인 메서드
const login = async () => {
  try {
    authStore.errorMessage = ''; // 오류 메시지 초기화
    const result = await authStore.login({ username: email.value, password: password.value }, router);
    if (result) {
      authStore.errorMessage = '로그인이 실패했습니다.';
    } else {
      closeModal(); // 로그인 성공 시 모달 닫기
      router.push('/'); // 로그인 성공 후 홈으로 이동
    }
  } catch (error) {
    console.error('로그인 중 오류 발생:', error.message);
    authStore.errorMessage = error.message || "로그인이 실패했습니다.";
  }finally{
    password.value = '';
  }
};

// 모달 닫기 메서드
const closeModal = () => {
  email.value = '' ;
  password.value = '';
  emit('close'); // 부모에게 모달 닫기를 알림
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative; /* 추가: 닫기 버튼을 상대적으로 배치하기 위해 */
}

/* 닫기 버튼 스타일 추가 */
.close-modal {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  border: none;
  background: none;
  color: #333;
  cursor: pointer;
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
  background-color: #F0B300;
}

.error {
  color: #E74C3C;
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
