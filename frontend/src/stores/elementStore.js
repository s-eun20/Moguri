import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import fireImage from '@/assets/element/fire1.png';
import waterImage from '@/assets/element/water1.png';
import goldImage from '@/assets/element/gold1.png';
import woodImage from '@/assets/element/wood1.png';
import soilImage from '@/assets/element/soil1.png';
import defaultBackground from '@/assets/element/element_back2.png'
import changeBackground from '@/assets/element/배경3.jpg'

export const useElementStore = defineStore('element', () => {
  const showQuestions = ref(false);
  const showResult = ref(false);
  const resultImage = ref('');
  const isStarted = ref(false);
  const backgroundImage = ref(defaultBackground);
  
  // 공유기능
  const shareTwitter = () => {
    const sendText = "자산 관리 유형 테스트 결과를 확인하세요!";
    const sendUrl = "http://localhost:5173/element"; 
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(sendText)}&url=${encodeURIComponent(sendUrl)}`);
  };

  const shareFacebook = () => {
    const sendUrl = "http://localhost:5173/element"; 
    window.open(`http://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sendUrl)}`);
  };

  const selectedAnswers = ref([]);
  const resultType = ref(null);

  const questions = ref([
    {
      "question": "당신이 숲 속을 거닐고 있을 때, 한 그루의 나무가 눈에 띕니다. 이 때 당신의 생각은?",
      "answer1": { "text": "불을 피워서 캠프파이어를 해야지!", "type": "화" },
      "answer2": { "text": "이 나무 주변에 물이 흐르면 더 좋을 텐데.", "type": "물" }
    },
    {
      "question": "주식 투자로 10% 수익을 얻었습니다! 이 돈을 어떻게 사용하실건가요?",
      "answer1": { "text": "부동산에 투자해서 안정적으로 불려나가겠어!", "type": "금" },
      "answer2": { "text": "책이나 나무 관련 프로젝트에 투자해서 장기적 수익을 기대할래.", "type": "목" }
    },
    {
      "question": "친구가 새로운 스타트업에 투자하라고 제안할 때, 당신의 반응은?",
      "answer1": { "text": "큰 성과를 기대할 수 없다면 바로 투자하지!", "type": "화" },
      "answer2": { "text": "안정적인 사업이 아니면 신중해야 해.", "type": "토" }
    },
    {
      "question": "당신의 급전은 나무에 비유한다면, 어느 시기에 가장 힘을 발휘할까요?",
      "answer1": { "text": "빠르게 자라서 하늘을 찌를 때", "type": "수" },
      "answer2": { "text": "바람에 불어 주변 나무와 연결될 때", "type": "목" }
    },
    {
      "question": "당신이 가장 선호하는 돈 관리 방식은?",
      "answer1": { "text": "빠르고 다이나믹한 증권 투자로 짜릿함을 느껴야지!", "type": "화" },
      "answer2": { "text": "언제든 재투자할 기회를 엿보고 있어.", "type": "수" }
    },
    {
      "question": "당신은 친구들 사이에서 어떤 경제적 조언을 해주나요?",
      "answer1": { "text": "부동산 투자만큼 안전한 건 없지", "type": "목" },
      "answer2": { "text": "자산 운용을 길게 보고 꾸준히 해야 해.", "type": "금" }
    },
    {
      "question": "어느 날 갑자기 창업 기회가 생겼다면, 당신은 어떤 직종을 선택할까요?",
      "answer1": { "text": "기계나 금속을 다루는 공업 관련 업종", "type": "화" },
      "answer2": { "text": "물류, 유통, 금과 다 관련 있는 업종", "type": "토" }
    },
    {
      "question": "투자에서 손해를 봤을 때, 당신의 반응은?",
      "answer1": { "text": "실수를 통해 배운 점을 활용해 앞으로 나아간다.", "type": "목" },
      "answer2": { "text": "흘러간 건 흘러간 거. 새로운 기회를 기다린다.", "type": "수" }
    },
    {
      "question": "당신에게 돈은 무엇을 의미하나요?",
      "answer1": { "text": "돈은 미래를 위한 견고한 자산", "type": "금" },
      "answer2": { "text": "돈은 생각을 하며 더 가치 있게 만들어야 한다.", "type": "토" }
    },
    {
      "question": "어느 날 갑자기 큰돈을 얻었다면 당신의 첫 번째 행동은?",
      "answer1": { "text": "당장 움직이지 말고 천천히 관망하며 계획을 세워야겠어", "type": "토" },
      "answer2": { "text": "장기적인 자산 가치가 높은 곳에 투자할 계획이야.", "type": "금" }
    }
  ]);

  const totalQuestions = 10;
  const currentQuestionIndex = ref(0);

  const selectAnswer = (answerType) => {
    selectedAnswers.value.push(answerType);
    currentQuestionIndex.value++;
    if (currentQuestionIndex.value >= questions.value.length) {
      calculateResult();
    }
  };

  const calculateResult = () => {
    const typeCounts = selectedAnswers.value.reduce((acc, type) => {
      if (type) {
        acc[type] = (acc[type] || 0) + 1;
      }
      return acc;
    }, {});

    const resultTypeValue = Object.entries(typeCounts).reduce((max, entry) => {
      return entry[1] > max[1] ? entry : max;
    }, ["Unknown", 0])[0];

    resultType.value = resultTypeValue;
    showResult.value = true;
    showQuestions.value = false;

    switch (resultType.value) {
      case '화':
        resultImage.value = fireImage;
        break;
      case '수':
        resultImage.value = waterImage;
        break;
      case '금':
        resultImage.value = goldImage;
        break;
      case '목':
        resultImage.value = woodImage;
        break;
      case '토':
        resultImage.value = soilImage;
        break;
      default:
        resultImage.value = '';
    }
  };

  const progressPercentage = computed(() => {
    return ((currentQuestionIndex.value + 1) / totalQuestions) * 100;
  });

  const progressWidth = computed(() => {
    return `${progressPercentage.value}%`; // 백틱 사용
  });

  const resultExplanation = computed(() => {
    switch(resultType.value) {
      case '화':
        return `당신의 자산 관리 유형은 불입니다. 
      열정적이고 적극적인 투자 성향을 가지고 있습니다.`;   
         
      case '수':
        return `당신의 자산 관리 유형은 물입니다.   
      유연하고 신중한 투자 성향을 가지고 있습니다.`;
      case '금':
      return `당신의 자산 관리 유형은 금입니다. 
      안정적이고 신뢰할 수 있는 투자 성향을 가지고 있습니다.`;

      case '목':
      return `당신의 자산 관리 유형은 나무입니다. 
      성장 지향적이고 장기적인 투자 성향을 가지고 있습니다.`;

      case '토':
      return `당신의 자산 관리 유형은 흙입니다. 
      실용적이고 기반이 튼튼한 투자 성향을 가지고 있습니다.`;

default:
  return `설명이 준비되지 않았습니다.`;

    }
  });

  const startTest = () => {
    showQuestions.value = true;
    showResult.value = false;
    selectedAnswers.value = [];
    currentQuestionIndex.value = 0;
    resultType.value = null;
    resultImage.value = ''; 
    isStarted.value = true;
    backgroundImage.value = changeBackground;

  };

  return {
    showQuestions,
    showResult,
    resultImage,
    questions,
    currentQuestionIndex,
    selectAnswer,
    progressWidth,
    progressPercentage,
    resultType,
    resultExplanation,
    isStarted, // 추가된 부분
    startTest,
    shareTwitter,
    shareFacebook,
    backgroundImage,
  };
});
