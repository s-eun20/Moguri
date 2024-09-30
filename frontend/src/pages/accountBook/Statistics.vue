<template>
  <div class="statistics-page">
    <h1 class="page-title">통계</h1>

    <div class="charts-container">
      <div class="charts-grid">
        <div class="chart-container">
          <h2 class="chart-title">월별 카테고리 지출</h2>
          <PieChart />
        </div>
        <div class="chart-container">
          <h2 class="chart-title">주별 지출</h2>
          <LineChart />
        </div>
        <div class="chart-container full-width">
          <h2 class="chart-title">연도별 지출</h2>
          <ColumnChart />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PieChart from '@/components/AccountBook/PieChart.vue';
import ColumnChart from '@/components/AccountBook/ColumnChart.vue';
import LineChart from '@/components/AccountBook/LineChart.vue';

export default {
  components: {
    PieChart,
    ColumnChart,
    LineChart,
  },
};
</script>

<style scoped>
.statistics-page {
  padding: 30px;
  max-width: 1600px;
  margin: 0 auto;
  box-sizing: border-box;
  overflow-x: hidden;
  font-family: 'HakgyoansimWoojuR';
  /* font-family: 'Pretendard-Regular'; */
  font-weight: bold;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ffcc00;
  width: 1600px;
}

.charts-container {
  width: 100%;
  overflow-x: hidden;
}

.charts-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 30px;
}

.chart-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chart-title {
  font-size: 18px;
  color: #000000;
  margin-bottom: 15px;
  padding-bottom: 10px;
  text-align: left;
  border-bottom: 1px solid #ffcc00;
  width: fit-content;
}

.full-width {
  grid-column: 1 / -1;
}

@media (max-width: 1500px) {
  .statistics-page {
    margin: 0 auto;
    max-width: 100%;
    overflow-x: hidden;
  }
}

@media (max-width: 768px) {
  .statistics-page {
    padding: 20px;
    overflow-x: hidden;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-container {
    margin-bottom: 20px;
  }

  .full-width {
    grid-column: auto;
  }
}
</style>
