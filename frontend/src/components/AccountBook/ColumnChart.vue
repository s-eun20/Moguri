<template>
  <div class="ColumnChart">
    <div class="year-selector">
      <select id="year" v-model="selectedYear" @change="updateChart">
        <option v-for="year in years" :key="year" :value="year">
          {{ year }}년
        </option>
      </select>
    </div>

    <div class="chart-container">
      <div ref="chartContainer" class="column-chart"></div>
    </div>

    <div class="total-amount">
      총 소비 금액: {{ totalExpenditure.toLocaleString() }}원
    </div>
  </div>
</template>

<script>
import { ColumnChart } from "@toast-ui/chart";
import { useAccountStore } from '@/stores/accountStore';
import { computed, onMounted, ref, watch } from 'vue';

export default {
  setup() {
    const accountStore = useAccountStore();
    const selectedYear = ref(new Date().getFullYear().toString());
    const years = computed(() => {
      const uniqueYears = [...new Set(accountStore.transactions.map(t => new Date(t.transactionDate).getFullYear()))];
      return uniqueYears.sort((a, b) => b - a);
    });
    const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    const chartColors = ["#ff6f61", "#6b5b95", "#88b04b", "#f7c6c7", "#f2ab27", "#f78fa7", "#5b5ea6", "#9b2335", "#dfcfbe", "#55b4b0", "#e15d44", "#7bc043"];
    let chart = null;

    const yearlyData = computed(() => {
      const data = Array(12).fill().map((_, i) => ({ name: months[i], data: 0, amount: 0 }));
      
      accountStore.transactions.forEach(t => {
        const transactionDate = new Date(t.transactionDate);
        if (transactionDate.getFullYear().toString() === selectedYear.value && t.type === '지출' && t.category !== '수입') {
          const monthIndex = transactionDate.getMonth();
          data[monthIndex].data += 1;
          data[monthIndex].amount += t.amount;
        }
      });

      return data;
    });

    const totalExpenditure = computed(() => 
      yearlyData.value.reduce((total, item) => total + item.amount, 0)
    );

    const updateChart = () => {
      const data = {
        categories: months,
        series: [
          {
            name: "월별 소비 금액",
            data: yearlyData.value.map(item => item.amount),
          },
        ],
      };

      const options = {
        chart: {  width: 1300, height: 500 },
        xAxis: { title: '월' },
        yAxis: { title: '금액 (원)' },
        legend: { align: 'bottom' },
        series: {
          dataLabels: { visible: true },
          colors: chartColors,
        },
      };

      if (chart) {
        chart.destroy();
      }

      chart = new ColumnChart({
        el: document.querySelector('.column-chart'),
        data,
        options,
      });
    };

    watch(selectedYear, updateChart);
    watch(() => accountStore.transactions, updateChart, { deep: true });

    onMounted(async() => {
      try {
        await accountStore.fetchAllTransactions();
        updateChart();
      } catch (error) {
        console.error('거래 내역을 불러오는 중 오류가 발생했습니다:', error);
      }
    });

    return {
      selectedYear,
      years,
      totalExpenditure,
      updateChart,
    };
  },
};
</script>

<style scoped>
.ColumnChart {
  font-family: 'HakgyoansimWoojuR';
  font-weight: bold;
}

.year-selector {
  margin-bottom: 20px;
  font-size: 20px;
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
  font-weight: bold;
}

#year:focus {
  outline: none;
  border-color: #ffb366;
  box-shadow: 0 0 4px rgba(255, 153, 85, 0.5);
}

.chart-container {
  display: flex;
}

.column-chart {
  margin-left: 100px;
  width: 1000px;
  height: 500px;
}

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
}
</style>