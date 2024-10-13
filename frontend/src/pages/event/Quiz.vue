<template>
  <div class="quiz-page">
    <h1 class="quiz-title">오늘의 퀴즈</h1>
    
    <div class="quiz-content-wrapper">
      <div class="quiz-container">
        <ObjectiveQuiz />
      </div>
      <div class="quiz-container">
        <OxQuiz />
      </div>
      <div class="quiz-container">
        <SubjectiveQuiz />
      </div>
    </div>
  </div>
</template>


  
<script>
import ObjectiveQuiz from '@/components/Event/ObjectiveQuiz.vue';
import OxQuiz from '@/components/Event/OxQuiz.vue';
import SubjectiveQuiz from '@/components/Event/SubjectiveQuiz.vue';

export default {
  components: {
    ObjectiveQuiz,
    OxQuiz,
    SubjectiveQuiz,
  }
}
</script>

  
<style scoped>
.quiz-page {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'HakgyoansimWoojuR';
  font-weight: bold;
}

.quiz-title {
  font-size: 28px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ffcc00;
}

.quiz-content-wrapper {
  display: flex;
  gap: 30px;
  margin-top: 30px;
}

.quiz-container {
  flex: 1;
  width: calc(50% - 15px); /* 간격의 절반을 뺀 50% */
  height: 500px; /* 고정 높이 설정 */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow: auto;
}
.quiz-btn {
  display: flex;
  justify-content: space-between;
  width: 30%; /* Ensure buttons take full width of modal */
  margin: 20px auto 0; /* Add space above buttons */
}
button {
  background-color: #ffd698;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  flex: 1;
  margin: 0 5px;
}
.quiz-message {
  margin: 20px auto 0;
  text-align: center;
}

@media (max-width: 1024px) {
  .quiz-content-wrapper {
    flex-direction: column;
  }
}
</style>