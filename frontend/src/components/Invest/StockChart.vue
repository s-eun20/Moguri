<template>
  <div class="stock-chart-container">
    <div class="chart-period-buttons">
      <button 
        v-for="period in periods" 
        :key="period"
        @click="changePeriod(period)" 
        :class="{ active: selectedPeriod === period }"
      >
        {{ periodLabels[period] }}
      </button>
    </div>
    <div class="stock-chart">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';
import { CandlestickController, CandlestickElement, OhlcElement } from 'chartjs-chart-financial';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';
import { useStockStore } from '@/stores/stockStore';

// Chart.js 컴포넌트 등록
Chart.register(...registerables, CandlestickController, CandlestickElement, OhlcElement);

export default {
  name: 'StockChart',
  props: {
    stockName: {
      type: String,
      required: true
    },
    stockCode: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const stockStore = useStockStore();
    const selectedPeriod = ref('DAY');
    const periods = ['DAY', 'WEEK', 'MONTH', 'YEAR'];
    const periodLabels = {
      DAY: '일',
      WEEK: '주',
      MONTH: '월',
      YEAR: '년'
    };
    const chartCanvas = ref(null);
    let chart = null;

    const updateChart = async () => {
      if (!props.stockCode || props.stockCode.trim() === '') {
        return; 
      }
      await stockStore.fetchStockChart(props.stockCode, selectedPeriod.value);
      const data = stockStore.chartData;

      if (!data) {
        console.error('No chart data available');
        return;
      }

      const ctx = chartCanvas.value.getContext('2d');

      if (chart) {
        chart.destroy();
      }

      chart = new Chart(ctx, {
        type: 'candlestick',
        data: {
          datasets: [{
            label: props.stockName,
            data: data.map(item => ({
              x: item.date,
              o: item.open,
              h: item.high,
              l: item.low,
              c: item.close
            })),
            color: {
              up: '#26A69A',
              down: '#EF5350',
              unchanged: '#888888',
            },
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: selectedPeriod.value.toLowerCase()
              },
              adapters: {
                date: {
                  locale: enUS
                }
              },
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                color: '#333'
              }
            },
            y: {
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                color: '#333'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    };

    const changePeriod = (period) => {
      selectedPeriod.value = period;
      updateChart();
    };

    onMounted(() => {
      updateChart();
    });

 

    return {
      selectedPeriod,
      periods,
      periodLabels,
      changePeriod,
      chartCanvas
    };
  }
};
</script>

<style scoped>
.stock-chart-container {
  margin-top: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
}

.chart-period-buttons {
  margin-bottom: 15px;
}

.chart-period-buttons button {
  font-weight: bold;
  padding: 8px 16px;
  margin-right: 10px;
  border: 1px solid #ffcc00;
  background-color: #ffffff;
  color: #333;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
}

.chart-period-buttons button.active {
  background-color: #ffcc00;
}

.stock-chart {
  height: 400px;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
}

@media (max-width: 768px) {
  .chart-period-buttons button {
    padding: 6px 12px;
    margin-right: 5px;
    font-size: 14px;
  }
}
</style>