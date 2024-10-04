<template>
    <div>
        <p class="subQuestion-div">
            {{ questions['question'] }}
        </p>
        <div>
            <p>답 : 
                <input
                    class="input"
                    :value="selectedAnswer"
                    @input="answered($event)"
                    placeholder="정답을 입력하세요"/>
            </p>
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
                    question: "Q. 지배구조가 나쁘거나 실적이 부진한 기업의 주식을 매입, 의결권을 확보한 뒤 회사를 압박해 단기간에 기업가치를 높여 수익을 올리는 것을 ‘OOOO 투자’라고 한다. 빈칸에 들어갈 말은?",
                    correctAnswer: '행동주의'
                }
            }
        },
        methods: {
            answered(e) {
                this.selectedAnswer= e.target.value;
                if(this.selectedAnswer == this.questions['correctAnswer']) {
                    this.checkAnswer = true;
                    this.$emit('SubjectCheck', true);
                }

                else {
                    this.checkAnswer = false;
                    this.$emit('SubjectCheck', false);
                }
            },
        }
    }
</script>

<style src='./SubjectiveQuiz.css' scoped>

</style>