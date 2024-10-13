<template>
  <div class="ranking-page">
    <Fireworks /> <!-- Add the Fireworks component here -->
    <h1 class="page-title">
      이달의 투자왕 👑
      <div class="moguri-container">
        <div class="speech-bubble">
          <p>순위에 따라 리워드가 차등 지급된다구리! 🎉 모두모두 축하한다구리!</p>
        </div>
        <img src="@/assets/img/Moguri.png" alt="Moguri" class="moguri-image" />
      </div>
    </h1>
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
.content-wrapper {
  margin: 0 auto;
}
.page-title {
  display: flex;
  justify-content: space-between; /* 양쪽 끝으로 정렬 */
  align-items: center; /* 수직 정렬 */
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
}

.moguri-container {
  display: flex;
  align-items: center; /* 수직 정렬 */
}

.moguri-image {
  width: 100px; /* 원하는 크기로 조정 */
  height: auto;
  margin-right: 10px; /* 이미지와 말풍선 간격 */
}

.speech-bubble {
  background: #fff;
  
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  text-align: center;
  white-space: nowrap;
}
@media (max-width: 768px) {
  .ranking-page {
    width: 90%; /* 모바일에서 페이지 너비 조정 */
    padding: 15px;
  }

  .page-title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .moguri-image {
    width: 80px; /* 모바일에서 이미지 크기 조정 */
  }

  .speech-bubble {
    font-size: 14px; /* 모바일에서 글자 크기 조정 */
    max-width: 90%; /* 모바일에서 최대 너비 조정 */
  }
}
</style>