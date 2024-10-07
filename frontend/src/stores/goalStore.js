import { defineStore } from 'pinia'
import axios from 'axios'

export const useGoalStore = defineStore('goal', {
  state: () => ({
    goals: [],
    goalquests : [],
    totalCount: 0,
    totalPage: 1,
    currentPage: 0,
  }),
  actions: {
    async fetchGoals() {
      try {
        const response = await axios.get('/api/goal')
        const { data } = response.data
        this.goals = data.contents
        console.log(this.goals)
      } catch (error) {
        console.error('목표 데이터를 가져오는 중 오류 발생:', error)
      }
    },
    async fetchQuests() {
      try {
        const response = await axios.get('/api/goalquest') 
        const { data } = response.data
        this.goalquests = data.contents
        console.log(this.goalquests)
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
      async updateGoal( updatedGoal) {
        try {
          console.log(updatedGoal);
          const response = await axios.patch(`/api/goal/${updatedGoal.goalId}`, updatedGoal, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          
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
})
