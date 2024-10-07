<template>
  <div class="statistics-page">
    <div class="header">
      <h1 class="page-title">통계</h1>
      <div class="mascot-message">
        <div class="speech-bubble">
          <p>{{ spendingChangeMessage }}</p>
          <p>{{ topCategoryMessage }}</p>
        </div>
        <img src="@/assets/img/Moguri.png" alt="Mascot" class="mascot-image" />
      </div>
    </div>
    
    <div class="controls-container">
      <div class="tab-container">
        <div class="tabs">
          <div @click="activeTab = 'monthly'" :class="['tab', { active: activeTab === 'monthly' }]">월별</div>
          <div @click="activeTab = 'yearly'" :class="['tab', { active: activeTab === 'yearly' }]">연도별</div>
        </div>
      </div>
    </div>

    <div class="content-container">
      <div class="chart-container">
        <PieChart v-if="activeTab === 'monthly'" @update:statistics="updateStatistics" />
        <ColumnChart v-else />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import PieChart from '@/components/AccountBook/PieChart.vue';
import ColumnChart from '@/components/AccountBook/ColumnChart.vue';

export default {
  components: { PieChart, ColumnChart },
  setup() {
    const activeTab = ref('monthly');
    const statistics = ref({
      currentMonthSpending: 0,
      previousMonthSpending: 0,
      topCategory: '없음'
    });

    const updateStatistics = (newStats) => {
      statistics.value = newStats;
    };

    

    const spendingChangeMessage = computed(() => {
  const changePercentage = statistics.value.spendingChangePercentage;
  const changeDirection = changePercentage >= 0 ? '증가' : '감소';
  return `전월대비 ${Math.abs(changePercentage)}% 소비가 ${changeDirection}했다구리!`;
});

    const topCategoryMessage = computed(() => {
      return `이번 달 제일 많이 쓴 카테고리는 ${statistics.value.topCategory}이다구리!`;
    });

    return { 
      activeTab,
      spendingChangeMessage,
      topCategoryMessage,
      updateStatistics
    };
  }
};
</script>

<style scoped>
.statistics-page {
  width: 70%;
  margin: 0 auto;
  padding: 20px;
  font-family: 'HakgyoansimWoojuR';
  margin-top: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.page-title {
  font-size: 35px;
  color: #333;
  font-weight: bold;
}

.controls-container {
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

.content-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.chart-container {
  width :80%;
  flex: 1;
  min-height: 500px;
  border-radius: 10px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.mascot-message {
  display: flex;
  align-items: flex-start;
}

.mascot-image {
  width: 90px;
  height: 110px;
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
