<template>
  <div class="container-fluid">
    <div class="row px-xl-3">
      <!-- 사이드바 -->
      <div class="col-lg-2">
        <div class="sidebar">
          <h2>마이페이지</h2>
          <ul>
            <li @click="navigateToMoguri">모구리 모으기</li>
            <li @click="navigateToProfileEdit">회원 정보 수정</li>
            <li @click="logout">로그 아웃</li>
          </ul>
        </div>
      </div>

      <!-- 오른쪽 화면 -->
      <div class="col-lg-10 col-xl-8 col-lg-3 mt-5 ms-5">
        <div class="header">
          <h1 class="page-title">모구리 모으기</h1>
        </div>
        <div class="character-list-container">
          <div class="my-cotton-candy-flex d-flex flex-row-reverse">
            <div class="my-cotton-candy-container p-1 m-2"></div>
          </div>
          <ul class="character-cards">
            <li v-for="(character, index) in characters" :key="character.moguriId">
              <CharacterCard
                :character="character"
                :badgeColor="getBadgeColor(index)"
                @purchase="openPurchaseModal(character)"
              />
            </li>
          </ul>
        </div>
        <MoguriModal
          :isVisible="isPurchaseModalVisible"
          :character="selectedCharacter"
          @confirm="purchaseCharacter"
          @cancel="closePurchaseModal"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import CharacterCard from '@/components/Cottoncandyshop/CharacterCard.vue';
import MoguriModal from '@/components/Cottoncandyshop/MoguriModal.vue'; // 변경된 모달 컴포넌트 경로
import axios from 'axios';

export default {
  components: {
    CharacterCard,
    MoguriModal,
  },
  data() {
    return {
      characters: [],
      badgeColors: ['#E78160', '#F7E788', '#75BF7D', '#B8DAF4'],
      isPurchaseModalVisible: false,
      selectedCharacter: {},
    };
  },
  async mounted() {
    await this.fetchMoguriList();
  },
  methods: {
    async fetchMoguriList() {
      try {
        const response = await axios.get('/api/moguri');
        if (response.data.returnCode === '0000') {
          // 캐릭터와 활성화 상태 설정
          this.characters = response.data.data.contents.map(character => {
            return {
              ...character,
              isActive: character.moguriId === 1 || character.moguriId === 2, // 1번과 2번만 활성화
              isPurchased: false, // 초기 구매 상태 설정
            };
          });

          // 3번부터 11번까지 비활성화
          this.characters.forEach(character => {
            if (character.moguriId >= 3 && character.moguriId <= 11) {
              character.isActive = false;
              character.isPurchased = true; // 3번부터는 구매된 상태로 표시
            }
          });
        } else {
          console.error('목표 데이터를 가져오는 중 오류 발생:', response.data.returnMessage);
        }
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    },
    getBadgeColor(index) {
      return this.badgeColors[index % this.badgeColors.length];
    },
    openPurchaseModal(character) {
      this.selectedCharacter = character;
      this.isPurchaseModalVisible = true;
    },
    closePurchaseModal() {
      this.isPurchaseModalVisible = false;
      this.selectedCharacter = {};
    },
    async purchaseCharacter() {
      const authStore = useAuthStore();
      const price = this.selectedCharacter.moguriPrice;

      if (this.currentCottonCandy < price) {
        alert('코튼 캔디가 부족합니다.');
        this.closePurchaseModal();
        return;
      }

      try {
        await fetch(
          `/api/moguri/${this.selectedCharacter.moguriId}/${authStore.state.user.memberId}`,
          { method: 'POST' }
        );

        this.confirmationMessage = `${this.selectedCharacter.moguriName} 구매가 완료되었습니다!`;
        this.closePurchaseModal();
      } catch (error) {
        console.error('구매 중 오류 발생:', error);
      }
    },
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$router.push({ name: 'Home' });
    },
    navigateToProfileEdit() {
      this.$router.push({ name: 'EditProfile' });
    },
    navigateToMoguri() {
      this.$router.push({ name: 'Moguri' });
    },
  },
};
</script>

<style scoped>
.cotton-candy-shop-page {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  font-family: 'HakgyoansimWoojuR';
  margin-top: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.page-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 35px;
  color: #333;
  font-weight: bold;
}

.character-list-container .character-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 20px; /* 카드 간의 간격 */
  padding: 20px;
  list-style-type: none;
  margin: 0;
}

.character-list-container .character-cards li {
  flex: 0 0 calc(25% - 20px); /* 4개가 같은 행에 위치하도록 조정 */
  max-width: calc(25% - 20px); /* 카드 너비 설정 */
  margin-bottom: 20px;
}

/* 사이드바 스타일 */
.sidebar {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
  font-family: 'HakgyoansimWoojuR', sans-serif;
}

.sidebar h2 {
  font-size: 24px;
  color: #ff8f17;
  margin-bottom: 1.5rem;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  font-size: 18px;
  color: #333;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sidebar li:hover {
  background-color: #e2e6ea;
}

@media (max-width: 1200px) {
  .character-list-container .character-cards li {
    flex: 0 0 calc(33.333% - 13.333px); /* 3개가 같은 행에 위치 */
    max-width: calc(33.333% - 13.333px);
  }
}

@media (max-width: 768px) {
  .character-list-container .character-cards li {
    flex: 0 0 calc(50% - 10px); /* 2개가 같은 행에 위치 */
    max-width: calc(50% - 10px);
  }
}

@media (max-width: 480px) {
  .character-list-container .character-cards li {
    flex: 0 0 100%; /* 모바일에서 1개만 표시 */
    max-width: 100%;
  }
}
</style>
