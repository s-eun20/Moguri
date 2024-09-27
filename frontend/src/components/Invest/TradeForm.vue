<template>
    <div class="trade-form">
      <div class="trade-buttons">
        <button :class="['buy', { active: tradeType === 'buy' }]" @click="setTradeType('buy')">매수</button>
        <button :class="['sell', { active: tradeType === 'sell' }]" @click="setTradeType('sell')">매도</button>
        <button class="history" @click="showHistory">거래내역</button>
      </div>
      <div v-if="!showingHistory" class="form">
        <div class="form-group">
          <label>주문수량</label>
          <input type="number" v-model="orderQuantity" />
        </div>
        <div class="form-group">
          <label>{{ tradeType === 'buy' ? '매수가격' : '매도가격' }}</label>
          <input type="number" v-model="orderPrice" />
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
            {{ trade.type === 'buy' ? '매수' : '매도' }} - {{ trade.quantity }}주 x {{ trade.price }}원
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
    data() {
      return {
        tradeType: 'buy',
        orderQuantity: 0,
        orderPrice: 0,
        showingHistory: false,
        tradeHistory: []
      };
    },
    computed: {
      totalPrice() {
        return this.orderQuantity * this.orderPrice;
      }
    },
    methods: {
      setTradeType(type) {
        this.tradeType = type;
        this.showingHistory = false;
      },
      resetForm() {
        this.orderQuantity = 0;
        this.orderPrice = 0;
      },
      placeOrder() {
        const trade = {
          type: this.tradeType,
          quantity: this.orderQuantity,
          price: this.orderPrice
        };
        this.tradeHistory.push(trade);
        // 여기에 실제 주문 처리 로직을 추가할 수 있습니다.
        this.$emit('updateBalance', this.newBalance);
        this.resetForm();
      },
      showHistory() {
        this.showingHistory = true;
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
    width: 500px;
  }
  
  .trade-buttons {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .trade-buttons button {
    width: 30%;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
  }
  
  .buy {
    background-color: #EC7063;
  }
  
  .sell {
    background-color: #5DADE2;
  }
  
  .history {
    background-color: #F5B041;
  }
  
  .form {
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 10px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
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
    background-color: #58D68D;
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
  
  .history-list ul {
    list-style-type: none;
    padding: 0;
  }
  
  .history-list li {
    margin-bottom: 10px;
    padding: 5px;
    background-color: #f0f0f0;
    border-radius: 5px;
  }
  </style>
