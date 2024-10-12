<template>
  <div class="ranking-page">
    <Fireworks /> <!-- Add the Fireworks component here -->
    <div class="content-wrapper">
      <InvestmentRanking :rankingData="rankingData" />
    </div>
  </div>
</template>

<script>
import InvestmentRanking from '@/components/Invest/Ranking.vue';
import Fireworks from '@/components/Invest/Fireworks.vue'; // Import the Fireworks component
import { useStockStore } from '@/stores/stockStore'; // Import the stock store

export default {
  components: {
    InvestmentRanking,
    Fireworks 
  },
  data() {
    return {
      rankingData: [] 
    }
  },
  async created() {
    const stockStore = useStockStore(); 
    this.rankingData = await stockStore.fetchStockRanking(); 
  }
}
</script>

<style scoped>
.ranking-page {
  width: 70%;
  margin: 0 auto;
  padding: 20px;
  margin-top: 20px;
  font-family: 'HakgyoansimWoojuR';
  font-weight: bold;
}

.page-title {
  font-size: 35px;
  margin-bottom: 30px;
  color: #333;
  font-weight: bold;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .ranking-page {
    padding: 15px;
  }

  .page-title {
    font-size: 20px;
    margin-bottom: 15px;
  }
}
</style>