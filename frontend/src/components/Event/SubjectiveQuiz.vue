<template>
  <div class="quiz-wrapper">
    <div class="quiz-content">
      <p class="subQuestion-div">
        Q. {{ questions.question }}
      </p>
      <div class="answer-options">
        <input
          class="subExample-input border"
          v-model="selectedAnswer"
          placeholder="정답을 입력하세요"
          @input="emitAnswer"
          :class="{
            'hover:example-label-gray cursor-pointer': true,
          }"
        />
      </div>
    </div>
  </div>
</template>
  
<script>
  import { useQuizStore } from '../../stores/quizStore.js';
  import { computed, onMounted, ref, watch } from 'vue';

  export default {
    emits: ['answer-selected'],
    setup(props, { emit }) {
      const quizStore = useQuizStore();
      const selectedAnswer = ref('');

      const quiz = computed(() => quizStore.subjectQuiz);

      const questions = computed(() => ({
        question: quiz.value ? quiz.value.question : '',
        correctAnswer: quiz.value ? quiz.value.answer : '',
      }));

      const emitAnswer = () => {
        emit('answer-selected', {
          answer: selectedAnswer.value,
          isCorrect: selectedAnswer.value.trim().toLowerCase() === questions.value.correctAnswer.trim().toLowerCase()
        });
      };

      watch(selectedAnswer, emitAnswer);

      onMounted(async () => {
        await quizStore.fetchSubjectQuiz(3);
      });

      return {
        selectedAnswer,
        questions,
      };
    }
  }
</script>
  
  <style src='./SubjectiveQuiz.css' scoped>
  </style>