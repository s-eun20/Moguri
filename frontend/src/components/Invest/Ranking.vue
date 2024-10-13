<template>
  <div class="investment-ranking">
    <div class="top-three">
      <div class="rank-item rank-1" v-if="sortedRankingData.length > 0">
        <div class="rank-info">
          <span class="rank">1</span>
          <span class="member-name">{{ sortedRankingData[0]?.nickName || '-' }}</span>
          <span class="profit-rate">{{ sortedRankingData[0]?.profitPercentage || 0 }}%</span>
        </div>
        <span class="reward">리워드: 100,000원</span>
      </div>
      <div class="rank-item rank-2" v-if="sortedRankingData.length > 1">
        <div class="rank-info">
          <span class="rank">2</span>
          <span class="member-name">{{ sortedRankingData[1]?.nickName || '-' }}</span>
          <span class="profit-rate">{{ sortedRankingData[1]?.profitPercentage || 0 }}%</span>
        </div>
        <span class="reward">리워드: 50,000원</span>
      </div>
      <div class="rank-item rank-3" v-if="sortedRankingData.length > 2">
        <div class="rank-info">
          <span class="rank">3</span>
          <span class="member-name">{{ sortedRankingData[2]?.nickName || '-' }}</span>
          <span class="profit-rate">{{ sortedRankingData[2]?.profitPercentage || 0 }}%</span>
        </div>
        <span class="reward">리워드: 30,000원</span>
      </div>
    </div>
    <div class="ranking-cards">
      <div v-for="(item, index) in sortedRankingData.slice(3)" :key="index" class="rank-item">
        <div class="rank-info">
          <span class="rank">{{ index + 4 }}</span>
          <span class="member-name">{{ item.nickName }}</span>
          <span class="profit-rate">{{ item.profitPercentage }}%</span>
        </div>
        <span class="reward">리워드: 10,000원</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    rankingData: {
      type: Array,
      required: true
    }
  },
  computed: {
    sortedRankingData() {
      return this.rankingData.sort((a, b) => b.profitPercentage - a.profitPercentage); // Sort by profitPercentage in descending order
    }
  }
}
</script>

<style scoped>
.investment-ranking {
  width: 100%;
}

.top-three {
  display: flex;
  flex-direction: column; /* 세로로 쌓이게 */
  align-items: flex-start; /* 왼쪽 정렬 */
  margin-top: 20px;
}

.rank-item {
  display: flex;
  justify-content: space-between; /* 양쪽 끝으로 정렬 */

  background-color: #f9f9f9; /* 카드 배경색 */
  border-radius: 10px; /* 카드 모서리 둥글게 */
  padding: 15px; /* 카드 내부 패딩 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 카드 그림자 */
  margin: 10px 0; /* 위아래 여백 */
  width: 100%; /* 카드 너비 */
  transition: transform 0.3s; /* 호버 효과 */
}

.rank-item:hover {
  transform: scale(1.02); /* 호버 시 확대 효과 */
}

/* 1, 2, 3위 강조 스타일 */
.rank-1 {
  background-color: #fff6c0; /* Gold */
}

.rank-2 {
  background-color: #e4e0e0; /* Silver */
}

.rank-3 {
  background-color: #f7dfc7; /* Bronze */
}

.rank-info {
  display: flex;
  align-items: center; /* 수직 정렬 */
}

.rank {
  font-size: 24px;
  font-weight: bold;
  margin-right: 10px; /* 순위와 이름 간격 */
  color: #ffbe0d; /* 순위 텍스트 색상 */
}

.member-name {
  font-size: 22px;
  font-weight: bold;
  margin-right: 10px; /* 이름과 수익률 간격 */
}

.profit-rate {
  font-size: 18px;
  color: #666;
  margin-right: 10px; /* 수익률과 리워드 간격 */
}

.reward {
  font-size: 18px;
  color: #a78528; /* 리워드 색상 */
  font-weight: bold;
}

.ranking-cards {
  display: flex;
  flex-direction: column; /* 세로로 쌓이게 */
  align-items: flex-start; /* 왼쪽 정렬 */
  margin-top: 20px; /* 카드 위 여백 */
}
</style>