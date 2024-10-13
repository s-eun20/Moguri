<template>
  <b-navbar toggleable="lg" type="light" class="navbar-custom">
    <b-navbar-brand href="/" class="moguri-logo">MOGURI</b-navbar-brand>

    <menu-group class="menu" />

    <b-navbar-nav class="ml-auto d-flex align-items-center">
      <b-dropdown v-if="isLoggedIn" class="user-dropdown" variant="link" text="">
        <template #button-content>
          <img
            src="@/assets/img/Moguri.png"
            alt="Profile Picture"
            class="profile-pic"
          />
        </template>
        <b-dropdown-item class="dropdown-item" @click="goToBadges">🛡️ 뱃지함</b-dropdown-item>
        <b-dropdown-item class="dropdown-item" @click="collectMoguri">🪙 모구리 모으기</b-dropdown-item>
        <b-dropdown-item class="dropdown-item" @click="editAccount">📝 회원 수정</b-dropdown-item>
        <b-dropdown-item class="dropdown-item" @click="logout">🚪 로그아웃</b-dropdown-item>
      </b-dropdown>

      <div class="d-flex align-items-center">
        <div v-if="isLoggedIn" class="user-info">
          <b-nav-item class="user-name">{{ nickname }}님</b-nav-item>
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
const router = useRouter();

const showModal = ref(false); 

const logout = async () => {
  await authStore.logout(router);
  localStorage.removeItem("selectedStock"); 
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

li.dropdown-item {
  padding: 3px;
}

.dropdown-menu {
  --bs-dropdown-min-width: 5rem;
}

.dropdown-item:hover {
  color: rgb(255, 166, 0);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .navbar-custom {
    flex-direction: column; /* 세로 방향으로 정렬 */
    align-items: flex-start; /* 왼쪽 정렬 */
  }

  .moguri-logo {
    font-size: 20px; /* 모바일에서 로고 크기 조정 */
  }

  .user-name {
    font-size: 18px; /* 모바일에서 사용자 이름 크기 조정 */
  }

  .cotton-candy {
    font-size: 16px; /* 모바일에서 코튼 캔디 크기 조정 */
  }

  .login-button {
    font-size: 14px; /* 모바일에서 로그인 버튼 크기 조정 */
  }

  .profile-pic {
    width: 50px; /* 모바일에서 프로필 사진 크기 조정 */
    height: 50px; 
  }
}
</style>