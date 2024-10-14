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
import MoguriModal from '@/components/Cottoncandyshop/MoguriModal.vue'; // 새로운 모달 가져오기
import moguriSampleImage from '@/assets/img/moguristore_sample_img.png';
import { useRouter } from 'vue-router';

export default {
  components: {
    CharacterCard,
    ConfirmationModal,
    MoguriModal, // 새로운 모달 등록
  },
  data() {
    return {
      characters: [
        {
          MOGURI_ID: 1,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 100,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: true, // 활성화
        },
        {
          MOGURI_ID: 2,
          MOGURI_NAME: '저쩌구 모구리',
          MOGURI_PRICE: 200,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: true, // 활성화
        },
        {
          MOGURI_ID: 3,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 300,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: false, // 비활성화
        },
        {
          MOGURI_ID: 4,
          MOGURI_NAME: '저쩌구 모구리',
          MOGURI_PRICE: 400,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: false, // 비활성화
        },
        {
          MOGURI_ID: 5,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 500,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: false, // 비활성화
        },
        {
          MOGURI_ID: 6,
          MOGURI_NAME: '저쩌구 모구리',
          MOGURI_PRICE: 100,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: false, // 비활성화
        },
        {
          MOGURI_ID: 7,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 200,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: false, // 비활성화
        },
        {
          MOGURI_ID: 8,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 300,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: false, // 비활성화
        },
        {
          MOGURI_ID: 9,
          MOGURI_NAME: '저쩌구 모구리',
          MOGURI_PRICE: 400,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: false, // 비활성화
        },
        {
          MOGURI_ID: 10,
          MOGURI_NAME: '어쩌구 모구리',
          MOGURI_PRICE: 500,
          MOGURI_IMAGE_PATH: moguriSampleImage,
          isPurchased: false, // 비활성화
        },
      ],
      badgeColors: ['#E78160', '#F7E788', '#75BF7D', '#B8DAF4'],
      isMoguriModalVisible: false, // 모달 상태 추가
      selectedCharacter: {}, // 선택된 캐릭터
      isConfirmationModalVisible: false,
      confirmationMessage: '',
      memberId: null, // memberId 초기화
    };
  },
  computed: {
    currentCottonCandy() {
      const authStore = useAuthStore();
      return authStore.cottonCandy; // 동적으로 authStore에서 cottonCandy 값 가져오기
    }
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
      // 모구리 캐릭터 선택 로직 구현
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
  background-color: #f8f9fa; /* 사이드바 배경 색상 */
  padding: 1.5rem; /* 내부 여백 */
  border-radius: 0.5rem; /* 모서리 둥글게 */
}

.sidebar h2 {
  font-size: 24px; /* 제목 크기 */
  color: #ff8f17; /* 제목 색상 */
  margin-bottom: 1.5rem; /* 제목과 목록 간격 */
}

.sidebar ul {
  list-style: none; /* 기본 리스트 스타일 제거 */
  padding: 0; /* 패딩 제거 */
}

.sidebar li {
  font-size: 18px; /* 항목 크기 */
  color: #333; /* 항목 색상 */
  padding: 0.75rem 1rem; /* 각 항목 패딩 */
  cursor: pointer; /* 포인터 커서 */
  transition: background-color 0.2s; /* 배경 색상 변경 효과 */
}

.sidebar li:hover {
  background-color: #ffecd1; /* 호버 시 배경 색상 변경 */
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 2rem; /* 페이지 제목 크기 */
  color: #333; /* 페이지 제목 색상 */
}
.character-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4열 그리드 */
  gap: 20px; /* 카드 간 간격 */
  padding-bottom: 50px; /* 아래 패딩 */
}
.character-list-container {
  padding: 0 20px; /* 가로 패딩 */
}
</style>
