<template>
    <div class="stock-holdings">
      <h3>보유주식</h3>
      <table>
        <thead>
          <tr>
            <th>종목명</th>
            <th>평가손익</th>
            <th>수익률</th>
            <th>수량</th>
            <th>잔고수량</th>
            <th>매입가</th>
            <th>현재가</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="currentPrice !== null">
            <td>{{ stockName }}</td>
            <td :class="{ 'positive': evaluationProfit > 0, 'negative': evaluationProfit < 0 }">
              {{ evaluationProfit.toLocaleString() }}
            </td>
            <td :class="{ 'positive': profitRate > 0, 'negative': profitRate < 0 }">
              {{ profitRate.toFixed(2) }}%
            </td>
            <td>{{ quantity }}</td>
            <td>{{ balanceQuantity }}</td>
            <td>{{ purchasePrice.toLocaleString() }}</td>
            <td>{{ currentPrice.toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: 'StockHoldings',
    props: {
      stockName: {
        type: String,
        default: ''
      },
      currentPrice: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        quantity: 100,
        balanceQuantity: 100,
        purchasePrice: 62000
      }
    },
    computed: {
      evaluationProfit() {
        return this.currentPrice !== null ? (this.currentPrice - this.purchasePrice) * this.quantity : 0;
      },
      profitRate() {
        return this.currentPrice !== null ? ((this.currentPrice - this.purchasePrice) / this.purchasePrice) * 100 : 0;
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

.stock-holdings tr:nth-child(even) {
  background-color: #f9f9f9;
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
