<template>
    <div class="stock-chart">
      <div class="chart-controls">
        <button @click="changeInterval('day')" :class="{ active: currentInterval === 'day' }">일</button>
        <button @click="changeInterval('week')" :class="{ active: currentInterval === 'week' }">주</button>
        <button @click="changeInterval('month')" :class="{ active: currentInterval === 'month' }">월</button>
        <button @click="changeInterval('year')" :class="{ active: currentInterval === 'year' }">년</button>
      </div>
      <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useStockStore } from '@/stores/stockStore';
import Chart from 'chart.js/auto';

export default {
  setup() {
    const stockStore = useStockStore();
    const chartCanvas = ref(null);
    const chart = ref(null);
    const currentInterval = ref('day');

    const createChart = (data) => {
      if (chart.value) {
        chart.value.destroy();
      }

      const ctx = chartCanvas.value.getContext('2d');
      chart.value = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [{
            label: stockStore.selectedStock?.name || '주가',
            data: data.prices,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    };

    const changeInterval = async (interval) => {
      currentInterval.value = interval;
      if (stockStore.selectedStock) {
        await stockStore.fetchStockChart(stockStore.selectedStock.code, interval);
        createChart(stockStore.chartData);
      }
    };

    onMounted(() => {
      if (stockStore.selectedStock) {
        changeInterval('day');
      }
    });

    watch(() => stockStore.selectedStock, (newStock) => {
      if (newStock) {
        changeInterval(currentInterval.value);
      }
    });

    return {
      chartCanvas,
      currentInterval,
      changeInterval
    };
  }
}
</script>

<style scoped>
.stock-chart {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.chart-controls {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.chart-controls button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
}

.chart-controls button.active {
  background-color: #007bff;
  color: white;
}
</style>
