<template>
  <button class="card-btn" @click="handleClick">
    <div class="card">
      <div class="card-body">
        <div class="d-flex flex-column">
          <!-- 카드 이름 -->
          <div class="card-name p-2">
            <div class="d-flex">
              <!-- 카드 번호 -->
              <div class="card-number">
                <span
                  class="badge rounded-pill"
                  :style="{ backgroundColor: badgeColor }"
                  >{{ character.MOGURI_ID }}</span
                >
              </div>
              <!-- 이름 -->
              <div class="flex-grow-1">
                <span class="card-title">{{ character.MOGURI_NAME }}</span>
              </div>
            </div>
          </div>
          <!-- 카드 이미지 -->
          <div class="card-img-container p-2">
            <img
              :src="character.MOGURI_IMAGE_PATH"
              class="card-img"
              :alt="character.MOGURI_NAME"
            />
          </div>
          <!-- 카드 가격 -->
          <div class="card-price p-2 text-end">
            <span class="text-end card-text">
              {{ character.MOGURI_PRICE }}
              <i class="fa-solid fa-cloud" style="color: #ffe5f2"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </button>
</template>

<script>
import AOS from 'aos';
import 'aos/dist/aos.css';

AOS.init();

export default {
  props: {
    character: {
      type: Object,
      required: true,
    },
    badgeColor: {
      type: String,
      required: true,
    },
  },
  methods: {
    handleClick() {
      this.$emit('purchase', this.character); // 이벤트 발생
    },
  },
};
</script>

<style scoped>
/* 카드 본체 */
.card {
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease-in-out; /* 변환 효과 추가 */
}

/* 호버 시 확대 효과 */
.card:hover {
  transform: scale(1.1); /* 5% 확대 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 그림자 효과 추가 */
}

/* 카드 내용 전체 감싸는 클래스 */
.card-body {
  padding: 15px;
}
/* 카드 이미지 컨테이너 */
.card-img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px; /* 원하는 높이로 조정 가능 */
}

/* 카드 이미지 자체(img태그에 클래스 먹여져 있음) */
/* 최종 이미지 크기 고려하여 수정할 것 */
.card-img {
  max-width: 80%; /* 최대 너비 설정 */
  max-height: 100%; /* 최대 높이 설정 */
  object-fit: contain; /* 이미지 비율 유지 */
}

/* 카드 번호 뱃지 */
.card-number {
  margin-right: 5px;
  margin-left: 5px;
}
/* 카드 이름(제목) span에 클래스 먹여져있음 */
.card-title {
  font-size: 1.2rem;
}
/* 카드 가격 */
.card-price {
  font-size: 1.3rem;
}
/* 카드 전체 감싸는 버튼 */
.card-btn {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  width: 100%;
  text-align: left;
}
</style>
