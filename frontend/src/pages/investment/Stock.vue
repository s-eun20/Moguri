<template>
  <div class="stock-page">
    <h1 class="page-title">매수/매도</h1>
    <div class="content-wrapper">
      <div class="stock-info-container">
        <StockInfo 
          ref="stockInfo"
          @updateCurrentPrice="updateCurrentPrice" 
          @updateStockCode="updateStockCode" 
          :selectedStock="selectedStock" 
        />
      </div>
      <div class="trade-form-container">
        <TradeForm 
          ref="tradeForm"
          :currentPrice="currentPrice" 
          :stockCode="stockCode" 
          @refreshHoldings="refreshHoldings" 
        />
      </div>
    </div>
    <div class="stock-holding-container">
      <StockHolding 
        ref="stockHoldings" 
        @select-stock="selectStock"
      />
    </div>
  </div>
</template>

<script>
import StockInfo from '@/components/Invest/StockInfo.vue';
import TradeForm from '@/components/Invest/TradeForm.vue';
import StockHolding from '@/components/Invest/StockHolding.vue';

export default {
  components: {
    StockInfo,
    TradeForm,
    StockHolding
  },
  data() {
    return {
      currentPrice: 0, 
      stockCode: '', 
      selectedStock: null 
    };
  },
  methods: {
    updateCurrentPrice(price) {
      this.currentPrice = price;
    },
    updateStockCode(code) {
      this.stockCode = code; 
    },
    async refreshHoldings() {
      await this.$refs.stockHoldings.loadHoldings(); 
    },
   selectStock(stock) {
      console.log("Selecting stock in parent:", stock);
      this.selectedStock = stock; 
      this.updateCurrentPrice(stock.currentPrice || 0); 
      this.updateStockCode(stock.stockCode); 
      this.$refs.stockInfo.selectStock(stock); 
      this.$refs.tradeForm.updateTradeHistory(stock.stockCode);
    }
  }
};
</script>

<style scoped>
.stock-page {
  width: 70%;
  margin: 0 auto;
  padding: 20px;
  font-family: 'HakgyoansimWoojuR';
  font-weight: bold;
  margin-top: 20px;
}

.page-title {
  font-size : 35px;
  margin-bottom: 30px;
  color: #333;
  font-weight: bold;
}

.content-wrapper {
  display: flex;
  gap: 20px;
}

.stock-info-container {
  flex: 3;
}

.trade-form-container {
  flex: 1;
}

@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }

  .stock-info-container,
  .trade-form-container {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .stock-page {
    padding: 15px;
  }

  .page-title {
    font-size: 20px;
    margin-bottom: 15px;
  }
}
</style>