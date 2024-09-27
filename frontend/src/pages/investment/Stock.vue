<template>
  <div class="stock-page">
      <div class="header">
    <header class="page-title">매도/매수</header>
  </div>
  <div class="content">
    <div class="left-content">
      <StockSearch @select-stock="handleStockSelect" />
      <StockChart :stockName="selectedStock?.name || '샘플 주식'" />
    </div>
    <TradeForm :balance="balance" @updateBalance="updateBalance" class="trade-form" />
  </div>
  <div class="stock-info">
    <h2>보유주식</h2>
    <table>
      <thead>
        <tr>
          <th>종목명</th>
          <th>평가손익</th>
          <th>수익률</th>
          <th>잔고수량</th>
          <th>매입가</th>
          <th>현재가</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>삼성</td>
          <td>-40,000</td>
          <td>-20%</td>
          <td>20</td>
          <td>20,000</td>
          <td>14,000</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
import { ref } from 'vue';
import StockSearch from '@/components/Invest/StockSearch.vue';
import StockChart from '@/components/Invest/StockChart.vue';
import TradeForm from '@/components/Invest/TradeForm.vue';

export default {
components: {
  StockSearch,
  StockChart,
  TradeForm
},
setup() {
  const selectedStock = ref(null);

  const handleStockSelect = (stock) => {
    selectedStock.value = stock;
  };

  return {
    selectedStock,
    handleStockSelect,
    balance: 100000,
    profitRate: 0
  };
},
methods: {
  updateBalance(newBalance) {
    this.balance = newBalance;
  },
  handleStockSelect(stock) {
    this.selectedStock = stock;
    // 여기에서 선택된 주식에 대한 추가 작업을 수행할 수 있습니다.
    // 예: 차트 업데이트, 거래 폼에 정보 전달 등
  }
}
}
</script>

<style scoped>
.stock-page {
padding: 30px;
max-width: 1400px;
margin: 0 auto;
font-family: 'HakgyoansimWoojuR';
font-weight: bold;
}

.page-title {
width: 1400px;
font-size: 28px;
font-weight: 600;
color: #000000;
margin-bottom: 30px;
padding-bottom: 15px;
border-bottom: 2px solid #ffcc00;
}

.header {
display: flex;
}

.content {
display: flex;
gap: 30px;
height: 500px; 
}

.left-content {
display: flex;
flex-direction: column;
gap: 20px;
flex: 3; 
}

.stock-info {
margin-top: 30px;
width: 100%;
}

table {
width: 100%;
border-collapse: collapse;
}

th, td {
padding: 10px;
text-align: center;
border: 1px solid #D5DBDB;
}

th {
background-color: #F7DC6F;
}

td {
background-color: #FCF3CF;
}

.stock-chart {
flex-grow: 1;
min-height: 0; 
}

.trade-form {
flex: 1;
height: 100%;
}

@media (max-width: 768px) {
.stock-page {
  padding: 15px;
}

.page-title {
  font-size: 24px;
  width: 100%;
}

.content {
  height: auto;
  flex-direction: column;
}

.left-content, .trade-form {
  width: 100%;
  height: auto;
}

.stock-chart {
  height: 300px; /* 모바일에서의 차트 높이 */
}
}
</style>
