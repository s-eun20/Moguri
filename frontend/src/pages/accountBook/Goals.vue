<template>
  <div class="goal-page">
    <h1 class="page-title">목표 설정</h1>
    <div class="content-wrapper">
      <div class="goal-lists-container">
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
      <div class="reference-container">
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

    <Modal
      :isVisible="isModalVisible"
      @add-goal="handleAddGoal"
      @close="closeModal"
    />
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
.goal-page {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  box-sizing: border-box;
  font-family: 'HakgyoansimWoojuR';
    font-weight: bold;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #FFCC00;
}

.content-wrapper {
  display: flex;
  gap: 30px;
  margin-top: 30px;
}

.goal-lists-container,
.reference-container {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  height: 700px;
  overflow-y: auto;
}

.goal-lists-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.reference-container h2 {
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: bold;
}

.hashtag-section {
  margin-bottom: 20px;
}

.hashtag {
  display: inline-block;
  background-color: #e0e0e0;
  border-radius: 3px;
  padding: 5px 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.article {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  font-size: 14px;
}

.article strong {
  display: inline-block;
  margin-bottom: 5px;
}

@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .goal-lists-container,
  .reference-container {
    width: 100%;
    height: auto;
  }
}
</style>
