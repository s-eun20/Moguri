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
        <!-- 회원정보 수정 -->
        <div class="card border mb-5">
          <div class="card-header border-bottom">
            <h4 class="card-header-title">회원정보 수정</h4>
          </div>
          <div class="card-body">
            <form class="row g-3" @submit.prevent="updateProfile">
              <div class="col-md-6">
                <label class="nicname mb-2">닉네임</label><br />
                <input
                  class="text-nicname w-100"
                  type="text"
                  v-model="nickname"
                  placeholder="닉네임을 입력하세요"
                  style="border: 2px solid #eaecef; border-radius: 3px; padding: 2%; font-family: 'HakgyoansimWoojuR', sans-serif;"
                />
              </div>

              <div class="col-12 text-end">
                <button
                  type="submit"
                  class="btn mb-1 me-3"
                  style="border: 1px solid #ff8f17; background-color: #ff8f17; color: white; font-family: 'HakgyoansimWoojuR', sans-serif;"
                >
                  수정
                </button>
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
              <input
                class="form-control"
                v-model="currentPassword"
                type="password"
                placeholder="기존 비밀번호를 입력하세요"
                style="font-family: 'HakgyoansimWoojuR', sans-serif;"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">새로운 비밀번호</label>
              <input
                class="form-control"
                v-model="newPassword"
                type="password"
                placeholder="새로운 비밀번호를 입력하세요"
                style="font-family: 'HakgyoansimWoojuR', sans-serif;"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">비밀번호 확인</label>
              <input
                class="form-control"
                v-model="confirmNewPassword"
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                style="font-family: 'HakgyoansimWoojuR', sans-serif;"
              />
              <span class="ms-2" style="color: red;">{{ errorMessage }}</span>
            </div>
            <div class="col-12 text-end">
              <button
                class="btn mb-1 me-3"
                @click="updatePassword"
                style="border: 1px solid #ff8f17; background-color: #ff8f17; color: white; font-family: 'HakgyoansimWoojuR', sans-serif;"
              >
                비밀번호 변경
              </button>
            </div>

            <!-- 비밀번호 변경 결과 메시지 -->
            <div v-if="passwordChangeMessage" class="alert alert-success mt-3">
              {{ passwordChangeMessage }}
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
const nickname = ref(authStore.nickname);
const currentPassword = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const errorMessage = ref('');
const passwordChangeMessage = ref(''); // 비밀번호 변경 메시지 상태
const router = useRouter();

const userId = authStore.state.user.memberId; // 스토어에서 유저 ID를 가져옴

// 로그아웃
const logout = () => {
  authStore.logout();
  router.push({ name: 'Home' }); // 홈 페이지로 리다이렉트
};

// 모구리 모으기 페이지로 이동
const navigateToMoguri = () => {
  router.push({ name: 'Moguri' }); // 모구리 페이지로 이동
};

// 회원 정보 수정 페이지로 이동
const navigateToProfileEdit = () => {
  router.push({ name: 'EditProfile' }); // 회원 정보 수정 페이지로 이동
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

    // 비밀번호 변경 성공 메시지
    passwordChangeMessage.value = '비밀번호가 변경되었습니다.';

    // 비밀번호 변경 후 입력된 필드 초기화
    currentPassword.value = '';
    newPassword.value = '';
    confirmNewPassword.value = '';

    // 일정 시간 후 메인 페이지로 리다이렉트
    setTimeout(() => {
      // 비밀번호 변경 메시지 초기화
      passwordChangeMessage.value = '';
      authStore.logout();
      router.push({ name: 'Main' });
    }, 2000); // 2초 후 이동
  } catch (error) {
    console.error('비밀번호 변경 실패:', error);
    errorMessage.value = '비밀번호 변경에 실패했습니다.';
  }
};
</script>

<style scoped>
/* 스타일링 */
.sidebar {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
  font-family: 'HakgyoansimWoojuR', sans-serif; /* 사이드바 폰트 설정 */
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

/* 카드 내의 텍스트 필드 폰트 설정 */
.card-header-title {
  font-family: 'HakgyoansimWoojuR', sans-serif; /* 카드 제목 폰트 설정 */
}

/* 전체 카드 본문에 대한 폰트 설정 */
.card-body {
  font-family: 'HakgyoansimWoojuR', sans-serif; /* 카드 본문 폰트 설정 */
}

/* 입력 필드의 폰트 설정 */
.input-field {
  font-family: 'HakgyoansimWoojuR', sans-serif; /* 입력 필드 폰트 설정 */
}
</style>
