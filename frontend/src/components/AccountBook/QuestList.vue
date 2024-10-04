<template>
  <div class="quest-list-overlay">
    <div class="quest-list-modal">
      <h3>퀘스트 목록</h3>
      <div class="category-tabs">
        <button 
          v-for="category in categories" 
          :key="category"
          @click="selectedCategory = category"
          :class="{ active: selectedCategory === category }"
        >
          {{ category }}
        </button>
      </div>
      <ul class="quest-items">
        <li v-for="quest in filteredQuests" :key="quest.id" @click="selectQuest(quest)">
          <div class="quest-info">
            <span class="quest-name">{{ quest.title }}</span>
            <span class="quest-description">{{ quest.description }}</span>
            <span class="quest-period">기간: {{ quest.questDays }}일</span>
            <span class="quest-reward">리워드: {{ quest.rewardAmount }}P</span>
          </div>
        </li>
      </ul>
      <div class="button-group">
        <button @click="$emit('open-goal-modal')" class="add-button">직접 추가</button>
        <button @click="$emit('close')" class="close-button">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    quests: Array,
  },
  data() {
    return {
      selectedCategory: '저축',
      categories: ['저축', '식비', '교통비', '주거비', '통신비', '쇼핑', '건강'],
    };
  },
  computed: {
    filteredQuests() {
      return this.quests.filter(quest => quest.category === this.selectedCategory);
    },
  },
  methods: {
    selectQuest(quest) {
      const today = new Date();
      const startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식
      const endDate = new Date(today.setDate(today.getDate() + quest.questDays)).toISOString().split('T')[0];

      const newGoal = {
        id: quest.id,
        category: quest.category,
        title: quest.title,
        description: quest.description,
        questDays: quest.questDays,
        startDate: startDate,
        endDate: endDate,
        targetAmount: quest.targetAmount,
        currentAmount: quest.currentAmount,
        rewardAmount: quest.rewardAmount
      };
      this.$emit('add-goal', newGoal);
      this.$emit('close');
    },

    formatDate(date) {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },
};
</script>

<style scoped>
.quest-list-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.quest-list-modal {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 80%;
  max-height: 80%;
  overflow-y: auto;
}

h3 {
  text-align: center;
  margin-bottom: 20px;
}

.category-tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.category-tabs button {
  padding: 10px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
}

.category-tabs button.active {
  background-color: #ffc95d;
  color: white;
}

.quest-items {
  list-style-type: none;
  padding: 0;
}

.quest-items li {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
}

.quest-items li:hover {
  background-color: #f5f5f5;
}

.quest-info {
  display: flex;
  flex-direction: column;
}

.quest-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.quest-description {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 5px;
}

.quest-period {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 5px;
}

.quest-reward {
  font-weight: bold;
  color: #ffc95d;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.add-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #ffdf9f;
  color: rgb(0, 0, 0);
}

.close-button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #ffadad;
}
</style>