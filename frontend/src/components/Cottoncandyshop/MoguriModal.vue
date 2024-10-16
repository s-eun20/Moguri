<template>
    <transition name="modal-fade">
      <div v-if="isVisible" class="modal-overlay">
        <div class="modal-content">
          <p>
            당신의 캐릭터로 사용하시겠습니까?
          </p>
          <div class="button-group">
            <button @click="confirmUsage" class="confirm-button">확인</button>
            <button @click="cancelUsage" class="cancel-button">취소</button>
          </div>
        </div>
      </div>
    </transition>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: {
        type: Boolean,
        required: true,
      },
      character: {
        type: Object,
        required: true,
      },
    },
    methods: {
      confirmUsage() {
        this.$emit('confirm');
        // 모달 비활성화
        this.$emit('update:isVisible', false);
      },
      cancelUsage() {
        this.$emit('cancel');
        // 모달 비활성화
        this.$emit('update:isVisible', false);
      },
    },
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
    max-width: 500px; /* 모달 최대 너비 설정 */
    width: 100%; /* 모바일 대응을 위한 반응형 너비 */
    font-size: 1.4rem;
  }
  
  button {
    margin: 0 10px;
    padding: 7px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .confirm-button {
    background-color: #72be7c;
    color: white;
  }
  
  .cancel-button {
    background-color: #e7815f;
    color: white;
  }
  
  /* 애니메이션 스타일 */
  .modal-fade-enter-active,
  .modal-fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .modal-fade-enter-from,
  .modal-fade-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
  
  .modal-fade-enter-to,
  .modal-fade-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
  </style>
  