// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

import IncomeExpense from '@/pages/accountBook/IncomeExpense.vue';
import Statistics from '@/pages/accountBook/Statistics.vue';
import Goals from '@/pages/accountBook/Goals.vue';
import Rank from '@/pages/investment/Rank.vue';
import Stock from '@/pages/investment/Stock.vue';
import Login from '@/pages/login/Login.vue'; // Login 컴포넌트 import 추가
import Register from '@/pages/login/Register.vue'; // Register 컴포넌트 추가
import Main from '@/pages/main/Main.vue'; //main 페이지 추가
import CottonCandyShop from '@/pages/cottonCandyShop/CottonCandyShop.vue'; // 솜사탕상점 컴포넌트 추가

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
    path: '/investment/stock',
    name: 'Stock',
    component: Stock,
  },

  {
    path: '/investment/rank',
    name: 'Rank',
    component: Rank,
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
    path: '/element', // 소비 원소 테스트 페이지 경로 추가
    name: 'ElementPage',
    // component: ElementPage,
  },
  {
    path: '/whatismoguri', // 모구리 설명 페이지 경로 추가
    name: 'WhatIsMoguri',
    // component: WhatIsMoguri,
  },
  {
    path: '/attendance', // 출석 체크 페이지 경로 추가
    name: 'AttendancePage',
    // component: AttendancePage,
  },
  {
    path: '/cottoncandyshop',
    name: 'CottonCandyShop',
    component: CottonCandyShop,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
