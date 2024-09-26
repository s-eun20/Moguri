<template>
    <div class="ranking-page">
      <h1 class="page-title">투자 랭킹</h1>
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
          { name: '하기싫다#123', profitRate: 125 },
          { name: '개발하고싶다#1', profitRate: 111 },
          { name: '잡자자#123', profitRate: 96 },
          { name: '으어어어어어#123', profitRate: 55 },
          { name: 'ㅁㅇㅇㅇㅇㅇ#123', profitRate: 53 },
          { name: 'ㅂㅈㄷㄱ#123', profitRate: 41 },
          { name: 'ㅂㅈㄷㄱ#123', profitRate: 21 }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .ranking-page {
    padding: 30px;
    max-width: 1400px;
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
