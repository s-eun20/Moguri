// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import IncomeExpense from '@/pages/accountBook/IncomeExpense.vue'; 
import Statistics from '@/pages/accountBook/Statistics.vue';
import Goals from '@/pages/accountBook/Goals.vue';
import Rank from '@/pages/investment/Rank.vue';
import Stock from '@/pages/investment/Stock.vue'

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
  


  {
    path: '/investment/stock',
    name: 'Stock',
    component: Stock
  },


  {
    path: '/investment/rank',
    name: 'Rank',
    component: Rank
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
