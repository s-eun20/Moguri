<template>
  <div id="intro">
    <!-- 위 배너 -->
    <div id="demo" class="carousel slide" data-ride="carousel">
      <!-- Indicators -->
      <ul class="carousel-indicators">
        <li data-target="#demo" data-slide-to="0" class="active"></li>
        <li data-target="#demo" data-slide-to="1"></li>
        <li data-target="#demo" data-slide-to="2"></li>
      </ul>

      <!-- The slideshow -->
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img src="../../assets/main_test.png" />
        </div>
        <div class="carousel-item">
          <img
            src="https://oimg1.kbstar.com/img/oevent/2022/0401_bot/event_visual.jpg"
          />
        </div>
        <div class="carousel-item">
          <img src="https://oimg1.kbstar.com/img/omweb/new/banner_2022.png" />
        </div>
      </div>

      <!-- Left and right controls -->
      <a class="carousel-control-prev" href="#demo" data-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </a>
      <a class="carousel-control-next" href="#demo" data-slide="next">
        <span class="carousel-control-next-icon"></span>
      </a>
    </div>
  </div>

  <div id="main_container">
    <!-- 아래 배너 -->
    <div class="buttons-container" style="border-color: red">
      <div class="row">
        <div class="col-sm-4">
          <div class="main_bottom_banner_btn_container">
            <button
              class="main_bottom_banner_btn"
              @click="goToPage('/element')"
            >
              당신의 소비 원소는?
            </button>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="main_bottom_banner_btn_container">
            <button
              class="main_bottom_banner_btn"
              @click="goToPage('/whatismoguri')"
            >
              모구리 한 마리 알아가세요
            </button>
          </div>
        </div>
        <div class="col-sm-4">
          <div class="main_bottom_banner_btn_container">
            <button
              class="main_bottom_banner_btn"
              @click="goToPage('/attendance')"
            >
              출석 체크!
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToPage = (path) => {
  router.push(path); // 지정된 경로로 이동
};
</script>

<style scoped>
* {
  font-family: 'HakgyoansimWoojuR';
}
/* === 배너 === */
#intro {
  margin: 0 auto;
  width: 100%;
  margin-bottom: 48px;
}

.carousel {
  width: 100%;
}

.carousel-item img {
  width: 100%; /* 너비를 100%로 설정하여 Carousel의 너비에 맞춤 */
  height: auto; /* 비율을 유지하면서 높이를 자동으로 조정 */
  object-fit: cover; /* 이미지가 잘리더라도 비율 유지 */
}

/* === 아래 === */
#main_container {
  padding-right: 10%;
  padding-left: 10%;
  margin: 0 auto;
}
.main_bottom_banner_btn_container {
  padding-right: 25px;
  padding-left: 25px;
}
.main_bottom_banner_btn {
  margin: 0 auto;
  width: 90%;
  height: 120px;
  border-radius: 5px;
  border: none;
  border: 3px solid #fce2a9;
  background-color: white;
  font-size: 1.5rem;
}

.carousel {
  width: 100%;
}
.carousel-item img {
  width: 100%; /* 너비를 100%로 설정하여 Carousel의 너비에 맞춤 */
  /* height: auto; */
  height: 400px; /* 원하는 높이 설정 */
  object-fit: cover; /* 이미지가 잘리더라도 비율 유지 */
}
</style>
