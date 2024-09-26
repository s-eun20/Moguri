<template>
  <div id="intro">
    <!-- 위 배너 -->
    <div
      id="carouselExampleIndicators"
      class="carousel slide"
      data-ride="carousel"
    >
      <ol class="carousel-indicators">
        <li
          data-target="#carouselExampleIndicators"
          data-slide-to="0"
          class="active"
        ></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
      </ol>
      <div class="carousel-inner">
        <!-- 이미지 -->
        <div class="carousel-item-active">
          <img
            class="d-block w-100"
            src="../../assets/main_test.png"
            alt="First slide"
          />
        </div>
        <!-- 이미지2 -->
        <div class="carousel-item">
          <img
            class="d-block w-100"
            src="../../assets/background.jpg"
            alt="Second slide"
          />
        </div>
      </div>
      <a
        class="carousel-control-prev"
        href="#carouselExampleIndicators"
        role="button"
        data-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only"> </span>
      </a>
      <a
        class="carousel-control-next"
        href="#carouselExampleIndicators"
        role="button"
        data-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only"> </span>
      </a>
    </div>
  </div>
  <!-- 아래 배너 -->
  <div class="buttons-container">
    <button class="consumption">당신의 소비 원소는?</button>
    <button class="moguri">모구리 한 마리 알아가세요</button>
    <button class="check-in">출석 체크!</button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'Buttons',
};
</script>

<style scoped>
.carousel-item {
  width: 100%; /* 부모 요소 너비에 맞게 설정 */
  max-width: 800px; /* 배너의 최대 너비 설정 */
  height: 300px; /* 배너의 고정 높이 설정 */
  margin: 0 auto; /* 중앙 정렬 */
}

.carousel-item img {
  width: 100%;
  height: 100%; /* 부모 컨테이너 높이에 맞춰 설정 */
  object-fit: contain; /* 이미지 비율을 유지하며 잘리지 않도록 설정 */
}

.carousel-control-next-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M2.75 0l-1.5 1.5 2.5 2.5-2.5 2.5 1.5 1.5 4-4-4-4z'/%3E%3C/svg%3E");
}
.carousel-control-prev-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23000' viewBox='0 0 8 8'%3E%3Cpath d='M5.25 0l-4 4 4 4 1.5-1.5-2.5-2.5 2.5-2.5-1.5-1.5z'/%3E%3C/svg%3E");
}
.buttons-container {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

button {
  padding: 1rem 2rem;
  border: none;
  background-color: #ffebc6;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #ffcc80;
}

.consumption {
  background-color: #ffe0e0;
}

.moguri {
  background-color: #e0ffe0;
}

.check-in {
  background-color: #e0f7ff;
}
</style>
