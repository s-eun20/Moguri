<template>
    <div class="goal-list-container">
      <div class="goal-header">
        <span class="title">{{ title }}</span>
        <button 
          :style="{ backgroundColor: buttonColor }" 
          @click="$emit('add-goal')"
        >
          {{ buttonText }}
        </button>
      </div>
      <div v-for="goal in goals" :key="goal.content" class="goal-card">
        <GoalCard :goal="goal" />
      </div>
    </div>
  </template>
  
  <script>
  import GoalCard from "@/components/AccountBook/GoalCard.vue";
  
  export default {
    props: {
      title: String,
      goals: Array,
      buttonText: String,
      buttonColor: String,
    },
    components: { GoalCard },
  };
  </script>
  
  <style scoped>
  .goal-list-container {
    background-color: #fffaf3;
    padding: 20px;
    border-radius: 12px;
    border: 2px solid #ffcc99;
    margin-bottom: 20px;
  }
  
  .goal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .title {
    font-size: 24px;
    font-weight: bold;
  }
  
  button {
    padding: 10px 20px;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
  }
  </style>
  