<template>
  <div class="quiz-page">
    <h1 class="quiz-title">오늘의 퀴즈</h1>
    
    <div class="quiz-content-wrapper">
      <div v-if="!quizStarted" class="quiz-start">
        <p>오늘의 퀴즈를 풀어보세요</p>
        <button @click="startQuiz" class="start-button">시작하기</button>
      </div>
      <div v-else-if="!hasParticipated" class="quiz-container-wrapper">
        <div class="quiz-container">
          <component :is="currentQuiz" @answer-selected="onAnswerSelected" />
          <div class="quiz-navigation">
            <button v-if="currentQuizIndex < 2" @click="nextQuiz" :disabled="!currentAnswer">다음</button>
            <button v-else @click="showResults" :disabled="!currentAnswer">결과 확인</button>
          </div>
        </div>
      </div>
      <div v-else-if="showResultMessage" class="quiz-result">
        <p>3문제 중 {{ correctAnswers }}개를 맞추셨어요!</p>
        <p>{{ earnedReward }} 솜사탕을 얻었어요!</p>
      </div>
      <div v-else class="quiz-message">
        오늘 퀴즈 이벤트에 참여하셨어요!
      </div>
    </div>
  </div>
</template>

<script>
  import { ref, computed, onMounted } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import axios from 'axios';
  import ObjectiveQuiz from '@/components/Event/ObjectiveQuiz.vue';
  import OxQuiz from '@/components/Event/OxQuiz.vue';
  import SubjectiveQuiz from '@/components/Event/SubjectiveQuiz.vue';

  export default {
    components: {
      ObjectiveQuiz,
      OxQuiz,
      SubjectiveQuiz,
    },
    setup() {
      const authStore = useAuthStore();
      const memberId = computed(() => authStore.state.user.memberId);
      const quizComponents = [ObjectiveQuiz, OxQuiz, SubjectiveQuiz];
      const currentQuizIndex = ref(0);
      const currentQuiz = computed(() => quizComponents[currentQuizIndex.value]);
      const answers = ref([]);
      const currentAnswer = ref(null);
      const hasParticipated = ref(false);
      const showResultMessage = ref(false);
      const correctAnswers = ref(0);
      const earnedReward = ref(0);
      const quizStarted = ref(false);

      const startQuiz = () => {
        quizStarted.value = true;
      };


      const nextQuiz = () => {
        answers.value.push(currentAnswer.value);
        currentAnswer.value = null;
        currentQuizIndex.value++;
      };

      const onAnswerSelected = (answer) => {
        currentAnswer.value = answer;
      };

      const showResults = async () => {
        answers.value.push(currentAnswer.value);
        correctAnswers.value = answers.value.filter(answer => answer.isCorrect).length;
        earnedReward.value = correctAnswers.value * 5000;
        showResultMessage.value = true;

        try {
          await axios.post('http://localhost:8080/api/quiz/part', {
            memberId: memberId.value,
            quizType: 1
          });
          await authStore.updateCottonCandy(earnedReward.value);
          hasParticipated.value = true;
        } catch (error) {
          console.error('Error submitting quiz participation:', error);
        }
      };

      onMounted(async () => {
          try {
          const response = await axios.get(`http://localhost:8080/api/quiz/part/${memberId.value}/1`);
          hasParticipated.value = response.data.data.partPlay;
        } catch (error) {
          console.error('Error checking participation:', error);
        }
      });

      return {
        currentQuiz,
        currentQuizIndex,
        nextQuiz,
        showResults,
        onAnswerSelected,
        currentAnswer,
        hasParticipated,
        showResultMessage,
        correctAnswers,
        earnedReward,
        quizStarted,
        startQuiz,
      };
    }
  }
</script>

<style scoped>

.quiz-start {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 24px;
  width: 100%;
  height: 450px;
}

.start-button {
  background-color: #ffd698;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
}

.quiz-page {
  padding: 20px;
  font-family: 'HakgyoansimWoojuR';
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 변경: center에서 flex-start로 */
  background: linear-gradient(135deg, rgb(255, 132, 0), rgb(255, 220, 0));
}

.quiz-title {
  font-size: 28px;
  font-weight: 600;
  color: #000000;
  text-align: left; /* 변경: center에서 left로 */
  align-self: flex-start; /* 추가: 왼쪽 정렬을 위해 */
  width: 100%; /* 추가: 전체 너비를 사용하도록 */
  margin-top: 30px; /* 이 줄을 추가합니다 */
  margin-left: 12%; /* 이 줄을 추가합니다 */
}

.quiz-content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(100% + 100px);
  max-width: 550px;
  margin-top: 30px;
  margin-left: -50px;
  align-self: center;
  background-image: url('@/assets/img/memo.png');
  background-size: calc(100% - 50px) calc(100% + 130px); /* 배경 이미지 높이를 50px 증가 */
  background-repeat: no-repeat;
  background-position: center;
  padding: 65px 95px 90px; /* 하단 패딩을 25px 증가 */
  min-height: calc(100% + 100px); /* 최소 높이를 50px 더 증가 */
  position: relative;
  border-radius: 20px; /* 이 줄을 추가합니다 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); /* 이 줄을 추가합니다 */

}

.quiz-container-wrapper {
  width: 100%;
  position: relative;
  z-index: 1;
}

.quiz-container {
  width: 100%;
  background-color: transparent;
  border-radius: 8px;
  padding: 20px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 0;
}

.quiz-navigation {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.quiz-navigation button {
  background-color: #ffd698;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
}

.quiz-navigation button:disabled {
  background-color: #c8c8c8;
  cursor: not-allowed;
}

.quiz-result, .quiz-message {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 24px;
  width: 100%;
  height: 450px;
  position: relative;
  z-index: 1;
}

.quiz-result p, .quiz-message p {
  margin: 10px 0;
}

@media (max-width: 1024px) {
  .quiz-content-wrapper {
    width: calc(90% + 100px);
    background-size: calc(100% - 50px) calc(100% + 50px); /* 배경 이미지 높이를 50px 증가 */
    padding: 45px 85px 70px; /* 하단 패딩을 25px 증가 */
    margin-left: -50px;
  }

  .quiz-container-wrapper {
    margin-bottom: 30px;
  }
}
</style>