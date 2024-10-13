<template>
    <div class="roulette-outer">
        <!-- <div class="roulette-pin"></div> -->
        <div class="roulette" v-bind:style="rouletteStyle">
            <!-- 값 영역 -->
            <div class="item-wrapper">
                <div class="item">
                  10,000<br>솜사탕
                  <img src="../../assets/img/cottoncandy.png" style="width: 50px; height: 50px;"/>
                </div>
                <div class="item">1,000<br>솜사탕<img src="../../assets/img/cottoncandy.png" style="width: 50px; height: 50px;"/></div>
                <div class="item">30,000<br>솜사탕<img src="../../assets/img/cottoncandy.png" style="width: 50px; height: 50px;"/></div>
                <div class="item">5,000<br>솜사탕<img src="../../assets/img/cottoncandy.png" style="width: 50px; height: 50px;"/></div>
                <div class="item">꽝<img src="../../assets/img/bomb.png" style="width: 50px; height: 50px;"/></div>
                <div class="item">한번 더!<img src="../../assets/img/chance.png" style="width: 50px; height: 50px;"/></div>
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
          <button class="play-btn" v-on:click="play" :disabled="hasPlayedToday">룰렛 돌리기!!</button>
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
                memberId: authStore.state.user.memberId, // Pinia 스토어에서 memberId 직접 할당
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
            async play() {
                const attendanceStore = useAttendanceStore();
                try {
                    this.count++;
                    this.current = Math.floor(Math.random() * this.items.length);
                    const result = this.items[this.current].value;
                    this.history.push(result);

                    if (result === "-1") {
                        // '한번 더!' 결과일 경우
                        console.log("한번 더 기회가 주어졌습니다!");
                        // 추가 작업이 필요하다면 여기에 코드를 추가하세요
                    } else {
                        // '한번 더!'가 아닌 경우에만 출석 데이터 전송
                        await attendanceStore.addRoulettePlay(this.memberId);
                        // 룰렛 플레이 후 상태 업데이트
                        await attendanceStore.fetchHasRoulette(this.memberId);

                        // 결과에 따른 추가 작업
                        if (result !== "0") {
                            // 당첨된 경우 (꽝이 아닌 경우)
                            const candyAmount = parseInt(result);
                            if (!isNaN(candyAmount)) {
                                const authStore = useAuthStore();
                                await authStore.updateCottonCandy(candyAmount);
                            }
                        }
                    }
                } catch (error) {
                    console.error('룰렛 플레이 중 오류 발생:', error);
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
      .roulette-outer {
          text-align: center;
          position: relative;  
          width: 300px;
          height: 300px;
          font-size: 30px;
          margin-left: 0%;
          margin-right: 0%;
          top: -30px;
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
          border: 20px solid #cfcfcf;
          z-index: 10;
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
          width: 137px; /* Ensure buttons take full width of modal */
          margin: 10px auto 0; /* Add space above buttons */
      }

      .play-btn:disabled {
            background-color: #ccc; /* 비활성화된 버튼 색상 */
            cursor: not-allowed; /* 비활성화된 버튼 커서 */
        }
  </style>