<template>
  <div class="element-bigcontainer">
  <div :style="{ backgroundImage: `url(${elementStore.backgroundImage})` }" class="element-container">
<!-- 헤더는 항상 표시 -->
<div class="header">
  <h6>☯ 음양 오행으로 알아보는 자산 관리 유형 테스트 ☯</h6>
</div>
<br>
<!-- 시작 섹션: showQuestions와 showResult가 false일 때만 표시 -->
<div
  class="start"
  v-if="!elementStore.showQuestions && !elementStore.showResult"
>
  <h1>나의 자산관리 방식은 <br>어떤 유형일까?</h1>
  <br />
  <img :class="['character', { 'started': elementStore.isStarted }]" src="../../assets/element/모구리캐릭터.png" alt="캐릭터">
  <button type="button" class="start-btn" @click="handleStartTest">
    시작하기
  </button>
</div>

 <div v-if="elementStore.showQuestions">
  <div class="progress mt-5">
    <div
      class="progress-bar"
      role="progressbar"
      :style="{ width: elementStore.progressWidth }"
      :aria-valuenow="elementStore.progressPercentage"
      aria-valuemin="0"
      aria-valuemax="100"
    ></div>
  </div>
  <br />
  <br />
  <br />
  <div class="d-flex flex-column" id="questionbox">
    <h4>{{ elementStore.questions[elementStore.currentQuestionIndex]?.question }}</h4>
  </div>
  <br /><br /><br />
  <div class="answer">
    <button
      class="answer-btn"
      @click="elementStore.selectAnswer(elementStore.questions[elementStore.currentQuestionIndex]?.answer1.type)"
    >
      {{ elementStore.questions[elementStore.currentQuestionIndex]?.answer1.text }}
    </button>
    <button
      class="answer-btn"
      @click="elementStore.selectAnswer(elementStore.questions[elementStore.currentQuestionIndex]?.answer2.type)"
    >
      {{ elementStore.questions[elementStore.currentQuestionIndex]?.answer2.text }}
    </button>
    <br /><br />
  </div>
</div>

<!-- 결과 섹션: showResult가 true일 때 표시 -->
<div class="result" v-if="elementStore.showResult">
  <div class="result-container">
    <img class="resultimg" :src="elementStore.resultImage" alt="element" />
    <div class="exp">
      <h2 class="resultElement">{{ elementStore.resultType }} 유형</h2>
      <h3 class="resultExp">{{ elementStore.resultExplanation }}</h3>
    </div>
  </div>
    
  <!-- SNS 공유 -->
  <div class="resultsns">
    <button type="button" id="btnTwitter" class="btn_comm" @click="handleShareTwitter">
      <img src="@/assets/element/twitter.png" alt="Twitter 공유">
    </button>
    <button type="button" id="btnFacebook" class="btn_comm" @click="handleShareFacebook">
      <img src="@/assets/element/facebook.png" alt="Facebook 공유">
    </button>
  </div> 
</div>
</div>
</div>
</template>

<script>
import { defineComponent, computed, onMounted } from 'vue';
import { useElementStore } from '@/stores/elementStore';
import { Carousel } from 'bootstrap';

export default defineComponent({
setup() {
const elementStore = useElementStore();

const resultExplanation = computed(() => {
  return elementStore.resultExplanation;
});

const initializeCarousel = () => {
  const carouselElement = document.getElementById('elementCarousel'); 
  if (carouselElement) {
    new Carousel(carouselElement, {
      interval: 2000,
      wrap: true,
    });
  }
};

onMounted(() => {
  initializeCarousel();
});

const handleShareTwitter = () => {
  elementStore.shareTwitter();
};

const handleShareFacebook = () => {
  elementStore.shareFacebook();
};

const handleStartTest = () => {
  elementStore.startTest();
};

return {
  elementStore,
  resultExplanation,
  handleShareTwitter,
  handleShareFacebook,
  handleStartTest,
};
},
});
</script>

<style scoped>
@import '../../assets/element/elementPage.css';
</style>
