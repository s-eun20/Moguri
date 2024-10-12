<template>
    <div>
      <p class="objectQuestion-div">
        Q. {{ questions.question }}
      </p>
      <div>
        <label
          :for="key"
          class="objectExample-label border"
          v-for="(answer, key) in questions.answers"
          :key="key"
          :class="{
            'hover:example-label-gray cursor-pointer': canParticipate && !isSubmitted,
            'example-label-orange': selectedAnswer === key,
            'disabled-label': !canParticipate || isSubmitted
          }"
        >
          <input
            type="radio"
            :id="key"
            class="hidden"
            :value="key"
            v-model="selectedAnswer"
            :disabled="!canParticipate || isSubmitted"
          />
          {{ answer }}
        </label>
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
  import { useAuthStore } from '@/stores/auth'; 
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
  
      const quiz = computed(() => quizStore.objectQuiz);
  
      const questions = computed(() => ({
        question: quiz.value ? quiz.value.question : '',
        answers: {
          a: quiz.value ? quiz.value.example1 : '',
          b: quiz.value ? quiz.value.example2 : '',
          c: quiz.value ? quiz.value.example3 : '',
          d: quiz.value ? quiz.value.example4 : '',
        },
        correctAnswer: quiz.value ? quiz.value.answer : '',
      }));
  
      onMounted(async () => {
        await quizStore.fetchObjectQuiz(1);
        checkParticipation();
      });
  
      const checkParticipation = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/quiz/part/${memberId.value}/1`);
          canParticipate.value = !response.data.data.partPlay;
        } catch (error) {
          console.error('Error checking participation:', error);
        }
      };

      const checkAnswer = async () => {
      if (selectedAnswer.value === '') {
        alert('답을 선택해주세요.');
        return;
      }

      isCorrect.value = selectedAnswer.value === questions.value.correctAnswer;
      rewardPoint.value = isCorrect.value ? 5000 : 0;
      isSubmitted.value = true;

      try {
        await axios.post('http://localhost:8080/api/quiz/part', {
          memberId: memberId.value,
          quizType: 1
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
  
  <style src='./ObjectiveQuiz.css' scoped>
  </style>