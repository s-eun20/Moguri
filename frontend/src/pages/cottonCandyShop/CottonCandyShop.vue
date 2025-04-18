<template>
  <div class="cotton-candy-shop-page">
    <div class="header">
      <h1 class="page-title">모구리 상점</h1>
    </div>
    <div class="character-list-container">
      <div class="my-cotton-candy-flex d-flex flex-row-reverse">
        <div class="my-cotton-candy-container p-1 m-2">
          <div class="icon-circle">
            <i class="fa-solid fa-cloud" style="color: #ffe5f2"></i>
          </div>
          <span class="my-cotton-candy" style="height: 1.5rem">
            {{ formattedCottonCandy }}
            <!-- 포맷팅된 값 사용 -->
          </span>
        </div>
      </div>
      <ul class="character-cards">
        <li v-for="(character, index) in characters" :key="character.moguriId">
          <CharacterCard
            :character="character"
            :badgeColor="getBadgeColor(index)"
            @purchase="openPurchaseModal"
          />
        </li>
      </ul>
    </div>
    <PurchaseModal
      v-if="isPurchaseModalVisible && selectedCharacter"
      :isVisible="isPurchaseModalVisible"
      :character="selectedCharacter"
      @confirm="purchaseCharacter"
      @cancel="closePurchaseModal"
    />
    <ConfirmationModal
      v-if="isConfirmationModalVisible"
      :isVisible="isConfirmationModalVisible"
      :message="confirmationMessage"
      @close="closeConfirmationModal"
    />
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import CharacterCard from '@/components/Cottoncandyshop/CharacterCard.vue';
import PurchaseModal from '@/components/Cottoncandyshop/PurchaseModal.vue';
import ConfirmationModal from '@/components/Cottoncandyshop/ConfirmationModal.vue';
import axios from 'axios';

export default {
  components: {
    CharacterCard,
    PurchaseModal,
    ConfirmationModal,
  },
  data() {
    return {
      characters: [],
      badgeColors: ['#E78160', '#F7E788', '#75BF7D', '#B8DAF4'],
      isPurchaseModalVisible: false,
      selectedCharacter: {},
      isConfirmationModalVisible: false,
      confirmationMessage: '',
    };
  },
  computed: {
    currentCottonCandy() {
      const authStore = useAuthStore();
      return authStore.cottonCandy;
    },
    formattedCottonCandy() {
      return new Intl.NumberFormat().format(this.currentCottonCandy); // 포맷팅
    },
  },
  async mounted() {
    await this.fetchMoguriList();
  },
  methods: {
    async fetchMoguriList() {
      try {
        const response = await axios.get('/api/moguri');
        if (response.data.returnCode === '0000') {
          this.characters = response.data.data.contents;
        } else {
          console.error(
            '목표 데이터를 가져오는 중 오류 발생:',
            response.data.returnMessage
          );
        }
      } catch (error) {
        console.error('가계부 데이터를 가져오는 중 오류 발생:', error);
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
        this.confirmationMessage = '코튼 캔디가 부족합니다.';
        this.isConfirmationModalVisible = true;
        return;
      }

      try {
        // 모구리 구매 API 호출
        await fetch(
          `/api/moguri/${this.selectedCharacter.moguriId}/${authStore.state.user.memberId}`,
          {
            method: 'POST',
          }
        );
        // 코튼 캔디 업데이트 (음수로 전달하여 줄어들게)
        await authStore.updateCottonCandy(-price);

        this.confirmationMessage = `${this.selectedCharacter.moguriName} 구매가 완료되었습니다!`;
        this.closePurchaseModal();
        this.isConfirmationModalVisible = true;
      } catch (error) {
        console.error('Error purchasing moguri:', error);
      }
    },
    closeConfirmationModal() {
      this.isConfirmationModalVisible = false;
      this.confirmationMessage = '';
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
/* 코튼캔디 */
.my-cotton-candy-flex {
  padding-left: 20px;
  padding-right: 20px;
  font-size: 1.5rem;
  font-weight: bold;
}
.my-cotton-candy-container {
  background-color: #fff3da;
  border-radius: 17px;
}
.icon-circle {
  background-color: #fff;
  display: inline;
  border-radius: 50%;
  padding: 5px;
}
.my-cotton-candy {
  margin-left: 15px;
  margin-right: 10px;
}
.page-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 35px;
  color: #333;
  font-weight: bold;
}
.mascot-message {
  display: flex;
  align-items: flex-start;
}
.mascot-image {
  width: 100px;
  height: 150px;
}
.speech-bubble {
  background-color: #fff;
  border: 2px solid #ffd700;
  border-radius: 20px;
  padding: 10px;
  text-align: center;
  width: 400px;
  font-weight: bold;
  margin-top: 15px;
}

.character-list-container .character-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex; /* flex-start 유지 */
  gap: 20px; /* 카드 사이의 간격 */
  padding: 20px;
  list-style-type: none; /* 리스트 스타일 제거 */
  margin: 0; /* 마진 제거 */
}

.character-list-container .character-cards li {
  flex: 0 0 calc(25% - 15px); /* flex-grow: 0, flex-shrink: 0 추가 */
  max-width: calc(25% - 15px); /* 최대 너비 설정 */
  margin-bottom: 20px;
}

/* 반응형 디자인을 위한 미디어 쿼리 */
@media (max-width: 1200px) {
  .character-list-container .character-cards li {
    flex: 0 0 calc(33.333% - 13.333px);
    max-width: calc(33.333% - 13.333px);
  }
}

@media (max-width: 768px) {
  .character-list-container .character-cards li {
    flex: 0 0 calc(50% - 10px);
    max-width: calc(50% - 10px);
  }
}

@media (max-width: 480px) {
  .character-list-container .character-cards li {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
