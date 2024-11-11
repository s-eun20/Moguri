<template>
  <div class="overlay" v-if="isVisible">
    <div class="modal">
      <h3>목표 입력</h3>
      <form @submit.prevent="submitGoal">
        <div class="form-group">
          <label for="goalName">목표 이름</label>
          <input type="text" v-model="goal.goalName" id="goalName" required />
        </div>
        <div class="form-group">
          <label for="goalAmount">목표 금액</label>
          <input
            type="number"
            v-model.number="goal.goalAmount"
            id="goalAmount"
            step="1"
            required
          />
        </div>
        <div class="form-group">
          <label for="startDate">시작일</label>
          <input type="date" v-model="goal.startDate" id="startDate" required />
        </div>
        <div class="form-group">
          <label for="endDate">종료일</label>
          <input type="date" v-model="goal.endDate" id="endDate" required />
        </div>
        <div class="buttons">
          <button type="submit">추가</button>
          <button type="button" @click="closeModal">취소</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useGoalStore } from "@/stores/goalStore";

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const goalStore = useGoalStore();
    const goal = ref({
      goalName: "",
      goalAmount: 0,
      currentAmount: 0,
      startDate: "",
      endDate: "",
    });

    const submitGoal = async () => {
      if (new Date(goal.value.startDate) >= new Date(goal.value.endDate)) {
        alert("종료일은 시작일보다 늦어야 합니다.");
        return;
      }

      const newGoal = {
        goalName: goal.value.goalName,
        goalAmount: goal.value.goalAmount,
        currentAmount: goal.value.currentAmount,
        startDate: goal.value.startDate,
        endDate: goal.value.endDate,
        goalCategory: null, // 저축 목표이므로 카테고리는 null
      };

      try {
        closeModal();
        const success = await goalStore.addGoal(newGoal);
        if (success) {
          emit("add-goal", newGoal);
        } else {
          alert("목표 추가에 실패했습니다. 다시 시도해 주세요.");
        }
      } catch (error) {
        console.error("Error adding goal:", error);
        alert("목표 추가 중 오류가 발생했습니다.");
      }
    };

    const closeModal = () => {
      emit("close");
      goal.value = {
        goalName: "",
        goalAmount: 0,
        currentAmount: 0,
        startDate: "",
        endDate: "",
      };
    };

    return {
      goal,
      submitGoal,
      closeModal,
    };
  },
};
</script>

<style src="./Modal.css" scoped></style>