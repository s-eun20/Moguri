<template>
  <div id="main_banner_container">
    <!-- 위 배너 -->
    <div id="demo" class="carousel slide" data-bs-ride="carousel">
      <!-- Indicators -->
      <ol class="carousel-indicators">
        <li data-bs-target="#demo" data-bs-slide-to="0" class="active"></li>
        <li data-bs-target="#demo" data-bs-slide-to="1"></li>
        <li data-bs-target="#demo" data-bs-slide-to="2"></li>
      </ol>

      <!-- The slideshow -->
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="@/assets/img/main_banner_1.png" />
        </div>
        <div class="carousel-item">
          <img src="@/assets/img/main_banner_2.png" />
        </div>
        <div class="carousel-item">
          <img src="@/assets/img/main_banner_3.png" />
        </div>
      </div>

      <!-- Left and right controls -->
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#demo"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#demo"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>

  <div id="main_under_container">
    <div id="main_under_title">
      <div id="main_under_title_1">스마트한 자산 관리, 모구리와 시작하세요</div>
      <div id="main_under_title_2">
        가계부로 효율적으로 자산을 관리하고, 모의투자로 자신감을 쌓아보세요!
      </div>
    </div>
    <!-- 배너 아래쪽 -->
    <div
      class="d-flex flex-column flex-md-row justify-content-center align-items-center"
    >
      <div class="p-2 flex-fill d-flex justify-content-center" style="flex: 1">
        <!-- 소비 원소 테스트 칸 -->
        <div class="main_bottom_banner_btn_container">
          <button @click="goToPage('/element')" class="main_bottom_banner_btn">
            <div class="first-flex">
              <img
                src="../../assets/img/main_element_icon1.png"
                alt="소비 원소 테스트"
                class="img-fluid main_img_btn"
              />
            </div>
            <div class="middle-flex bg-warning"></div>
            <div class="p-2">
              <div class="last-flex d-flex flex-column">
                <div class="last-flex-1">당신의 소비 원소는❓</div>
                <div class="last-flex-2">
                  <p>
                    "나의 자산 관리 방식은 어떤 유형일까?"<br />
                    테스트를 통해 나의 소비 원소를 확인 후<br />
                    친구들과 공유 해보아요.
                  </p>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
      <div class="p-2 flex-fill d-flex justify-content-center" style="flex: 1">
        <!-- 모구리 소개 칸 -->
        <div class="main_bottom_banner_btn_container">
          <button
            @click="goToPage('/whatismoguri')"
            class="main_bottom_banner_btn"
          >
            <div class="first-flex">
              <img
                src="../../assets/img/main_whatismoguri_icon.png"
                alt="모구리 소개"
                class="img-fluid main_img_btn"
              />
            </div>
            <div class="middle-flex"></div>
            <div class="last-flex p-2">
              <div class="d-flex flex-column">
                <div class="last-flex-1">모구리 한 마리 알아가세요🐾</div>
                <div class="last-flex-2">
                  <p>
                    "돈은 중요하지만, 진정한 행복은 <br />
                    그걸 어떻게 관리하느냐에 달려있지!" <br />
                    지구에 불시착 해 자산 관리 전문가가 된 <br />
                    모구리에 대해 알아보아요.
                  </p>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
      <div class="p-2 flex-fill d-flex justify-content-center" style="flex: 1">
        <!-- 출석체크 칸 -->
        <div class="main_bottom_banner_btn_container">
          <button
            @click="goToPage('/attendance')"
            class="main_bottom_banner_btn"
          >
            <div class="first-flex">
              <img
                src="../../assets/img/main_attendance_icon.png"
                alt="출석체크"
                class="img-fluid main_img_btn"
              />
            </div>
            <div class="middle-flex"></div>
            <div class="last-flex p-2">
              <div class="d-flex flex-column">
                <div class="last-flex-1">출석 체크🎯</div>
                <div class="last-flex-2">
                  <p>
                    매일매일 출석하고 리워드를 획득해보아요. <br />
                    획득한 리워드로 다양한 컨텐츠를 즐겨보세요!
                  </p>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Carousel } from 'bootstrap';

const router = useRouter();

const goToPage = (path) => {
  router.push(path);
};

onMounted(() => {
  // 캐러셀 초기화
  const carouselElement = document.querySelector('#demo');
  if (carouselElement) {
    new Carousel(carouselElement, {
      interval: 3000, // 3초마다 슬라이드 변경
      wrap: true, // 마지막 슬라이드에서 첫 번째로 순환
    });
  }
});
</script>

<style scoped>
/* === 배너 === */
#main_banner_container {
  margin: 0 auto;
  width: 100%;
  margin-bottom: 35px;
}
.carousel {
  width: 100%;
}
.carousel-item img {
  width: 100%; /* 너비를 100%로 설정하여 Carousel의 너비에 맞춤 */
  height: auto; /* 높이를 자동으로 설정 */
  object-fit: cover; /* 이미지가 잘리더라도 비율 유지 */
}

/* 작은 화면 (예: 모바일) */
@media (max-width: 767px) {
  .carousel-item img {
    height: 200px; /* 모바일에서 적절한 높이 설정 */
  }
}
/* 중간 화면 (예: 태블릿) */
@media (min-width: 768px) and (max-width: 1023px) {
  .carousel-item img {
    height: 300px; /* 태블릿에서 적절한 높이 설정 */
  }
}
/* 큰 화면 (예: 데스크탑) */
@media (min-width: 1024px) {
  .carousel-item img {
    height: 400px; /* 데스크탑에서 적절한 높이 설정 */
  }
}

/* === 아래 === */
#main_under_container {
  padding-right: 10%;
  padding-left: 10%;
  margin: 0 auto;
  align-items: center;
  text-align: center;
  font-family: 'Pretendard-Regular';
  /* font-family: 'HakgyoansimWoojuR'; */
}
#main_under_title_1 {
  font-weight: 800;
  font-size: 1.5rem;
}
#main_under_title_2 {
  margin-bottom: 10px;
  color: #7b7b7b;
}
.main_bottom_banner_btn_container {
  width: 100%; /* 너비를 100%로 설정하여 flex에 맞춤 */
}
.main_bottom_banner_btn {
  width: 300px;
  border: none; /* 기본 테두리 제거 */
  border-radius: 10px;
  background: none; /* 기본 배경 제거 */
  padding: 0; /* 기본 패딩 제거 */
  cursor: pointer; /* 커서 모양 변경 */
  padding-top: 15px;
  transition: box-shadow 0.3s ease; /* 부드러운 그림자 애니메이션 */
}
.main_bottom_banner_btn:hover {
  box-shadow: 4px 4px 10px rgba(0, 0, 0, 0.2); /* 오른쪽과 아래에 그림자 추가 */
}

.main_img_btn {
  width: 90px;
  height: 90px;
}
.middle-flex {
  gap: 24px;
}
.last-flex {
  color: rgb(31, 41, 55);
}
.last-flex-1 {
  font-size: 20px;
  font-weight: 800;
}
.last-flex-2 {
  font-size: 15px;
  font-weight: 200;
  height: 100px;
}
.carousel-indicators {
  list-style: none;
}
</style>
