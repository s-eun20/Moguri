<template>
    <div>
      <!-- 년도 선택 드롭다운 -->
      <div class="year-selector">
        <select id="year" v-model="selectedYear" @change="updateChart">
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
  
      <!-- Column Chart Container -->
      <div ref="columnChartContainer" class="column-chart"></div>
  
      <!-- 총 소비 금액 표시 -->
      <div class="total-amount">
        총 소비 금액: {{ totalExpenditure.toLocaleString() }}원
      </div>
    </div>
  </template>
  
  <script>
  import { ColumnChart } from "@toast-ui/chart";
  
  export default {
    data() {
      return {
     
        yearlyData: {
          2024: [
            { name: "1월", data: 1200000 },
            { name: "2월", data: 950000 },
            { name: "3월", data: 1100000 },
            { name: "4월", data: 800000 },
            { name: "5월", data: 1500000 },
            { name: "6월", data: 900000 },
            { name: "7월", data: 1200000 },
            { name: "8월", data: 950000 },
            { name: "9월", data: 1100000 },
            { name: "10월", data: 800000 },
            { name: "11월", data: 1500000 },
            { name: "12월", data: 900000 },
          ],
          2023: [
            { name: "1월", data: 1100000 },
            { name: "2월", data: 1000000 },
            { name: "3월", data: 1050000 },
            { name: "4월", data: 750000 },
            { name: "5월", data: 1400000 },
            { name: "6월", data: 850000 },
            { name: "7월", data: 1150000 },
            { name: "8월", data: 1000000 },
            { name: "9월", data: 1050000 },
            { name: "10월", data: 780000 },
            { name: "11월", data: 1450000 },
            { name: "12월", data: 880000 },
          ],
          
        },
        years: ["2023", "2024"], 
        selectedYear: "2024",
        chartColor: "#36a2eb",
      };
    },
    computed: {
      // 선택된 년도의 총 소비 금액 계산
      totalExpenditure() {
        return this.yearlyData[this.selectedYear].reduce((total, item) => total + item.data, 0);
      },
    },
    mounted() {
      this.updateChart(); 
    },
    methods: {
      
      updateChart() {
        const data = {
          categories: this.yearlyData[this.selectedYear].map((item) => item.name), // X축에 월 표시
          series: [
            {
              name: "월별 소비 금액",
              data: this.yearlyData[this.selectedYear].map((item) => item.data),
              color: this.chartColor, // 그래프 색상 지정
            },
          ],
        };
  
        const options = {
          chart: { width: 1500, height: 400 },
          xAxis: {
            title: "월",
          },
          yAxis: {
            title: "금액 (원)",
            min: 0,
            max: 2000000,
          },
          series: {
            colors: [this.chartColor],
            showLabel: true,
          },
        };
  
        
        if (this.chart) {
          this.chart.destroy();
        }
  
        this.chart = new ColumnChart({
          el: this.$refs.columnChartContainer,
          data,
          options,
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .year-selector {
    margin-bottom: 10px;
    font-family: 'LeeSeoyun';
  }
  
  .year-selector label {
    margin-right: 8px;
  }
  
  #year {
    padding: 8px 12px;
    border-radius: 12px;
    border: 2px solid #ffcc99; 
    background-color: #fff4e6; 
    color: #333; 
    font-size: 20px;
    cursor: pointer; 
    appearance: none; 
    width: 200px;
    text-align: center;
  }
  
  #year:focus {
    outline: none; 
    border-color: #ffb366; 
    box-shadow: 0 0 4px rgba(255, 153, 85, 0.5); 
  }
  
  .column-chart {
    width: 100%;
    height: 400px;
  }
  
  /* 총 소비 금액 표시 스타일 */
  .total-amount {
  border-radius: 12px; 
  border: 2px solid #ffcc99; 
  background-color: #fff4e6; 
  margin-top: 20px;
  font-size: 24px;
  width: 350px;
  font-weight: bold;
  color: #ff6f61; 
  text-align: center; 
  font-family: 'omyu_pretty';
}
  </style>
  