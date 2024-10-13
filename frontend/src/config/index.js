export default {
    menus: [
      { title: '자산관리', url: '/accountBook', items: 'accountBookMenus' },
      { title: '모의투자', url: '/investment', items: 'investmentMenus' },
      { title: '이벤트', url: '/event', items: 'eventMenus' },
      { title: '솜사탕 상점', url: '/cottonCandy', items: 'cottonCandyMenus' }
    ],
  
    accountBookMenus: [
      { title: '가계부', url: '/accountBook/incomeExpense' },
      { title: '통계', url: '/accountBook/statistics' },
      { title: '목표', url: '/accountBook/goal' }
    ],
  
    investmentMenus: [
      { title: '매수/매도', url: '/investment/stock' },
      { title: '랭킹', url: '/investment/rank' }
    ],
  
    eventMenus: [
      { title: '출석/ 룰렛', url: '/event/check' },
      { title: '금융 퀴즈', url: '/event/quiz' }
    ],

    cottonCandyMenus : [
        { title: '상점', url: '/cottonCandy/shop' },
    ]
  };
  