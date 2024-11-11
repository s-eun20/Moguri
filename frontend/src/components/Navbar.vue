<template>
  <b-navbar toggleable="lg" type="light" class="navbar-custom">
    <b-navbar-brand href="/" class="moguri-logo">MOGURI</b-navbar-brand>

    <menu-group class="menu" />

    <b-navbar-nav class="ml-auto d-flex align-items-center">
      <!-- 프로필 사진을 숨기기 위한 조건 추가 -->
      <div v-if="isLoggedIn && !hideProfilePic" class="user-dropdown">
        <img
          src="@/assets/img/moguri_close.png"
          alt="Profile Picture"
          class="profile-pic"
        />
      </div>

      <div class="d-flex align-items-center">
        <div v-if="isLoggedIn" class="user-info">
          <b-nav-item class="user-name" @click="goToMoguriPage"
            >{{ nickname }}님</b-nav-item
          >
        </div>

        <b-nav-item
          v-if="isLoggedIn"
          id="cotton-candy-container"
          class="d-flex align-items-center"
        >
          <!-- Font Awesome 솜사탕 아이콘 추가 -->
          <!-- <i class="fas fa-cloud cotton-candy-icon" style="color: #ffe5f2; font-size: 20px;"></i>
          <p class="cotton-candy ml-2 mb-0">{{ cottonCandy }}</p> 코튼 캔디 금액 -->
          <div class="my-cotton-candy-container p-1 m-2">
            <div class="icon-circle">
              <i
                class="fa-solid fa-cloud"
                style="color: #ffe5f2; font-size: 1.2rem"
              ></i>
            </div>
            <span class="my-cotton-candy">
              {{ cottonCandy }}
              <!-- 포맷팅된 값 사용 -->
            </span>
          </div>
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

  <LoginModal
    v-if="showModal"
    :showModal="showModal"
    @close="closeLoginModal"
  />
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
// cottonCandy computed 속성 수정
const cottonCandy = computed(() => {
  return new Intl.NumberFormat('ko-KR').format(authStore.cottonCandy);
});
const router = useRouter();

// 현재 경로의 메타 정보에 따라 프로필 사진 숨기기 결정
const hideProfilePic = computed(() => {
  return router.currentRoute.value.meta.hideProfilePic; // 메타 필드 확인
});

const showModal = ref(false);

// 마구리 페이지로 이동하는 함수
const goToMoguriPage = () => {
  router.push({ name: 'Moguri' });
};

const showLoginModal = () => {
  showModal.value = true;
};

const closeLoginModal = () => {
  showModal.value = false;
};
</script>

<style scoped>
/* 코튼캔디 */
.my-cotton-candy-flex {
  padding-left: 20px;
  padding-right: 20px;
  font-size: 1.5rem;
  font-weight: bold;
}
.my-cotton-candy-container {
  background-color: #fff3da;
  border-radius: 17px;
}
.icon-circle {
  background-color: #fff;
  display: inline;
  border-radius: 50%;
  padding: 7px;
}
.my-cotton-candy {
  margin-left: 10px;
  margin-right: 10px;
  font-size: 1.4rem;
  font-weight: 600;
}

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
  z-index: 1;
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

.cotton-candy {
  font-weight: bold;
  color: rgb(228, 171, 67);
  margin-bottom: 0; /* 텍스트 아래 여백 제거 */
}

.profile-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.profile-pic {
  width: 50px; /* 프로필 사진 크기 조정 */
  height: 50px;
  border-radius: 50%;
  object-fit: contain;
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
  font-size: 1.4rem; /* 크기 조정 */
  color: rgb(255, 166, 0); /* 주황색 */
  cursor: pointer;
  margin-right: 10px;
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

.cotton-candy-icon {
  color: #ffe5f2; /* 아이콘 색상 */
  font-size: 10px; /* 아이콘 크기 조정 */
  margin-right: 3px; /* 아이콘과 텍스트 간의 간격 조정 */
}
</style>
