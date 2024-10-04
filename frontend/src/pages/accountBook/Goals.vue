<template>
  <div class="goals-page">
    <div class="header">
      <h1 class="page-title">목표 설정</h1>
      <div class="mascot-message">
        <div class="speech-bubble">
          <p>소비 패턴에 맞는 퀘스트를 원한다면 나를 클릭해구리!</p>
        </div>
        <img 
          src="@/assets/img/Moguri.png" 
          alt="Mascot" 
          class="mascot-image" 
          @click="showRecommendationModal"
        />
      </div>
    </div>
    
    <div class="controls-container">
      <div class="tab-container">
        <div class="tabs">
          <div @click="activeTab = 'saving'" :class="['tab', { active: activeTab === 'saving' }]">저축 목표</div>
          <div @click="activeTab = 'expense'" :class="['tab', { active: activeTab === 'expense' }]">지출 목표</div>
        </div>
      </div>
      <button @click="openQuestList" class="add-goal-btn">목표 추가</button>
    </div>

    <div class="content-container">
      <GoalList :title="activeTabTitle" :activeTab="activeTab" />
    </div>

    <RecommendationModal
      v-if="isRecommendationModalVisible"
      :category="topSpendingCategory"
      :recommendedQuests="recommendedQuests"
      @close="closeRecommendationModal"
      @add-quest="addRecommendedQuest"
    />

    <QuestList
      v-if="isQuestListVisible"
      :quests="quests"
      @add-goal="addGoal"
      @close="closeQuestList"
      @open-goal-modal="openGoalModal"
    />

    <Modal
      :isVisible="isModalVisible"
      @add-goal="closeModal"
      @close="closeModal"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useGoalStore } from '@/stores/goalStore'
import { useAccountStore } from '@/stores/accountStore'
import GoalList from "@/components/AccountBook/GoalList.vue"
import Modal from "@/components/AccountBook/GoalModal.vue"
import QuestList from "@/components/AccountBook/QuestList.vue"
import RecommendationModal from "@/components/AccountBook/RecommendationModal.vue"

export default {
  components: { 
    GoalList, 
    Modal, 
    QuestList,
    RecommendationModal
  },
  setup() {
    const goalStore = useGoalStore()
    const accountStore = useAccountStore()
    const activeTab = ref('saving')
    const isModalVisible = ref(false)
    const isQuestListVisible = ref(false)
    const isRecommendationModalVisible = ref(false)
    const topSpendingCategory = ref(null)
    const recommendedQuests = ref([])

    const quests = ref([
      { id: 1, title: "가까운 거리는 대중교통 대신 자전거로!", description: "교통비 10% 줄이기", category: "교통비", targetAmount: 10.00, currentAmount: 0.00, questDays: 60, rewardAmount: 50000.00 },
      { id: 2, title: "교통비 다이어트 시작!", description: "교통비 5% 줄이기", category: "교통비", targetAmount: 5.00, currentAmount: 0.00, questDays: 30, rewardAmount: 25000.00 },
      { id: 3, title: "쇼핑 멈추고, 절약 시작!", description: "쇼핑 지출 10% 줄이기", category: "쇼핑", targetAmount: 10.00, currentAmount: 0.00, questDays: 60, rewardAmount: 40000.00 },
      { id: 4, title: "장바구니 줄이기 도전!", description: "쇼핑 지출 5% 줄이기", category: "쇼핑", targetAmount: 5.00, currentAmount: 0.00, questDays: 14, rewardAmount: 20000.00 },
      { id: 5, title: "가계 통신비 절약!", description: "통신비 5% 줄이기", category: "통신비", targetAmount: 5.00, currentAmount: 0.00, questDays: 30, rewardAmount: 15000.00 },
      { id: 6, title: "데이터 절약으로 통신비 감소!", description: "통신비 10% 줄이기", category: "통신비", targetAmount: 10.00, currentAmount: 0.00, questDays: 30, rewardAmount: 30000.00 },
      { id: 7, title: "내 집 비용 다이어트!", description: "주거비 3% 줄이기", category: "주거비", targetAmount: 3.00, currentAmount: 0.00, questDays: 30, rewardAmount: 25000.00 },
      { id: 8, title: "살림살이 슬림하게!", description: "주거비 7% 줄이기", category: "주거비", targetAmount: 7.00, currentAmount: 0.00, questDays: 60, rewardAmount: 50000.00 },
      { id: 9, title: "건강 유지하며 절약도 하기!", description: "건강 지출 5% 줄이기", category: "건강", targetAmount: 5.00, currentAmount: 0.00, questDays: 30, rewardAmount: 10000.00 },
      { id: 10, title: "헬스장 대신 야외 운동 도전!", description: "건강 지출 10% 줄이기", category: "건강", targetAmount: 10.00, currentAmount: 0.00, questDays: 30, rewardAmount: 20000.00 },
      { id: 11, title: "외식 줄이기 챌린지!", description: "식비 5% 줄이기", category: "식비", targetAmount: 5.00, currentAmount: 0.00, questDays: 14, rewardAmount: 30000.00 },
      { id: 12, title: "집밥 요리왕 도전!", description: "식비 15% 줄이기", category: "식비", targetAmount: 15.00, currentAmount: 0.00, questDays: 30, rewardAmount: 60000.00 },
      { id: 13, title: "작은 지출 큰 절약!", description: "기타 지출 10% 줄이기", category: "기타", targetAmount: 10.00, currentAmount: 0.00, questDays: 14, rewardAmount: 20000.00 },
      { id: 14, title: "작은 습관 큰 변화!", description: "기타 지출 15% 줄이기", category: "기타", targetAmount: 15.00, currentAmount: 0.00, questDays: 60, rewardAmount: 35000.00 }
    ])

    const activeTabTitle = computed(() => activeTab.value === 'saving' ? '저축 목표' : '지출 목표')

    const showRecommendationModal = async () => {
      await calculateTopSpendingCategory()
      if (recommendedQuests.value.length > 0) {
        isRecommendationModalVisible.value = true
      } else {
        // 추천 퀘스트가 없을 경우 사용자에게 알림
        alert('현재 추천할 퀘스트가 없습니다.')
      }
    }

    const calculateTopSpendingCategory = async () => {
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear()
      const currentMonth = currentDate.getMonth()
      
      const transactions = accountStore.transactions.filter(t => 
        new Date(t.transactionDate).getFullYear() === currentYear &&
        new Date(t.transactionDate).getMonth() === currentMonth &&
        t.type === '지출'
      )

      const categoryTotals = transactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount
        return acc
      }, {})

      topSpendingCategory.value = Object.entries(categoryTotals).reduce((a, b) => a[1] > b[1] ? a : b)[0]
      
      recommendedQuests.value = quests.value.filter(quest => quest.category === topSpendingCategory.value)
      
      if (recommendedQuests.value.length > 0) {
        isRecommendationModalVisible.value = true
      }
    }

    const closeRecommendationModal = () => {
      isRecommendationModalVisible.value = false
    }

    const addRecommendedQuest = (quest) => {
      goalStore.addGoal(quest)
      closeRecommendationModal()
    }

    const openModal = () => {
      isModalVisible.value = true
    }

    const closeModal = () => {
      isModalVisible.value = false
    }

    const openQuestList = () => {
      isQuestListVisible.value = true
    }

    const closeQuestList = () => {
      isQuestListVisible.value = false
    }

    const openGoalModal = () => {
      isQuestListVisible.value = false
      isModalVisible.value = true
    }

    onMounted(async () => {
      await goalStore.fetchGoals()
      await accountStore.fetchAllTransactions()
      await calculateTopSpendingCategory()
    })

    return {
      activeTab,
      activeTabTitle,
      isModalVisible,
      isQuestListVisible,
      isRecommendationModalVisible,
      topSpendingCategory,
      recommendedQuests,
      quests,
      openModal,
      closeModal,
      openQuestList,
      closeQuestList,
      openGoalModal,
      showRecommendationModal,
      closeRecommendationModal,
      addRecommendedQuest
    }
  }
}
</script>

<style scoped>
.goals-page {
  width: 70%;
  margin: 0 auto;
  padding: 20px;
  font-family: 'HakgyoansimWoojuR';
}
.page-title {
  text-align: center;
  margin-bottom: 30px;
  font-size : 35px;
  color: #333;
  font-weight: bold;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.controls-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tab-container {
  display: flex;
}

.tabs {
  display: flex;
}

.tab {
  font-weight: bold;
  padding: 10px 20px;
  cursor: pointer;
  border: 2px solid #FFD700;
  border-bottom: none;
  border-radius: 10px 10px 0 0;
  background-color: #FFF;
  margin-right: 5px;
}

.tab.active {
  background-color: #FFD700;
  color: #000;
}

.add-goal-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: #000000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.content-container {
  background-color: #fff;
  border-radius: 10px;
  padding: 2%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-grow: 1; /* 남은 공간을 채우도록 설정 */
  display: flex;
  flex-direction: column;
}

.content-title {
  font-size: 24px;
  font-weight: bold;
}

.goal-list-container {
  min-height: 30vh; /* 뷰포트 높이의 30% */
  max-height: 70vh; /* 뷰포트 높이의 70% */
  overflow-y: auto;
  flex-grow: 1; /* 남은 공간을 채우도록 설정 */
}

.mascot-message {
  display: flex;
  align-items: flex-start;
}

.mascot-image {
  width: 90px;
  height: 110px;

  cursor: pointer;
}

.speech-bubble {
  background-color: #FFF;
  border: 2px solid #FFD700;
  border-radius: 20px;
  padding: 10px;
  text-align: center;
  width: 400px;
  font-weight: bold;
  margin-top: 15px;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: center;
  }

  .mascot-message {
    margin-top: 20px;
    justify-content: center;
    width: 100%;
  }

  .speech-bubble {
    margin-right: 10px;
  }

  .mascot-image {
    margin-top: 0;
  }
}
</style>