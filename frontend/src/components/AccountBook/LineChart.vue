<template>
  <div class="line-chart-container">
    <div v-if="isLoading">데이터를 불러오는 중...</div>
    <div v-else>
      <div class="selector">
        <select id="year" v-model="selectedYear" @change="updateChart">
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}년
          </option>
        </select>
        <select id="month" v-model="selectedMonth" @change="updateChart">
          <option v-for="month in months" :key="month.value" :value="month.value">
            {{ month.label }}
          </option>
        </select>
        <select id="week" v-model="selectedWeek" @change="updateChart">
          <option v-for="week in weeks" :key="week" :value="week">
            {{ week }}주
          </option>
        </select>
      </div>
      
      <div ref="chartContainer" class="line-chart"></div>
      
      <div class="total-expenditure">
        <p>총 소비 금액: {{ totalExpenditure.toLocaleString() }}원</p>
      </div>
    </div>
  </div>
</template>

<script>
import { LineChart } from '@toast-ui/chart';
import { useAccountStore } from '@/stores/accountStore';
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
import debounce from 'lodash/debounce';

export default {
  setup() {
    const accountStore = useAccountStore();
    const currentDate = new Date();
    const selectedYear = ref(currentDate.getFullYear());
    const selectedMonth = ref(String(currentDate.getMonth() + 1).padStart(2, '0'));
    const selectedWeek = ref('1');
    const isLoading = ref(true);
    const chartContainer = ref(null);
    let chart = null;

    const years = computed(() => {
      const uniqueYears = [...new Set(accountStore.transactions.map(t => new Date(t.transactionDate).getFullYear()))];
      return uniqueYears.sort((a, b) => b - a);
    });

    const months = [
      { value: '01', label: '1월' },
      { value: '02', label: '2월' },
      { value: '03', label: '3월' },
      { value: '04', label: '4월' },
      { value: '05', label: '5월' },
      { value: '06', label: '6월' },
      { value: '07', label: '7월' },
      { value: '08', label: '8월' },
      { value: '09', label: '9월' },
      { value: '10', label: '10월' },
      { value: '11', label: '11월' },
      { value: '12', label: '12월' },
    ];

    const weeks = ['1', '2', '3', '4', '5'];

    const dailyData = computed(() => {
      const startDate = getStartDateOfWeek(selectedYear.value, selectedMonth.value, selectedWeek.value);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      
      const data = Array(7).fill().map((_, i) => {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        return { 
          day: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()], 
          amount: 0,
          date: date.toISOString().split('T')[0]
        };
      });
      
      accountStore.transactions.forEach(t => {
        const transactionDate = new Date(t.transactionDate);
        if (transactionDate >= startDate && transactionDate <= endDate && t.type === '지출' && t.category !== '수입') {
          const dayIndex = transactionDate.getDay();
          data[dayIndex].amount += t.amount;
        }
      });

      return data;
    });

    const totalExpenditure = computed(() => 
      dailyData.value.reduce((total, item) => total + item.amount, 0)
    );

    function getStartDateOfWeek(year, month, week) {
      const firstDayOfMonth = new Date(year, month - 1, 1);
      const dayOfWeek = firstDayOfMonth.getDay();
      const daysToAdd = (week - 1) * 7 - dayOfWeek;
      const startDate = new Date(firstDayOfMonth);
      startDate.setDate(firstDayOfMonth.getDate() + daysToAdd);
      return startDate;
    }

    const updateChart = debounce(async () => {
      await nextTick();

      if (!chartContainer.value || dailyData.value.length === 0) return;

      const data = {
        categories: dailyData.value.map(item => `${item.day} (${item.date})`),
        series: [
          {
            name: '일별 지출 금액',
            data: dailyData.value.map(item => item.amount),
          },
        ],
      };

      const options = {
        chart: { width: 700, height: 400 },
        xAxis: { title: '요일' },
        yAxis: { title: '금액 (원)' },
        legend: { align: 'bottom' },
        series: {
          showDot: true,
          dataLabels: { visible: true },
        },
      };

      if (chart) {
        chart.destroy();
      }

      chart = new LineChart({
        el: chartContainer.value,
        data,
        options,
      });
    }, 400);

    watch([selectedYear, selectedMonth, selectedWeek], updateChart);
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
      selectedWeek,
      years,
      months,
      weeks,
      totalExpenditure,
      updateChart,
      isLoading,
      chartContainer,
    };
  },
};
</script>

<style scoped>
.line-chart-container {
  font-family: 'HakgyoansimWoojuR';
  font-weight: bold;
}

.selector {
  margin-bottom: 20px;
  font-size: 20px;
}

#year, #month, #week {
  padding: 8px 12px;
  border-radius: 12px;
  border: 2px solid #ffcc99;
  background-color: #fff4e6;
  color: #333;
  font-size: 20px;
  cursor: pointer;
  appearance: none;
  width: 100px;
  text-align: center;
  font-weight: bold;
  margin-right: 10px;
}

#year:focus, #month:focus, #week:focus {
  outline: none;
  border-color: #ffb366;
  box-shadow: 0 0 4px rgba(255, 153, 85, 0.5);
}

.line-chart {
  width: 700px;
  height: 385px;
  margin: 0 auto;
}

.loading-message {
  text-align: center;
  font-size: 24px;
  color: #ff6f61;
  margin-top: 20px;
}

.total-expenditure {
  border-radius: 12px; 
  border: 2px solid #ffcc99; 
  background-color: #fff4e6; 
  margin-top: 20px;
  font-size: 24px;
  width: 350px;
  height: 38px;
  font-weight: bold;
  color: #ff6f61;
  text-align: center; 
}
</style>
