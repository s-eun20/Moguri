<template>
  <transition name="modal-fade">
    <div v-if="isVisible" class="modal-overlay">
      <div class="modal-content">
        <p>{{ message }}</p>
        <button @click="close" class="confirm-button">확인</button>
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
    message: {
      type: String,
      required: true,
    },
  },
  methods: {
    close() {
      this.$emit('close');
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
  /* background-color: #f7f2d6; */
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  max-width: 600px; /* 모달 최대 너비 설정 */
  width: 100%; /* 모바일 대응을 위한 반응형 너비 */
  font-size: 1.4rem;
}

.confirm-button {
  margin-top: 15px;
  padding: 7px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #72be7c;
  color: white;
  width: 20%;
  margin: auto;
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
