<template>
  <div class="overlay" v-if="isVisible">
    <div class="modal">
      <h3>수입/지출 내역 추가</h3>
      <div class="form-group">
        <label for="transactionDate">날짜</label>
        <input type="date" id="transactionDate" v-model="transactionDate" />
      </div>
      <div class="form-group">
        <label for="type">유형</label>
        <select id="type" v-model="type">
          <option value="">유형 선택</option>
          <option value="수입">수입</option>
          <option value="지출">지출</option>
        </select>
      </div>
      <div class="form-group" v-if="type === '수입'">
        <label for="incomeType">수입 유형</label>
        <select id="incomeType" v-model="incomeType">
          <option value="">카테고리</option>
          <option value="고정수입">고정수입</option>
          <option value="부수입">부수입</option>
        </select>
      </div>
      <div class="form-group" v-if="type === '지출'">
        <label for="category">카테고리</label>
        <select id="category" v-model="category">
          <option value="">카테고리 선택</option>
          <option v-for="cat in categories" :key="cat">{{ cat }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="amount">금액</label>
        <input type="number" id="amount" v-model="amount" />
      </div>
      <div class="form-group">
        <label for="description">거래 상세내역</label>
        <input type="text" id="description" v-model="description" />
      </div>
      <div class="form-group">
        <label for="paymentMethod">결제 방법</label>
        <select id="paymentMethod" v-model="paymentMethod">
          <option value="">결제 방법 선택</option>
          <option v-for="method in paymentMethods" :key="method">{{ method }}</option>
        </select>
      </div>
      <div class="buttons">
        <button @click="addTransaction">추가</button>
        <button @click="closeModal">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: Boolean
  },
  data() {
    return {
      memberId: 1,
      transactionDate: '',
      type: '',
      category: '',
      incomeType: '',
      amount: 0,
      description: '',
      paymentMethod: '',
      categories: ['식비', '교통비', '건강', '쇼핑', '통신비','주거비'],
      paymentMethods: ['현금', '신용카드', '체크카드', '계좌이체']
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
      this.resetForm();
    },
    addTransaction() {
      if (!this.type || 
          (this.type === '지출' && !this.category) || 
          (this.type === '수입' && !this.incomeType) || 
          this.amount <= 0 || 
          !this.paymentMethod) {
        alert('모든 필드를 올바르게 입력해 주세요.');
        return;
      }
      const newTransaction = {
        memberId: this.memberId,
        transactionDate: this.transactionDate,
        type: this.type,
        category: this.type === '지출' ? this.category : this.incomeType,
        amount: this.amount,
        description: this.description,
        paymentMethod: this.paymentMethod
      };
      this.$emit('add', newTransaction);
      console.log(newTransaction);
      this.closeModal();
    },
    resetForm() {
      this.transactionDate = '';
      this.type = '';
      this.category = '';
      this.incomeType = '';
      this.amount = 0;
      this.description = '';
      this.paymentMethod = '';
    }
  }
};
</script>

<style src="./Modal.css" scoped>
</style>