<template>
  <div class="PieChart">
    <div v-if="isLoading">데이터를 불러오는 중...</div>
    <div v-else>
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
      <div class="chart-container">
        <div class="category-list">
          <ul>
            <li>카테고리별 소비내역</li>
            <li
              v-for="(item, index) in selectedSeries"
              :key="index"
            >
              {{ item.name }} : {{ item.amount.toLocaleString() }}원
            </li>
          </ul>
        </div>

        <div ref="chartContainer" class="pie-chart"></div>
      </div>

      <div class="total-amount">
        총 소비 금액: {{ totalExpenditure.toLocaleString() }}원
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
  setup() {
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
        chart: { width: 500, height: 400 },
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

    watch([selectedYear, selectedMonth], updateChart);
    watch(() => accountStore.transactions, { deep: true });

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
  font-family: 'HakgyoansimWoojuR';
  font-weight: bold;
}

.selector {
  margin-bottom: 10px;
  font-size: 20px;
}

#year, #month {
  padding: 8px 12px;
  border-radius: 12px;
  border: 2px solid #ffcc99;
  background-color: #fff4e6;
  color: #333;
  font-size: 20px;
  cursor: pointer;
  appearance: none;
  width: 150px;
  text-align: center;
  font-weight: bold;
  margin-right: 10px;
}

#year:focus, #month:focus {
  outline: none;
  border-color: #ffb366;
  box-shadow: 0 0 4px rgba(255, 153, 85, 0.5);
}

.chart-container {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: 50px;
}

.pie-chart {
  width: 400px;
  height: 400px;
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
  margin: 0;
}

li {
  font-size: 23px;
  margin-bottom: 10px;
  align-items: center;
  color: #fda451;
}
li:first-child {
  color: black; /* '카테고리별 소비내역' 텍스트는 검정색 유지 */
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
