<template>
  <b-navbar toggleable="lg" type="light"  class="navbar-custom">
    <!-- MOGURI 로고 -->
    <b-navbar-brand href="/" class="moguri-logo">MOGURI</b-navbar-brand>

    <!-- 메뉴 그룹 -->
    <menu-group class="menu" />

    <!-- 프로필 사진 -->
    <img src="@/assets/모구리.png" alt="Profile Picture" class="profile-pic" />

    <!-- 프로필과 사용자 이름 -->
    <b-navbar-nav class="ml-auto d-flex align-items-center">
      <!-- 사용자 이름 -->
      <b-nav-item class="user-name">홍길동님</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
  <hr>
</template>

<script setup>
import MenuGroup from './Menu/menuGroup.vue';
import '../assets/styles/global.css';

</script>

<style scoped>
/* 배경색 흰색, 텍스트 노란색 */


/* MOGURI 로고 노란색 */
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
  font-size :19px;
}

/* 사용자 이름 스타일링 */
.user-name {
  font-weight: bold;
  font-family: 'Ownglyph_meetme-Rg';
  font-size :22px;
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
