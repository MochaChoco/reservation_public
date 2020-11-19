let introSlide, introSlideWidth, introSlideIndex,
  discoverSlide, discoverSlideIndex, dotArray, myTimeout, mainWidth, isClicked;

includeHTML(init);      // 스니펫 함수

function init(){      // main 페이지 init 함수
  headerInit();
  navInit();
  mainWidth = document.getElementsByTagName("main")[0].clientWidth;
  introSlide = document.getElementById("introduceSlide");
  introSlideWidth = introSlide.clientWidth / 8;
  introSlideIndex = 1;
  isClicked = false;
  discoverSlide = document.getElementById("discoverSlide");
  discoverSlideIndex = -1;
  dotArray = document.getElementsByClassName("dot");
  autoDiscoverShow();
  autoIntroShow();
}

function resizeMainPage(){        // 윈도우에서 창 크기를 조절하거나 화면을 로테이트하면 실행
    introSlideWidth = introSlide.clientWidth / 8;
}

function autoIntroShow(){     // introSlide를 4초마다 움직이게 만드는 함수
  setInterval(introSlideShow, 4000);
}

function introSlideShow(){   // introslide 움직임 처리하는 함수
  introSlide.style.transition = "left 2s";    // 슬라이드가 움직이는데 2초 걸리게 설정
  introSlide.style.left = (introSlideIndex * introSlideWidth) + 'px';

  if(introSlideIndex == 4) {    // 슬라이드가 마지막에 도달했을 시 다음 이동 전에 위치를 초기화
    setTimeout(function(){
      introSlide.style.transition = "left 0s";
      introSlide.style.left = "0px";
    }, 3800);   // Timeout 간격보다 조금 더 낮게 설정
      introSlideIndex = 0;
  }
  introSlideIndex++;
}

function slideButtonClick(num){   // 슬라이드 좌, 우측 버튼 눌렀을 때 처리하는 함수
  if(!(discoverSlideIndex + num == -5) && !(discoverSlideIndex + num == 1)){
    if(isClicked == false){     // 좌, 우측 버튼을 여러번 눌러도 시간(1초) 내에 1번만 움직이도록 설정
      clearTimeout(myTimeout);
      discoverSlideIndex += num;
      discoverSlideShow();
      setTimeout(function(){
        isClicked = false;
      }, 1000);
    }
    isClicked = true;
  }
}

function dotButtonClick(num){     // 슬라이드 하단에 dot 클릭했을 때 처리하는 함수
  clearTimeout(myTimeout);
  discoverSlideIndex = num;
  discoverSlideShow();
}

function autoDiscoverShow(){      // discoverslide를 4초마다 움직이게 만드는 함수
  myTimeout = setTimeout(roofDiscoverShow, 4000);
}

function roofDiscoverShow(){    // 다음 슬라이드로 넘기는 함수
  slideButtonClick(-1);
}

/*
화면 밖   |   화면 안   | 화면 밖
      [0]|[-1][-2][-3]|[-4]
화면 밖  |   화면 안   | 화면 밖
-1, -2, -3번 슬라이드만 화면에 보여지고, 0과 -4번 슬라이드는 밖에서 대기함
*/
function discoverSlideShow(){   // discoverslide 움직임 처리하는 함수
  discoverSlide.style.transition = "left 1s";
  if(discoverSlideIndex > -1){    // 슬라이드가 범위를 초과하는지 체크
    setTimeout(function(){
      discoverSlideIndex = -3;
      discoverSlide.style.transition = "left 0s";   // 슬라이드가 범위를 초과하면 애니메이션 시간이 지난 직후 transition 시간을 0으로 하여 기존에 준비했던 슬라이드로 바로 교체한다.(사용자가 인식하지 못하게)
      if(sizeState == 0)
        discoverSlide.style.left = (discoverSlideIndex * 1024) + 'px';    // 슬라이드 번호 * 화면 해상도만큼 이동
      else
        discoverSlide.style.left = (discoverSlideIndex * 90) + 'vw';
      isClicked = false;
    }, 950);
    discoverSlideIndex = 0;
    dotSelect(-3);
  } else if(discoverSlideIndex < -3){
    setTimeout(function(){
      discoverSlideIndex = -1;
      discoverSlide.style.transition = "left 0s";
      if(sizeState == 0)
        discoverSlide.style.left = (discoverSlideIndex * 1024) + 'px';
      else
        discoverSlide.style.left = (discoverSlideIndex * 90) + 'vw';
      isClicked = false;
    }, 950);
    dotSelect(-1);
    discoverSlideIndex = -4;
  } else {
    dotSelect(discoverSlideIndex);
  }
  if(sizeState == 0)
    discoverSlide.style.left = (discoverSlideIndex * 1024) + 'px';
  else
    discoverSlide.style.left = (discoverSlideIndex * 90) + 'vw';
  autoDiscoverShow();
}

function dotSelect(num){      // 해상 슬라이드의 도트부분 색깔 변경하는 함수
  const index = -(num + 1);
    for(let i = 0 ; i < dotArray.length; i++){
      const selected = document.getElementsByClassName("active");
      selected[0].className = selected[0].className.replace(" active", "");
      dotArray[index].className += " active";
    }
}
