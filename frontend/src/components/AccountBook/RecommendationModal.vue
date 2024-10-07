<template>
  <div class="recommendation-modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>퀘스트</h2>
        <button class="close-button" @click="$emit('close')">X</button>
      </div>
      <div class="mascot-message">
        <div class="speech-bubble">
          <p>
            <span class="highlight">{{ category }}</span> 카테고리에서 가장 많은
            지출이 있었구리!
          </p>
          <p>
            <span class="highlight">{{ category }}</span> 지출 줄이기 퀘스트에
            도전해 포인트도 받아가면 일석이조구리!
          </p>
        </div>
        <img src="@/assets/img/Moguri.png" alt="Mascot" class="mascot-image" />
      </div>
      <div class="quest-list">
        <div
          v-for="quest in recommendedQuests"
          :key="quest.id"
          class="quest-item"
        >
          <input type="checkbox" v-model="selectedQuests" :value="quest" />
          <div class="quest-info">
            <p class="title">{{ quest.questTitle }}</p>
            <p>{{ quest.questDescription }}</p>
            <p>기간: {{ quest.questDays }}일</p>
          </div>
          <div class="quest-reward">
            <p>{{ quest.rewardAmount }}P</p>
          </div>
        </div>
      </div>
      <div class="button-group">
        <button class="add-button" @click="addSelectedQuests">추가</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useGoalStore } from "@/stores/goalStore";
import { ref } from "vue";

export default {
  props: {
    category: String,
    recommendedQuests: Array,
  },
  emits: ["close", "add-quest"],
  setup(props, { emit }) {
    const goalStore = useGoalStore();
    const selectedQuests = ref([]); // 선택된 퀘스트를 저장할 배열

    const addSelectedQuests = async () => {
      for (const quest of selectedQuests.value) {
        try {
          const startDate = new Date(); // 현재 날짜
          const endDate = new Date(startDate);
          const newGoalAmount =
            quest.previousMonthAmount -
            quest.previousMonthAmount * (quest.targetPercent / 100);

          endDate.setDate(startDate.getDate() + quest.questDays); // questDays만큼 더하기

          await goalStore.addGoal({
            goalName: quest.questTitle,
            description: quest.questDescription,
            rewardAmount: quest.rewardAmount,
            targetPercent: quest.targetPercent,
            currentAmount: quest.currentAmount,
            startDate: startDate.toISOString().split("T")[0], // YYYY-MM-DD 형식
            endDate: endDate.toISOString().split("T")[0], // YYYY-MM-DD 형식
            goalAmount: newGoalAmount, // 추가: goalAmount 필드
            goalCategory: quest.categoryName, // 필요한 경우 카테고리 추가
          });
        } catch (error) {
          console.error("Error adding quest:", error);
        }
      }
      // 퀘스트 추가 후 모달 닫기
      emit("close"); // 수정: emit 사용
    };

    return {
      selectedQuests,
      addSelectedQuests,
    };
  },
};
</script>

<style scoped>
.recommendation-modal {
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

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-weight: bold;
}

.mascot-message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  font-weight: bold;
}

.speech-bubble {
  background-color: #f0f0f0;
  border-radius: 10px;
  padding: 10px;
  margin-right: 10px;
  flex-grow: 1;
}

.mascot-image {
  width: 90px;
  height: 110px;
}

.highlight {
  color: #f0bb2b;
  font-weight: bold;
}

.quest-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px; /* 추가: 퀘스트 목록과 버튼 사이의 간격 */
}

.quest-item {
  display: flex;
  align-items: center; /* 수직 정렬 */
  border-bottom: 1px solid #e0e0e0;
  padding: 10px 0;
}

.quest-item input[type="checkbox"] {
  margin-right: 10px; /* 체크박스와 텍스트 간격 조정 */
}

.title {
  margin: 0 0 5px 0;
  font-size: 22px;
  font-weight: bold;
}

.quest-info p {
  margin: 0;
}

.quest-reward {
  margin-left: auto;
  font-weight: bold;
  color: #f7cb54;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.add-button,
.close-button {
  padding: 10px 20px;
  margin-left: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-button {
  background-color: #ffdf9f;
}

.close-button {
  background-color: #ffadad;
}
</style>
