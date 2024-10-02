<template>
  <div class="PieChart">
    <div v-if="isLoading">데이터를 불러오는 중...</div>
    <div v-else class="chart-content">
      <div class="header">
        <div class="selector">
          <select id="year" v-model="selectedYear" @change="updateChart">
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}년
            </option>
          </select>
          <select id="month" v-model="selectedMonth" @change="updateChart">
            <option v-for="month in months" :key="month" :value="month">
              {{ month }}
            </option>
          </select>
        </div>
        <div class="total-amount">
          총 소비 금액: {{ totalExpenditure.toLocaleString() }}원
        </div>
      </div>
      <div class="chart-and-category">
        <div class="chart-container">
          <div ref="chartContainer" class="pie-chart"></div>
        </div>
        <div class="category-list">
          <h3>카테고리별 소비내역</h3>
          <ul>
            <li v-for="(item, index) in selectedSeries" :key="index">
              <span class="category-name">{{ item.name }}</span>
              <span class="category-amount">{{ item.amount.toLocaleString() }}원</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PieChart } from "@toast-ui/chart";
import { useAccountStore } from '@/stores/accountStore';
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import debounce from 'lodash/debounce';
import { Colors } from "chart.js";

export default {
  setup(props, { emit }) {  // emit 추가
    const accountStore = useAccountStore();
    const currentDate = new Date();
    const selectedYear = ref(currentDate.getFullYear());
    const selectedMonth = ref('9월');
    const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    let chart = null;
    const isLoading = ref(true);
    const chartContainer = ref(null);

    const years = computed(() => {
      const uniqueYears = [...new Set(accountStore.transactions.map(t => new Date(t.transactionDate).getFullYear()))];
      return uniqueYears.sort((a, b) => b - a);
    });

    const monthlyData = computed(() => {
      const monthIndex = months.indexOf(selectedMonth.value);
      const startDate = new Date(selectedYear.value, monthIndex, 1);
      const endDate = new Date(selectedYear.value, monthIndex + 1, 0);

      const transactions = accountStore.transactions.filter(t => 
        new Date(t.transactionDate) >= startDate && 
        new Date(t.transactionDate) <= endDate &&
        t.type === '지출' &&
        t.category !== '수입'
      );

      const categoryTotals = transactions.reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = { name: t.category, amount: 0 };
        }
        acc[t.category].amount += t.amount;
        return acc;
      }, {});

      return Object.values(categoryTotals);
    });

    const totalExpenditure = computed(() =>
      monthlyData.value.reduce((total, item) => total + item.amount, 0)
    );

    const selectedSeries = computed(() => monthlyData.value);

    const updateChart = debounce(async () => {
      await nextTick();

      if (!chartContainer.value || monthlyData.value.length === 0) return;

      const data = {
        series: monthlyData.value.map(item => ({
          name: item.name,
          data: item.amount,
        })),
      };

      const options = {
        chart: { width: 700, height: 400 },
        series: {
          dataLabels: {
            visible: true,
            pieSeriesName: {
              visible: true,
            },
          },
        },
        legend: {
          visible: true,
          align: 'bottom',
        },
      };

      if (chart) {
        chart.destroy();
      }

      chart = new PieChart({
        el: chartContainer.value,
        data,
        options,
      });
    }, 400);

    const previousMonthData = computed(() => {
      const currentMonthIndex = months.indexOf(selectedMonth.value);
      const previousMonthIndex = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
      const previousYear = currentMonthIndex === 0 ? selectedYear.value - 1 : selectedYear.value;
      const startDate = new Date(previousYear, previousMonthIndex, 1);
      const endDate = new Date(previousYear, previousMonthIndex + 1, 0);

      return calculateMonthlyExpenditure(startDate, endDate);
    });

    const calculateMonthlyExpenditure = (startDate, endDate) => {
      const transactions = accountStore.transactions.filter(t => 
        new Date(t.transactionDate) >= startDate && 
        new Date(t.transactionDate) <= endDate &&
        t.type === '지출' &&
        t.category !== '수입'
      );

      return transactions.reduce((total, t) => total + t.amount, 0);
    };

    const spendingChangePercentage = computed(() => {
      if (previousMonthData.value === 0) return 0;
      const change = ((totalExpenditure.value - previousMonthData.value) / previousMonthData.value) * 100;
      return Number(change.toFixed(1));
    });

    const topSpendingCategory = computed(() => {
      if (selectedSeries.value.length === 0) return '없음';
      return selectedSeries.value.reduce((max, current) => 
        max.amount > current.amount ? max : current
      ).name;
    });

    const emitStatistics = () => {
      emit('update:statistics', {
        currentMonthSpending: totalExpenditure.value,
        previousMonthSpending: previousMonthData.value,
        spendingChangePercentage: spendingChangePercentage.value,
        topCategory: topSpendingCategory.value
      });
    };

    watch([selectedYear, selectedMonth], () => {
      updateChart();
      nextTick(() => {
        emitStatistics();
      });
    });

    watch(() => accountStore.transactions, { deep: true });

    onMounted(async () => {
      try {
        await accountStore.fetchAllTransactions();
        updateChart();
        emitStatistics();
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
      selectedMonth,
      years,
      months,
      selectedSeries,
      totalExpenditure,
      updateChart,
      isLoading,
      chartContainer,
    };
  },
};
</script>

<style scoped>
.PieChart {
  font-family: 'HakgyoansimWoojuR', sans-serif;
 
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

#year, #month {
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  color: #333;
  font-size: 16px;
  cursor: pointer;
  appearance: none;
  background-color: white;
  transition: all 0.3s ease;
}

#year:hover, #month:hover {
  border-color: #007bff;
}

#year:focus, #month:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.total-amount {
  font-size: 18px;
  font-weight: bold;
  color: #ff0000;
  padding: 8px 15px;
  border-radius: 8px;
}

.chart-and-category {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  gap: 20px;
}

.chart-container, .category-list {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.chart-container {
  width : 60%;
}
.category-list {
  width :40%;
}

.pie-chart {
  height: auto;

}

.category-list h3 {
  margin-top: 0;
  color: #333;
  font-size: 18px;
  margin-bottom: 15px;
  border-bottom: 2px solid #c1dcfa;
  padding-bottom: 10px;
  font-weight: bold;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  height: calc(400px - 50px); /* 차트 높이에서 제목 높이를 뺀 값 */
  overflow-y: auto;
}

li {
  font-size: 16px;
  margin-bottom: 10px;
  color: #555;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

li:hover {
  background-color: #f0f4f8;
}

.category-name {
  font-weight: bold;
  font-size :18px;
}

.category-amount {
  font-size: 18px;
  color: #000000;
  font-weight: bold;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .chart-and-category {
    flex-direction: column;
  }

  .chart-container, .category-list {
    max-width: 100%;
  }

  .pie-chart {
    height: 300px;
  }

  ul {
    height: auto;
    max-height: 300px;
  }
}
</style>