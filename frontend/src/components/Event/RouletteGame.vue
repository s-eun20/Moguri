<template>
    <div class="roulette-outer">
        <div class="roulette-pin"></div>
        <div class="roulette" v-bind:style="rouletteStyle">

            <!-- 값 영역 -->
            <div class="item-wrapper">
                <div class="item">10000<br>솜사탕</div>
                <div class="item">1000<br>솜사탕</div>
                <div class="item">30000<br>솜사탕</div>
                <div class="item">5000<br>솜사탕</div>
                <div class="item">꽝</div>
                <div class="item">한번 더!</div>
            </div>

            <!-- 선 영역 -->
             <div class="line-wrapper">
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
                <div class="line"></div>
             </div>

        </div>

        <div class="roulette-image">
            <img src="../../assets/img/roulettemoguri.png" > 
        </div>
    </div>

    <div class="btn-wrapper">
        <button class="play-btn" v-on:click="play">룰렛 돌리기!!</button>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                items: [
                    {value:"10000"},
                    {value:"1000"},
                    {value:"30000"},
                    {value:"5000"},
                    {value:"0"},
                    {value:"-1"},
                ],
                itemStyles:[],
                lineStyles:[],
                current:0,// 실제 가리키는 데이터 위치
                count:0,
                history:[],
            }
        },
        computed: {
            segment() {
                return 360 / this.items.length;
            },
            offset() {
                return this.segment / 2;
            },
            angle() {
                // return -this.current * this.segment; // 정가운데 설정
                let temp = this.current * this.segment;
                let randomOffset = Math.floor(Math.random() * this.segment) - this.offset - 1;
                let cycle = this.count * 360 * 5; //5바퀴 
                return -(temp + randomOffset + cycle); // 랜덤 변화
            },
            rouletteStyle() {
                return {
                    "transform":"rotate("+this.angle+"deg)"
                }
            },
            currentItem() {
                return this.items[this.current];
            },
        },
        methods: {
            play() {
                this.count++;
                this.current = Math.floor(Math.random() * this.items.length);
                this.history.push(this.currentItem.value);
            }
        },
        created() {
            //itemStyle 정의
            this.items.forEach((el, idx) => {
                //itemStyles 정의
                this.itemStyles.push({
                    "transform":"rotate(" + this.segment * idx + "deg)",
                });
                //lineStyles 정의
                this.lineStyles.push({
                    "transform":"rotate(" + (this.segment * idx + this.offset) + "deg)",
                })
            });
        }
    }
</script>

<style>

    .roulette-outer {
        text-align: center;
        position:relative;  
        width: 400px;
        height: 400px;
        font-size: 30px;
        margin-left: 0%;
        margin-right: auto;
        left: 25%;
    }

    .roulette-outer > .roulette {
        position: absolute;
        top:5%;
        left:5%;
        right:5%;
        bottom:5%;
        border-radius: 50%;
        border: 1px solid black;
        z-index: 10;
        background: conic-gradient(
            rgb(255, 125, 125) 0deg 30deg,
            rgb(255, 198, 91) 30deg 90deg,
            rgb(255, 255, 108) 90deg 150deg,
            rgb(90, 175, 90) 150deg 210deg,
            rgba(125, 125, 255, 1) 210deg 270deg,
            rgb(128, 70, 128) 270deg 330deg,
            rgba(255, 125, 125) 330deg 360deg
        );
    }
    .roulette-outer > .roulette-pin {
        position: absolute;
        top:3%;
        left:50%;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 30px 5px 0 5px;
        border-color: #ff0000 transparent transparent transparent;
        margin-left: -5px;
        z-index: 20;
    }

    .roulette-outer > .roulette > .item-wrapper > .item {
        position: absolute;
        top:10px;
        left:0px;
        right:0;
        bottom:0;

        padding-top: 0%;
        text-align: center;
        display: flex;
        justify-content: center;
    }

    .roulette-outer > .roulette > .item-wrapper > .item:nth-child(1) {
        transform: rotate(0deg);
    }

    .roulette-outer > .roulette > .item-wrapper > .item:nth-child(2) {
        transform: rotate(60deg);
    }

    .roulette-outer > .roulette > .item-wrapper > .item:nth-child(3) {
        transform: rotate(120deg);
    }

    .roulette-outer > .roulette > .item-wrapper > .item:nth-child(4) {
        transform: rotate(180deg);
    }

    .roulette-outer > .roulette > .item-wrapper > .item:nth-child(5) {
        transform: rotate(240deg);
    }

    .roulette-outer > .roulette > .item-wrapper > .item:nth-child(6) {
        transform: rotate(300deg);
    }

    .roulette-outer > .roulette >.line-wrapper > .line {
        position: absolute;
        top: 0;
        bottom: 50%;
        left: 50%;
        width: 1px;
        margin-left: -1px;
        background: black;

        transform-origin: bottom;
    }

    .roulette-outer > .roulette >.line-wrapper > .line:nth-child(1) {
        transform: rotate(30deg);
    }

    .roulette-outer > .roulette >.line-wrapper > .line:nth-child(2) {
        transform: rotate(90deg);
    }

    .roulette-outer > .roulette >.line-wrapper > .line:nth-child(3) {
        transform: rotate(150deg);
    }

    .roulette-outer > .roulette >.line-wrapper > .line:nth-child(4) {
        transform: rotate(210deg);
    }

    .roulette-outer > .roulette >.line-wrapper > .line:nth-child(5) {
        transform: rotate(270deg);
    }

    .roulette-outer > .roulette >.line-wrapper > .line:nth-child(6) {
        transform: rotate(330deg);
    }

    .roulette-outer > .roulette {
        transition:transform 5s ease-in-out;
    }

    .roulette-outer > .roulette-image {
      position: absolute;
      top: -50px; /* 원하는 위치에 이미지 배치 */
      /* left: 460px; */
      left: 82%;
      width: 300px; /* 이미지 크기 조정 */
      height: 350px;
      z-index: 2; /* 이미지가 컴포넌트 위로 오도록 */
    }

    .btn-wrapper {
        position: absolute;
        bottom: 30%;
        right: 44%;
    }

    .play-btn {
        position: absolute;
        background-color: #ffd698;
        border: none;
        border-radius: 5px;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 20px;
        font-weight: bold;
        flex: 1;
        display: flex;
        justify-content: space-between;
        width: 137px; /* Ensure buttons take full width of modal */
        margin: 10px auto 0; /* Add space above buttons */
    }
</style>