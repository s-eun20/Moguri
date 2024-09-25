<template>
    <div class="goal-card">
      <div class="goal-content">
        <h3>{{ goal.goalName }}</h3>
        <p>목표 금액: {{ formatCurrency(goal.goalAmount) }}</p>
        <p>현재 금액: {{ formatCurrency(goal.currentAmount) }}</p>
        <p>기간: {{ formatDate(goal.startDate) }} - {{ formatDate(goal.endDate) }}</p>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: `${calculateProgress()}%` }"></div>
      </div>
      <p class="progress-text">{{ calculateProgress() }}% 달성</p>
      <div class="button-container">
        <button @click="$emit('edit', goal)" class="edit-btn">수정</button>
        <button @click="$emit('delete', goal.goalId)" class="delete-btn">삭제</button>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    goal: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    },
    calculateProgress() {
      return Math.round((this.goal.currentAmount / this.goal.goalAmount) * 100);
    }
  }
};
</script>

<style scoped>
.goal-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  margin-bottom: 15px;
}

.goal-content h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.goal-content p {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.progress-bar-container {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 10px;
}

.progress-bar {
  height: 100%;
  background-color: #ff9f67;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 14px;
  color: #4CAF50;
  text-align: right;
  margin-top: 5px;
  font-weight: bold;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.edit-btn, .delete-btn {
  padding: 5px 10px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn {
  background-color: #4CAF50;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}
</style>
