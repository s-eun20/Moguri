<template>
  <b-navbar toggleable="lg" type="light" class="navbar-custom">
    <!-- MOGURI 로고 -->
    <b-navbar-brand href="/" class="moguri-logo">MOGURI</b-navbar-brand>

    <!-- 메뉴 그룹 -->
    <menu-group class="menu" />

    <!-- 프로필 사진 -->
    <img src="@/assets/모구리.png" alt="Profile Picture" class="profile-pic" />

    <!-- 프로필과 사용자 이름 -->
    <b-navbar-nav class="ml-auto d-flex align-items-center">
      <!-- 로그인 링크 추가 -->
      <b-nav-item v-if="!isLoggedIn" to="/login">로그인</b-nav-item>
      <!-- 사용자 이름 -->
      <b-nav-item v-if="isLoggedIn" class="user-name">{{ nickname }}님</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
  <div class="nav-divider"></div>
</template>

<script setup>
import { ref } from 'vue';
import MenuGroup from './Menu/menuGroup.vue';
import '../assets/styles/global.css';

// 로그인 상태와 닉네임을 관리할 ref 변수 생성
const isLoggedIn = ref(false);
const nickname = ref('');

// 로컬 스토리지에서 사용자 정보를 가져와 로그인 상태를 설정
const user = JSON.parse(localStorage.getItem('user'));
if (user) {
  isLoggedIn.value = true;
  nickname.value = user.nickname; // 사용자의 닉네임 설정
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
  font-family: 'BMJUA';
}

/* 메뉴 그룹을 왼쪽으로 정렬 */
.menu {
  margin-right: auto;
  font-family: 'HakgyoansimBareondotumB';
  font-size: 19px;
}

/* 사용자 이름 스타일링 */
.user-name {
  font-weight: bold;
  font-family: 'Ownglyph_meetme-Rg';
  font-size: 22px;
  color: #333;
}

.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%; 
  object-fit: cover; 
  margin-left: 1rem;
}
</style>
