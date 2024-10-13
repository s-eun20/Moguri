<template>
    <div>
      <p class="subQuestion-div">
        Q. {{ questions.question }}
      </p>
      <div>
        <p>답 : 
          <input
            class="input"
            v-model="selectedAnswer"
            placeholder="정답을 입력하세요"
            :disabled="!canParticipate || isSubmitted"
            :class="{ 'disabled-input': !canParticipate || isSubmitted }"
          />
        </p>
      </div>
      <div v-if="!isSubmitted && canParticipate" class="quiz-btn">
        <button @click="checkAnswer" :disabled="!selectedAnswer">정답 확인</button>
      </div>
      <div v-else-if="!canParticipate && !isSubmitted" class="quiz-message">
        오늘은 퀴즈에 참여했습니다!
      </div>
      <div v-if="isSubmitted" class="quiz-message">
        <span>
          <img src="../../assets/img/cottoncandy.png" width="30px"/>
          {{ isCorrect ? "정답입니다!" : "틀렸습니다." }} 솜사탕 {{ rewardPoint }}개를 획득하셨습니다!
        </span>
      </div>
    </div>
  </template>
  
<script>
  import { useQuizStore } from '../../stores/quizStore.js';
  import { useAuthStore } from '@/stores/auth'; // auth 스토어 추가
  import { computed, onMounted, ref } from 'vue';
  import axios from 'axios';
  
  export default {
    setup() {
      const quizStore = useQuizStore();
      const authStore = useAuthStore(); // auth 스토어 사용
      const selectedAnswer = ref('');
      const isSubmitted = ref(false);
      const isCorrect = ref(false);
      const rewardPoint = ref(0);
      const canParticipate = ref(true);

      const memberId = computed(() => authStore.state.user.memberId); // computed로 memberId 가져오기

  
      const quiz = computed(() => quizStore.subjectQuiz);
  
      const questions = computed(() => ({
        question: quiz.value ? quiz.value.question : '',
        correctAnswer: quiz.value ? quiz.value.answer : '',
      }));
  
      onMounted(async () => {
        await quizStore.fetchSubjectQuiz(3);
        checkParticipation();
      });
  
      const checkParticipation = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/quiz/part/${memberId.value}/3`);
          canParticipate.value = !response.data.data.partPlay;
        } catch (error) {
          console.error('Error checking participation:', error);
        }
      };

      const checkAnswer = async () => {
        isCorrect.value = selectedAnswer.value.trim().toLowerCase() === questions.value.correctAnswer.trim().toLowerCase();
        rewardPoint.value = isCorrect.value ? 5000 : 0;
        isSubmitted.value = true;

        try {
          await axios.post('http://localhost:8080/api/quiz/part', {
            memberId: memberId.value,
            quizType: 3
          });
          canParticipate.value = false;

          if (isCorrect.value) {
            await authStore.updateCottonCandy(rewardPoint.value);
          }
        } catch (error) {
          console.error('Error submitting quiz participation:', error);
        }
      };
  
      return {
        selectedAnswer,
        isSubmitted,
        isCorrect,
        rewardPoint,
        canParticipate,
        questions,
        checkAnswer,
        memberId, // memberId를 반환값에 추가
      };
    }
  }
  </script>
  
  <style src='./SubjectiveQuiz.css' scoped>
  </style>