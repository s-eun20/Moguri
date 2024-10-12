import { defineStore } from 'pinia';
import axios from 'axios';

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    quizzes: [],
    objectQuiz: {},
    oxQuiz: {},
    subjectQuiz: {},
  }),
  actions: {
    async fetchQuizzes() {
      try {
        const response = await axios.get('http://localhost:8080/api/quiz');
        this.quizzes = response.data;
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    },
    async fetchObjectQuiz(id) {
      try {
        const response = await axios.get(`http://localhost:8080/api/quiz/${id}`);
        console.log('Object Quiz');
        this.objectQuiz = response.data.data;
      } catch (error) {
        console.error('Error fetching object quiz:', error);
      }
    },
    async fetchOxQuiz(id) {
      try {
        const response = await axios.get(`http://localhost:8080/api/quiz/${id}`);
        console.log('OX Quiz');
        this.oxQuiz = response.data.data;
      } catch (error) {
        console.error('Error fetching ox quiz:', error);
      }
    },
    async fetchSubjectQuiz(id) {
      try {
        const response = await axios.get(`http://localhost:8080/api/quiz/${id}`);
        console.log('Subject Quiz');
        this.subjectQuiz = response.data.data;
      } catch (error) {
        console.error('Error fetching subject quiz:', error);
      }
    },
  },
});