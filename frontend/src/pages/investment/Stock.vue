<template>
  <div class="stock-page">
    <h1 class="page-title">매도/매수</h1>
    <div class="content-wrapper">
      <div class="stock-info-container">
        <StockInfo />
      </div>
      <div class="trade-form-container">
        <TradeForm />
      </div>
    </div>
    <div class="stock-holding-container">
      <StockHolding :stockName="'삼성전자'" :currentPrice="63300" />
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
  }
};
</script>

<style scoped>
.stock-page {
  padding: 30px;
  max-width: 1600px;
  margin: 0 auto;
  font-family: 'HakgyoansimWoojuR';
  font-weight: bold;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ffcc00;
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
