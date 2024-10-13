<template>
  <b-navbar toggleable="lg" type="light" class="navbar-custom">
    <b-navbar-brand href="/" class="moguri-logo">MOGURI</b-navbar-brand>

    <menu-group class="menu" />

    <b-navbar-nav class="ml-auto d-flex align-items-center">
      <div v-if="isLoggedIn" class="user-dropdown">
        <img
          src="@/assets/img/Moguri.png"
          alt="Profile Picture"
          class="profile-pic"
        />
      </div>

      <div class="d-flex align-items-center">
        <div v-if="isLoggedIn" class="user-info">
          <b-nav-item class="user-name" @click="goToMyPage">{{ nickname }}님</b-nav-item> <!-- 클릭 이벤트 추가 -->
        </div>

        <b-nav-item v-if="isLoggedIn" class="cotton-candy-container">
          <p class="cotton-candy">코튼 캔디: {{ cottonCandy }}</p>
        </b-nav-item>

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
const profilePhoto = computed(() => authStore.profilePhoto);
const defaultPhoto = 'path_to_default_image';
const router = useRouter();

const showModal = ref(false);

// 마이페이지로 이동하는 함수
const goToMyPage = () => {
  router.push({ name: 'EditProfile' }); // 'EditProfile'이 마이페이지의 라우트 이름인지 확인
};

const showLoginModal = () => {
  showModal.value = true;
};

const closeLoginModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
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
  z-index:1;
}

.menu {
  margin-right: auto;
  font-weight: bold;
  font-size: 19px;
}

.user-dropdown {
  position: relative; /* 드롭다운의 위치를 상대적으로 설정 */
  z-index: 1000; /* 드롭다운이 다른 요소 위에 표시되도록 설정 */
}
.user-dropdown .dropdown-toggle::after {
  display: none; /* 화살표 숨기기 */
}

.cotton-candy {
  margin-top: 15px;
  font-weight: bold;
  color: rgb(228, 171, 67);
}

.profile-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.profile-pic {
  width: 60px; /* 프로필 사진 크기 조정 */
  height: 60px; 
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.3s; /* Hover 애니메이션 */
}

.profile-pic:hover {
  transform: scale(1.1); /* Hover 시 확대 */
}

.user-info {
  display: flex;
  flex-direction: column; 
  align-items: flex-start; 
}

.user-name {
  font-weight: bold;
  font-size: 24px; /* 크기 조정 */
  color: rgb(255, 166, 0); /* 주황색 */
  cursor: pointer;
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