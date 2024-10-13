<template>
  <div class="trade-form">
    <div class="trade-buttons">
      <button :class="['buy', { active: tradeType === 'BUY' }]" @click="setTradeType('BUY')">매수</button>
      <button :class="['sell', { active: tradeType === 'SELL' }]" @click="setTradeType('SELL')">매도</button>
      <button :class="['history', { active: showingHistory }]" @click="showHistory">거래내역</button>
    </div>
    <div v-if="!showingHistory" class="form">
      <div class="form-group">
        <label>주문수량</label>
        <input type="number" v-model="orderQuantity" @input="validateQuantity" />
      </div>
      <div class="form-group">
        <label>{{ tradeType === 'BUY' ? '매수가격' : '매도가격' }}</label>
        <input type="text" v-model="orderPrice" />
      </div>
      <div class="form-group">
        <label>주문총액</label>
        <input type="number" :value="totalPrice" disabled />
      </div>
    </div>
    <div v-else class="history-list">
      <h3>거래내역</h3>
      <ul>
        <li v-for="(trade, index) in paginatedTrades" :key="index">
          <div class="trade-info">
            <span class="trade-date">{{ trade.tradeAt }}</span>
            <span class="trade-stock">{{ trade.stockNameKR }}</span>
          </div>
          <div class="trade-details">
            <span :class="['trade-type', trade.tradeType]">
              {{ trade.tradeType === 'BUY' ? '매수' : '매도' }}
            </span>
            <span class="trade-quantity">{{ trade.quantity }}주</span>
            <span class="trade-price">{{ trade.price }}원</span>
          </div>
          <div class="trade-total">
            {{ trade.totalAmount }}원
          </div>
        </li>
      </ul>

      <!-- 페이지네이션 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">이전</button>
        <span>페이지 {{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
      </div>
    </div>
    <div v-if="!showingHistory" class="form-actions">
      <button class="reset" @click="resetForm">초기화</button>
      <button :class="tradeType === 'BUY' ? 'buy' : 'sell'" @click="placeOrder">
        {{ tradeType === 'BUY' ? '매수' : '매도' }}
      </button>
    </div>
  </div>
</template>

<script>
import { useStockStore } from '@/stores/stockStore'; // stockStore import

export default {
  props: {
    currentPrice: {
      type: Number,
      required: true
    },
    stockCode: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      tradeType: 'BUY',
      orderQuantity: 1,
      orderPrice: 0,
      showingHistory: false,
      tradeHistory: [],
      currentPage: 1,
      itemsPerPage: 4,
    };
  },
  computed: {
    totalPrice() {
      return this.orderQuantity * this.orderPrice;
    },
    totalPages() {
      return Math.ceil(this.tradeHistory.length / this.itemsPerPage);
    },
    paginatedTrades() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.tradeHistory.slice(start, start + this.itemsPerPage);
    }
  },
  async mounted() {
    const savedStock = localStorage.getItem('selectedStock');
    const stockStore = useStockStore(); 
    if (savedStock) {
      const stockData = JSON.parse(savedStock);
      this.orderPrice = stockData.currentPrice; 
      await stockStore.fetchTradeHistory(stockData.stockCode); 
      this.tradeHistory = stockStore.tradeHistory; 
      console.log('Trade history on mount:', this.tradeHistory); 
    } else {
      this.orderPrice = this.currentPrice; // 기본값으로 currentPrice 설정
    }
  },
  methods: {
    setTradeType(type) {
      this.tradeType = type;
      this.showingHistory = false;
    },
    resetForm() {
      this.orderQuantity = 1; // 최소 1로 설정
      this.orderPrice = this.currentPrice; 
    },
    async placeOrder() {
      const confirmation = confirm(`${this.tradeType === 'BUY' ? '매수' : '매도'} 하시겠습니까?\n\n` +
        `가격: ${this.orderPrice.toLocaleString()}원\n` + // 실시간 금액 반영
        `수량: ${this.orderQuantity}주`);
      
      if (!confirmation) {
        return; // 사용자가 취소하면 함수 종료
      }
      const stockStore = useStockStore(); 
      const trade = {
        quantity: this.orderQuantity,
        price: this.orderPrice,
        totalAmount: this.totalPrice
      };

      // 매수 또는 매도 처리
      if (this.tradeType === 'BUY') {
        await stockStore.buyStock(this.stockCode, trade); 
        console.log(this.stockCode);
      } else {
        await stockStore.sellStock(this.stockCode, trade); 
      }

      // Fetch trade history after placing the order
      await stockStore.fetchTradeHistory(this.stockCode); 
      this.tradeHistory = stockStore.tradeHistory; // Update local tradeHistory
      console.log('Updated trade history after order:', this.tradeHistory);

      this.resetForm();
      // 주문 가격을 로컬 스토리지에 저장
      localStorage.setItem('orderPrice', this.orderPrice);
      localStorage.setItem('stockCode', this.stockCode);
      await stockStore.fetchHoldings();
      this.$emit('refreshHoldings');
    },
    showHistory() {
      this.showingHistory = !this.showingHistory;
      if (this.showingHistory) {
        this.tradeType = null;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    async updateTradeHistory() {
      const stockStore = useStockStore(); 
      this.tradeHistory = stockStore.tradeHistory; // 로컬 거래내역 업데이트
      console.log('Updated trade history:', this.tradeHistory);
    },
    validateQuantity() {
      if (this.orderQuantity < 1) {
        this.orderQuantity = 1; // 최소 1로 설정
      }
    },
  },
  watch: {
    stockCode: {
      immediate: true,
      handler(newStockCode) {
        this.updateTradeHistory(newStockCode);
      }
    },
    currentPrice(newPrice) {
      this.orderPrice = newPrice; 
    }
  }
};
</script>

<style scoped>
.trade-form {
  background-color: #FFFFFF;
  border: 1px solid #D5DBDB;
  padding: 20px;
  border-radius: 10px;
  height: 786px;
  margin-top: 76px;
}

.trade-buttons {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.trade-buttons button {
  width: 30%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.buy {
  background-color: #b4e1ec; /* Sky blue for buy */
}

.sell {
  background-color: #f5c3c7; /* Red for sell */
}

.history {
  background-color: #f7ea81; /* Existing color for history */
}

.form {
  margin-bottom: 50px;
}

.form-group {
  margin-bottom: 30px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 23px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #D5DBDB;
  border-radius: 5px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.form-actions button {
  width: 45%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.reset {
  background-color: #ece9e3; 
}

.reset:hover {
  background-color: #ffd54f; 
}

.form-actions button.buy {
  background-color: #b4e1ec; /* Sky blue for buy */
}

.form-actions button.sell {
  background-color: #f5c3c7; /* Red for sell */
}

.form-actions button.buy:hover {
  background-color: #a0d3e0; 
}

.form-actions button.sell:hover {
  background-color: #f1b2b5; 
}

.history-list {
  margin-top: 20px;
}

.history-list h3 {
  font-size: 25px;
  margin-bottom: 15px;
  color: #333;
  font-weight: bold;
}

.history-list ul {
  list-style-type: none;
  padding: 0;
}

.history-list li {
  margin-bottom: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.trade-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.trade-date {
  font-size: 17px;
  color: #666;
}

.trade-stock {
  font-weight: bold;
  font-size: 20px;
  color: #333;
}

.trade-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.trade-type {
  font-weight: bold;
  padding: 3px 8px;
  border-radius: 4px;
}

.trade-type.BUY {
  background-color: #e9fafa;
  color: #5aa9bd;
}

.trade-type.SELL {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.trade-quantity {
  font-size: 20px;
  color: #333;
}

.trade-price {
  font-size: 17px;
  color: #e10202;
}

.trade-total {
  text-align: right;
  font-weight: bold;
  color: #026f1c;
  font-size: 16px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  margin: 0 10px;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.pagination button:disabled {
  background-color: #e0e0e0; /* 비활성화된 버튼 색상 */
  color: #a0a0a0; /* 비활성화된 버튼 텍스트 색상 */
  cursor: not-allowed; /* 커서 모양 변경 */
}

.pagination button:not(:disabled):hover {
  background-color: #007bff; /* 버튼 호버 색상 */
  color: white; /* 버튼 호버 시 텍스트 색상 */
}

.pagination span {
  font-size: 16px;
  margin: 0 10px;
  font-weight: bold;
}
</style>