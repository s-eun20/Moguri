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
            @click="goToPage('/moguriintro')"
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

  <!-- 스크롤 시 서비스 소개 페이지-->
  <div id="service-container">
      <div id="section">
        <section class="d-flex flex-column" id="section1">
          <section id="section1-content">
          <img src="../../assets/mainpage/머리.png" />
          <p>내 모든 자산 내역을 한 눈에 조회하고 한 곳에서 관리하세요. <br/>
              돈을 모으고 투자하는 방법을 알려주는 금융 서비스,<br/>
              모구리와 함께라면 당신의 일상이 새로워집니다.</p>
        </section>
      </section>
  
        <section id="section2">
          <section id="section2-header">
          <h3>가계부</h3><br>
          <h1>자산 관리,
          <br>지출부터 목표 설정까지 
          <br>똑똑하게</h1><br>
          <div id="section2-content">
          <h4>모구리에서 퀘스트를 설정하고<br>
              시드머니를 모아봐요<br></h4>
              <h4>퀘스트 성공 시 솜사탕을 획득하고<br>
              모의투자에서 돈을 굴려보세요<br>   
          </h4>
          </div>
        </section>
          <div class="d-flex justify-content-end" id="section2-icon">
          <img src="../../assets/mainpage/둘러보기.png">
          <img src="../../assets/mainpage/퀘스트설정.png">
          <img src="../../assets/mainpage/솜사탕.png">
         </div>
      </section>
  
        <section id="section3">
          <div class="section3-header">
          <h3>모의투자</h3><br>
          <h1>간편하고 재미있게,
          <br>모의 투자로 
          <br>투자 경험을 쌓아봐요
          </h1>
          <div class="section3-content">
            <h4>이해하기 쉬운 용어<br>
            설명이 필요 없는
            직관적인 화면 구성<br></h4>
            <h4>그리고 실제 투자에 도움을 주는<br>
            매도/매수 경험까지 한 번에</h4>
          </div>
        </div>
          <img class="section3-img" src="../../assets/mainpage/모의투자컴터.png">
        </section>
  
        <section id="section4">
          <h3>이벤트</h3><br>
          <h1>금융 퀴즈, 룰렛 돌리기 등
          <br>다양한 게임을 통해
          <br>솜사탕을 획득해 보아요
          </h1>
          <img class="section4-img" src="../../assets/mainpage/이벤트 배경.png">
        </section>
      </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { Carousel } from 'bootstrap';

const router = useRouter();
const activeSection= ref(null);

const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        const navHeight = document.querySelector(".nav").offsetHeight;
        const sectionPosition = section.offsetTop - navHeight;
  
        window.scrollTo({
          top: sectionPosition,
          behavior: "smooth"
        });
      };
    
  //scroll event 처리
  const onScroll=() => {
        const sections = document.querySelectorAll("section");
        const scrollPosition = window.scrollY + window.innerHeight / 3;
  
        sections.forEach((section) => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
  
          if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
          ) {
            activeSection.value = section.getAttribute("id");
          }
        });
      }
//페이지 이동 함수
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
  window.addEventListener('scroll', onScroll);
}); 
// 컴포넌트가 언마운트될 시, 스크롤 이벤트 리스터 제거
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style scoped>
@import '../../assets/mainpage/Main.css';
</style>