<template>
  <div class="goal-list-container">
    <div class="goal-header">
      <span class="title">{{ title }}</span>
    </div>
    <table class="goal-table">
      <thead>
        <tr>
          <th>카테고리</th>
          <th>목표 제목</th>
          <th>기간</th>
          <th v-if="props.activeTab === 'saving'">목표 금액</th>
          <th v-if="props.activeTab === 'expense'">최대 지출 금액</th>
          <th v-if="props.activeTab === 'saving'">현재 금액</th>
          <th v-if="props.activeTab === 'saving'">현재 저축 현황</th>
          <th v-if="props.activeTab === 'expense'">현재 지출 현황</th>
          <th>작업</th> <!-- 작업 열 추가 -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="goal in filteredGoals" :key="goal.goalId">
          <td>{{ goal.goalCategory || '저축' }}</td>
          <td>{{ goal.goalName }}</td>
          <td>{{ formatDateRange(goal.startDate, goal.endDate) }}</td>
          <td>{{ formatCurrency(goal.goalAmount) }}</td>
          <td v-if="props.activeTab === 'saving'">{{ formatCurrency(goal.currentAmount) }}</td>
          <td class="progress-cell">
            <div class="progress-bar">
              <div class="progress" :style="{ width: calculateProgress(goal) + '%' }"></div>
            </div>
            <span class="progress-text">{{ calculateProgress(goal) }}%</span>
          </td>
          <td>
            <button @click="editGoal(goal.goalId)" class="edit-button">수정</button>
            <button @click="deleteGoal(goal.goalId)" class="delete-button">삭제</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 퀘스트 테이블 추가 -->
    <div class="quest-header">
  <span class="title">퀘스트 목록</span>
  <p class="quest-description" v-if="props.activeTab === 'expense'">※지출 퀘스트는 전월 해당 카테고리 소비금액과 비교하며 기간 내 최대 지출 금액보다 적어야 리워드가 지급됩니다.</p>
</div>
    <table class="goal-table">
      <thead>
        <tr>
          <th>카테고리</th>
          <th>퀘스트 제목</th>
          <th>기간</th>
          <th v-if="props.activeTab === 'saving'">목표 금액</th>
          <th v-if="props.activeTab === 'expense'">최대 지출 금액</th>
          <th v-if="props.activeTab === 'saving'">현재 저축 현황</th>
          <th v-if="props.activeTab === 'expense'">현재 지출 현황</th>
          <th>리워드</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="quest in filteredQuests" :key="quest.goalId">
          <td>{{ quest.goalCategory || '저축'}}</td>
          <td>{{ quest.goalName }} {{ quest.description }}</td>
          <td>{{ formatDateRange(quest.startDate, quest.endDate) }}</td>
          <td>{{ formatCurrency(quest.goalAmount) }}</td>
          <td class="progress-cell">
            <div class="progress-bar">
              <div class="progress" :style="{ width: calculateProgress(quest) + '%' }"></div>
            </div>
            <span class="progress-text">{{ calculateProgress(quest) }}%</span>
          </td>
          <td>{{ formatCurrency(quest.rewardAmount) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useGoalStore } from '@/stores/goalStore'
import { useAccountStore } from '@/stores/accountStore'
import { onMounted, computed, ref, watch } from 'vue'

export default {
  props: {
    title: String,
    activeTab: String,
  },
  setup(props) {
    const goalStore = useGoalStore()
    const accountStore = useAccountStore(); // 가계부 스토어 인스턴스 생성

    onMounted(() => {
      goalStore.fetchGoals() // 목표 데이터만 가져오기
    })

    const filteredGoals = computed(() => {
  return goalStore.goals.filter(goal => {
    // activeTab에 따라 목표를 필터링
    if (props.activeTab === 'saving') {
      return goal.goalCategory === null && goal.rewardAmount === null;
    } else {
      return goal.goalCategory !== null && goal.rewardAmount === null; // 지출 목표
    }
  });
});

const filteredQuests = computed(() => {
  return goalStore.goals.filter(goal => {
    // rewardAmount가 0이 아닌 경우 퀘스트로 간주
    if (props.activeTab === 'saving') {
      return goal.goalCategory === null && goal.rewardAmount > 0;
    }
    else {
      return goal.goalCategory !== null && goal.rewardAmount > 0; 
    }
    
  })
});

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

    const editGoal = (goalId) => {
      console.log(`Edit goal with ID: ${goalId}`);
    }

    const deleteGoal = (goalId) => {
      console.log(goalId);
      if (confirm('정말로 이 목표를 삭제하시겠습니까?')) {
        goalStore.deleteGoal(goalId);
      }
    }

    // 거래가 추가될 때마다 currentAmount 업데이트
    watch(() => accountStore.transactions, () => {
      goalStore.goals.forEach(goal => {
        if (goal.goalCategory) {
          updateCurrentAmount(goal.goalCategory);
        }
      });
    });

    const updateCurrentAmount = (goalCategory) => {

  // 해당 목표를 찾습니다.
  const goalToUpdate = goalStore.goals.find(goal => goal.goalCategory === goalCategory);
  
  if (goalToUpdate) {
    // 목표의 시작일과 종료일을 가져옵니다.
    const startDate = new Date(goalToUpdate.startDate);
    const endDate = new Date(goalToUpdate.endDate);

    // 해당 기간 내의 거래 금액을 계산합니다.
    const totalAmount = accountStore.transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.transactionDate);
        return (
          transaction.category === goalCategory &&
          transactionDate >= startDate &&
          transactionDate <= endDate
        );
      })
      .reduce((total, transaction) => total + transaction.amount, 0);

    // 목표의 currentAmount 업데이트
    goalToUpdate.currentAmount = totalAmount;

    // 목표 업데이트 API 호출
    goalStore.updateGoal(goalToUpdate);
  }
};

    return {
      filteredGoals,
      filteredQuests,
      formatCurrency,
      formatDateRange,
      calculateProgress,
      editGoal,
      deleteGoal,
      props
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

.goal-header, .quest-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.quest-description {
  margin-top: 40px;
  font-size: 1em; /* 글자 크기를 작게 설정 */
  margin-left: 10px; /* 제목과의 간격을 설정 */
  color: #666; /* 색상 조정 (선택 사항) */
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

.goal-table th, .goal-table td {
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

.edit-button, .delete-button {
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