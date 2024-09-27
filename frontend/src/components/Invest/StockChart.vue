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
    const selectedPeriod = ref('day');
    const periods = ['day', 'week', 'month', 'year'];
    const periodLabels = {
      day: '일',
      week: '주',
      month: '월',
      year: '년'
    };
    const chartCanvas = ref(null);
    let chart = null;

    const generateDummyData = (days) => {
      const data = [];
      let price = 60000;
      for (let i = 0; i < days; i++) {
        const open = price + Math.random() * 2000 - 1000;
        const close = open + Math.random() * 2000 - 1000;
        const high = Math.max(open, close) + Math.random() * 1000;
        const low = Math.min(open, close) - Math.random() * 1000;
        data.push({
          x: new Date(2023, 0, i + 1).getTime(),
          o: open,
          h: high,
          l: low,
          c: close
        });
        price = close;
      }
      return data;
    };

    const updateChart = () => {
      const ctx = chartCanvas.value.getContext('2d');
      
      let data;
      switch(selectedPeriod.value) {
        case 'day':
          data = generateDummyData(30);
          break;
        case 'week':
          data = generateDummyData(12 * 7);
          break;
        case 'month':
          data = generateDummyData(12 * 30);
          break;
        case 'year':
          data = generateDummyData(365);
          break;
      }

      if (chart) {
        chart.destroy();
      }

      chart = new Chart(ctx, {
        type: 'candlestick',
        data: {
          datasets: [{
            label: props.stockName,
            data: data,
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
                unit: selectedPeriod.value === 'day' ? 'day' : 'month'
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
    };

    onMounted(() => {
      updateChart();
    });

    watch(selectedPeriod, () => {
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
