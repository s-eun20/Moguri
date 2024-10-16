<template>
    <div v-if="isVisible" class="modal-overlay" @click.self="close">
      <div class="modal">
        <h3 class="modal-title">{{ title }}</h3>
        <p class="modal-message">{{ message }}</p>
        <button @click="confirm" class="modal-button">확인</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      isVisible: {
        type: Boolean,
        required: true,
      },
      title: {
        type: String,
        default: '알림',
      },
      message: {
        type: String,
        default: '',
      },
    },
    methods: {
      close() {
        this.$emit('update:isVisible', false); // 모달을 닫을 때 부모에게 알림
      },
      confirm() {
        this.close();
        this.$emit('confirm'); // 확인 버튼 클릭 시 부모에게 알림
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
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal {
    background: white;
    padding: 30px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .modal-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .modal-message {
    font-size: 16px;
    margin-bottom: 20px;
  }
  
  .modal-button {
    padding: 10px 20px;
    background-color: #FECD72;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
  }
  
  .modal-button:hover {
    background-color: #F0B300;
  }
  </style>
  