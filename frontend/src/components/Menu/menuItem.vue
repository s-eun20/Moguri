<template>
  <b-nav-item-dropdown :text="title">
    <b-dropdown-item
      v-for="item in items"
      :key="item.url"
      @click.prevent="navigate(item.url)"
    >
      {{ item.title }}
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const props = defineProps({
  title: String,
  items: Array
});

const authStore = useAuthStore();
const router = useRouter();

const isLoggedIn = computed(() => authStore.isLogin);

const navigate = (url) => {
  if (!isLoggedIn.value) {
    // 로그인 필요 경고 메시지 표시
    alert("로그인 후 이용할 수 있습니다."); // 한국어 경고 메시지
  } else {
    router.push(url);
  }
};
</script>
