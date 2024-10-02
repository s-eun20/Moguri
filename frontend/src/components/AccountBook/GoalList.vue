<template>
    <div class="goal-list-container">
      <div class="goal-header">
        <span class="title">{{ title }}</span>
       
      </div>
      <table class="goal-table">
        <thead>
        <tr>
          <th>카테고리</th>
          <th>목표 이름</th>
          <th>기간</th>
          <th>목표 금액</th>
          <th>현재 금액</th>
          <th>목표 달성률</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="goal in filteredGoals" :key="goal.goalId">
          <td>{{ goal.goalCategory || '저축' }}</td>
          <td>{{ goal.goalName }}</td>
          <td>{{ formatDateRange(goal.startDate, goal.endDate) }}</td>
          <td>{{ formatCurrency(goal.goalAmount) }}</td>
          <td>{{ formatCurrency(goal.currentAmount) }}</td>
          <td class="progress-cell">
            <div class="progress-bar">
              <div class="progress" :style="{ width: calculateProgress(goal) + '%' }"></div>
            </div>
            <span class="progress-text">{{ calculateProgress(goal) }}%</span>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { useGoalStore } from '@/stores/goalStore'
  import { onMounted, computed } from 'vue'

  export default {
    props: {
      title: String,
      activeTab: String,
    },
    setup(props) {
      const goalStore = useGoalStore()

      onMounted(() => {
        goalStore.fetchGoals()
      })

      const filteredGoals = computed(() => {
        return goalStore.goals.filter(goal => {
          if (props.activeTab === 'saving') {
            return goal.goalCategory === null 
          } else {
            return goal.goalCategory !== null 
          }
        })
      })

      const formatCurrency = (value) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
      }

      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
      }

      const formatDateRange = (startDate, endDate) => {
        return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
      }

      const calculateProgress = (goal) => {
        return Math.round((goal.currentAmount / goal.goalAmount) * 100);
      }

      return {
        filteredGoals,
        formatCurrency,
        formatDateRange,
        calculateProgress
      }
    }
  };
  </script>
  
  <style scoped>
  .goal-list-container {
    background-color: #ffffff;
    border-radius: 8px;
    margin-bottom: 20px;
    font-family: 'HakgyoansimWoojuR';
  }
  
  .goal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .title {
    margin-top: 10px;
    font-size: 24px;
    font-weight: bold;
  }
  
  .goal-table {
    width: 100%;
    border-collapse: collapse;
    font-weight: bold;
  }
  
  .goal-table th, .goal-table td {
    border: 1px solid #e0e0e0;
    padding: 10px;
    text-align: left;
  }
  
  .goal-table th {
    background-color: #f5f5f5;
    font-weight: bold;
  }
  
  
  
  
  .progress-cell {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .progress-bar-container {
    flex-grow: 1;
    background-color: #e0e0e0;
    border-radius: 10px;
    margin-right: 10px;
    height: 10px;
    width: 80%;
  }

  .progress {
  height: 20px;
  background-color: #ffda73; /* 회색으로 변경 */
}

  
  .progress-bar {
    width: 80%; /* 바의 너비를 줄임 */
    background-color: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
  }
  
  .progress-text {
    white-space: nowrap;
    font-weight: bold;
  }
  
  @media (max-width: 768px) {
    .goal-table, .goal-table thead, .goal-table tbody, .goal-table th, .goal-table td, .goal-table tr {
      display: block;
    }
    
    .goal-table thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }
    
    .goal-table tr {
      margin-bottom: 15px;
    }
    
    .goal-table td {
      border: none;
      position: relative;
      padding-left: 50%;
    }
    
    .goal-table td:before {
      position: absolute;
      top: 6px;
      left: 6px;
      width: 45%;
      padding-right: 10px;
      white-space: nowrap;
      content: attr(data-label);
      font-weight: bold;
    }
  }
  </style>
