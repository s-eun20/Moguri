<template>
  <div class="investment-ranking">
    <h2 class="section-title">이달의 투자왕 <span class="crown">👑</span></h2>
    <div class="top-three">
      <div class="rank-container">
        <div class="member-name">{{ rankingData[1]?.name || '-' }}</div>
        <div class="rank rank-2">2</div>
        <div class="profit-rate">{{ rankingData[1]?.profitRate || 0 }}%</div>
      </div>
      <div class="rank-container">
        <div class="member-name">{{ rankingData[0]?.name || '-' }}</div>
        <div class="rank rank-1">1</div>
        <div class="profit-rate">{{ rankingData[0]?.profitRate || 0 }}%</div>
      </div>
      <div class="rank-container">
        <div class="member-name">{{ rankingData[2]?.name || '-' }}</div>
        <div class="rank rank-3">3</div>
        <div class="profit-rate">{{ rankingData[2]?.profitRate || 0 }}%</div>
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
        <tr v-for="(item, index) in rankingData" :key="index">
          <td>{{ index + 4 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.profitRate }}%</td>
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
  }
}
</script>

<style scoped>
.investment-ranking {
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.ranking-container {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.section-title {
  font-size: 35px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.crown {
  font-size: 40px;
  margin-left: 5px;
}

.top-three {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: 30px;
}

.rank-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
}

.member-name {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  text-align: center;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profit-rate {
  font-size: 14px;
  margin-top: 5px;
}

.rank {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  border-radius: 50%;
}

.rank-1 {
  background-color: #ffd700;
  height: 70px;
  width: 70px;
  font-size: 24px;
}

.rank-2 {
  background-color: #c0c0c0;
}

.rank-3 {
  background-color: #cd7f32;
}

.ranking-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.ranking-table th,
.ranking-table td {
  padding: 12px;
  text-align: center;
}

.ranking-table th {
  background-color: #f0f0f0;
  color: #333;
  font-weight: 600;
}

.ranking-table td {
  background-color: #f9f9f9;
}

.ranking-table tr:nth-child(even) td {
  background-color: #f0f0f0;
}

@media (max-width: 768px) {
  .investment-ranking {
    padding: 15px;
  }

  .section-title {
    font-size: 16px;
  }

  .rank {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .rank-1 {
    height: 60px;
    width: 60px;
    font-size: 20px;
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
