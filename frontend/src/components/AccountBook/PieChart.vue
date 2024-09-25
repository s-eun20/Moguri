<template>
  <div class="PieChart">
    <div class="month-selector">
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
            :style="{ color: chartColors[index] }"
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
</template>

<script>
import { PieChart } from "@toast-ui/chart";
import { useAccountStore } from '@/stores/accountStore';
import { computed, onMounted, ref, watch } from 'vue';

export default {
  setup() {
    const accountStore = useAccountStore();
    const selectedMonth = ref('1월');
    const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    const chartColors = ["#ff6f61", "#6b5b95", "#88b04b", "#f7c6c7", "#f2ab27"];
    let chart = null;

    const monthlyData = computed(() => {
      const currentYear = new Date().getFullYear();
      const monthIndex = months.indexOf(selectedMonth.value);
      const startDate = new Date(currentYear, monthIndex, 1);
      const endDate = new Date(currentYear, monthIndex + 1, 0);

      const transactions = accountStore.transactions.filter(t => 
        new Date(t.transactionDate) >= startDate && 
        new Date(t.transactionDate) <= endDate &&
        t.type === '지출' &&
        t.category !== '수입'  // 수입 카테고리 제외
      );

      const categoryTotals = transactions.reduce((acc, t) => {
        if (!acc[t.category]) {
          acc[t.category] = { name: t.category, data: 0, amount: 0 };
        }
        acc[t.category].data += 1;
        acc[t.category].amount += t.amount;
        return acc;
      }, {});

      return Object.values(categoryTotals);
    });

    const totalExpenditure = computed(() => 
      monthlyData.value.reduce((total, item) => total + item.amount, 0)
    );

    const selectedSeries = computed(() => monthlyData.value);

    const updateChart = () => {
      const data = {
        categories: ["Category"],
        series: monthlyData.value.map(item => ({
          name: item.name,
          data: item.amount,
        })),
      };

      const options = {
        chart: { width: 500, height: 400 },
        series: {
          colors: chartColors,
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
        el: document.querySelector('.pie-chart'),
        data,
        options,
      });
    };

    watch(selectedMonth, updateChart);
    watch(() => accountStore.transactions, updateChart, { deep: true });

    onMounted(async() => {
      try {
        await accountStore.fetchAllTransactions();
        updateChart();
      } catch (error) {
        console.error('거래 내역을 불러오는 중 오류가 발생했습니다:', error);
      } finally {
      }
    });

    return {
      selectedMonth,
      months,
      chartColors,
      selectedSeries,
      totalExpenditure,
      updateChart,
    };
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
  color: #333; 
  font-size: 20px; 
  cursor: pointer; 
  appearance: none; 
  width: 200px;
  text-align: center;
  font-weight: bold;
}

#month:focus {
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
  color: #ff6f61;
  text-align: center; 
}
</style>