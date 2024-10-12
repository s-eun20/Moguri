<template>
  <div class="investment-ranking">
    <h2 class="page-title">이달의 투자왕 👑</h2>
    <div class="top-three">
      <div class="rank-container" v-if="sortedRankingData.length > 0">
        <div class="rank rank-1">1</div>
        <div class="member-name">{{ sortedRankingData[0]?.nickName || '-' }}</div>
        <div class="profit-rate">{{ sortedRankingData[0]?.profitPercentage || 0 }}%</div>
      </div>
      <div class="rank-container" v-if="sortedRankingData.length > 1">
        <div class="rank rank-2">2</div>
        <div class="member-name">{{ sortedRankingData[1]?.nickName || '-' }}</div>
        <div class="profit-rate">{{ sortedRankingData[1]?.profitPercentage || 0 }}%</div>
      </div>
      <div class="rank-container" v-if="sortedRankingData.length > 2">
        <div class="rank rank-3">3</div>
        <div class="member-name">{{ sortedRankingData[2]?.nickName || '-' }}</div>
        <div class="profit-rate">{{ sortedRankingData[2]?.profitPercentage || 0 }}%</div>
      </div>
    </div>
    <table class="ranking-table">
      <thead>
        <tr>
          <th>순위</th>
          <th>회원명</th>
          <th>수익률</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sortedRankingData.slice(3)" :key="index">
          <td>{{ index + 4 }}</td> <!-- Start ranking from 4 -->
          <td>{{ item.nickName }}</td>
          <td>{{ item.profitPercentage }}%</td>
        </tr>
      </tbody>
    </table>
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

.page-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.top-three {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-top: 50px;
}

.rank-container {
  
  margin: 0 10px;
  
}

.rank-container:hover {
  transform: scale(1.05);
}

.member-name {
  font-size: 18px;
  font-weight: bold;
  margin-top: 5px;
  text-align: center;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profit-rate {
  font-size: 16px;
  margin-top: 5px;
  color: #666;
  text-align: center;
}

.rank {
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  border-radius: 50%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.rank-1 {
  background-color: #ffd700; /* Gold */
}

.rank-2 {
  background-color: #c0c0c0; /* Silver */
}

.rank-3 {
  background-color: #cd7f32; /* Bronze */
}

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 60px;
}

.ranking-table th,
.ranking-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.ranking-table th {
  background-color: #f0f0f0;
  color: #333;
  font-weight: 600;
}

.ranking-table td {
  background-color: #ffffff;
  transition: background-color 0.3s;
}

.ranking-table tr:hover td {
  background-color: #f1f1f1; /* Hover effect for rows */
}

@media (max-width: 768px) {
  .investment-ranking {
    padding: 15px;
  }

  .rank {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }

  .ranking-table th,
  .ranking-table td {
    padding: 10px;
    font-size: 14px;
  }

  .member-name {
    font-size: 12px;
    max-width: 80px;
  }

  .profit-rate {
    font-size: 12px;
  }
}
</style>