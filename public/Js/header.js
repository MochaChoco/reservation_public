var minLimit, maxLimit, leftPos;
let header, headerLogo, headerText, isMinimal, bannerImg, mainBannerText, curPageName, headerMenuWrapper;
let isHeaderInit = false, isReviewInit = false, isCreateIconInit = false, isNewsInit = false,  isBookInit = false, isHeaderMenuFold = true;
let sizeState;  // 0 : big, 1 : medium, 2: small
let prevState;
let isBannerLoaded = false;
let browserWidth, browserHeight;
let bookMenu;

function headerInit(){     // init 함수
  header = document.getElementsByClassName("headerContentsWrapper");
  headerLogo = document.getElementsByClassName("headerLogo");
  headerText = document.getElementsByClassName("headerTextWrapper");
  bannerImg = document.getElementById("mainBannerImg");
  mainBannerText = document.getElementById("mainBannerText");
  curPageName = getPageName();
  headerMenuWrapper = document.getElementById("headerMenuWrapper");
  bookMenu = document.getElementsByClassName("hiddenMenu")[0];
  isMinimal = false;
  isHeaderInit = true;
  changeBanner(curPageName);
}

window.onscroll = function() {    // 브라우저가 스크롤 될때 처리하는 함수
  if(isBannerLoaded){
    if(isHeaderInit)
      setHeaderMenuTransition();
    if((isReviewInit && isCreateIconInit) || isNewsInit)
      setMenuCurPos();
    if(getPageName()!= "reservation")
      setNavMenuTransition();
  }
};

window.onresize = function() {    // 브라우저의 크기가 변할때 처리하는 함수
  resize();
};

window.onorientationchange = function(){    // 태블릿, 모바일 환경에서 브라우저가 회전할때 처리하는 함수
  resize();
}

function resize(){            // 현재 페이지의 이름을 읽어 해당하는 페이지의 resize함수를 호출
  checkWidth(function(){
    if(curPageName == "main")
      resizeMainPage();
    else if(curPageName == "rooms")
      resizeRoomPage();
    else if(curPageName == "review" && isCreateIconInit == true)
      resizeReviewPage();
    else if(curPageName == "news")
      resizeNewsPage();
    else if(curPageName == "reservation" && isBookInit == true)
      resizeBookPage();
    if(prevState != sizeState){
      mobileMenuPopUp();
    }
    setPrevState();
  });
}

function setPrevState(){          // 창의 크기가 변하거나 회전 시 이전에 어떤 상태였는지 가져옴
    prevState = sizeState;
}

function getBrowserWidth(){       // 브라우저의 너비를 가져옴
  return browserWidth;
}

function getBrowserHeight(){      // 브라우저의 높이를 가져옴
  return browserHeight;
}

function checkWidth(callbackFunc){    // 브라우저의 현재 너비를 판단하여 PC, 태블릿, 모바일 환경인지 여부를 판단함
  if(isMobileCheck() == false || screen.width > 1024 || screen.height > 1024){    // 현재 태블릿, 모바일이 아니거나 높이 또는 너비가 1024px를 초과할 때
    if(window.innerWidth > 1024)        // 가로 너비가 1024px을 넘을때, 태블릿도 가로 화면엔 여기에 해당함
      sizeState = 0;
    else if(window.innerWidth <= 1024 && window.innerWidth >= 640)    // 가로 너비가 640px보다 크고 1024px보다 작을 때
      sizeState = 1;
    else                                                            // 그 외의 경우(PC환경에서 창 크기 최소화 했을 때) 처리
      sizeState = 2;
    browserWidth = window.innerWidth;
    browserHeight = window.innerHeight;
  } else if(isMobileCheck() == true){     // 현재 태블릿, 모바일 환경일 때
    if(window.orientation == 0 || window.orientation == 180){
      if(screen.width > 1024)
        sizeState = 0;
      else if(screen.width <= 1024 && screen.width >= 640)
        sizeState = 1;
      else
        sizeState = 2;
      browserWidth = screen.width;
      browserHeight = screen.height;
    } else {
      if(screen.height > 1024)
        sizeState = 0;
      else if(screen.height <= 1024 && screen.height >= 640)
        sizeState = 1;
      else
        sizeState = 2;
      browserWidth = screen.height;     // 태블릿, 모바일 환경은 가로 세로를 구분해야 함
      browserHeight = screen.width;
    }
  }
  callbackFunc();
}


function changeBanner(pageName) {         // 페이지 이름에 맞는 bannerImg를 로딩해줌
  if(pageName == "main")
  {
    bannerImg.src= "/Images/mainBanner.jpg";
    mainBannerText.childNodes[1].innerHTML = "Book your stay";
    mainBannerText.childNodes[3].innerHTML = "You have worked enough so far and it's time to relax,</br>Our hotel will offer you the best seating area.";
  } else if(pageName == "rooms"){
    bannerImg.src= "/Images/roomsBanner.jpg";
    mainBannerText.childNodes[1].innerHTML = "Rooms";
    mainBannerText.childNodes[3].innerHTML = "Choose your resting place. We bring you high quality and reasonable price.</br>Whatever you choosed, will be satisfied.";
  } else if(pageName == "review"){
    bannerImg.src= "/Images/reviewBanner.jpg";
    mainBannerText.childNodes[1].innerHTML = "Review";
    mainBannerText.childNodes[3].innerHTML = "We'll be honest with you about the reviews left by other visitors.</br>Look at the visitor's happy.";
  } else if(pageName == "news"){
    bannerImg.src= "/Images/newsBanner.jpg";
    mainBannerText.childNodes[1].innerHTML = "News";
    mainBannerText.childNodes[3].innerHTML = "We have some amazing and special news to share with you only at the Stasis Hotel. We're waiting to do this together.";
  } else if(pageName == "reservation"){
    bannerImg.src= "/Images/reservationBanner.jpg";
    mainBannerText.childNodes[1].innerHTML = "Reservation";
    mainBannerText.childNodes[3].innerHTML = "We will help you make a reservation quickly and accurately.<br>There is no burden as you can pay the amount when you enter the room.";
  }
  else if(pageName == "order"){
    bannerImg.src= "/Images/orderBanner.jpg";
    mainBannerText.childNodes[1].innerHTML = "Order";
    mainBannerText.childNodes[3].innerHTML = "Find your order list quickly and easily. You don't need a lot of things, just need the reservation number and a password.";
  }
}

function setReviewInit(){     // 현재 리뷰 페이지일때 main부분이 로딩 완료됐을 때 호출하는 함수
  isReviewInit = true;
}

function setCreateIconLoaded(){     // 현재 글 작성 페이지일때 createIcon이 로딩 완료됐을 때 호출하는 함수
  isCreateIconInit = true;
}

function setNewsInit(){     // 현재 뉴스 페이지일때 main부분이 로딩 완료됐을 때 호출하는 함수
  isNewsInit = true;
}

function setBookInit(){
  isBookInit = true;
}

function convertPxtoVW(px){             // 픽셀 단위를 vw단위로 변환
  return px * (100 / window.outerWidth);
}

function setHeaderMenuTransition(){       // 스크롤이 어느정도 내려왔을 때 헤더 부분을 최소화하는 함수
    // header 부분 show, hide 처리 부분
  if (window.pageYOffset > bannerImg.clientHeight * 0.14) {
    header[0].className = "headerContentsWrapper resizeHeader";
    headerText[0].className = "headerTextWrapper";
  }
  else{
    header[0].className = "headerContentsWrapper";
    headerText[0].className = "headerTextWrapper hiddenText";
  }
}

function getPageName(){       // 현재 페이지 이름을 불러옴
    let pageName = "";
    const tempPageName = window.location.href;
    const strPageName = tempPageName.split("/");
    pageName = strPageName[3];
    return pageName;
}

function getPageNum(){      // 현재 페이지의 숫자를 불러옴(리뷰나 뉴스 부분에서 쓰임)
    let pageNum = "";
    const tempPageName = window.location.href;
    const strPageName = tempPageName.split("/");
    pageNum = strPageName[4];
    return pageNum;
}

// 이미지의 크기가 가변적이므로 이미지가 다 로드되면 계산하게끔 설정
function bannerImgLoaded() {
  checkWidth(function(){
    setPrevState();
    isBannerLoaded = true;

    if(curPageName == "review" && isCreateIconInit == true){
      resizeReviewPage();
      setReviewInit();
    }
    if(curPageName == "news"){
      resizeNewsPage();
      setNewsInit();
    }
    if(curPageName == "order"){
      setOrderInit();
    }
  });
}

function isMobileCheck() {      // 현재 브라우저 환경이 모바일(태블릿)인지 체크하는 함수
  const tempUser = navigator.userAgent;
  let isMobile = false;

  // userAgent 값에 iPhone, iPad, ipot, Android 라는 문자열이 하나라도 존재한다면 모바일로 간주.
  if (tempUser.indexOf("iPhone") > 0 || tempUser.indexOf("iPad") > 0
          || tempUser.indexOf("iPot") > 0 || tempUser.indexOf("Android") > 0) {
      isMobile = true;
  }
  return isMobile;
};

function mobileMenuPopUp(){         // 현재 브라우저가 태블릿, 모바일일 경우 header 메뉴 팝업 처리하는 부분
  if(sizeState == 0){   // 현재 pc화면 상태일때
    if(prevState != 0){   // 모바일에서 pc화면으로 전환했을 때
      headerMenuWrapper.style.left = "50%";
      isHeaderMenuFold = false;
    } else{
        // pc에서 이 버튼을 누를 일이 없으므로 무시함.
    }
  } else if(sizeState == 1){   // 현재 pc화면 상태가 아닐 때
    if(prevState == 0 || prevState == 2){   // pc화면에서 태블릿으로 전환했을 때
      headerMenuWrapper.style.left = "-180px";
      isHeaderMenuFold = true;
    } else{   // 그 외의 경우(태블릿 화면에서 버튼을 클릭했을 때)
      if(isHeaderMenuFold && prevState == sizeState){   // 메뉴가 접혀있을때 펴줌
        headerMenuWrapper.style.left = "0px";
        isHeaderMenuFold = false;
      } else{   // 메뉴가 펴져있을때 접음
        headerMenuWrapper.style.left = "-180px";
        isHeaderMenuFold = true;
      }
    }
  } else if(sizeState == 2){
    if(prevState == 0 || prevState == 1){   // pc화면에서 모바일로 전환했을 때
      headerMenuWrapper.style.left = "-390px";
      isHeaderMenuFold = true;
    } else{   // 그 외의 경우(모바일 화면에서 버튼을 클릭했을 때)
      if(isHeaderMenuFold && prevState == sizeState){   // 메뉴가 접혀있을때 펴줌
        headerMenuWrapper.style.left = "0px";
        isHeaderMenuFold = false;
      } else{   // 메뉴가 펴져있을때 접음
        headerMenuWrapper.style.left = "-390px";
        isHeaderMenuFold = true;
      }
    }
  }
}

function hideBookMenu(){              // reservation 페이지에서 book 메뉴가 비활성화되도록 하는 함수
  bookMenu.style.display = "none";
}
