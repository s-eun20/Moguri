<template>
    <div class="roulette-outer">
        <div class="message-box">
            <p v-if="isSpinning">두구두구두구...</p>
            <p v-else-if="!hasPlayedToday && !result">룰렛을 돌려보세요</p>
            <p v-else-if="result">{{ resultMessage }}</p>
            <p v-else>오늘 룰렛 게임을 진행했어요</p>
        </div>
        <div class="roulette-pin">
            <img src="@/assets/img/Moguri.png" alt="Moguri" class="moguri-image"/>
        </div>
        <div class="roulette" v-bind:style="rouletteStyle">
            <!-- 값 영역 -->
            <div class="item-wrapper">
                <div class="item">
                  10,000<br>솜사탕
                  <i class="fa-solid fa-cloud" style="width: 50px; height: 50px; color: #ffe5f2"></i>
                </div>
                <div class="item">1,000<br>솜사탕<i class="fa-solid fa-cloud" style="width: 50px; height: 50px; color: #ffe5f2"></i></div>
                <div class="item">30,000<br>솜사탕<i class="fa-solid fa-cloud" style="width: 50px; height: 50px; color: #ffe5f2"></i></div>
                <div class="item">5,000<br>솜사탕<i class="fa-solid fa-cloud" style="width: 50px; height: 50px; color: #ffe5f2"></i></div>
                <div class="item">꽝<img src="../../assets/img/bomb.png" style="width: 50px; height: 50px;"/></div>
                <div class="item">한번 더!<img src="../../assets/img/clover.png" style="width: 50px; height: 50px;"/></div>
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
  
        <div class="btn-wrapper">
          <button class="play-btn" v-on:click="play" :disabled="hasPlayedToday || isSpinning">룰렛 돌리기</button>
        </div>
    </div>
  
  
  </template>
  
<script>
    import { useAttendanceStore } from '@/stores/attendanceStore';
    import { useAuthStore } from '@/stores/auth'; 
    import { mapState } from 'pinia';
  
    export default {
        data() {
            const authStore = useAuthStore();
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
                current:0, // 실제 가리키는 데이터 위치
                count:0,
                history:[],
                memberId: authStore.state.user.memberId,
                result: null,
                resultMessage: '',
                isSpinning: false,
            }
        },
        computed: {
            ...mapState(useAttendanceStore, ['hasRoulette']),
            hasPlayedToday() {
                return this.hasRoulette[this.memberId] || false;
            },
            segment() {
                return 360 / this.items.length;
            },
            offset() {
                return this.segment / 2;
            },
            angle() {
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
            async play() {
                if (this.hasPlayedToday || this.isSpinning) return;

                this.isSpinning = true;
                this.result = null;
                this.resultMessage = '';

                const attendanceStore = useAttendanceStore();
                try {
                    this.count++;
                    this.current = Math.floor(Math.random() * this.items.length);
                    
                    // 룰렛 애니메이션 시간을 기다립니다
                    await new Promise(resolve => setTimeout(resolve, 5000)); // 5초 대기

                    this.result = this.items[this.current].value;
                    this.history.push(this.result);

                    if (this.result === "-1") {
                        this.resultMessage = "한번 더 기회가 주어졌어요!";
                        console.log("한번 더 기회가 주어졌어요!");
                        this.isSpinning = false;
                    } else {
                        await attendanceStore.addRoulettePlay(this.memberId);
                        await attendanceStore.fetchHasRoulette(this.memberId);

                        if (this.result !== "0") {
                            const candyAmount = parseInt(this.result);
                            if (!isNaN(candyAmount)) {
                                const authStore = useAuthStore();
                                await authStore.updateCottonCandy(candyAmount);
                                this.resultMessage = `${candyAmount.toLocaleString()} 솜사탕을 얻었어요.`;
                            }
                        } else {
                            this.resultMessage = "아쉽게도 꽝이네요.";
                        }
                    }
                } catch (error) {
                    console.error('룰렛 플레이 중 오류 발생:', error);
                } finally {
                    this.isSpinning = false;
                }
            }
        },
        async created() {
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
            const attendanceStore = useAttendanceStore();
            await attendanceStore.fetchHasRoulette(this.memberId);
        }
    }
  </script>
  
  <style scoped>
      .message-box {
        position: absolute;
        top: -120px; /* 위치 조정이 필요할 수 있습니다 */
        left: 50%;
        transform: translateX(-50%);
        background-color: #FFF;
        border: 2px solid #FFD700;
        border-radius: 20px;
        padding: 10px;
        text-align: center;
        z-index: 30;
        width: 200px; /* 크기 조정이 필요할 수 있습니다 */
    }

    .message-box p {
        margin: 0;
        font-size: 14px;
        font-weight: bold;
    }

      .roulette-outer {
          text-align: center;
          position: relative;  
          width: 285px;
          height: 285px;
          font-size: 30px;
          margin-left: 0%;
          margin-right: 0%;
          top: -10px;
          left: 0;
          border: 2px solid black; /* 검은색 얇은 선 추가 */
          border-radius: 50%; /* 전체를 원형으로 만듦 */
          box-sizing: border-box; /* 테두리를 요소 크기에 포함 */
      }
  
      .roulette-outer > .roulette {
          position: absolute;
          top:0%;
          left:0%;
          right:0%;
          bottom:0%;
          border-radius: 50%;
          border: 20px solid #ffd698;
          z-index: 10;
      }
  
      .roulette-outer > .roulette-pin {
        position: absolute;
        top: -30%; /* 위치 조정이 필요할 수 있습니다 */
        left: 50%;
        transform: translateX(-50%);
        z-index: 20;
      }

      .roulette-pin .moguri-image {
        width: 150px; /* 이미지 크기 조정 */
        height: auto;
    }
  
      .roulette-outer > .roulette > .item-wrapper > .item {
          position: absolute;
          top:0px;
          left:0px;
          right:0;
          bottom:0;
  
          padding-top: 0px;
          text-align: center;
          display: flex;
  
          justify-content: center;
  
          display: flex;
          flex-direction: column;
          align-items: center;
  
          font-size: 15px;
      }
  
      .roulette-outer > .roulette > .item-wrapper > .item:nth-child(1) {
          transform: rotate(0deg);
          top: -150px;
      }
  
      .roulette-outer > .roulette > .item-wrapper > .item:nth-child(2) {
          transform: rotate(60deg);
          top:-75px;
          right:-130px;
      }
  
      .roulette-outer > .roulette > .item-wrapper > .item:nth-child(3) {
          transform: rotate(120deg);
          top: 75px;
          right: -130px;
      }
  
      .roulette-outer > .roulette > .item-wrapper > .item:nth-child(4) {
          transform: rotate(180deg);
          top: 150px;
      }
  
      .roulette-outer > .roulette > .item-wrapper > .item:nth-child(5) {
          transform: rotate(240deg);
          top: 75px;
          right: 130px;
      }
  
      .roulette-outer > .roulette > .item-wrapper > .item:nth-child(6) {
          transform: rotate(300deg);
          top: -75px;
          right: 130px;
      }
  
      .img {
        display: flex;
        margin-top: 0px; /* 이미지 위의 여백 조정 */
        justify-content: center; /* 수평 중앙 정렬 */
        align-items: center;     /* 수직 중앙 정렬 */ 
        top: -500000px;
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
          bottom: -20%;
          left: 30%;
          z-index: 200;
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
          width: 126px; /* Ensure buttons take full width of modal */
          margin: 10px auto 0; /* Add space above buttons */
      }

      .play-btn:disabled {
            background-color: #ccc; /* 비활성화된 버튼 색상 */
            cursor: not-allowed; /* 비활성화된 버튼 커서 */
        }
  </style>