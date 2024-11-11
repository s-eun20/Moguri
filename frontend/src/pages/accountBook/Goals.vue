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
      @add-quest="addQuest"
    />

    <QuestList
      v-if="isQuestListVisible"
      :quests="quests"
      @add-goal="addQuest"
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
import { ref, computed, onMounted } from 'vue'
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

    const quests = ref([]) 

    const activeTabTitle = computed(() => activeTab.value === 'saving' ? '저축 목표' : '지출 목표')

    const showRecommendationModal = async () => {
      await calculateTopSpendingCategory()
      if (recommendedQuests.value.length > 0) {
        isRecommendationModalVisible.value = true
      } else {
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
      recommendedQuests.value = quests.value.filter(quest => quest.categoryName === topSpendingCategory.value)

      console.log(recommendedQuests.value)
      
      if (recommendedQuests.value.length > 0) {
        isRecommendationModalVisible.value = true
      }
    }

  
    const closeRecommendationModal = () => {
      isRecommendationModalVisible.value = false
    }

    const addQuest = (quest) => {
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
      await goalStore.fetchQuests(); // 퀘스트 데이터 가져오기
      console.log(goalStore.goalquests);
      quests.value = goalStore.goalquests; 
      recommendedQuests.value = goalStore.goalquests; 
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
      addQuest
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
  background-color: #ffadad;
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
  flex-grow: 1; 
  display: flex;
  flex-direction: column;
}

.content-title {
  font-size: 24px;
  font-weight: bold;
}

.goal-list-container {
  min-height: 30vh; 
  max-height: 70vh; 
  overflow-y: auto;
  flex-grow: 1; 
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
  background: #fff;
  border: 2px solid #FFD700;
  border-radius: 20px;
  padding: 20px; /* 패딩을 조정하여 내부 여백을 설정 */
  font-size: 16px;
  margin-top: 15px;
  text-align: center;
  white-space: nowrap;
}

.speech-bubble p {
  margin: 3px 0;
  font-weight: bold;
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