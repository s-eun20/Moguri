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
          <ul class="character-cards">
            <li v-for="(character, index) in characters" :key="character.MOGURI_ID">
              <CharacterCard
                :character="character"
                :badgeColor="getBadgeColor(index)"
                :disabled="!character.isPurchased"
                :disabledMessage="!character.isPurchased ? '사용 불가능' : ''"
                @purchase="openMoguriModal"
              />
            </li>
          </ul>
        </div>
        <MoguriModal
          v-if="isMoguriModalVisible && selectedCharacter"
          :isVisible="isMoguriModalVisible"
          :character="selectedCharacter"
          @confirm="selectMoguriCharacter"
          @cancel="closeMoguriModal"
        />
        <ConfirmationModal
          v-if="isConfirmationModalVisible"
          :isVisible="isConfirmationModalVisible"
          :message="confirmationMessage"
          @close="closeConfirmationModal"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import CharacterCard from '@/components/Cottoncandyshop/CharacterCard.vue';
import ConfirmationModal from '@/components/Cottoncandyshop/ConfirmationModal.vue';
import MoguriModal from '@/components/Cottoncandyshop/MoguriModal.vue';
import moguriSampleImage from '@/assets/img/moguristore_sample_img.png';
import { useRouter } from 'vue-router';

export default {
  components: {
    CharacterCard,
    ConfirmationModal,
    MoguriModal,
  },
  data() {
    return {
      characters: [
        {
          MOGURI_ID: 1,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 100,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: true,
        },
        {
          MOGURI_ID: 2,
          MOGURI_NAME: '저쩌구 모구리',
          MOGURI_PRICE: 200,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: true,
        },
        {
          MOGURI_ID: 3,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 300,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: false,
        },
        {
          MOGURI_ID: 4,
          MOGURI_NAME: '저쩌구 모구리',
          MOGURI_PRICE: 400,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: false,
        },
        {
          MOGURI_ID: 5,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 500,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: false,
        },
        {
          MOGURI_ID: 6,
          MOGURI_NAME: '저쩌구 모구리',
          MOGURI_PRICE: 100,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: false,
        },
        {
          MOGURI_ID: 7,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 200,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: false,
        },
        {
          MOGURI_ID: 8,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 300,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: false,
        },
        {
          MOGURI_ID: 9,
          MOGURI_NAME: '저쩌구 모구리',
          MOGURI_PRICE: 400,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: false,
        },
        {
          MOGURI_ID: 10,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 500,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: false,
        },
      ],
      badgeColors: ['#E78160', '#F7E788', '#75BF7D', '#B8DAF4'],
      isMoguriModalVisible: false,
      selectedCharacter: {},
      isConfirmationModalVisible: false,
      confirmationMessage: '',
      memberId: null,
    };
  },
  computed: {
    currentCottonCandy() {
      const authStore = useAuthStore();
      return authStore.cottonCandy;
    },
  },
  created() {
    const authStore = useAuthStore();
    this.memberId = authStore.memberId;
  },
  methods: {
    getBadgeColor(index) {
      return this.badgeColors[index % this.badgeColors.length];
    },
    openMoguriModal(character) {
      this.selectedCharacter = character;
      this.isMoguriModalVisible = true;
    },
    async selectMoguriCharacter() {
      const price = this.selectedCharacter.MOGURI_PRICE;

      if (this.currentCottonCandy < price) {
        this.confirmationMessage = '코튼 캔디가 부족합니다.';
        this.isConfirmationModalVisible = true;
        return;
      }

      try {
        await fetch(`/api/moguri/${this.selectedCharacter.MOGURI_ID}/${this.memberId}`, {
          method: 'POST',
        });

        const authStore = useAuthStore();
        await authStore.updateCottonCandy(-price);

        const characterIndex = this.characters.findIndex(c => c.MOGURI_ID === this.selectedCharacter.MOGURI_ID);
        this.characters[characterIndex].isPurchased = true;

        this.confirmationMessage = `${this.selectedCharacter.MOGURI_NAME} 캐릭터가 사용되었습니다!`;
        this.closeMoguriModal();
        this.isConfirmationModalVisible = true;
      } catch (error) {
        console.error('Error selecting moguri character:', error);
      }
    },
    closeMoguriModal() {
      this.isMoguriModalVisible = false;
      this.selectedCharacter = {};
    },
    closeConfirmationModal() {
      this.isConfirmationModalVisible = false;
      this.confirmationMessage = '';
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
/* 스타일링 */
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

.header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 36px;
  font-family: 'HakgyoansimWoojuR', sans-serif; /* 헤더와 동일한 폰트 설정 */
  color: #343a40;
}

.character-list-container {
  margin-top: 2rem;
}

.character-cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

/* 캐릭터 카드 폰트 설정 */
.character-cards li {
  width: calc(33.333% - 1rem);
  margin-bottom: 1rem;
  font-family: 'HakgyoansimWoojuR', sans-serif; /* 캐릭터 카드 폰트 설정 */
}

/* 캐릭터 카드 내부의 텍스트 스타일 추가 */
.character-cards li .character-name {
  font-size: 20px; /* 캐릭터 이름 크기 */
  color: #343a40; /* 캐릭터 이름 색상 */
  margin: 0.5rem 0; /* 캐릭터 이름과 이미지 간의 여백 */
}
</style>
