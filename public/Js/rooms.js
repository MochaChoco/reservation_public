let section, contents, button;
let isClicked;

includeHTML(init);      // 스니펫 함수

function init(){      // room 페이지 init 함수
  headerInit();
  navInit();

  section = document.getElementsByTagName("section");
  contents = document.getElementsByClassName("hidden");
  room = document.getElementsByClassName("roomInfoWrapper");
  isClicked = false;
  button = document.getElementById("showButton");
  if(sizeState != 0)
    section[0].style.height = (room[0].clientHeight + convertString(window.getComputedStyle(room[0]).getPropertyValue('margin-Bottom')) + room[1].clientHeight + convertString(window.getComputedStyle(room[1]).getPropertyValue('margin-Bottom')) + 125) + "px";
}

function convertString(string){   // "px" 단위가 포함된 문자열에서 숫자만 반환하는 함수
  let str = string.split("px");
  str = str[0];
  str = parseInt(str);
  return str;
}

function resizeRoomPage(){      // room페이지에서 브라우저 크기를 변화(사이즈 변경, 화면 로테이트)시켰을 때 호출되는 함수
  if(sizeState == 0){
    if(isClicked == true)     // 데스크탑 환경에서 more info 버튼이 눌렸는지 확인 후 section 태그의 높이를 변경 처리
      section[0].style.height = (room[0].clientHeight + convertString(window.getComputedStyle(room[0]).getPropertyValue('margin-Bottom'))
      + room[1].clientHeight + convertString(window.getComputedStyle(room[1]).getPropertyValue('margin-Bottom'))
      + room[2].clientHeight + convertString(window.getComputedStyle(room[2]).getPropertyValue('margin-Bottom')) + 125) + "px";
    else
      section[0].style.height = (room[0].clientHeight + convertString(window.getComputedStyle(room[0]).getPropertyValue('margin-Bottom')) + room[1].clientHeight + convertString(window.getComputedStyle(room[1]).getPropertyValue('margin-Bottom')) + 125) + "px";
  }
  else{
    if(isClicked == true)     // 태블릿, 모바일 환경에서 more info 버튼이 눌렸는지 확인 후 section 태그의 높이를 변경 처리
      section[0].style.height = (room[0].clientHeight + convertString(window.getComputedStyle(room[0]).getPropertyValue('margin-Bottom'))
      + room[1].clientHeight + convertString(window.getComputedStyle(room[1]).getPropertyValue('margin-Bottom'))
      + room[2].clientHeight + convertString(window.getComputedStyle(room[2]).getPropertyValue('margin-Bottom'))
      + room[3].clientHeight + convertString(window.getComputedStyle(room[3]).getPropertyValue('margin-Bottom'))
      + room[4].clientHeight + convertString(window.getComputedStyle(room[4]).getPropertyValue('margin-Bottom'))
      + room[5].clientHeight + convertString(window.getComputedStyle(room[5]).getPropertyValue('margin-Bottom')) + 125) + "px";
    else
      section[0].style.height = (room[0].clientHeight + convertString(window.getComputedStyle(room[0]).getPropertyValue('margin-Bottom')) + room[1].clientHeight + convertString(window.getComputedStyle(room[1]).getPropertyValue('margin-Bottom')) + 125) + "px";
  }
  section[0].style.marginBottom = "100px";
}

function showContents(){    // more info 버튼이 눌렸을 때 버튼 처리
  isClicked = true;
  const len = contents.length;
  for(let i = 0 ; i < len ; i++){     // remove로 인해 배열의 크기가 달라짐
    contents[0].classList.remove("hidden");
  }
  resizeRoomPage();
  button.style.display = "none";
}
