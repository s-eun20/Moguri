<template>
  <div class="PieChart">
    <!-- 월 선택 드롭다운 -->
    <div class="month-selector">
      <select id="month" v-model="selectedMonth" @change="updateChart">
        <option v-for="month in months" :key="month" :value="month">
          {{ month }}
        </option>
      </select>
    </div>

    <div class="chart-container">
      <!-- 카테고리 리스트 -->
      <div class="category-list">
        <ul>
          <li> 카테고리별 소비내역 </li>
          <li
            v-for="(item, index) in selectedSeries"
            :key="index"
            :style="{ color: chartColors[index] }"
          >
            {{ item.name }} : {{ item.amount.toLocaleString() }}원
          </li>
        </ul>
      </div>

      <div ref="chartContainer" class="pie-chart"></div>
    </div>

    <!-- 총 지출 금액 표시 -->
    <div class="total-amount">
      총 소비 금액: {{ totalExpenditure.toLocaleString() }}원
    </div>
  </div>
</template>

<script>
import { PieChart } from "@toast-ui/chart";

export default {
  data() {
    return {
      // 전체 월별 데이터
      monthlyData: {
        "1월": [
          { name: "식비", data: 40, amount: 40000 },
          { name: "교통비", data: 15, amount: 150000 },
          { name: "건강", data: 10, amount: 100000 },
          { name: "통신비", data: 15, amount: 150000 },
          { name: "쇼핑", data: 20, amount: 200000 },
        ],
        "2월": [
          { name: "식비", data: 35, amount: 350000 },
          { name: "교통비", data: 20, amount: 200000 },
          { name: "건강", data: 10, amount: 100000 },
          { name: "통신비", data: 20, amount: 200000 },
          { name: "쇼핑", data: 15, amount: 150000 },
        ],
        // 각 월에 대한 데이터 추가
      },
      months: [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
      ],
      selectedMonth: "1월", // 선택된 월 기본값
      chartColors: ["#ff6f61", "#6b5b95", "#88b04b", "#f7c6c7", "#f2ab27"],
      selectedSeries: [], // 현재 선택된 월의 데이터
    };
  },
  computed: {
    // 선택된 월의 총 지출 금액 계산
    totalExpenditure() {
      return this.selectedSeries.reduce((total, item) => total + item.amount, 0);
    },
  },
  mounted() {
    this.updateChart(); // 첫 로딩 시 차트를 그립니다.
  },
  methods: {
    // 차트 업데이트 함수
    updateChart() {
      const data = {
        categories: ["Category"],
        series: this.monthlyData[this.selectedMonth].map((item) => ({
          name: item.name,
          data: item.data,
        })),
      };

      const options = {
        chart: { width: 500, height: 400 },
        series: {
          colors: this.chartColors,
          dataLabels: {
            visible: true, // 데이터 레이블을 차트에 표시
            pieSeriesName: {
              visible: true, // 파이 차트 시리즈의 이름을 표시
            },
          },
        },
        legend: {
          visible: true, // 차트의 범례를 표시
          align: 'bottom', // 범례를 아래쪽에 배치
        },
      };

      // 파이차트 업데이트
      if (this.chart) {
        this.chart.destroy(); // 기존 차트를 삭제
      }

      this.chart = new PieChart({
        el: this.$refs.chartContainer,
        data,
        options,
      });

      // 선택된 월의 데이터를 업데이트
      this.selectedSeries = this.monthlyData[this.selectedMonth];
    },
  },
};
</script>

<style scoped>
.PieChart {
  font-family: 'HakgyoansimWoojuR';
  font-weight: bold;
}

.month-selector {
  margin-bottom: 10px;
  font-size: 20px;
  
}

#month {
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
  font-weight: bold;
}

#month:focus {
  outline: none; /* Remove default focus outline */
  border-color: #ffb366; /* Darker orange border on focus */
  box-shadow: 0 0 4px rgba(255, 153, 85, 0.5); /* Add a subtle shadow on focus */
}

.chart-container {
  display: flex; /* Flex 레이아웃 사용 */
  flex-direction: row-reverse; /* 요소들을 오른쪽부터 정렬 */
  align-items: center; /* 요소들을 수직으로 가운데 정렬 */
  gap: 50px; /* 차트와 리스트 사이의 간격 설정 */
}

.pie-chart {
  width: 400px; /* 차트의 크기 조정 */
  height: 400px; /* 차트의 높이를 리스트와 맞춤 */
}

.category-list {
  width: 230px; 
  height: 320px; 
  padding-left: 20px;
  border: 3px solid rgb(255, 212, 95);
  font-weight: bold;
  display: flex; 
  align-items: center;
  margin-left: 70px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0; /* 리스트의 기본 여백 제거 */
}

li {
  font-size: 23px;
  margin-bottom: 10px;
  align-items: center;
}

/* 총 지출 금액 표시 스타일 */
.total-amount {
  border-radius: 12px; 
  border: 2px solid #ffcc99; 
  background-color: #fff4e6; 
  margin-top: 20px;
  font-size: 24px;
  width: 350px;
  font-weight: bold;
  color: #ff6f61; /* 총 지출 금액의 텍스트 색상 */
  text-align: center; /* 가운데 정렬 */
}
</style>
