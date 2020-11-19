var menuId, newsId, keyword, minLimit, maxLimit, leftPos;
let recent, recentTitle, recentListWrapper, recentList;
let category, categoryTitle, categoryListWrapper, categoryList;
let titleHeight;
let isRecentOpened, isCategoryOpened, isSearchOpened, openedCount;
let pageList, lastPageNum;
let newsPopUpButton, menuCloseDiv, newsRight, prevYOffset = 0;
let touchStart = false, touchMove = false;
let animationTimer, transitionY;
let hSlope = ((window.innerHeight / 2) / window.innerWidth).toFixed(2) * 1;   // 수직, 수평을 판단하는 기울기 기준
const menuMarginBottom = "25px", showLength = 3;

let touchStartPos = {       // 터치 관련 객체(터치 시작 지점, 현재 터치 지점, 이전 터치 지점)
  x:0,
  y:0
};
let touchCurPos = {
  x:0,
  y:0
};
let touchPrevPos = {
  x:0,
  y:0
};

includeHTML(init);

function init(callbackFunc){      // init 함수
  newsPopUpButton = document.getElementById("newsPopUpButton");
  recent = document.getElementById("recentWrapper");
  if(recent != undefined){
    recentTitle = recent.childNodes[1];
    recentListWrapper = document.getElementById("recentListWrapper");
    recentList = recentListWrapper.childNodes[1];

    category = document.getElementById("categoryWrapper");
    categoryTitle = category.childNodes[1];
    categoryListWrapper = document.getElementById("categoryListWrapper");
    categoryList = categoryListWrapper.childNodes[1];

    search = document.getElementById("searchWrapper");
    searchTitle = search.childNodes[1];
    searchListWrapper = document.getElementById("searchListWrapper");
    searchList = searchListWrapper.childNodes[1];

    let marginTitle = window.getComputedStyle(recentTitle).marginBottom;
    marginTitle = convertStrToNum(marginTitle);

    titleHeight = recentTitle.offsetHeight + marginTitle + "px";
    menuCloseDiv = document.getElementsByClassName("menuCloseDiv")[0];
    newsRight = document.getElementsByClassName("newsRight")[0];
    moving = document.getElementsByClassName("moving")[0];
    prevYOffset = window.pageYOffset;

    setDate();

    if(menuId != "recent"){
      pageList = document.getElementsByClassName("newsPageList");
      setPageList(curPageDecorate);
    }
  }
  headerInit();
  navInit();
}

function resizeNewsPage(){            // news페이지에서 브라우저 크기를 변화(사이즈 변경, 화면 로테이트)시켰을 때 호출되는 함수
  if(newsRight !== undefined && sizeState == 0){
    hideNewsMenu();
    isRecentOpened = false;
    isCategoryOpened = false;
    isSearchOpened = false;
    openedCount = 0;

    clickMenu("recent");
    clickMenu("category");
    clickMenu("search");
    newsRight.style.height = "870px";
    moving.style.top = 0;
    moving.style.webkitTransform = "translateY(0px)";
    moving.style.transform = "translateY(0px)";
    setMenuLimitPos();
    setMenuCurPos();
  } else if(newsRight !== undefined && sizeState != 0 && prevState == 0){
    newsRight.removeAttribute("style");
    moving.style.top = 0;
    recent.removeAttribute("style");
    category.removeAttribute("style");
    search.removeAttribute("style");
    hideNewsMenu();
  }
}

function onTouchStart(event){       // 모바일, 태블릿 해상도에서 오른쪽 메뉴에 대해 터치가 시작됐을 때 처리
  if(!touchStart){
    touchStart = true;
    moving.style.webkitTransitionProperty = "none";
    moving.style.transitionProperty = "none";
    clearTimeout(animationTimer);

    transitionY = parseInt(window.getComputedStyle(moving).transform.split("(")[1].split(")")[0].split(",")[5]);

    // touch[0]은 터치 시작, 터치 중에만 값을 받을 수 있음.(터치 종료는 changedTouches[0]로 받는다)
    touchCurPos.x = event.touches[0].pageX;
    touchCurPos.y = event.touches[0].pageY;
    touchStartPos.x = touchCurPos.x;
    touchStartPos.y = touchCurPos.y;
    touchPrevPos.x = touchCurPos.x;
    touchPrevPos.y = touchCurPos.y;
  }
}

function onTouchMove(event){              // 터치 중 처리
  if(!touchStart || sizeState == 0)
    return;

  touchPrevPos.x = touchCurPos.x;
  touchPrevPos.y = touchCurPos.y;
  touchMove = true;

  touchCurPos.x = event.touches[0].pageX;
  touchCurPos.y = event.touches[0].pageY;

  const distanceX = touchCurPos.x - touchStartPos.x;
  const distanceY = touchCurPos.y - touchStartPos.y;

  if(getMoveType() == 0){
    // 브라우저 높이가 터치 영역의 높이보다 크면 드래그 할 필요가 없으니 드래그 처리를 막아놓는다.
    if(browserHeight - moving.clientHeight - 97 < 0) {
      if(transitionY + distanceY > 0){
        moving.style.webkitTransform = "translateY(0px)";
        moving.style.transform = "translateY(0px)";
      } else if(transitionY + distanceY < browserHeight - moving.clientHeight - 97){
          // 97 : header.clientHeight(77px) + newsRight.paddingTop(10px) + newsRight.paddingBottom(10px)
        moving.style.webkitTransform = "translateY(" + (browserHeight - moving.clientHeight - 97) + "px)";
        moving.style.transform = "translateY(" + (browserHeight - moving.clientHeight - 97) + "px)";
      } else{
        moving.style.webkitTransform = "translateY(" + (transitionY + distanceY) + "px)";
        moving.style.transform = "translateY(" + (transitionY + distanceY) + "px)";
      }
    }
  } else if(getMoveType() == 1){      // swipe를 수직(오른쪽)으로 했을 경우 메뉴를 숨김처리 함.
    if(distanceX > 50){
      hideNewsMenu();
    }
  }
  event.preventDefault();               // 메뉴가 터치 중일땐 기존 스크롤이 동작하지 않도록 설정
}

function onTouchEnd(event){                 // 터치 종료
  if(touchStart && !touchMove) {
    return;
  }
  touchCurPos.x = event.changedTouches[0].pageX;
  touchCurPos.y = event.changedTouches[0].pageY;

  const distanceY = touchCurPos.y - touchPrevPos.y;
  if(distanceY > 4 || distanceY < -4){  // 손가락을 땔 때 직전 픽셀과 비교해서 4픽셀 미만이면 동작안하게 설정
    moving.style.webkitTransition = "transform 0.35s ease-out";
    moving.style.transition = "transform 0.35s ease-out";
    animationTimer = setTimeout(function(){
      moving.style.webkitTransitionProperty = "none";
      moving.style.transitionProperty = "none";
    }, 350);

      // 브라우저 높이가 터치 영역의 높이보다 크면 드래그 할 필요가 없으니 드래그 처리를 막아놓는다.
    if(browserHeight - moving.clientHeight - 97 < 0) {
      if(transitionY + distanceY * 30 > 0){
        moving.style.webkitTransform = "translateY(0px)";
        moving.style.transform = "translateY(0px)";
      } else if(transitionY + distanceY * 30 < browserHeight - moving.clientHeight - 97){
          // 97 : header.clientHeight(77px) + newsRight.paddingTop(10px) + newsRight.paddingBottom(10px)
        moving.style.webkitTransform = "translateY(" + (browserHeight - moving.clientHeight - 97) + "px)";
        moving.style.transform = "translateY(" + (browserHeight - moving.clientHeight - 97) + "px)";
      } else{
        moving.style.webkitTransform = "translateY(" + (transitionY + distanceY * 30) + "px)";
        moving.style.transform = "translateY(" + (transitionY + distanceY * 30) + "px)";
      }
    }
  }

  touchStart = false;
  touchMove = false;

  event.preventDefault();
}

function onMouseWheel(event) {    // PC 환경을 위한 마우스 휠 이벤트
  if(sizeState != 0){
    moving.style.webkitTransition = "transform 0.3s";
    moving.style.transition = "transform 0.3s";
    if(browserHeight - moving.clientHeight - 97 < 0) {
      if(transitionY - event.deltaY * 2 > 0){
        moving.style.webkitTransform = "translateY(0px)";
        moving.style.transform = "translateY(0px)";
      } else if(transitionY - event.deltaY * 2 < browserHeight - moving.clientHeight - 97){
          // 97 : header.clientHeight(77px) + newsRight.paddingTop(10px) + newsRight.paddingBottom(10px)
        moving.style.webkitTransform = "translateY(" + (browserHeight - moving.clientHeight - 97) + "px)";
        moving.style.transform = "translateY(" + (browserHeight - moving.clientHeight - 97) + "px)";
      } else{
        moving.style.webkitTransform = "translateY(" + (transitionY - event.deltaY * 2) + "px)";
        moving.style.transform = "translateY(" + (transitionY - event.deltaY * 2) + "px)";
      }
    }
    transitionY = parseInt(window.getComputedStyle(moving).transform.split("(")[1].split(")")[0].split(",")[5]);

    event.preventDefault();
  }
}

function getMoveType(){             // 현재 swipe가 수직인지 수평인지 판단하는 함수
  let moveType = -1;   // 0 : 수평, 1 : 수직
  const x = Math.abs(touchCurPos.x - touchStartPos.x);
  const y = Math.abs(touchCurPos.y - touchStartPos.y);

  const slope = parseFloat((x / y).toFixed(2), 10);

  if(slope > hSlope)
    moveType = 1;
  else
    moveType = 0;

  return moveType;
}


function sendPageInfo(menuId, keyword, newsId){             // ejs 부분(서버 사이드)에서 클라이언트 사이드로 변수 값을 보내와서 그 값을 세팅해줌
  this.menuId = menuId;
  this.keyword = keyword;
  this.newsId = parseInt(newsId);

  if(this.menuId == "recent"){
    selectedRecentPost();
  } else{
    selectedCategoryPost();
  }
}

function selectedRecentPost() {          // 현재 선택된 recent Post를 decorate 해주는 함수
  document.getElementsByClassName("recentList")[newsId].className += " tagSelected";
}

function selectedCategoryPost() {         // 현재 선택된 category를 decorate 해주는 함수
  if(menuId == "Travel")
    document.getElementsByClassName("categoryList")[0].className += " tagSelected";
  else if(menuId == "Living")
    document.getElementsByClassName("categoryList")[1].className += " tagSelected";
  else if(menuId == "Entertainment")
    document.getElementsByClassName("categoryList")[2].className += " tagSelected";
  else if(menuId == "Food")
    document.getElementsByClassName("categoryList")[3].className += " tagSelected";
}

function convertStrToNum(string){             // window.getComputedStyle 함수로 받은 값에서 "px"라는 단위를 제거하고 정수형으로 만듬으로써 사용이 용이하게 함.
  let str = string.split("px");
  str = str[0];
  str = parseInt(str);
  return str;
}

function calcHeight(menu, menuTitle, menuListWrapper, menuList){        // 오른쪽 메뉴의 높이를 계산(접고 펴지는 애니메이션을 위해 필요)

  let marginTitle = window.getComputedStyle(menuTitle).marginBottom;
  let marginList = window.getComputedStyle(menuList).marginBottom;
  const length = menuListWrapper.childElementCount;

  menu.style.top = "0px";
  marginTitle = convertStrToNum(marginTitle);
  marginList = convertStrToNum(marginList);

  return (menuTitle.offsetHeight + marginTitle) + length * (menuList.offsetHeight + marginList) + "px";
}

function clickMenu(menuName){         // 메뉴를 클릭했을 때 접고 펴지는 애니메이션 구현
  if(sizeState == 0){
    if(menuName == "recent"){
      if(isRecentOpened == false){
        recentListWrapper.style.top = "0px";
        recent.style.height = calcHeight(recent, recentTitle, recentListWrapper, recentList);
        recent.style.marginBottom = menuMarginBottom;
        isRecentOpened = true;
        openedCount++;
        newsRight.style.height = convertStrToNum(window.getComputedStyle(newsRight).height) + convertStrToNum(window.getComputedStyle(recentListWrapper).height) + "px";
      } else{
        recentListWrapper.style.top = -(recentListWrapper.offsetHeight + 20) + "px";
        recent.style.height = titleHeight;
        recent.style.marginBottom = "0px";
        isRecentOpened = false;
        openedCount--;
        newsRight.style.height = convertStrToNum(window.getComputedStyle(newsRight).height) - convertStrToNum(window.getComputedStyle(recentListWrapper).height) + "px";
      }
    } else if(menuName == "category"){
      if(isCategoryOpened == false){
        categoryListWrapper.style.top = "0px";
        category.style.height = calcHeight(category, categoryTitle, categoryListWrapper, categoryList);
        category.style.marginBottom = menuMarginBottom;
        isCategoryOpened = true;
        openedCount++;
        newsRight.style.height = convertStrToNum(window.getComputedStyle(newsRight).height) + convertStrToNum(window.getComputedStyle(categoryListWrapper).height) + "px";
      } else{
        categoryListWrapper.style.top = -(categoryListWrapper.offsetHeight + 20) + "px";
        category.style.height = titleHeight;
        category.style.marginBottom = "0px";
        isCategoryOpened = false;
        openedCount--;
        newsRight.style.height = convertStrToNum(window.getComputedStyle(newsRight).height) - convertStrToNum(window.getComputedStyle(categoryListWrapper).height) + "px";
      }
    } else if(menuName == "search"){
      if(isSearchOpened == false){
        searchListWrapper.style.top = "0px";
        search.style.height = calcHeight(search, searchTitle, searchListWrapper, searchList);
        search.style.marginBottom = menuMarginBottom;
        isSearchOpened = true;
        openedCount++;
        newsRight.style.height = convertStrToNum(window.getComputedStyle(newsRight).height) + convertStrToNum(window.getComputedStyle(searchListWrapper).height) + "px";
      } else{
        searchListWrapper.style.top = -(searchListWrapper.offsetHeight + 20) + "px";
        search.style.height = titleHeight;
        search.style.marginBottom = "0px";
        isSearchOpened = false;
        openedCount--;
        newsRight.style.height = convertStrToNum(window.getComputedStyle(newsRight).height) - convertStrToNum(window.getComputedStyle(searchListWrapper).height) + "px";
      }
    }
    setMenuLimitPos();
  }
}

function setDate(){             // post상단에 현재 월에 맞는 영어 단어를 출력
  const res = document.getElementsByClassName("newsPostDate");
  for(let i = 0 ; i < res.length ; i++){
    let date = res[i].childNodes[1].innerHTML;
    date = date.split("-");

    let year = date[0];
    year = year.substring(2, 4);

    let month = date[1];
    switch (month) {
      case "01": month = "Jan"; break;
      case "02": month = "Feb"; break;
      case "03": month = "Mar"; break;
      case "04": month = "Apr"; break;
      case "05": month = "May"; break;
      case "06": month = "Jun"; break;
      case "07": month = "Jul"; break;
      case "08": month = "Aug"; break;
      case "09": month = "Sep"; break;
      case "10": month = "Oct"; break;
      case "11": month = "Nov"; break;
      case "12": month = "Dec"; break;
    }

    let day = date[2];
    if(parseInt(day) < 10)
      day = day.substring(1,2);
      res[i].childNodes[0].innerHTML = day;
      res[i].childNodes[1].innerHTML = month + "'" + year;
  }
}

function submitForm(obj){       // 검색 버튼(아이콘)을 눌렀을 때 폼을 제출하여 검색을 실행하는 함수
  const regText = /^[^`|^'|^"]+$/;       // '나 `등 쿼리에 영향 줄 수 있는 특수 문자가 있는지 체크
  if(!regText.test(obj.parentNode.childNodes[1].value)){
    alert("Forbidden characters included. [Forbidden characters : ', `, \"]");
    return;
  }

  obj.parentNode.submit();
}

function setPageList(callbackFunc){     // 페이지 리스트를 숫자로 출력하는 함수(review 페이지의 그것과 로직은 같음)
  newsId = parseInt(newsId) + 1;
  let startPageNum = newsId - Math.floor(showLength / 2);
  let endPageNum = newsId + Math.floor(showLength / 2);
  if(newsId <= Math.floor(showLength / 2)){
    startPageNum = 1;
    endPageNum = showLength;
  }
  if(newsId > Math.floor(lastPageNum - showLength / 2)){
    startPageNum = lastPageNum - showLength + 1;
    endPageNum = lastPageNum;
  }

  pageList[0].innerHTML = "";

  if(menuId != "search"){
    if(newsId > Math.floor(showLength / 2) + 1 && lastPageNum > showLength){
      if(newsId - showLength < 1)
        pageList[0].innerHTML = '<a href=\'./' + 1 + '\'>' + 'prev</a>';
      else
        pageList[0].innerHTML = '<a href=\'./' + (newsId - showLength) + '\'>' + 'prev</a>';
    }
    for(let j = startPageNum ; j <= endPageNum ; j++){
      if(j != newsId)
        pageList[0].innerHTML += '<a href=\'./' + j + '\'>' + j + '</a>';
      else
        pageList[0].innerHTML += '<p>' + j + '</p>';
    }
    if(newsId <= Math.floor(lastPageNum - showLength / 2) && lastPageNum > showLength)
    {
      if(newsId + showLength > lastPageNum)
        pageList[0].innerHTML += '<a href=\'./' + lastPageNum + '\'>' + 'next</a>';
      else
        pageList[0].innerHTML += '<a href=\'./' + (newsId + showLength) + '\'>' + 'next</a>';
    }
  } else{
    if(newsId > Math.floor(showLength / 2) + 1 && lastPageNum > showLength){
      if(newsId - showLength < 1)
        pageList[0].innerHTML = '<a href=\'./' + 1 + '?text=' + keyword + '\'>' + 'prev</a>';
      else
        pageList[0].innerHTML = '<a href=\'./' + (newsId - showLength) + '?text=' + keyword + '\'>' + 'prev</a>';
    }
    for(let j = startPageNum ; j <= endPageNum ; j++){
      if(j != newsId)
        pageList[0].innerHTML += '<a href=\'./' + j  + '?text=' + keyword + '\'>' + j + '</a>';
      else
        pageList[0].innerHTML += '<p>' + j + '</p>';
    }
    if(newsId <= Math.floor(lastPageNum - showLength / 2) && lastPageNum > showLength)
    {
      if(newsId + showLength > lastPageNum)
        pageList[0].innerHTML += '<a href=\'./' + lastPageNum  + '?text=' + keyword + '\'>' + 'next</a>';
      else
        pageList[0].innerHTML += '<a href=\'./' + (newsId + showLength) + '?text=' + keyword + '\'>' + 'next</a>';
    }
  }
  callbackFunc();
}

function curPageDecorate(){         // 현재 페이지를 decorate하는 함수(review 페이지의 그것과 동일함)
  newsId = parseInt(newsId);
  if(newsId > Math.floor(showLength / 2) + 1 && newsId <= Math.floor(lastPageNum - showLength / 2))
    pageList[0].childNodes[2].className += "selected";
  else if(newsId <= Math.floor(showLength / 2) + 1)
    pageList[0].childNodes[newsId - 1].className += "selected";
  else if(newsId > Math.floor(lastPageNum - showLength / 2) && lastPageNum > showLength)
    pageList[0].childNodes[newsId - (lastPageNum - showLength)].className += "selected";
  else if(newsId == lastPageNum && lastPageNum <= showLength)
    pageList[0].childNodes[newsId - 1].className += "selected";
}

function sendLastPageNum(num){            // ejs 부분(서버 사이드)에서 클라이언트 사이드로 변수 값을 보내와서 그 값을 세팅해줌
  lastPageNum = num;
}

function setMenuLimitPos() {              // 오른쪽 메뉴의 수직 위치 범위를 설정(review 페이지의 그것과 동일)
  minLimit = document.getElementsByTagName("main")[0].offsetTop;
  maxLimit = document.getElementsByTagName("main")[0].offsetTop + document.getElementsByTagName("main")[0].clientHeight - newsRight.clientHeight;
  newsRight.style.top = minLimit + "px";
}

function setMenuCurPos(){           // 오른쪽 메뉴의 수직, 수평 위치를 설정(review 페이지의 그것과 동일)
  if(newsRight != undefined){

    if(sizeState == 0){
      if(newsRight !== undefined && menuId != "recent"){
        if (window.pageYOffset + (window.innerHeight * 0.1) > minLimit && window.pageYOffset - (window.innerHeight * 0.2) < maxLimit) {
            newsRight.classList.add("fix");
            newsRight.style.top = "10%";
            moving.classList.add("fix");

            if(window.pageYOffset < minLimit + (window.innerHeight * 0.1)){
              newsRight.style.top = minLimit;
              newsRight.classList.remove("fix");
            } else if((window.pageYOffset >= (minLimit + (window.innerHeight * 0.1))) && (window.pageYOffset <= (maxLimit - (window.innerHeight * 0.2)))){
              if((prevYOffset > window.pageYOffset)){
                moving.style.top = "10%";
              } else if(prevYOffset < window.pageYOffset){
                moving.style.top = "-20%";
              }
            } else if(window.pageYOffset > maxLimit - (window.innerHeight * 0.2)){
                newsRight.style.top = maxLimit;
                newsRight.classList.remove("fix");
            }
            prevYOffset = window.pageYOffset;
        } else {
          newsRight.classList.remove("fix");
          moving.classList.remove("fix");
          if(window.pageYOffset + (window.innerHeight * 0.1) < minLimit){
            newsRight.style.top = minLimit + "px";
          }
          if(window.pageYOffset + (window.innerHeight * 0.2) > maxLimit){
            newsRight.style.top = maxLimit + "px";
          }
        }
      }
      leftPos = (document.getElementsByTagName("Body")[0].clientWidth * 0.5) + (document.getElementById("newsLeft").clientWidth * 0.33);
      newsRight.style.left = leftPos + "px";
    } else{
    // 이 부분은 값을 안넣어도 동작함
    //  newsRight.style.top = "77px";
    //  moving.style.top = 0;
    }
  }
}

function showNewsMenu(){        // 태블릿, 모바일 환경에서 오른쪽 버튼을 누르면 메뉴가 표시되게 하는 함수
  menuCloseDiv.style.display = "block";
  newsRight.style.right = "0";
  newsPopUpButton.style.webkitFilter = "opacity(0)";
  newsPopUpButton.style.filter = "opacity(0)";
}

function hideNewsMenu(){        // 표시된 메뉴가 숨겨지는 함수(오른쪽으로 swipe)
  if(sizeState != 0){
    menuCloseDiv.style.display = "none";
    newsPopUpButton.style.webkitFilter = "opacity(0.85)";
    newsPopUpButton.style.filter = "opacity(0.85)";
    if(sizeState == 1)
      newsRight.style.right = "-285px";
    else if(sizeState == 2)
      newsRight.style.right = "-640px";
  }
}
