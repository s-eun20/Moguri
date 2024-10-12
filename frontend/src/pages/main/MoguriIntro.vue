<template>
    <body>
      <div class="moguriintro-body">
        <!-- 기본 텍스트 -->
        <div class="text" id="basictext" style="display: block">
          <h1>모구리 한 마리 알아가세요 !</h1>
          <br />
          <h2>캐릭터에 마우스를 올려보세요 !</h2>
        </div>
      </div>
      <div class="moguriintro-logo">
        <img src="../../assets/moguriintro/모구리별글자.png" alt="로고" />
      </div>
      <div id="character">
        <img src="../../assets/moguriintro/모구리.png" />
        <img class="hoverimg" src="../../assets/moguriintro/별.png" alt="별" />
        <img
          class="hovertext"
          src="../../assets/moguriintro/말풍선.png"
          alt="말풍선"
        />
      </div>
    </body>
  </template>
  
  <style>
  @font-face {
    font-family: 'NeoDunggeunmo';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.3/NeoDunggeunmo.woff')
      format('woff');
    font-weight: normal;
    font-style: normal;
  }
  .moguriintro-body {
    font-family: 'NeoDunggeunmo', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    background-image: url('../../assets/moguriintro/모구리배경.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: center center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .text h1,
  .text h2 {
    font-family: 'NeoDunggeunmo', sans-serif;
  }
  .text {
    color: white;
    position: absolute;
    top: 50%;
    right: 15%;
    transform: translateY(-50%);
    text-align: left;
    max-width: 50%;
  }
  .moguriintro-logo {
    position: fixed;
    right: 1%;
    top: 2%;
    width: 50px;
    height: auto;
    z-index: 100;
  }
  #character {
    background-color: transparent;
    position: absolute;
    bottom: 400px; /* 지구 위에 적절히 위치하도록 설정 */
    left: 360px;
    transform: translate(-50%, 50%);
    width: 15%; /* 캐릭터 크기 조절 */
    z-index: 10; /* 지구 위에 나타나도록 z-index 조정 */
    transition: all 0.5s ease;
  }
  #character:hover .hoverimg,
  #character:hover .hovertext {
    display: block;
    opacity: 1;
    transform: translate(-50, 50%) scale(1.1);
  }
  .hoverimg {
    opacity: 0;
    transition: opacity 0.4s ease, transfrom 0.4s ease;
    position: absolute;
    top: -29%;
    left: 70px;
    width: 70px;
    z-index: 20;
  }
  .hovertext {
    opacity: 0;
    transition: opacity 0.5s ease, transform 0.5s ease;
    position: absolute;
    top: 40%;
    left: 320%;
    bottom: 15%;
    width: 100%;
    transform: translateX(-50%) scale(3.5);
    z-index: 20;
  }
  img {
    max-width: 100%;
  }
  </style>