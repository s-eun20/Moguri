<template>
  <b-navbar toggleable="lg" type="light" class="navbar-custom">
    <b-navbar-brand href="/" class="moguri-logo">MOGURI</b-navbar-brand>

    <menu-group class="menu" />

    <b-navbar-nav class="ml-auto d-flex align-items-center">
      <div class="d-flex align-items-center">
        <b-dropdown v-if="isLoggedIn">
          <template #button-content>
            <img src="@/assets/모구리.png" alt="Profile Picture" class="profile-pic" />
          </template>
          <b-dropdown-item class="dropdown-item" @click="goToBadges">🛡️ 뱃지함</b-dropdown-item>
          <b-dropdown-item class="dropdown-item" @click="collectMoguri">🪙 모구리 모으기</b-dropdown-item>
          <b-dropdown-item class="dropdown-item" @click="editAccount">📝 회원 수정</b-dropdown-item>
          <b-dropdown-item class="dropdown-item" @click="logout">🚪 로그아웃</b-dropdown-item>
        </b-dropdown>

        <b-nav-item v-if="isLoggedIn" class="user-name">{{ nickname }}님</b-nav-item>

        <!-- 로그인 링크 수정 -->
        <b-nav-item v-else>
          <router-link to="/login" class="login-button">
            <i class="fas fa-user-circle"></i> 로그인
          </router-link>
        </b-nav-item>
      </div>
    </b-navbar-nav>
  </b-navbar>
  <div class="nav-divider"></div>
</template>

<script setup>
import { computed } from 'vue';
import MenuGroup from './Menu/menuGroup.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import '../assets/styles/global.css';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLogin);
const nickname = computed(() => authStore.nickname);
const router = useRouter();
const logout = () => {
  authStore.logout(router); // router 전달
};

const goToBadges = () => {
  console.log("뱃지함으로 이동");
}

const collectMoguri = () => {
  console.log("모구리 모으기");
}

const editAccount = () => {
  console.log("회원 수정");
}
</script>

<style scoped>
.nav-divider {
  height: 1px;
  background-color: #e0e0e0; /* 원하는 색상으로 변경 가능 */
  margin-top: 5px;
  padding: 0;
  border: none;
}
.moguri-logo {
  color: rgb(255, 166, 0);
  font-weight: bold;
  font-size: 24px;
  font-family: 'HakgyoansimWoojuR';
}

.menu {
  margin-right: auto;
  font-family: 'HakgyoansimWoojuR';
  font-weight: bold;
  font-size: 19px;
}

.user-name {
  font-weight: bold;
  font-family: 'Ownglyph_meetme-Rg';
  font-size: 22px;
  color: #333;
  margin-left: 0.5rem;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 1rem;
  cursor: pointer;
}

.login-button {
  margin-left: 1rem;
  font-weight: bold;
  color: #FECD72;
  border: 2px solid #FECD72;
  padding: 14px 14px; /* 여백 추가하여 버튼 크기 조정 */
  border-radius: 5px; /* 모서리 둥글게 */
  transition: all 0.3s ease;
  text-decoration: none; /* 링크 밑줄 제거 */
}

.login-button:hover {
  background-color: #FECD72;
  color: white;
}

.dropdown-item {
  display: flex;
  align-items: center;
  font-size: 16px;
  padding: 8px 12px; /* 여백 추가하여 버튼 크기 조정 */
  transition: background-color 0.2s;
  border-radius: 5px;
}

.dropdown-item:hover {
  background-color: rgba(255, 166, 0, 0.1);
  color: rgb(255, 166, 0);
}
</style>
