// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import IncomeExpense from '@/pages/accountBook/IncomeExpense.vue'; 
import Statistics from '@/pages/accountBook/Statistics.vue';
import Goals from '@/pages/accountBook/Goals.vue';

const routes = [
  {
    path: '/accountBook/incomeExpense',
    name: 'IncomeExpense',
    component: IncomeExpense 
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
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
