<template>
    <button class="card-btn" @click="handleClick" :disabled="character.isPurchased">
      <div class="card" :class="{ 'disabled-card': character.isPurchased || !isActive, 'active-card': isActive }">
        <div class="card-body">
          <div class="d-flex flex-column">
            <!-- 카드 이름 -->
            <div class="card-name p-2">
              <div class="d-flex">
                <!-- 카드 번호 -->
                <div class="card-number">
                  <span class="badge rounded-pill" :style="{ backgroundColor: badgeColor }">
                    {{ formattedMoguriId }}
                  </span>
                </div>
                <!-- 이름 -->
                <div class="flex-grow-1">
                  <span class="card-title">{{ character.moguriName }}</span>
                </div>
              </div>
            </div>
            <!-- 카드 이미지 -->
            <div class="card-img-container p-2">
              <img :src="character.filePath" :alt="character.moguriName" />
            </div>
            <!-- 카드 가격 -->
            <div class="card-price p-2 text-end">
              <span class="text-end card-text">
                {{ formattedMoguriPrice }}
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
    computed: {
      isActive() {
        // 1번과 2번 캐릭터의 ID에 따라 활성화 여부를 반환
        return this.character.moguriId === 1 || this.character.moguriId === 2;
      },
      // 한 자리 모구리 번호 포맷팅
      formattedMoguriId() {
        return String(this.character.moguriId).padStart(2, '0'); // 2자리로 포맷팅
      },
      // 코튼캔디 포맷팅
      formattedMoguriPrice() {
        return new Intl.NumberFormat().format(this.character.moguriPrice);
      },
    },
    methods: {
      handleClick() {
        if (!this.character.isPurchased) {
          this.$emit('purchase', this.character); // 이벤트 발생
        }
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
  .card:hover:not(.disabled-card) {
    transform: scale(1.1); /* 10% 확대 */
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
  .card-img {
    max-width: 80%; /* 최대 너비 설정 */
    max-height: 100%; /* 최대 높이 설정 */
    object-fit: contain; /* 이미지 비율 유지 */
  }
  
  /* 카드 번호 뱃지 */
  .card-number {
    margin-right: 10px;
    margin-left: 5px;
    font-size: 1.2rem;
  }
  
  .badge {
    vertical-align: middle;
  }
  
  /* 카드 이름(제목) span에 클래스 먹여져있음 */
  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  /* 카드 가격 */
  .card-price {
    font-size: 1.3rem;
    font-weight: 600;
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
  
  /* 비활성화된 카드의 스타일 */
  .disabled-card {
    background-color: rgba(220, 220, 220, 0.7); /* 밝은 회색 배경과 투명도 적용 */
    color: #777; /* 글자 색상 변경 (회색) */
    pointer-events: none; /* 클릭 불가능하게 설정 */
  }
  
  /* 활성화된 카드의 스타일 (1번, 2번) */
  .active-card {
    background-color: white; /* 기본 배경색 */
  }
  </style>
  