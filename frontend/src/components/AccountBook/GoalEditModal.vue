<template>
    <div class="overlay" v-if="isVisible">
      <div class="modal">
        <h3>목표 수정</h3>
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
            <button type="submit">수정</button>
            <button type="button" @click="closeModal">취소</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from "vue";
  import { useGoalStore } from "@/stores/goalStore";
  
  export default {
    props: {
      isVisible: {
        type: Boolean,
        required: true,
      },
      goal: {
        type: Object,
        required: true,
      },
    },
    setup(props, { emit }) {
      const goalStore = useGoalStore();
      const goal = ref({ ...props.goal }); // Create a reactive copy of the goal

      watch(
        () => props.goal,
        (newGoal) => {
          goal.value = { ...newGoal }; // Update the goal when props change
        }
      );

      const submitGoal = async () => {
        if (new Date(goal.value.startDate) >= new Date(goal.value.endDate)) {
          alert("종료일은 시작일보다 늦어야 합니다.");
          return;
        }

        const updatedGoal = {
          goalId: goal.value.goalId, // Include the goalId for updating
          goalName: goal.value.goalName,
          goalAmount: goal.value.goalAmount,
          currentAmount: goal.value.currentAmount,
          startDate: goal.value.startDate,
          endDate: goal.value.endDate,
          goalCategory: null, // Adjust as necessary
        };

        try {
          await goalStore.updateGoal(updatedGoal);
          emit("goal-updated", updatedGoal); // Emit the updated goal
          closeModal();
        } catch (error) {
          console.error("Error updating goal:", error);
          alert("목표 수정 중 오류가 발생했습니다.");
        }
      };

      const closeModal = () => {
        emit("close");
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