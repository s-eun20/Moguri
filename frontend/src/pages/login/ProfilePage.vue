<template>
    <div class="container-fluid">
      <div class="row px-xl-3">
        <!-- 사이드바 -->
        <div class="col-lg-2">
          <div class="sidebar">
            <h2>마이페이지</h2>
            <ul>
              <li><a href="#">개인 정보</a></li>
              <li><a href="#">회원 정보 수정</a></li>
              <li><a href="#">로그 아웃</a></li>
            </ul>
          </div>
        </div>
  
        <!-- 오른쪽 화면 -->
        <div class="col-lg-10 col-xl-8 col-lg-3 mt-5 ms-5">
          <!-- 개인정보 수정 -->
          <div class="card border mb-5">
            <div class="card-header border-bottom">
              <h4 class="card-header-title">개인정보 수정</h4>
            </div>
            <div class="card-body">
              <form class="row g-3" @submit.prevent="updateProfile">
                <div class="col-12">
                  <label class="form-label ms-1" style="color: #bababa">프로필 사진 업로드</label>
                  <div class="d-flex align-items-start mb-3">
                    <label class="mt-3 ms-5" for="uploadfile" style="cursor: pointer; display: flex; align-items: center; justify-content: center">
                      <div style="position: relative; display: inline-block">
                        <img class="avatar-img" :src="profilePhoto || defaultPhoto" style="width: 100px; height: 100px; object-fit: cover; border-radius: 50%" />
                        <div style="position: absolute; bottom: 5px; right: 5px; background-color: white; border-radius: 50%; padding: 5px; display: flex; justify-content: center; align-items: center;">
                          <i class="fa-solid fa-camera"></i>
                        </div>
                      </div>
                    </label>
                    <input type="file" id="uploadfile" style="display: none" accept="image/*" @change="onFileChange" />
                  </div>
                </div>
  
                <div class="col-md-6">
                  <label class="nicname mb-2">닉네임</label><br />
                  <input class="text-nicname w-100" type="text" v-model="nickname" placeholder="닉네임을 입력하세요" style="border: 2px solid #eaecef; border-radius: 3px; padding: 2%" />
                </div>
  
                <div class="col-12 text-end">
                  <button class="btn mb-1 me-3" style="border: 1px solid #ff8f17; background-color: #ff8f17; color: white">수정</button>
                </div>
              </form>
            </div>
          </div>
  
          <!-- 비밀번호 변경 -->
          <div class="card border mb-5">
            <div class="card-header card-bottom">
              <h4 class="card-header-title">비밀번호 변경</h4>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">기존 비밀번호</label>
                <input class="form-control" v-model="currentPassword" type="password" placeholder="기존 비밀번호를 입력하세요" />
              </div>
              <div class="mb-3">
                <label class="form-label">새로운 비밀번호</label>
                <input class="form-control" v-model="newPassword" type="password" placeholder="새로운 비밀번호를 입력하세요" />
              </div>
              <div class="mb-3">
                <label class="form-label">비밀번호 확인</label>
                <input class="form-control" v-model="confirmNewPassword" type="password" placeholder="비밀번호를 다시 입력하세요" />
                <span class="ms-2" style="color: red;">{{ errorMessage }}</span>
              </div>
              <div class="col-12 text-end">
                <button class="btn mb-1 me-3" @click="updatePassword" style="border: 1px solid #ff8f17; background-color: #ff8f17; color: white">변경</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  const profilePhoto = ref(null);
  const defaultPhoto = '@/assets/img/Moguri.png';
  const nickname = ref(authStore.state.user.nickname);
  const currentPassword = ref('');
  const newPassword = ref('');
  const confirmNewPassword = ref('');
  const errorMessage = ref('');
  
  // 프로필 사진 변경 핸들러
  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        profilePhoto.value = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 개인정보 수정 (닉네임 및 사진)
  const updateProfile = async () => {
    try {
      await axios.patch(`http://localhost:8080/api/members/${authStore.state.user.memberId}`, {
        nickname: nickname.value,
      });
      alert('회원정보가 수정되었습니다.');
      authStore.state.user.nickname = nickname.value;
      router.push('/');
    } catch (error) {
      console.error('회원정보 수정 실패:', error);
      errorMessage.value = '회원정보 수정에 실패했습니다.';
    }
  };
  
  // 비밀번호 변경
  const updatePassword = async () => {
    if (newPassword.value !== confirmNewPassword.value) {
      errorMessage.value = '새 비밀번호가 일치하지 않습니다.';
      return;
    }
  
    try {
      await axios.patch(`http://localhost:8080/api/members/${authStore.state.user.memberId}/password`, {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      });
      alert('비밀번호가 변경되었습니다.');
      currentPassword.value = '';
      newPassword.value = '';
      confirmNewPassword.value = '';

      router.push({name:'Main'});

    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      errorMessage.value = '비밀번호 변경에 실패했습니다.';
    }
  };
  </script>
<style scoped>
/* 사이드바 스타일 */
.sidebar {
  margin-bottom: 20px;
  margin-right: 10px;
  width: 200px;
  padding: 20px; /* 여백 추가 */
  background-color: #f9f9f9; /* 연한 배경색 추가 */
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
  font-family: 'HakgyoansimWoojuR', sans-serif; /* 네비게이션 바의 폰트와 동일하게 설정 */
  position: sticky;
  top: 20px; /* 상단에서 20px 떨어지도록 고정 */
}

.sidebar h2 {
  font-size: 22px;
  margin-bottom: 20px;
  font-weight: bold;
  color: rgb(255, 166, 0); /* 주황색으로 강조 */
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar ul li {
  margin: 15px 0; /* 간격을 넓혀 여유 공간 확보 */
}

.sidebar ul li a {
  text-decoration: none;
  color: black;
  font-weight: bold;
  font-size: 18px;
  padding: 10px 15px; /* 링크에 패딩 추가로 클릭 영역 확대 */
  display: block;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.sidebar ul li a:hover {
  background-color: rgba(255, 166, 0, 0.1); /* 호버 시 배경색을 연하게 변경 */
  color: rgb(255, 166, 0); /* 텍스트 색상 변경 */
}

/* 컨테이너 스타일 */
.container-fluid {
  padding: 20px;
  background-color: white;
  font-family: 'HakgyoansimWoojuR', sans-serif; /* 폰트 통일 */
}

/* 카드 컴포넌트 스타일 */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.card-header-title {
  font-size: 18px;
  color: #333;
  font-family: 'HakgyoansimWoojuR', sans-serif; /* 폰트 통일 */
}

/* 폼 컨트롤 스타일 */
.form-control {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  transition: border-color 0.3s;
  font-family: 'HakgyoansimWoojuR', sans-serif; /* 폰트 통일 */
}

.form-control:focus {
  border-color: rgb(255, 166, 0); /* 주황색 테마 적용 */
  outline: none;
}

/* 버튼 스타일 */
.btn {
  background-color: rgb(255, 166, 0);
  border: none;
  color: white;
  cursor: pointer;
  font-family: 'HakgyoansimWoojuR', sans-serif; /* 폰트 통일 */
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #f0b300;
}

/* 아바타 이미지 스타일 */
.avatar-img {
  border-radius: 50%;
  border: 2px solid rgb(255, 166, 0); /* 프로필 사진 테두리 주황색 */
  width: 100px;
  height: 100px;
  object-fit: cover;
  transition: transform 0.3s;
}

.avatar-img:hover {
  transform: scale(1.05); /* Hover 시 살짝 확대 */
}
</style>
