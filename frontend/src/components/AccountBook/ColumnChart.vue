<template>
  <div class="ColumnChart">
    <div v-if="isLoading">데이터를 불러오는 중...</div>
    <div v-else class="chart-content">
      <div class="header">
        <div class="selector">
          <select id="year" v-model="selectedYear" @change="updateChart">
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}년
            </option>
          </select>
        </div>
        <div class="total-amount">
          총 소비 금액: {{ totalExpenditure.toLocaleString() }}원
        </div>
      </div>
      <div class="chart-container">
        <div ref="chartContainer" class="column-chart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ColumnChart } from "@toast-ui/chart";
import { useAccountStore } from '@/stores/accountStore';
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import debounce from 'lodash/debounce';

export default {
  setup() {
    const accountStore = useAccountStore();
    const selectedYear = ref(new Date().getFullYear());
    const isLoading = ref(true);
    const chartContainer = ref(null);
    let chart = null;

    const years = computed(() => {
      const uniqueYears = [...new Set(accountStore.transactions.map(t => new Date(t.transactionDate).getFullYear()))];
      return uniqueYears.sort((a, b) => b - a);
    });

    const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    const chartColors = ["#ff6f61", "#6b5b95", "#88b04b", "#f7c6c7", "#f2ab27", "#f78fa7", "#5b5ea6", "#9b2335", "#dfcfbe", "#55b4b0", "#e15d44", "#7bc043"];

    const yearlyData = computed(() => {
      const data = Array(12).fill().map((_, i) => ({ name: months[i], amount: 0 }));
      
      accountStore.transactions.forEach(t => {
        const transactionDate = new Date(t.transactionDate);
        if (transactionDate.getFullYear() === selectedYear.value && t.type === '지출' && t.category !== '수입') {
          const monthIndex = transactionDate.getMonth();
          data[monthIndex].amount += t.amount;
        }
      });

      console.log('Yearly Data:', data); // 디버깅을 위한 로그
      return data;
    });

    const totalExpenditure = computed(() => 
      yearlyData.value.reduce((total, item) => total + item.amount, 0)
    );

    const updateChart = debounce(async () => {
      await nextTick();

      console.log('Updating chart for year:', selectedYear.value); // 디버깅을 위한 로그

      if (!chartContainer.value || yearlyData.value.length === 0) {
        console.log('Chart container not ready or no data'); // 디버깅을 위한 로그
        return;
      }

      const data = {
        categories: months,
        series: [
          {
            name: "월별 소비 금액",
            data: yearlyData.value.map(item => item.amount),
          },
        ],
      };

      console.log('Chart data:', data); // 디버깅을 위한 로그

      const options = {
        chart: { width: chartContainer.value.clientWidth, height: chartContainer.value.clientHeight },
        xAxis: { title: '월' },
        yAxis: { title: '금액 (원)' },
        legend: { visible: false },
        series: {
          dataLabels: { visible: true },
          colors: chartColors,
        },
      };

      if (chart) {
        chart.destroy();
      }

      chart = new ColumnChart({
        el: chartContainer.value,
        data,
        options,
      });
    }, 400);

    watch(() => selectedYear.value, updateChart);
    watch(() => accountStore.transactions, updateChart, { deep: true });

    onMounted(async () => {
      try {
        await accountStore.fetchAllTransactions();
        updateChart();
      } catch (error) {
        console.error('거래 내역을 불러오는 중 오류가 발생했습니다:', error);
      } finally {
        isLoading.value = false;
      }
    });

    onUnmounted(() => {
      if (chart) {
        chart.destroy();
        chart = null;
      }
    });

    return {
      selectedYear,
      years,
      totalExpenditure,
      updateChart,
      isLoading,
      chartContainer,
    };
  },
};
</script>

<style scoped>
.ColumnChart {
  font-family: 'HakgyoansimWoojuR', sans-serif;
  width: 100%;
 
}

.chart-content {
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background-color: #ffffff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.selector {
  display: flex;
  gap: 10px;
}

#year {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  appearance: none;
  background-color: white;
  transition: all 0.3s ease;
  font-weight: bold;
}

#year:hover {
  border-color: #007bff;
}

#year:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.total-amount {
  font-size: 18px;
  font-weight: bold;
  color: #ff0000;
  background-color: #ffffff;
  padding: 8px 15px;
  border-radius: 8px;
}

.chart-container {
  flex: 1;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.column-chart {
  width: 100%;
  height: 400px;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .column-chart {
    height: 300px;
  }
}

@media (max-width: 480px) {
  #year, .total-amount {
    font-size: 14px;
  }
  
  .column-chart {
    height: 250px;
  }
}
</style>