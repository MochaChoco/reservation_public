let reviewScore, pageList, curPageNum, lastPageNum, createIcon, createIconWrapper;
const showLength = 5;

includeHTML(init);

function init(){      // init 함수
  headerInit();
  navInit();
  curPageNum = getPageNum();
  reviewScore = document.getElementsByClassName("reviewScore");
  pageList = document.getElementsByClassName("reviewPageList");
  createIconWrapper = document.getElementsByClassName("createIconWrapper")[0];
  createIcon = createIconWrapper.children[0];
  setScore();
  setPageList(curPageDecorate);
  setCreateIconLoaded();
}

function sendLastPageNum(num){      // ejs 부분(서버 사이드)에서 클라이언트 사이드로 변수 값을 보내줌
  lastPageNum = num;
}

function resizeReviewPage(){        // review페이지에서 브라우저 크기를 변화(사이즈 변경, 화면 로테이트)시켰을 때 호출되는 함수
  if(createIconWrapper != undefined){
    setMenuLimitPos();
    setMenuCurPos();
  }
}

function setMenuLimitPos(){       // createIcon이 화면을 따라오는 범위를 설정함
  minLimit = document.getElementsByTagName("main")[0].offsetTop;
  maxLimit = document.getElementsByTagName("main")[0].offsetTop + document.getElementsByTagName("main")[0].clientHeight - createIconWrapper.clientHeight;
}

function setMenuCurPos(){         // 현재 수직, 수평 위치를 설정함
  if(createIconWrapper !== undefined){
    if(sizeState == 0){
        // createIconWrapper 수직 이동 로직 처리 부분
      if (window.pageYOffset + (window.innerHeight * 0.8) > minLimit && window.pageYOffset + (window.innerHeight * 0.8) < maxLimit) {
          createIconWrapper.classList.add("fix");
          createIconWrapper.style.top = "80%";
      } else {
        createIconWrapper.classList.remove("fix");
        if(window.pageYOffset + (window.innerHeight * 0.8) < minLimit)
          createIconWrapper.style.top = minLimit + "px";
        if(window.pageYOffset + (window.innerHeight * 0.8) > maxLimit)
          createIconWrapper.style.top = maxLimit + "px";
      }
       // 수평 위치 지정
      leftPos = (document.getElementsByTagName("Body")[0].clientWidth * 0.5) + document.getElementsByClassName("reviewWrapper")[0].clientWidth * 0.525;
      createIconWrapper.style.left = leftPos + "px";
    } else{
      createIconWrapper.classList.remove("fix");
      createIconWrapper.style.top = maxLimit + "px";
      createIconWrapper.style.left = "auto";
      createIconWrapper.style.right = "10px";
    }
  }
}

function setScore(){    // 스코어(별 그림) 출력해주는 함수
  for(let i = 0 ; i < reviewScore.length ; i++){
    const score = reviewScore[i].innerHTML;
    reviewScore[i].innerHTML = "";
    reviewScore[i].style.backgroundImage = 'url(' + '\'/Images/score' + score + '.png\'' + ')';
  }
}

function setPageList(callbackFunc){     // 페이지 리스트 출력하는 함수
  curPageNum = parseInt(curPageNum);
  let startPageNum = curPageNum - Math.floor(showLength / 2);
  let endPageNum = curPageNum + Math.floor(showLength / 2);

  if(curPageNum <= Math.floor(showLength / 2)){
    startPageNum = 1;
    endPageNum = showLength;
  }
  if(curPageNum > Math.floor(lastPageNum - showLength / 2)){
    startPageNum = lastPageNum - showLength + 1;
    endPageNum = lastPageNum;
  }

  for(let i = 0 ; i < 2 ; i++){
    pageList[i].innerHTML = "";
    if(curPageNum > Math.floor(showLength / 2) + 1 && lastPageNum > showLength){
      if(curPageNum - showLength < 1)
        pageList[i].innerHTML = '<a href=\'./' + 1 + '\'>' + 'prev</a>';
      else
        pageList[i].innerHTML = '<a href=\'./' + (curPageNum - showLength) + '\'>' + 'prev</a>';
    }
    for(let j = startPageNum ; j <= endPageNum ; j++){
      if(j != curPageNum)
        pageList[i].innerHTML += '<a href=\'./' + j + '\'>' + j + '</a>';
      else
        pageList[i].innerHTML += '<p>' + j + '</p>';
    }
    if(curPageNum <= Math.floor(lastPageNum - showLength / 2) && lastPageNum > showLength)
    {
      if(curPageNum + showLength > lastPageNum)
        pageList[i].innerHTML += '<a href=\'./' + lastPageNum + '\'>' + 'next</a>';
      else
        pageList[i].innerHTML += '<a href=\'./' + (curPageNum + showLength) + '\'>' + 'next</a>';
    }
  }
  callbackFunc();
}

function curPageDecorate(){       // 현재 선택된 페이지를 decorate하는 함수
  curPageNum = parseInt(curPageNum);

  for(let i = 0 ; i < 2 ; i++){
    if(curPageNum > Math.floor(showLength / 2) + 1 && curPageNum <= Math.floor(lastPageNum - showLength / 2))
      pageList[i].childNodes[3].className += "selected";
    else if(curPageNum <= Math.floor(showLength / 2) + 1)
      pageList[i].childNodes[curPageNum - 1].className += "selected";
    else if(curPageNum > Math.floor(lastPageNum - showLength / 2) && lastPageNum > showLength)
      pageList[i].childNodes[curPageNum - (lastPageNum - showLength)].className += "selected";
    else if(curPageNum == lastPageNum && lastPageNum <= showLength)
      pageList[0].childNodes[curPageNum - 1].className += "selected";
  }
}

function reviewUpdate(content){     // 업데이트 아이콘을 눌렀을 때 호출되는 함수
    const pageId = content.parentNode.parentNode.childNodes[1].innerHTML;
    location.href= "/review/update/" + pageId;
}

function reviewDelete(content){     // 삭제 아이콘을 눌렀을 때 호출되는 함수
    const pageId = content.parentNode.parentNode.childNodes[1].innerHTML;
    location.href= "/review/delete/" + pageId;
}
