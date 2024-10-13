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
                  <div class="d-flex align-items-center">
                    <input class="text-nicname w-100" type="text" v-model="nickname" placeholder="닉네임을 입력하세요" style="border: 2px solid #eaecef; border-radius: 3px; padding: 2%" />
                    <img class="nickname-avatar" :src="profilePhoto || defaultPhoto" alt="프로필 이미지" style="width: 40px; height: 40px; border-radius: 50%; margin-left: 10px; object-fit: cover;" />
                  </div>
                </div>
  
                <div class="col-12 text-end">
                  <button type="submit" class="btn mb-1 me-3" style="border: 1px solid #ff8f17; background-color: #ff8f17; color: white">수정</button>
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
                <button class="btn mb-1 me-3" @click="updatePassword" style="border: 1px solid #ff8f17; background-color: #ff8f17; color: white">비밀번호 변경</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/auth';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const authStore = useAuthStore();
  const profilePhoto = ref(null);
  const defaultPhoto = 'path_to_default_image'; // 기본 이미지 경로
  const nickname = ref(authStore.nickname);
  const currentPassword = ref('');
  const newPassword = ref('');
  const confirmNewPassword = ref('');
  const errorMessage = ref('');
  const router = useRouter();
  
  const userId = authStore.state.user.memberId; // 스토어에서 유저 ID를 가져옴
  
  // 로그아웃
  const logout = () => {
    authStore.logout();
    router.push({ name: 'Home' }); // 홈 페이지로 리다이렉트
  };
  
  // 모구리 모으기 페이지로 이동
  const navigateToMoguri = () => {
    router.push({ name: 'Moguri' });
  };
  
  // 회원 정보 수정 페이지로 이동
  const navigateToProfileEdit = () => {
    router.push({ name: 'EditProfile' });
  };
  
  // 프로필 수정
  const updateProfile = async () => {
    try {
      const requestData = {
        email: authStore.state.user.email, // 스토어에서 이메일 가져오기
        nickName: nickname.value, // 닉네임
        password: currentPassword.value || '', // 비밀번호가 있으면 전송
      };
  
      const response = await axios.patch(`http://localhost:8080/api/members/${userId}`, requestData);
  
      if (response.data.returnCode === '0000') {
        alert('프로필 수정이 완료되었습니다.');
      } else {
        alert('프로필 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 수정 중 오류:', error);
      alert('프로필 수정 중 오류가 발생했습니다.');
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

    // 비밀번호 변경 후 입력된 필드 초기화
    currentPassword.value = '';
    newPassword.value = '';
    confirmNewPassword.value = '';

    // 메인 페이지로 리다이렉트
    authStore.logout();
    router.push({ name: 'Main' });
    
  } catch (error) {
    console.error('비밀번호 변경 실패:', error);
    errorMessage.value = '비밀번호 변경에 실패했습니다.';
  }
};

  
  // 파일 업로드 처리
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
  </script>
  
  <style scoped>
  /* 스타일링 */
  .sidebar {
    background-color: #f8f9fa;
    padding: 1.5rem;
    border-radius: 0.5rem;
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
    background-color: #ffecd1;
  }
  </style>
  