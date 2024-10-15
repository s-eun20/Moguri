<template>
  <div v-show="show" class="modal-overlay">
    <div class="modal">
      <p>{{ message }}</p>
      <button @click="close">확인</button>
    </div>
  </div>
</template>

  
<script>
export default {
  name: 'LoginCheckModal',
  props: {
    show: Boolean,
    message: String,
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
    z-index: 1000; /* 높은 z-index 값 추가 */
  }
  
  .modal {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    z-index: 1001; /* modal-overlay보다 높은 z-index 값 추가 */
    position: relative; /* position 추가 */
    max-width: 80%; /* 최대 너비 설정 */
    width: 300px; /* 기본 너비 설정 */
    }
  
  button {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #FECD72;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #F0B300;
  }
  </style>