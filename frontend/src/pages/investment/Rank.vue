<template>
    <div class="ranking-page">
      <div class="content-wrapper">
        <InvestmentRanking :rankingData="rankingData" />
      </div>
    </div>
  </template>
  
  <script>
  import InvestmentRanking from '@/components/Invest/Ranking.vue';
  
  export default {
    components: {
      InvestmentRanking
    },
    data() {
      return {
        rankingData: [
          { name: 'user4', profitRate: 125 },
          { name: 'user5', profitRate: 111 },
          { name: 'user6', profitRate: 96 },
          { name: 'user7', profitRate: 55 },
          { name: 'user8', profitRate: 53 },
          { name: 'user9', profitRate: 41 },
          { name: 'user10', profitRate: 21 }
        ]
      }
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
  font-size : 35px;
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
