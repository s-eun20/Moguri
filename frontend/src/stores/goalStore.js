import { defineStore } from 'pinia'
import axios from 'axios'

export const useGoalStore = defineStore('goal', {
  state: () => ({
    goals: [],
    totalCount: 0,
    totalPage: 1,
    currentPage: 0,
  }),
  actions: {
    async fetchGoals() {
      try {
        const response = await axios.get('/api/goal') // API 엔드포인트를 적절히 수정하세요
        const { data } = response.data
        this.goals = data.contents
        console.log(this.goals)
      } catch (error) {
        console.error('목표 데이터를 가져오는 중 오류 발생:', error)
      }
    },
    async addGoal(newGoal) {
        try {
          console.log(newGoal);
          const response = await axios.post('/api/goal', newGoal,{
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (response.data) {
            await this.fetchGoals(); // 목표 목록을 새로고침
            return true;
          }
        } catch (error) {
          console.error('Error adding goal:', error);
          return false;
        }
      },
  },
})
