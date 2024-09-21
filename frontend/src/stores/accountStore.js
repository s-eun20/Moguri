import { defineStore } from 'pinia';
import axios from 'axios';

export const useStatisticsStore = defineStore('statistics', {
  state: () => ({
    accounts: [],
    savingGoals: [],
    statistics: [],
  }),
  actions: {
    // 가계부 정보 조회
    async fetchAccounts(memberId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/account/${memberId}`);
        this.accounts = response.data; // 가계부 정보 저장
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    },
    
    // 가계부 추가
    async addAccount(newAccount) {
      try {
        const response = await axios.post('http://localhost:8080/api/account', newAccount);
        this.accounts.push(response.data); // 추가한 계좌 정보 저장
      } catch (error) {
        console.error('Error adding account:', error);
      }
    },

    // 저축 목표 조회
    async fetchSavingGoals(memberId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/account/goal/${memberId}`);
        this.savingGoals = response.data; // 저축 목표 정보 저장
      } catch (error) {
        console.error('Error fetching saving goals:', error);
      }
    },

    // 저축 목표 추가
    async addSavingGoal(memberId, newGoal) {
      try {
        const response = await axios.post(`http://localhost:8080/api/account/goal/${memberId}`, newGoal);
        this.savingGoals.push(response.data); // 추가한 저축 목표 저장
      } catch (error) {
        console.error('Error adding saving goal:', error);
      }
    },

    // 통계 정보 조회
    async fetchStatistics(startDate, endDate) {
      try {
        const response = await axios.get(`http://localhost:8080/api/account`, {
          params: { startDate, endDate },
        });
        this.statistics = response.data; // 통계 데이터 저장
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    },
  },
});
