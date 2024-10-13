<template>
  <div class="quest-list-overlay">
    <div class="quest-list-modal">
      <div class="modal-header">
        <h3>퀘스트 목록</h3>
        <button class="close-button" @click="$emit('close')">X</button>
      </div>
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
        <li v-for="quest in filteredQuests" :key="quest.questId">
          <input type="checkbox" v-model="selectedQuests" :value="quest" />
          <div class="quest-info">
            <span class="quest-name">{{ quest.questTitle }}</span>
            <span class="quest-description">{{ quest.questDescription }}</span>
            <span class="quest-period">기간: {{ quest.questDays }}일</span>
            <span class="quest-reward">리워드: {{ quest.rewardAmount }}P</span>
          </div>
        </li>
      </ul>
      <div class="button-group">
        <button @click="$emit('open-goal-modal')" class="add-button">
          저축 목표 추가
        </button>
        <button @click="addSelectedQuests" class="add-button">
          퀘스트 추가
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    quests: Array,
    previousMonthCategoryTotals: Object, // 추가된 부분
  },
  data() {
    return {
      selectedCategory: '저축',
      categories: [
        '저축',
        '식비',
        '교통비',
        '주거비',
        '통신비',
        '쇼핑',
        '건강',
      ],
      selectedQuests: [], // 선택된 퀘스트를 저장할 배열
    };
  },
  computed: {
    filteredQuests() {
      return this.quests.filter(
        (quest) => quest.categoryName === this.selectedCategory
      );
    },
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(value);
    },
    addSelectedQuests() {
      const today = new Date();
      this.selectedQuests.forEach((quest) => {
        const startDate = today.toISOString().split('T')[0]; // YYYY-MM-DD 형식
        const endDate = new Date(
          today.setDate(today.getDate() + quest.questDays)
        )
          .toISOString()
          .split('T')[0];
        const newGoal = {
          memberId: 1, // 임시 하드코딩
          goalName: quest.questTitle,
          description: quest.questDescription,
          startDate: startDate,
          endDate: endDate,
          targetPercent: quest.targetPercent,
          currentAmount: quest.currentAmount,
          goalAmount: quest.goalAmount,
          rewardAmount: quest.rewardAmount,
          goalCategory: quest.categoryName,
          questId: quest.questId,
        };
        this.$emit('add-goal', newGoal);
      });
      this.$emit('close'); // 모달 닫기
    },
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
  font-weight: bold;
  margin-bottom: 10px;
}

.category-tabs {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.category-tabs button {
  font-weight: bold;
  padding: 10px;
  border: none;
  cursor: pointer;
}

.category-tabs button.active {
  background-color: #ffc95d;
}

.quest-items {
  list-style-type: none;
  padding: 0;
}

.quest-items li {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.quest-items li:hover {
  background-color: #f5f5f5;
}

.quest-info {
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* 추가: 공간을 차지하도록 설정 */
}

.quest-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.quest-description {
  font-size: 16px;
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
  font-weight: bold;
}

.close-button {
  margin-left: auto;
  margin-bottom: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #ffadad;
  font-weight: bold;
}
</style>
