<template>
  <b-navbar toggleable="lg" type="light" class="navbar-custom">
    <b-navbar-brand href="/" class="moguri-logo">MOGURI</b-navbar-brand>

    <menu-group class="menu" />

    <b-navbar-nav class="ml-auto d-flex align-items-center">
      <div class="d-flex align-items-center">
        <b-dropdown v-if="isLoggedIn" class="user-dropdown" variant="link" text="">
          <template #button-content>
            <img
              src="@/assets/img/Moguri.png"
              alt="Profile Picture"
              class="profile-pic"
            />
          </template>
           <b-dropdown-item class="dropdown-item" @click="goToBadges"
            >🛡️ 뱃지함</b-dropdown-item
          >
          <b-dropdown-item class="dropdown-item" @click="collectMoguri"
            >🪙 모구리 모으기</b-dropdown-item
          >
          <b-dropdown-item class="dropdown-item" @click="editAccount"
            >📝 회원 수정</b-dropdown-item
          >
          <b-dropdown-item class="dropdown-item" @click="logout"
            >🚪 로그아웃</b-dropdown-item
          >
        </b-dropdown>

        <div v-if="isLoggedIn" class="user-info">
          <b-nav-item class="user-name">{{ nickname }}님</b-nav-item>
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
const router = useRouter();

const showModal = ref(false); 

const logout = async () => {
  await authStore.logout(router);
};

const goToBadges = () => {
  console.log("뱃지함으로 이동");
};

const collectMoguri = () => {
  console.log("모구리 모으기");
};

const editAccount = () => {
  console.log("회원 수정");
};

const showLoginModal = () => {
  showModal.value = true;
};

const closeLoginModal = () => {
  showModal.value = false;
}
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
}

.menu {
  margin-right: auto;
  font-weight: bold;
  font-size: 19px;
}

.user-dropdown {
  position: relative;
}

.profile-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgb(255, 166, 0); /* 프로필 사진 테두리 주황색 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 */
  transition: border-color 0.3s;
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
  margin-left: 1rem; /* 여백 추가 */
}

.user-name {
  font-weight: bold;
  font-size: 24px; /* 크기 조정 */
  color: rgb(255, 166, 0); /* 주황색 */
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

.dropdown-item {
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 8px 12px; 
  transition: background-color 0.2s;
  border-radius: 5px;
  background-color: transparent; /* 배경색 제거 */
  color: rgb(255, 166, 0); /* 드롭다운 아이템 텍스트 색상 */
}

.dropdown-item:hover {
  background-color: rgba(255, 166, 0, 0.1); /* Hover 시 배경색 */
  color: rgb(255, 166, 0);
}

/* 드롭다운 배경 */
.b-dropdown-menu {
  background-color: white; /* 드롭다운 메뉴 배경색 흰색 */
  border: 1px solid rgb(255, 166, 0); /* 테두리 색상 주황색 */
  border-radius: 5px; /* 드롭다운 모서리 둥글게 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
  z-index: 10; /* 드롭다운 메뉴가 위로 올라오도록 */
}
</style>