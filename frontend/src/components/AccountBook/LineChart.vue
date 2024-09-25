<template>
  <div class="line-chart-container">
    <div class="selector">
      <select id="month" v-model="selectedMonth" @change="updateChart">
        <option v-for="month in months" :key="month.value" :value="month.value">
          {{ month.label }}
        </option>
      </select>
    </div>
    <div ref="lineChartContainer" class="line-chart"></div>
    <div class="total-expenditure">
      <p>총 소비 금액: {{ totalExpenditure.toLocaleString() }}원</p>
    </div>
  </div>
</template>

<script>
import { LineChart } from '@toast-ui/chart';
import { useAccountStore } from '@/stores/accountStore';
import { computed, onMounted, ref, watch } from 'vue';

export default {
  setup() {
    const accountStore = useAccountStore();
    const currentDate = new Date();
    const selectedMonth = ref(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`);
    const months = computed(() => {
      const uniqueMonths = [...new Set(accountStore.transactions.map(t => {
        const date = new Date(t.transactionDate);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }))];
      return uniqueMonths.sort((a, b) => b.localeCompare(a)).map(month => ({
        value: month,
        label: `${month.split('-')[0]}년 ${month.split('-')[1]}월`
      }));
    });
    let chart = null;

    const weeklyData = computed(() => {
      const [year, month] = selectedMonth.value.split('-');
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      const data = Array(6).fill().map((_, i) => ({ week: i + 1, amount: 0 }));
      
      accountStore.transactions.forEach(t => {
        const transactionDate = new Date(t.transactionDate);
        if (transactionDate >= startDate && transactionDate <= endDate && t.type === '지출' && t.category !== '수입') {
          const weekNumber = getWeekNumberInMonth(transactionDate);
          data[weekNumber - 1].amount += t.amount;
        }
      });

      return data.filter(d => d.amount > 0);
    });

    const totalExpenditure = computed(() => 
      weeklyData.value.reduce((total, item) => total + item.amount, 0)
    );

    function getWeekNumberInMonth(d) {
      const firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
      const dayOfWeek = firstDayOfMonth.getDay();
      return Math.ceil((d.getDate() + dayOfWeek) / 7);
    }

    const updateChart = () => {
      const data = {
        categories: weeklyData.value.map(item => `${item.week}주`),
        series: [
          {
            name: '주별 지출 금액',
            data: weeklyData.value.map(item => item.amount),
          },
        ],
      };

      const options = {
        chart: {  width: 600, height: 400 },
        xAxis: { title: '주' },
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
        el: document.querySelector('.line-chart'),
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
      }
    });

    return {
      selectedMonth,
      months,
      totalExpenditure,
      updateChart,
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

.line-chart {
  width: 700px;
  height: 400px;
  margin: 0 auto;
}

.title {    
  padding: 8px 12px;
  border-radius: 12px; 
  border: 2px solid #ffcc99; 
  background-color: #fff4e6; 
  color: #333;
  font-size: 20px;
  width: 200px;
  text-align: center;
  margin: 20px auto;
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