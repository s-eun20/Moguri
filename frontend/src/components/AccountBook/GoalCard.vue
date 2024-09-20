<template>
    <div class="goal-card">
      <div class="goal-content">
        <p class="goal-title">{{ goal.content }}</p>
        <p class="goal-date">{{ goal.startDate }} ~ {{ goal.endDate }}</p>
      </div>
      <div class="goal-info">
        <p>목표 금액: {{ goal.amount.toLocaleString() }} ₩</p>
        <div class="goal-progress">
          <div class="progress-bar" :style="{ width: goal.progress + '%' }"></div>
          <span class="progress-text">{{ goal.progress }}%</span>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      goal: Object,
    },
  };
  </script>
  
  <style scoped>
  .goal-card {
  background-color: white;
  border-radius: 8px; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
  padding: 10px; 
  margin-bottom: 10px; 
  font-size: 14px; 
  width: 700px; /* 가로 길이 유지 */
  height: 120px; /* 세로 높이 감소 */
}

.goal-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px; 
}

.goal-title {
  font-weight: bold;
  font-size: 16px; 
}

.goal-date {
  font-size: 12px; 
  color: gray;
}

.goal-info {
  margin-top: 6px; 
}

.goal-progress {
  position: relative;
  background-color: #f2f2f2;
  height: 10px; /* 프로그레스바 높이 조정 */
  border-radius: 4px; 
  margin: 8px 0; 
}

.progress-bar {
  height: 100%; /* 프로그레스바 높이 유지 */
  background-color: #ffa07a;
  border-radius: 4px; 
}

.progress-text {
  position: absolute;
  right: 5px; 
  top: -18px; 
  font-size: 12px; 
  color: #ffa07a;
}
  </style>
  