<template>
  <div class="quiz-wrapper">
    <div class="quiz-content">
      <p class="objectQuestion-div">
        Q. {{ questions.question }}
      </p>
      <div class="answer-options">
        <label
          :for="key"
          class="objectExample-label border"
          v-for="(answer, key) in questions.answers"
          :key="key"
          :class="{
            'cursor-pointer': true,
            'example-label-orange': selectedAnswer === key,
            'hover:example-label-gray': selectedAnswer !== key,
          }"
        >
          <input
            type="radio"
            :id="key"
            class="hidden"
            :value="key"
            v-model="selectedAnswer"
            @change="emitAnswer"
          />
          {{ answer }}
        </label>
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

      const emitAnswer = () => {
        emit('answer-selected', {
          answer: selectedAnswer.value,
          isCorrect: selectedAnswer.value === questions.value.correctAnswer
        });
      };

      watch(selectedAnswer, emitAnswer);

      onMounted(async () => {
        await quizStore.fetchObjectQuiz(1);
      });

      return {
        selectedAnswer,
        questions,
      };
    }
  }
</script>

<style src='./ObjectiveQuiz.css' scoped>
</style>