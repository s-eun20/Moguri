<template>
  <div class="line-chart-container">
    <p class="title">요일 별 지출 금액</p>
    <div ref="lineChartContainer" class="line-chart"></div>
    <div class="total-expenditure">
      <p>총 소비 금액: {{ totalExpenditure }}원</p> <!-- 총 소비 금액 표시 -->
    </div>
  </div>
</template>

<script>
import { LineChart } from '@toast-ui/chart';

export default {
  data() {
    return {
      // 요일별 지출 데이터
      weeklyExpenditure: [
        { day: '월', amount: 30000 },
        { day: '화', amount: 15000 },
        { day: '수', amount: 50000 },
        { day: '목', amount: 20000 },
        { day: '금', amount: 40000 },
        { day: '토', amount: 25000 },
        { day: '일', amount: 10000 },
      ],
    };
  },
  computed: {
    totalExpenditure() {
      return this.weeklyExpenditure.reduce((sum, item) => sum + item.amount, 0);
    },
  },
  mounted() {
    this.renderLineChart();
  },
  methods: {
    renderLineChart() {
      const data = {
        categories: this.weeklyExpenditure.map(item => item.day), // 요일
        series: [
          {
            name: '지출 금액',
            data: this.weeklyExpenditure.map(item => item.amount), // 금액
          },
        ],
      };

      const options = {
        chart: {
          width: 700,
          height: 400,
          fontFamily: 'Arial, sans-serif',
        },
        series: {
          showLabel: true,
        },
        xAxis: {
          title: '요일',
        },
        yAxis: {
          title: '금액 (원)',
        },
      };

      // LineChart 생성
      const chart = new LineChart({
        el: this.$refs.lineChartContainer, // 차트가 렌더링될 DOM 요소
        data,
        options,
      });
    },
  },
};
</script>

<style scoped>
.line-chart-container {
  font-family: 'LeeSeoyun';
}

.line-chart {
  width: 100%; 
}

.title {    
    padding: 8px 12px;
  border-radius: 12px; 
  border: 2px solid #ffcc99; 
  background-color: #fff4e6; 
  color: #333; /* Text color */
  font-size: 20px; /* Font size */
  cursor: pointer; /* Pointer cursor */
  appearance: none; /* Remove default browser styles */
  width: 200px;
  text-align: center;

}

.total-expenditure {
  border-radius: 12px; 
  border: 2px solid #ffcc99; 
  background-color: #fff4e6; 
  margin-top: 8px;
  font-size: 24px;
  width: 350px;
  font-weight: bold;
  color: #ff6f61; /* 총 지출 금액의 텍스트 색상 */
  text-align: center; /* 가운데 정렬 */
  height: 40px;

}
</style>
