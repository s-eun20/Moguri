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
        <div
          v-for="article in filteredArticles"
          :key="article.id"
          class="article"
        >
          <img
            :src="article.imageUrl"
            :alt="article.title"
            class="article-image"
          />
          <div class="article-content">
            <h3>{{ article.title }}</h3>
            <p><strong>출처:</strong> {{ article.source }}</p>
            <p>{{ article.content }}</p>
            <a
              :href="article.url"
              target="_blank"
              rel="noopener noreferrer"
              class="article-link"
              >자세히 보기</a
            >
          </div>
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
      currentGoalType: "",
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
          source: "여행 가이드",
          title: "필수 여행 앱 TOP 5",
          content:
            "Google Maps, TripAdvisor, XE Currency, Duolingo, Airbnb 등 여행에 꼭 필요한 앱들을 소개합니다.",
          tags: ["여행"],
          url: "https://www.tripadvisor.com/TravelersChoice-Apps",
          imageUrl:
            "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        },
        {
          id: 2,
          source: "환율 정보",
          title: "실시간 환율 확인 방법",
          content:
            "XE Currency나 Google Finance를 통해 실시간 환율을 확인하고 여행 경비를 효율적으로 관리하세요.",
          tags: ["여행"],
          url: "https://www.xe.com/currencyconverter/",
          imageUrl:
            "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        },
        {
          id: 3,
          source: "여행 팁",
          title: "해외여행 시 꼭 알아야 할 10가지",
          content:
            "여권 유효기간 확인, 여행자보험 가입, 현지 문화 존중 등 해외여행 시 주의해야 할 점들을 정리했습니다.",
          tags: ["여행"],
          url: "https://www.nomadicmatt.com/travel-blogs/61-travel-tips/",
          imageUrl:
            "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80",
        },
        {
          id: 4,
          source: "배낭여행 가이드",
          title: "최소한의 짐으로 떠나는 배낭여행",
          content:
            "효율적인 짐 싸기 방법, 필수품 목록, 배낭 선택 팁 등 가벼운 배낭여행을 위한 가이드를 제공합니다.",
          tags: ["여행"],
          url: "https://www.lonelyplanet.com/articles/how-to-pack-for-world-tour",
          imageUrl:
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1421&q=80",
        },
        {
          id: 5,
          source: "재테크 가이드",
          title: "효과적인 저축 방법 TOP 5",
          content:
            "급여 자동이체, 52주 저축법, 잔돈 모으기 등 쉽고 효과적인 저축 방법을 소개합니다.",
          tags: ["저축"],
          url: "https://www.investopedia.com/personal-finance/how-start-saving-money/",
          imageUrl:
            "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        },
        {
          id: 6,
          source: "금융 전문가",
          title: "20대를 위한 스마트한 저축 전략",
          content:
            "복리의 힘을 활용한 장기 저축, 긴급자금 마련, 재무 목표 설정 등 20대를 위한 맞춤형 저축 전략을 제시합니다.",
          tags: ["저축"],
          url: "https://www.nerdwallet.com/article/banking/savings/how-much-should-i-save-each-month",
          imageUrl:
            "https://images.unsplash.com/photo-1518183214770-9cffbec72538?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        },
        {
          id: 7,
          source: "경제 뉴스",
          title: "물가상승 시대의 현명한 저축법",
          content:
            "인플레이션에 대비한 저축 전략, 고금리 예금 상품 활용법, 분산 투자의 중요성 등을 설명합니다.",
          tags: ["저축"],
          url: "https://www.cnbc.com/select/how-to-save-money-during-inflation/",
          imageUrl:
            "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        },
        {
          id: 8,
          source: "재무 상담사",
          title: "결혼/육아 대비 저축 가이드",
          content:
            "결혼 비용 산정, 신혼집 마련, 출산 및 육아 비용 대비 등 인생의 큰 이벤트를 위한 저축 방법을 안내합니다.",
          tags: ["저축"],
          url: "https://www.thebalancemoney.com/how-to-save-for-a-down-payment-on-a-house-4159128",
          imageUrl:
            "https://images.unsplash.com/photo-1602030638412-bb8dcc0bc8b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        },
        {
          id: 9,
          source: "취미 탐험",
          title: "2023년 인기 취미 활동 순위",
          content:
            "홈가드닝, DIY 공예, 온라인 쿠킹클래스 등 2023년에 주목받는 취미 활동을 소개합니다.",
          tags: ["취미"],
          url: "https://www.goodhousekeeping.com/life/g26960479/best-hobbies-to-try/",
          imageUrl:
            "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80",
        },
        {
          id: 10,
          source: "DIY 매거진",
          title: "초보자를 위한 DIY 프로젝트 5가지",
          content:
            "간단한 목공, 캔들 만들기, 티셔츠 커스터마이징 등 집에서 쉽게 시작할 수 있는 DIY 프로젝트를 소개합니다.",
          tags: ["취미"],
          url: "https://www.countryliving.com/diy-crafts/how-to/g2/easy-diy-projects/",
          imageUrl:
            "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        },
        {
          id: 11,
          source: "요리 블로그",
          title: "주말에 도전해볼 만한 홈베이킹 레시피",
          content:
            "초보자도 쉽게 따라할 수 있는 쿠키, 머핀, 브라우니 등의 홈베이킹 레시피를 단계별로 설명합니다.",
          tags: ["취미"],
          url: "https://sallysbakingaddiction.com/category/desserts/cookies/",
          imageUrl:
            "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        },
        {
          id: 12,
          source: "취미 생활 매거진",
          title: "스트레스 해소에 좋은 취미 활동 BEST 5",
          content:
            "요가, 정원 가꾸기, 악기 연주 등 스트레스 해소에 효과적인 취미 활동을 소개하고 시작하는 방법을 안내합니다.",
          tags: ["취미"],
          url: "https://www.verywellmind.com/the-importance-of-hobbies-for-stress-relief-3144574",
          imageUrl:
            "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        },
        {
          id: 13,
          source: "자기계발 연구소",
          title: "하루 1% 성장하기: 작은 습관의 힘",
          content:
            "매일 조금씩 실천하는 자기계발 습관으로 1년 후 큰 변화를 만드는 방법을 알아봅니다.",
          tags: ["자기계발"],
          url: "https://jamesclear.com/atomic-habits",
          imageUrl:
            "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1468&q=80",
        },
        {
          id: 14,
          source: "독서 클럽",
          title: "2023 자기계발 베스트셀러 TOP 10",
          content:
            "올해 가장 주목받은 자기계발서 10권을 소개하고, 각 책의 핵심 메시지와 독자 리뷰를 공유합니다.",
          tags: ["자기계발"],
          url: "https://www.goodreads.com/shelf/show/self-improvement",
          imageUrl:
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1498&q=80",
        },
        {
          id: 15,
          source: "생산성 전문가",
          title: "시간 관리의 기술: 일과 삶의 균형 찾기",
          content:
            "효율적인 시간 관리 기법, 우선순위 설정 방법, 일-삶 균형을 위한 팁 등을 제공합니다.",
          tags: ["자기계발"],
          url: "https://todoist.com/productivity-methods/eisenhower-matrix",
          imageUrl:
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
        },
        {
          id: 16,
          source: "마인드셋 코치",
          title: "긍정적 마인드셋 기르기: 성공의 첫걸음",
          content:
            "긍정적 사고방식의 중요성, 마인드셋 변화 기법, 자기 암시의 효과 등을 설명하고 실천 방법을 제시합니다.",
          tags: ["자기계발"],
          url: "https://positivepsychology.com/growth-mindset-vs-fixed-mindset/",
          imageUrl:
            "https://images.unsplash.com/photo-1522163182402-834f871fd851?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1503&q=80",
        },
      ],
      hashtags: ["여행", "저축", "취미", "자기계발"],
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
      this.currentGoalType = "";
    },
    handleAddGoal(newGoal) {
      newGoal.progress = 0;
      if (this.currentGoalType === "saving") {
        this.savingGoals.push(newGoal);
      } else if (this.currentGoalType === "expense") {
        this.expenseGoals.push(newGoal);
      }
      this.closeModal();
    },
    filterArticles(tag) {
      this.filteredArticles = this.articles.filter((article) =>
        article.tags.includes(tag)
      );
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
  font-family: "HakgyoansimWoojuR";
  font-weight: bold;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ffcc00;
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
  display: flex;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
  font-size: 14px;
}

.article-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
}

.article-content {
  flex: 1;
}

.article h3 {
  font-size: 23px;
  font-weight: bold;
  margin-bottom: 10px;
}

.article p {
  margin-bottom: 5px;
}

.article-link {
  display: inline-block;
  margin-top: 10px;
  color: #007bff;
  text-decoration: none;
}

.article-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .article {
    flex-direction: column;
  }

  .article-image {
    width: 100%;
    height: 200px;
    margin-right: 0;
    margin-bottom: 15px;
  }
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
