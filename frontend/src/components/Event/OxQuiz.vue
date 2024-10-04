<template>
    <div>
        <p class="oxQuestion-div">
            {{ questions['question'] }}
        </p>
        <div>
            <label
                :for="key"
                class="oxExample-label border"
                v-for="answer,key in questions['answers']"
                :class="{'hover:example-label-gray cursor-pointer' : selectedAnswer == ''},
                    {'example-label-orange' : selectedAnswer == key}"
            >
                <input
                    type="radio"
                    :id="key"
                    class="hidden"
                    :value="key"
                    @change="answered($event)"
                    v-model="selectedAnswer"
                    :disabled="selectedAnswer != ''"
                />
                {{ answer }}
            </label>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                selectedAnswer: '',
                checkAnswer: '',
                questions: {
                    question: "Q. 인테리어 계약서에는 공사 항목별로 세분화된 내역을 기재해야 한다?",
                    answers: {o: 'O 세분화된 내역서가 필요하다', x: 'X 전체 공사금액만 적으면 된다'},
                    correctAnswer: 'x'
                }
            }
        },
        methods: {
            answered(e) {
                this.selectedAnswer = e.target.value;
                if(this.selectedAnswer == this.questions['correctAnswer']) {
                    this.checkAnswer = true;
                    this.$emit('OxCheck', true);
                }

                else {
                    this.checkAnswer = false;
                    this.$emit('OxCheck', false);
                }
            },
        }
    }
</script>

<style src='./OxQuiz.css' scoped>

</style>