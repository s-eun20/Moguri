<template>
  <div class="trade-form">
    <div class="trade-buttons">
      <button :class="['buy', { active: tradeType === 'buy' }]" @click="setTradeType('buy')">매수</button>
      <button :class="['sell', { active: tradeType === 'sell' }]" @click="setTradeType('sell')">매도</button>
      <button :class="['history', { active: showingHistory }]" @click="showHistory">거래내역</button>
    </div>
    <div v-if="!showingHistory" class="form">
      <div class="form-group">
        <label>주문수량</label>
        <input type="number" v-model="orderQuantity" />
      </div>
      <div class="form-group">
        <label>{{ tradeType === 'buy' ? '매수가격' : '매도가격' }}</label>
        <input type="text" v-model="orderPrice"/>
      </div>
      <div class="form-group">
        <label>주문총액</label>
        <input type="number" :value="totalPrice" disabled />
      </div>
    </div>
    <div v-else class="history-list">
      <h3>거래내역</h3>
      <ul>
        <li v-for="(trade, index) in tradeHistory" :key="index">
          <div class="trade-info">
            <span class="trade-date">{{ trade.date }}</span>
            <span class="trade-stock">{{ trade.stockName }}</span>
          </div>
          <div class="trade-details">
            <span :class="['trade-type', trade.type]">
              {{ trade.type === 'buy' ? '매수' : '매도' }}
            </span>
            <span class="trade-quantity">{{ trade.quantity }}주</span>
            <span class="trade-price">{{ trade.price.toLocaleString() }}원</span>
          </div>
          <div class="trade-total">
            {{ (trade.quantity * trade.price).toLocaleString() }}원
          </div>
        </li>
      </ul>
    </div>
    <div v-if="!showingHistory" class="form-actions">
      <button @click="resetForm">초기화</button>
      <button @click="placeOrder">{{ tradeType === 'buy' ? '매수' : '매도' }}</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentPrice: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      tradeType: 'buy',
      orderQuantity: 0,
      orderPrice: 0, // 초기값을 0으로 설정
      showingHistory: false,
      tradeHistory: [
        { type: 'buy', stockName: '삼성전자', quantity: 10, price: 63000, date: '2023-05-01' },
        { type: 'sell', stockName: '삼성전자', quantity: 5, price: 63500, date: '2023-05-02' },
        { type: 'buy', stockName: 'SK하이닉스', quantity: 20, price: 120000, date: '2023-05-03' }
      ]
    };
  },
  computed: {
    totalPrice() {
      return this.orderQuantity * this.orderPrice;
    }
  },
  mounted() {
    // 로컬 스토리지에서 selectedStock 불러오기
    const savedStock = localStorage.getItem('selectedStock');
    if (savedStock) {
      const stockData = JSON.parse(savedStock);
      this.orderPrice = stockData.currentPrice; // selectedStock의 currentPrice로 초기화
    } else {
      this.orderPrice = this.currentPrice; // 기본값으로 currentPrice 설정
    }
    console.log("Current Price in TradeForm.vue:", this.orderPrice); 
  },
 
  methods: {
    setTradeType(type) {
      this.tradeType = type;
      this.showingHistory = false;
    },
    resetForm() {
      this.orderQuantity = 0;
      this.orderPrice = this.currentPrice; 
    },
    placeOrder() {
      const trade = {
        type: this.tradeType,
        quantity: this.orderQuantity,
        price: this.orderPrice,
        stockName: '삼성전자', // 예시로 삼성전자로 고정
        date: new Date().toISOString().split('T')[0] // 현재 날짜
      };
      this.tradeHistory.push(trade);
      // 여기에 실제 주문 처리 로직을 추가할 수 있습니다.
      this.$emit('updateBalance', this.newBalance);
      this.resetForm();
      // 주문 가격을 로컬 스토리지에 저장
      localStorage.setItem('orderPrice', this.orderPrice);
    },
    showHistory() {
      this.showingHistory = !this.showingHistory;
      if (this.showingHistory) {
        this.tradeType = null;
      }
    }
  },
  
  watch: {
    currentPrice(newPrice) {
      this.orderPrice = newPrice; 
    }
  }
}
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
}

.buy, .sell, .history {
  background-color: #f7ea81;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.buy:hover, .sell:hover, .history:hover {
  background-color: #f5e456;
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
  font-size :23px;
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
  background-color: #ffe3ae;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.trade-buttons button.active {
  opacity: 0.7;
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
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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

.trade-type.buy {
  background-color: #e6f7ff;
  color: #1890ff;
}

.trade-type.sell {
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

@media (max-width: 768px) {
  .trade-details {
    flex-direction: column;
    align-items: flex-start;
  }

  .trade-type, .trade-quantity, .trade-price {
    margin-bottom: 5px;
  }
}
</style>