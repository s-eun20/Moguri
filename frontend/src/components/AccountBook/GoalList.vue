<template>
  <div class="goal-list-container">
    <div class="goal-header">
      <span class="title" v-if="props.activeTab === 'saving'">{{ title }}</span>
    </div>

    <!-- Only show the goals table if the active tab is 'saving' -->
    <table class="goal-table" v-if="props.activeTab === 'saving'">
      <thead>
        <tr>
          <th>목표 제목</th>
          <th>기간</th>
          <th>목표 금액</th>
          <th>현재 금액</th>
          <th>현재 저축 현황</th>
          <th>작업</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="goal in filteredGoals" :key="goal.goalId">
          <td>{{ goal.goalName }}</td>
          <td>{{ formatDateRange(goal.startDate, goal.endDate) }}</td>
          <td>{{ formatCurrency(goal.goalAmount) }}</td>
          <td>{{ formatCurrency(goal.currentAmount) }}</td>
          <td class="progress-cell">
            <div class="progress-bar">
              <div
                class="progress"
                :style="{ width: calculateProgress(goal) + '%' }"
              ></div>
            </div>
            <span class="progress-text">{{ calculateProgress(goal) }}%</span>
          </td>
          <td>
            <button @click="editGoal(goal)" class="edit-button">수정</button>
            <button @click="deleteGoal(goal.goalId)" class="delete-button">삭제</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Only show the quests table -->
    <div class="quest-header">
      <span class="title" v-if="props.activeTab === 'expense'">지출 퀘스트 목록</span>
      <span class="title" v-if="props.activeTab === 'saving'">저축 퀘스트 목록</span>
      <p class="quest-description" v-if="props.activeTab === 'expense'">
        ※지출 퀘스트는 기간 내 최대 지출 금액보다 적어야 리워드가 지급됩니다.
      </p>
    </div>
    <table class="goal-table">
      <thead>
        <tr>
          <th v-if="props.activeTab === 'expense'">카테고리</th>
          <th>퀘스트 제목</th>
          <th>기간</th>
          <th v-if="props.activeTab === 'saving'">목표 금액</th>
          <th v-if="props.activeTab === 'expense'">최대 지출 금액</th>
          <th v-if="props.activeTab === 'saving'">현재 저축 현황</th>
          <th v-if="props.activeTab === 'expense'">현재 지출 현황</th>
          <th>리워드</th>
          <th>작업</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="quest in filteredQuests" :key="quest.goalId">
          <td>{{ quest.goalCategory }}</td>
          <td>{{ quest.goalName }} {{ quest.description }}</td>
          <td>{{ formatDateRange(quest.startDate, quest.endDate) }}</td>
          <td>{{ formatCurrency(quest.goalAmount) }}</td>
          <td class="progress-cell">
            <div class="progress-bar">
              <div
                class="progress"
                :style="{ width: calculateProgress(quest) + '%' }"
              ></div>
            </div>
            <span class="progress-text">{{ calculateProgress(quest) }}%</span>
          </td>
          <td>{{ formatCurrency(quest.rewardAmount) }}</td>
          <td>
            <button @click="deleteGoal(quest.goalId)" class="delete-button">삭제</button>
          </td>
        </tr>
      </tbody>
    </table>
    <GoalEditModal
      v-if="isModalVisible"
      :isVisible="isModalVisible"
      :goal="selectedGoal"
      @close="closeModal"
      @goal-updated="fetchGoals"
    />
  </div>
</template>

<script>
import { useGoalStore } from "@/stores/goalStore";
import { useAccountStore } from "@/stores/accountStore";
import { onMounted, computed, ref, watch } from "vue";
import GoalEditModal from "./GoalEditModal.vue";

export default {
  components: {
    GoalEditModal,
  },
  props: {
    title: String,
    activeTab: String,
  },
  setup(props) {
    const goalStore = useGoalStore();
    const accountStore = useAccountStore(); 
    const isModalVisible = ref(false);
    const selectedGoal = ref(null); 
    onMounted(() => {
      fetchGoals(); 
    });

    const fetchGoals = () => {
      goalStore.fetchGoals(); 
    };

    const editGoal = (goal) => {
      selectedGoal.value = goal; 
      isModalVisible.value = true; 
    };

    const closeModal = () => {
      isModalVisible.value = false;
      selectedGoal.value = null; 
    };

    const filteredGoals = computed(() => {
      return goalStore.goals.filter((goal) => {
        // activeTab에 따라 목표를 필터링
        if (props.activeTab === "saving") {
          return goal.goalCategory === null && goal.rewardAmount === null;
        } else {
          return false; 
        }
      });
    });

    const filteredQuests = computed(() => {
      return goalStore.goals.filter((goal) => {
        if (props.activeTab === "saving") {
          return goal.goalCategory === null && goal.rewardAmount > 0;
        } else {
          return goal.goalCategory !== null && goal.rewardAmount > 0;
        }
      });
    });

    const formatCurrency = (value) => {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
      }).format(value);
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}.${String(date.getDate()).padStart(2, "0")}`;
    };

    const formatDateRange = (startDate, endDate) => {
      return `${formatDate(startDate)} ~ ${formatDate(endDate)}`;
    };

    const calculateProgress = (goal) => {
      return Math.round((goal.currentAmount / goal.goalAmount) * 100);
    };


    const deleteGoal = (goalId) => {
      console.log(goalId);
      if (confirm("정말로 이 목표를 삭제하시겠습니까?")) {
        goalStore.deleteGoal(goalId);
      }
    };

    
    watch(
      () => accountStore.transactions,
      () => {
        goalStore.goals.forEach((goal) => {
          if (goal.goalCategory) {
            updateCurrentAmount(goal.goalCategory);
          }
        });
      }
    );

    const updateCurrentAmount = (goalCategory) => {
      const goalToUpdate = goalStore.goals.find(
        (goal) => goal.goalCategory === goalCategory
      );

      if (goalToUpdate) {
        const startDate = new Date(goalToUpdate.startDate);
        const endDate = new Date(goalToUpdate.endDate);

        
        const totalAmount = accountStore.transactions
          .filter((transaction) => {
            const transactionDate = new Date(transaction.transactionDate);
            return (
              transaction.category === goalCategory &&
              transactionDate >= startDate &&
              transactionDate <= endDate
            );
          })
          .reduce((total, transaction) => total + transaction.amount, 0);

        goalToUpdate.currentAmount = totalAmount;

        goalStore.updateGoal(goalToUpdate);
      }
    };

    return {
      closeModal,
      filteredGoals,
      filteredQuests,
      formatCurrency,
      formatDateRange,
      calculateProgress,
      editGoal,
      deleteGoal,
      props,
      isModalVisible,
      selectedGoal,
      fetchGoals,
    };
  },
};
</script>

<style scoped>
.goal-list-container {
  background-color: #ffffff;
  border-radius: 8px;
  margin-bottom: 20px;
  font-family: "HakgyoansimWoojuR";
}

.goal-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.quest-header {
  display: flex;
  align-items: center;
}
.quest-description {
  margin-top: 40px;
  font-size: 1em;
  color: #666;
  margin-left: 10px;
}
.subtitle {
  margin-top: 20px;
  font-size: 1em;
  margin-left: 10px;
  color: #666;
}
.title {
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
}

.goal-table {
  width: 100%;
  border-collapse: collapse;
  font-weight: bold;
}

.goal-table th,
.goal-table td {
  border: 1px solid #e0e0e0;
  padding: 10px;
  text-align: left;
  height: 55px;
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

.progress-bar {
  width: 80%;
  background-color: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
}

.progress {
  height: 20px;
  background-color: #ffda73;
}

.progress-text {
  white-space: nowrap;
  font-weight: bold;
}

.edit-button,
.delete-button {
  padding: 5px 10px;
  margin-right: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-button {
  background-color: #ffdf9f;
  font-weight: bold;
}

.delete-button {
  background-color: #ffadad;
  font-weight: bold;
}

@media (max-width: 768px) {
  .goal-table,
  .goal-table thead,
  .goal-table tbody,
  .goal-table th,
  .goal-table td,
  .goal-table tr {
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