<template>
  <div class="goal-page">
    <h1 class="page-title">목표 설정</h1>
    <div class="goal">
    <div class="goal-list">
      <GoalList 
        title="저축 목표" 
        :goals="savingGoals" 
        buttonText="저축 목표 등록"
        buttonColor="green"
        @add-goal="openModal('saving')"
      />
      <GoalList 
        title="지출 목표" 
        :goals="expenseGoals" 
        buttonText="지출 목표 등록"
        buttonColor="orange"
        @add-goal="openModal('expense')"
      />
    </div>

    <Modal
      :isVisible="isModalVisible"
      @add-goal="handleAddGoal"
      @close="closeModal"
    />

    <div class="reference-section">
      <h2>관심 있는 태그를 클릭하세요!</h2>
      <div class="hashtag-section">
        <span 
          v-for="tag in hashtags" 
          :key="tag" 
          class="hashtag" 
          @click="filterArticles(tag)"
        >
          #{{ tag }}
        </span>
      </div>
      <div v-for="article in filteredArticles" :key="article.id" class="article">
        <strong>신문사:</strong> {{ article.source }}<br>
        <strong>기사 제목:</strong> {{ article.title }}<br>
        <strong>기사 내용:</strong> {{ article.content }}
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import GoalList from "@/components/AccountBook/GoalList.vue";
import Modal from "@/components/AccountBook/GoalModal.vue";

export default {
  components: { GoalList, Modal },
  data() {
    return {
      isModalVisible: false,
      currentGoalType: '',
      savingGoals: [
        {
          content: "이탈리아 여행 자금",
          amount: 3000000,
          startDate: "2024-09-01",
          endDate: "2024-09-30",
          progress: 60,
        },
      ],
      expenseGoals: [
        {
          content: "식비 줄이기",
          amount: 200000,
          startDate: "2024-09-01",
          endDate: "2024-09-30",
          progress: 60,
        },
      ],
      articles: [
        {
          id: 1,
          source: "여행신문",
          title: "MZ 세대의 여행 트렌드",
          content: "MZ 세대가 선호하는 여행 스타일과 인기 여행지를 소개합니다.",
          tags: ['여행', '트렌드'],
        },
        {
          id: 2,
          source: "관광매거진",
          title: "예산 관리 방법",
          content: "MZ 세대를 위한 여행 예산 관리 팁을 제공합니다.",
          tags: ['여행', '예산'],
        },
        {
          id: 3,
          source: "주말여행",
          title: "캠핑 명소 추천",
          content: "MZ 세대가 즐길 수 있는 캠핑 명소를 소개합니다.",
          tags: ['여행', '캠핑'],
        }
      ],
      hashtags: ['여행', '저축', '취미', '자기계발'],
      filteredArticles: [],
    };
  },
  methods: {
    openModal(goalType) {
      this.currentGoalType = goalType;
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.currentGoalType = '';
    },
    handleAddGoal(newGoal) {
      newGoal.progress = 0;
      if (this.currentGoalType === 'saving') {
        this.savingGoals.push(newGoal);
      } else if (this.currentGoalType === 'expense') {
        this.expenseGoals.push(newGoal);
      }
      this.closeModal();
    },
    filterArticles(tag) {
      this.filteredArticles = this.articles.filter(article => article.tags.includes(tag));
    },
  },
};
</script>

<style scoped>
.goal {
  display: flex; 
  justify-content: space-between;
}
.goal-page {
  padding: 20px;
}
.page-title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ffcc99;
}
.goal-list {
  flex: 1;
  height: 660px;
}

.reference-section {
  background-color: #fffaf3;
    padding: 20px;
    border-radius: 12px;
    border: 2px solid #ffcc99;
    margin-bottom: 20px;
    width: 800px;
    margin-right: 110px;
}

.reference-section h2 {
  font-size: 30px;
  margin-bottom: 30px; 
  font-weight: bold;
  
}

.hashtag-section {
  margin: 10px 0;
}

.hashtag {
  display: inline-block;
  background-color: #e0e0e0;
  border-radius: 3px;
  padding: 5px;
  margin-right: 5px;
  cursor: pointer; 
  margin-bottom: 10px;
}

.article {
  margin-bottom: 15px; 
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px; 
  background-color: white;
  border-radius: 8px; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
  padding: 10px; 
  margin-bottom: 10px; 
  font-size: 14px; 
  width: 700px; 
  height: 120px; 
  
}

.article strong {
  display: inline-block; 
  margin-bottom: 5px;
}
</style>
