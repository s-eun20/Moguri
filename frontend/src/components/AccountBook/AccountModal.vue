<template>
  <div class="overlay" v-if="isVisible">
    <div class="modal">
      <h3>거래 내역 추가</h3>
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
          <option value="저축">저축</option>
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
        <label for="description">상세내역</label>
        <div class="input-wrapper">
          <input
            type="text"
            id="description"
            v-model="description"
            @input="filterGoals"
          />
          <ul
            v-if="
              type === '저축' &&
              filteredGoals.length > 0 &&
              description.trim() !== ''
            "
            class="goal-list"
          >
            <li
              v-for="goal in filteredGoals"
              :key="goal.goalName"
              @click="selectGoal(goal)"
            >
              {{ goal.goalName }}
            </li>
          </ul>
        </div>
      </div>
      <div class="form-group" v-if="type === '지출'">
        <label for="paymentMethod">결제 방법</label>
        <select id="paymentMethod" v-model="paymentMethod">
          <option value="">결제 방법 선택</option>
          <option v-for="method in paymentMethods" :key="method">
            {{ method }}
          </option>
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
import { defineComponent, ref, computed, watch } from "vue";
import { useGoalStore } from "@/stores/goalStore";
import { useAuthStore } from "@/stores/auth"; // auth 스토어를 가져옵니다.

export default defineComponent({
  props: {
    isVisible: Boolean,
  },
  setup(props, { emit }) {
    const goalStore = useGoalStore();
    const authStore = useAuthStore(); // auth 스토어를 사용합니다.

    // authStore에서 memberId를 가져옵니다.
    const memberId = computed(() => authStore.state.user.memberId);

    const transactionDate = ref("");
    const type = ref("");
    const category = ref("");
    const incomeType = ref("");
    const amount = ref(0);
    const description = ref("");
    const paymentMethod = ref("");
    const categories = ref([
      "식비",
      "교통비",
      "건강",
      "쇼핑",
      "통신비",
      "주거비",
    ]);
    const paymentMethods = ref(["현금", "신용카드", "체크카드", "계좌이체"]);
    const filteredGoals = ref([]);

    const handleTypeChange = async () => {
      if (type.value === "저축" || description.value.trim() === "") {
        await goalStore.fetchGoals();
        filterGoals();
      } else {
        filteredGoals.value = [];
      }
    };

    const filterGoals = () => {
      if (type.value !== "저축") return;

      const searchText = description.value.toLowerCase().trim();
      filteredGoals.value = goalStore.goals.filter(
        (goal) =>
          goal.goalCategory === null &&
          goal.goalName.toLowerCase().includes(searchText)
      );
    };

    const selectGoal = (goal) => {
      description.value = goal.goalName;
      filteredGoals.value = [];
    };

    watch(type, handleTypeChange);

    const closeModal = () => {
      emit("close");
      resetForm();
    };

    const addTransaction = () => {
  // newTransaction 생성
  const newTransaction = {
    memberId: memberId.value, // memberId를 computed로 가져옵니다.
    transactionDate: transactionDate.value,
    type: type.value,
    category:
      type.value === "지출"
        ? category.value
        : type.value === "수입"
        ? incomeType.value
        : null, // 저축의 경우 category를 null로 설정
    amount: amount.value,
    description: description.value,
    paymentMethod: type.value === "지출" ? paymentMethod.value : "",
  };

  // 순환 참조를 피하기 위해 새로운 객체를 JSON으로 변환
  const transactionData = {
    ...newTransaction,
  };

  emit("add", transactionData); // emit으로 새로운 객체를 전달
  console.log(transactionData);
      if (type.value === "저축") {
        const matchingGoal = goalStore.goals.find(
          (goal) => goal.goalName === description.value
        );
        if (matchingGoal) {
          matchingGoal.currentAmount += amount.value; 
          goalStore.updateGoal(matchingGoal); 
        }
      }
      closeModal();
    };
    
    const resetForm = () => {
      transactionDate.value = "";
      type.value = "";
      category.value = "";
      incomeType.value = "";
      amount.value = 0;
      description.value = "";
      paymentMethod.value = "";
      filteredGoals.value = [];
    };

    return {
      memberId, // computed 속성 반환
      transactionDate,
      type,
      category,
      incomeType,
      amount,
      description,
      paymentMethod,
      categories,
      paymentMethods,
      filteredGoals,
      handleTypeChange,
      filterGoals,
      selectGoal,
      closeModal,
      addTransaction,
      resetForm,
    };
  },
});
</script>

<style src="./Modal.css" scoped></style>
