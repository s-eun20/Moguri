import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth'; // auth 스토어 가져오기

export const useGoalStore = defineStore('goal', {
  state: () => ({
    goals: [],
    goalquests: [],
    totalCount: 0,
    totalPage: 1,
    currentPage: 0,
  }),
  actions: {
    async fetchGoals() {
      const authStore = useAuthStore(); // auth 스토어에서 memberId 가져오기
      const memberId = authStore.state.user.memberId; // 로그인된 사용자의 memberId

      try {
        const response = await axios.get(`/api/goal/list/${memberId}`); // memberId를 쿼리 파라미터로 포함
        const { data } = response.data;
        this.goals = data.contents;
        console.log(this.goals);
      } catch (error) {
        console.error('목표 데이터를 가져오는 중 오류 발생:', error);
      }
    },
    async fetchQuests() {
      try {
        const response = await axios.get('/api/goalquest');
        const { data } = response.data;
        this.goalquests = data.contents;
        console.log(this.goalquests);
      } catch (error) {
        console.error('목표 데이터를 가져오는 중 오류 발생:', error);
      }
    },
    async addGoal(newGoal) {
      const authStore = useAuthStore(); // auth 스토어에서 memberId 가져오기
      const memberId = authStore.state.user.memberId;

      try {
        console.log(newGoal);
        const response = await axios.post(
          '/api/goal',
          { ...newGoal, memberId },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data) {
          await this.fetchGoals(); // 목표 목록을 새로고침
          return true;
        }
      } catch (error) {
        console.error('Error adding goal:', error);
        return false;
      }
    },
    async updateGoal(updatedGoal) {
      try {
        console.log(updatedGoal);
        const response = await axios.patch(
          `/api/goal/${updatedGoal.goalId}`,
          updatedGoal,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data) {
          await this.fetchGoals(); // 목표 목록을 새로고침
          return true;
        }
      } catch (error) {
        console.error('Error updating goal:', error);
        return false;
      }
    },
    async deleteGoal(goalId) {
      try {
        const response = await axios.delete(`/api/goal/${goalId}`);

        if (response.data) {
          await this.fetchGoals(); // 목표 목록을 새로고침
          return true;
        }
      } catch (error) {
        console.error('Error deleting goal:', error);
        return false;
      }
    },
  },
});
