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

export default {
  setup(props, { emit }) {
    const accountStore = useAccountStore();
    const currentDate = new Date();
    const selectedYear = ref(currentDate.getFullYear());
    const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    const selectedMonth = ref(months[currentDate.getMonth()]);
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

    const previousMonthData = computed(() => {
      const monthIndex = months.indexOf(selectedMonth.value);
      const previousMonthIndex = monthIndex === 0 ? 11 : monthIndex - 1;
      const previousYear = monthIndex === 0 ? selectedYear.value - 1 : selectedYear.value;
      const startDate = new Date(previousYear, previousMonthIndex, 1);
      const endDate = new Date(previousYear, previousMonthIndex + 1, 0);

      const transactions = accountStore.transactions.filter(t => 
        new Date(t.transactionDate) >= startDate && 
        new Date(t.transactionDate) <= endDate &&
        t.type === '지출' &&
        t.category !== '수입'
      );

      return transactions.reduce((total, t) => total + t.amount, 0);
    });

    const selectedSeries = computed(() => {
      const series = monthlyData.value;

      // 가장 많이 쓴 카테고리 계산
      if (series.length > 0) {
        const topCategory = series.reduce((max, current) => (current.amount > max.amount ? current : max));
        series.forEach(item => {
          item.isTopSpending = item.name === topCategory.name; // 가장 많이 쓴 카테고리 표시
        });
      }

      return series;
    });

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
        chart: { width: chartContainer.value.clientWidth, height: chartContainer.value.clientHeight },
        legend: { visible: false },
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

      // 통계 업데이트 이벤트 발생
      const spendingChangePercentage = previousMonthData.value === 0 ? 0 : ((totalExpenditure.value - previousMonthData.value) / previousMonthData.value) * 100;

      emit('update:statistics', {
        currentMonthSpending: totalExpenditure.value,
        previousMonthSpending: previousMonthData.value,
        spendingChangePercentage: Math.round(spendingChangePercentage),
        topCategory: selectedSeries.value.length > 0 ? selectedSeries.value.reduce((max, current) => (current.amount > max.amount ? current : max)).name : '없음'
      });
    }, 400);

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

    watch([selectedYear, selectedMonth], () => {
      updateChart();
    });

    return {
      selectedYear,
      selectedMonth,
      years,
      months,
      selectedSeries,
      totalExpenditure,
      previousMonthData,
      updateChart,
      isLoading,
      chartContainer,
    };
  },
};
</script>

<style scoped>
.PieChart {
  font-family: 'HakgyoansimWoojuR';
  width: 100%;
}

.pie-chart {
  width: 100%;
  height: 400px; /* 기본 높이 설정 */
}

.chart-content {
  display: flex;
  flex-direction: column; /* 세로 방향으로 정렬 */
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
  width: 75%;
}

.category-list {
  width: 25%;
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
  font-size: 18px;
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
    flex-direction: column; /* 세로 방향으로 변경 */
  }

  .chart-container, .category-list {
    max-width: 100%; /* 최대 너비를 100%로 설정 */
    width: 100%; /* 너비를 100%로 설정 */
  }

  .pie-chart {
    height: 300px; /* 차트 높이 조정 */
  }

  ul {
    height: auto; /* 높이를 자동으로 조정 */
    max-height: 300px; /* 최대 높이 설정 */
  }
}
</style>