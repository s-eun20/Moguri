<template>
    <div>
        <p class="objectQuestion-div">
            {{ questions['question'] }}
        </p>
        <div>
            <label
                :for="key"
                class="objectExample-label border"
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
                    question: "Q. ‘은행들의 은행’이라는 별명을 갖고 있는 화폐 발행 등 독점적 권한을 갖고 있는 곳은?",
                    answers: {a: '1. 특수은행', b: '2. 투자은행', c: '3. 중앙은행', d: '4. 상업은행'},
                    correctAnswer: 'a'
                }
            }
        },
        methods: {
            answered(e) {
                this.selectedAnswer = e.target.value;
                if(this.selectedAnswer == this.questions['correctAnswer']) {
                    this.checkAnswer = true;
                    this.$emit('ObjectCheck', true);
                }
                    
                else {
                    this.checkAnswer = false;
                    this.$emit('ObjectCheck', false);
                }
            }       
        }
    }
</script>

<style src='./ObjectiveQuiz.css' scoped>

</style>