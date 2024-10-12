import { defineStore } from 'pinia';
import axios from 'axios';

export const useAttendanceStore = defineStore('attendance', {
    state: () => ({
        memberAttendance: [],
        memberId: 0,
        memberMonthCount: {},
        hasRoulette: {},
    }),
    actions: {
        async fetchMemberAttendance(memberId) {
            try {
                const response = await axios.get(`http://localhost:8080/api/attendance/member/${memberId}`);
                console.log('Member Attendance');
                this.memberAttendance = response.data.data;
            } catch(error) {
                console.error('Error fetching member attendance:', error);
            }
        },
        async addAttendance(newAttendance) {
            try {
                const response = await axios.post('http://localhost:8080/api/attendance', newAttendance);
                if (response.data.returnCode === '0000') { // 성공 코드는 실제 API 응답에 맞게 수정해야 합니다
                    console.log('출석체크 성공:', response.data);
                    // 새로운 출석 데이터를 state에 추가
                    this.memberAttendance.push(response.data.data);
                    return response.data.returnCode;
                } else {
                    throw new Error(response.data.returnMessage || '출석체크에 실패했습니다.');
                }
            } catch (error) {
                console.error('Error adding attendance:', error);
                throw error;
            }
        },
        async fetchMonthCount(memberId) {
            try {
              const response = await axios.get(`http://localhost:8080/api/attendance/month/${memberId}`);
              console.log('Month Count');
              this.memberMonthCount = response.data.data.monthCount;
            } catch (error) {
              console.error('Error fetching Month Count:', error);
            }
        },
        async fetchHasRoulette(memberId) {
            try {
                const response = await axios.get(`http://localhost:8080/api/roulette/${memberId}`);
                console.log('Has Roulette');
                this.hasRoulette[memberId] = response.data.data.hasPlay;
            } catch(error) {
                console.error('Error fetching has roulette:', error);
            }
        },

        async addRoulettePlay(memberId) {
            try {
                const response = await axios.post('http://localhost:8080/api/roulette', { memberId });
                if (response.data.returnCode === '0000') {
                    console.log('룰렛 플레이 기록 성공:', response.data);
                    this.hasRoulette[memberId] = true;
                    return response.data.data;
                } else {
                    throw new Error(response.data.returnMessage || '룰렛 플레이 기록에 실패했습니다.');
                }
            } catch (error) {
                console.error('Error adding roulette play:', error);
                throw error;
            }
        },
    },
});