<template>
  <b-navbar toggleable="lg" type="light" class="navbar-custom">
    <b-navbar-brand href="/" class="moguri-logo">MOGURI</b-navbar-brand>

    <menu-group class="menu" />

    <b-navbar-nav class="ml-auto d-flex align-items-center">
      <div class="d-flex align-items-center">
        <!-- 닉네임 클릭 시 마이페이지로 이동 -->
        <div v-if="isLoggedIn" class="user-info d-flex align-items-center">
          <img 
            class="user-avatar" 
            :src="profilePhoto || defaultPhoto" 
            alt="프로필 이미지" 
            style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-right: 10px;" 
          />
          <b-nav-item class="user-name" @click="goToMyPage">{{ nickname }}님</b-nav-item>
          <p class="cotton-candy">코튼 캔디: <span class="cotton-candy-value">{{ cottonCandy }}</span></p>
        </div>

        <b-nav-item v-else>
          <button @click="showLoginModal" class="login-button">
            <i class="fas fa-user-circle"></i> 로그인
          </button>
        </b-nav-item>
      </div>
    </b-navbar-nav>
  </b-navbar>

  <div class="nav-divider"></div>

  <LoginModal v-if="showModal" :showModal="showModal" @close="closeLoginModal" />
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import MenuGroup from './Menu/menuGroup.vue';
import { useRouter } from 'vue-router';
import LoginModal from '@/pages/login/LoginModal.vue';
import '@/assets/styles/global.css';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLogin);
const nickname = computed(() => authStore.nickname);
const cottonCandy = computed(() => authStore.cottonCandy);
const profilePhoto = computed(() => authStore.profilePhoto); // 프로필 사진 가져오기
const defaultPhoto = 'path_to_default_image'; // 기본 이미지 경로
const router = useRouter();

const showModal = ref(false);

// 마이페이지로 이동하는 함수
const goToMyPage = () => {
  router.push({ name: 'EditProfile' });
};

const showLoginModal = () => {
  showModal.value = true;
};

const closeLoginModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
/* 이전 스타일을 유지하되 드롭다운 관련된 부분 제거 */
.navbar-custom {
  font-family: 'HakgyoansimWoojuR' !important;
}

.nav-divider {
  height: 1px;
  background-color: #e0e0e0;
  margin-top: 5px;
  padding: 0;
  border: none;
}

.moguri-logo {
  color: rgb(255, 166, 0); /* 주황색 */
  font-weight: bold;
  font-size: 24px;
}

.menu {
  margin-right: auto;
  font-weight: bold;
  font-size: 19px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 1rem; /* 여백 추가 */
}

.user-name {
  font-weight: bold;
  font-size: 24px; /* 크기 조정 */
  color: rgb(255, 166, 0); /* 주황색 */
  cursor: pointer;
}

.cotton-candy {
  font-size: 16px;
  color: rgb(255, 166, 0); /* 주황색 */
  padding: 8px 12px; /* 여백 추가 */
  border-radius: 5px; /* 모서리 둥글게 */
  background-color: rgba(255, 166, 0, 0.1); /* 배경 추가 */
}

.cotton-candy-value {
  color: rgb(230, 120, 0); /* 조금 더 어두운 주황색 */
  font-weight: bold; /* 강조를 위한 두께 조정 */
}

.login-button {
  margin-left: 1rem;
  font-weight: bold;
  color: rgb(255, 166, 0); /* 주황색 */
  border: 2px solid rgb(255, 166, 0); /* 주황색 */
  background-color: white;
  padding: 14px 14px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: rgb(255, 166, 0); /* 주황색 */
  color: white;
}
</style>