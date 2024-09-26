// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

import IncomeExpense from '@/pages/accountBook/IncomeExpense.vue';
import Statistics from '@/pages/accountBook/Statistics.vue';
import Goals from '@/pages/accountBook/Goals.vue';
import Login from '@/pages/login/Login.vue'; // Login 컴포넌트 import 추가
import Register from '@/pages/login/Register.vue'; // Register 컴포넌트 추가
import Main from '@/pages/main/Main.vue'; //main 컴포넌트 추가
  import Whatismoguri from '@/pages/main/Whatismoguri.vue';

const routes = [
  {
    path: '/accountBook/incomeExpense',
    name: 'IncomeExpense',
    component: IncomeExpense,
  },
  {
    path: '/accountBook/statistics',
    name: 'Statistics',
    component: Statistics,
  },
  {
    path: '/accountBook/Goal',
    name: 'Goals',
    component: Goals,
  },
  {
    path: '/login', // 로그인 경로 추가
    name: 'Login',
    component: Login,
  },
  {
    path: '/register', // 회원가입 경로 추가
    name: 'Register',
    component: Register,
  },
  {
    path: '/', // 메인페이지 경로 추가
    name: 'Main',
    component: Main,
  },
  {
    path: '/whatismoguri',
    name: 'Whatismoguri', //모구리 소개 경로 추가
    component: Whatismoguri,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
