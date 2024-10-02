<template>
  <div class="goals-page">
    <div class="header">
      <h1 class="page-title">목표 설정</h1>
      <div class="mascot-message">
        <div class="speech-bubble">
          <p>목표를 설정하고 달성해보세요!</p>
          <p>작은 목표부터 시작해봐요.</p>
        </div>
        <img src="@/assets/img/너구리샘플.png" alt="Mascot" class="mascot-image" />
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
import { ref, computed, onMounted } from 'vue'
import { useGoalStore } from '@/stores/goalStore'
import GoalList from "@/components/AccountBook/GoalList.vue";
import Modal from "@/components/AccountBook/GoalModal.vue";
import QuestList from "@/components/AccountBook/QuestList.vue";

export default {
  components: { GoalList, Modal, QuestList },
  setup() {
    const goalStore = useGoalStore()
    const activeTab = ref('saving')
    const isModalVisible = ref(false)
    const isQuestListVisible = ref(false)

    const activeTabTitle = computed(() => activeTab.value === 'saving' ? '저축 목표' : '지출 목표')

    onMounted(() => {
      goalStore.fetchGoals()
    })

    const quests = ref([
      { id: 1, content: '비상금 모으기', amount: 1000000, category: '저축', startDate: '2023-05-01', endDate: '2023-12-31' },
      { id: 2, content: '여행 자금 모으기', amount: 2000000, category: '저축', startDate: '2023-05-01', endDate: '2023-12-31' },
      { id: 3, content: '식비 10% 줄이기', amount: 300000, category: '식비', startDate: '2023-05-01', endDate: '2023-05-31' },
      { id: 4, content: '교통비 10% 줄이기', amount: 50000, category: '교통비', startDate: '2023-05-01', endDate: '2023-05-31' },
    ])

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


  

    return {
      quests,
      activeTab,
      activeTabTitle,
      isModalVisible,
      isQuestListVisible,
      openModal,
      closeModal,
      openQuestList,
      closeQuestList,
      openGoalModal,
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
  width: 80px;
  height: 80px;
  margin-top: 10px;
}

.speech-bubble {
  background-color: #FFF;
  border: 2px solid #FFD700;
  border-radius: 20px;
  padding: 10px;
  text-align: center;
  margin-right: 10px;
  width: 400px;
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