<template>
  <div class="cotton-candy-shop-page">
    <div class="header">
      <h1 class="page-title">모구리 상점</h1>
      <!-- <div class="mascot-message">
        <div class="speech-bubble">
          <p>소비 패턴에 맞는 퀘스트를 원한다면 나를 클릭해구리!</p>
        </div>
        <img
          src="@/assets/img/Moguri.png"
          alt="Mascot"
          class="mascot-image"
          @click="showRecommendationModal"
        />
      </div> -->
    </div>
    <div class="character-list-container">
      <!-- 코튼캔디 현황 -->
      <div class="my-cotton-candy-flex d-flex flex-row-reverse">
        <div class="my-cotton-candy-container p-1 m-2">
          <div class="icon-circle">
            <i class="fa-solid fa-cloud" style="color: #ffe5f2"></i>
          </div>
          <span class="my-cotton-candy" style="height: 1.5rem">70,000</span>
        </div>
      </div>
      <ul class="character-cards">
        <li v-for="(character, index) in characters" :key="character.MOGURI_ID">
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
import CharacterCard from '@/components/CottonCandyShop/CharacterCard.vue';
import PurchaseModal from '@/components/CottonCandyShop/PurchaseModal.vue';
import ConfirmationModal from '@/components/CottonCandyShop/ConfirmationModal.vue';
import moguriSampleImage from '@/assets/img/moguristore_sample_img.png';

export default {
  components: {
    CharacterCard,
    PurchaseModal,
    ConfirmationModal,
  },
  data() {
    return {
      characters: [
        {
          MOGURI_ID: 1,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 100,
          MOGURI_IMAGE_PATH: moguriSampleImage,
        },
        {
          MOGURI_ID: 2,
          MOGURI_NAME: '저쩌구 모구리',
          MOGURI_PRICE: 200,
          MOGURI_IMAGE_PATH: moguriSampleImage,
        },
        {
          MOGURI_ID: 3,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 300,
          MOGURI_IMAGE_PATH: moguriSampleImage,
        },
        {
          MOGURI_ID: 4,
          MOGURI_NAME: '저쩌구 모구리',
          MOGURI_PRICE: 400,
          MOGURI_IMAGE_PATH: moguriSampleImage,
        },
        {
          MOGURI_ID: 5,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 500,
          MOGURI_IMAGE_PATH: moguriSampleImage,
        },
        {
          MOGURI_ID: 1,
          MOGURI_NAME: '저쩌구 모구리',
          MOGURI_PRICE: 100,
          MOGURI_IMAGE_PATH: moguriSampleImage,
        },
        {
          MOGURI_ID: 2,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 200,
          MOGURI_IMAGE_PATH: moguriSampleImage,
        },
        {
          MOGURI_ID: 3,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 300,
          MOGURI_IMAGE_PATH: moguriSampleImage,
        },
        {
          MOGURI_ID: 4,
          MOGURI_NAME: '저쩌구 모구리',
          MOGURI_PRICE: 400,
          MOGURI_IMAGE_PATH: moguriSampleImage,
        },
        {
          MOGURI_ID: 5,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 500,
          MOGURI_IMAGE_PATH: moguriSampleImage,
        },
        {
          MOGURI_ID: 4,
          MOGURI_NAME: '저쩌구 모구리',
          MOGURI_PRICE: 400,
          MOGURI_IMAGE_PATH: moguriSampleImage,
        },
        {
          MOGURI_ID: 5,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 500,
          MOGURI_IMAGE_PATH: moguriSampleImage,
        },
      ],
      badgeColors: ['#E78160', '#F7E788', '#75BF7D', '#B8DAF4'],
      isPurchaseModalVisible: false,
      selectedCharacter: {},
      isConfirmationModalVisible: false,
      confirmationMessage: '',
    };
  },
  methods: {
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
    purchaseCharacter() {
      // 여기에 실제 구매 로직을 구현합니다.
      // 예: API 호출, 상태 업데이트 등
      console.log(`${this.selectedCharacter.MOGURI_NAME} 구매 완료!`);
      this.confirmationMessage = `${this.selectedCharacter.MOGURI_NAME} 구매가 완료되었습니다!`;
      this.closePurchaseModal();
      this.isConfirmationModalVisible = true;
    },
    closeConfirmationModal() {
      this.isConfirmationModalVisible = false;
      this.confirmationMessage = '';
    },
  },
};
</script>

<style scoped>
div {
  /* border: 1px solid blue; */
}
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
