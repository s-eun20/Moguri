<template>
  <div class="statistics-page">
    <h1 class="page-title">통계</h1>
    
    <div class="Chart">
      <PieChart />
      <div class="lineChart">
        <LineChart /> 
      </div>
    </div>
    <div class="ColumnChart">
      <ColumnChart />
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
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ffcc99;
}

.Chart {
  display: flex;
  margin-left: 30px;
  margin-top: 20px;
}

.lineChart {
  margin-left: auto;
}

.ColumnChart {
  margin-left: 30px;
  margin-top: 30px;
}
</style>
