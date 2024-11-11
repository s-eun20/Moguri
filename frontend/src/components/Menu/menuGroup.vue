<template>
  <b-navbar-nav>
    <menu-item 
      v-for="menu in menus" 
      :key="menu.url" 
      :title="menu.title" 
      :items="getItems(menu.items)" />
  </b-navbar-nav>
</template>

<script setup>
import menuConfig from '@/config/index';
import MenuItem from './menuItem.vue';

const menus = menuConfig.menus;

// 메뉴 항목에 연결된 세부 메뉴 배열을 가져옴
const getItems = (menuType) => {
  return menuConfig[menuType] || [];
};
</script>
