<template>
  <div class="income-expense-page">
    <h1 class="page-title">룰렛 돌리기</h1>
    
    <div class="content-wrapper">
      <div class="Roulette-container">
        <div class="roulette-game">
          <RouletteGame/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import RouletteGame from '@/components/Event/RouletteGame.vue';

  export default {
    components: {
      RouletteGame,
    },
  }
</script>

<style scoped>
    .income-expense-page {
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
      border-bottom: 2px solid #FFCC00;
    }
  
    .content-wrapper {
      display: flex;
      gap: 30px;
      margin-top: 30px;
    }
  
    .Roulette-container {
      position: relative;
      flex: 1;
      width: calc(50% - 15px); /* 간격의 절반을 뺀 50% */
      height: 450px; /* 고정 높이 설정 */
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 20px;
      overflow: hidden;
    }

    .roulette-game {
      position: absolute;
      top: 50px;
      left: 0%;
      width: 100%;
      height: 100%;
    }

</style>