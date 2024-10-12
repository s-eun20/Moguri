<template>
  <div class="stock-holdings">
    <h3>보유주식</h3>
    <table>
      <thead>
        <tr>
          <th>종목코드</th>
          <th>종목명</th>
          <th>시장구분</th>
          <th>평가손익</th>
          <th>수익률</th>
          <th>수량</th>
          <th>매입가 평균</th>
          <th>현재가</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="stock in stockData" :key="stock.stockCode">
          <td @click="selectStock(stock)" style="cursor: pointer;">{{ stock.stockCode }}</td> <!-- 클릭 이벤트 추가 -->
          <td>{{ stock.nameKr }}</td>
          <td>{{ stock.marketType }}</td>
          <td :class="{ 'positive': evaluationProfit(stock) > 0, 'negative': evaluationProfit(stock) < 0 }">
            {{ evaluationProfit(stock).toLocaleString() }}
          </td>
          <td :class="{ 'positive': profitRate(stock) > 0, 'negative': profitRate(stock) < 0 }">
            {{ profitRate(stock).toFixed(2) }}%
          </td>
          <td>{{ stock.quantity }}</td>
          <td>{{ stock.averagePrice.toLocaleString() }}</td>
          <td>{{ stock.currentPrice ? stock.currentPrice.toLocaleString() : '로딩 중...' }}</td> <!-- 현재가 표시 -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useStockStore } from '@/stores/stockStore'; // stockStore import

export default {
  name: 'StockHoldings',
  data() {
    return {
      stockData: [] 
    }
  },
  async mounted() {
    await this.loadHoldings(); 
  },
  methods: {
    async loadHoldings() {
      const stockStore = useStockStore();
      await stockStore.fetchHoldings(); 
      this.stockData = stockStore.holdings; 

      for (const stock of this.stockData) {
        const currentPriceData = await stockStore.fetchCurrentPrice(stock.stockCode);
        stock.currentPrice = currentPriceData ? currentPriceData.currentPrice : null; // 현재가 저장
      }
    },
    selectStock(stock) {
      const selectedStock = {
        stockCode: stock.stockCode,
        stockNameKR: stock.nameKr, // nameKr을 stockNameKR로 변환
        marketType: stock.marketType,
        // 추가적으로 필요한 속성도 여기에 포함
      };
      this.$emit('select-stock', selectedStock); 
    },
    
    // 총금액 계산
    totalAmount(stock) {
      return stock.quantity * stock.averagePrice; // 수량 * 매입가
    },
    // 팔면 얻는 총금액 계산
    potentialTotalAmount(stock) {
      return stock.quantity * (stock.currentPrice || 0); // 수량 * 현재가
    },
    // 평가 손익 계산
    evaluationProfit(stock) {
      return this.potentialTotalAmount(stock) - this.totalAmount(stock); // 팔면 얻는 총금액 - 총금액
    },
    // 수익률 계산
    profitRate(stock) {
      const total = this.totalAmount(stock);
      return total > 0 ? (this.evaluationProfit(stock) / total) * 100 : 0; // 평가 손익 / 총금액 * 100
    },
    evaluationProfitClass(stock) {
      return this.evaluationProfit(stock) > 0 ? 'positive' : 'negative'; // 평가 손익이 증가하면 'positive', 감소하면 'negative'
    },
    // 수익률 클래스 계산
    profitRateClass(stock) {
      return this.profitRate(stock) > 0 ? 'positive' : 'negative'; // 수익률이 증가하면 'positive', 감소하면 'negative'
    }
  }
}
</script>

<style scoped>
.stock-holdings {
  margin-top: 30px;
}

.stock-holdings h3 {
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 10px;
}

.stock-holdings table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ddd;
}

.stock-holdings th, .stock-holdings td {
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
}

.stock-holdings th {
  background-color: #f2f2f2;
  font-weight: bold;
}
.positive {
  color: #92c5d1;/* 초록색 */
}

.negative {
  color: #c06e77;  /* 빨간색 */
}

@media (max-width: 768px) {
  .stock-holdings {
    overflow-x: auto;
  }
  
  .stock-holdings table {
    min-width: 600px;
  }
}
</style>