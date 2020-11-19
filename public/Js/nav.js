var curDate;
let navMenu, navMenuImg;
let minDateValue, maxDateValue;
let footerClientHeight;
let isShowed = false;

function navInit(){     // init 함수
  navMenu = document.getElementById("navMenuWrapper");
  footerClientHeight = document.getElementsByTagName("footer")[0].clientHeight;

  if(getPageName() == "reservation"){
    navMenu.style.display = "none";
    return;
  }
  navMenuImg = document.getElementById("navMenuImg");
  initDate();
  showMenu();
}

function showMenu(){    // 마우스 hover 했을 때 표시 처리 하는 함수
  if(navMenu != undefined){
    navMenu.style.bottom = "0";
    navMenuImg.style.transform = "translate(-50%) rotate(180deg)";
    isShowed = true;
  }
}

function hideMenu() {   // 마우스를 뗐을 때 숨김 처리 하는 함수
  if(navMenu != undefined){
    navMenu.style.bottom = "-58px";
    navMenuImg.style.transform = "translate(-50%) rotate(0deg)";
    isShowed = false;
  }
}

function clickNavMenu(){
  if(isShowed == true)
    hideMenu();
  else if(isShowed == false)
    showMenu();
}

function initDate(){    // 오늘 날짜 받아옴
  curDate = new Date();
}

function getMinDate(obj){     // check in 필드 처리
  let year = curDate.getFullYear();
  let month = curDate.getMonth() + 1;
  let day = curDate.getDate();

  if(month < 10)
    month = "0" + month;

  if(day < 10)
    day = "0" + day;

  const str = year + "-" + month + "-" + day;
//  console.log("min : " + str);
  obj.min = str;
  minDateValue = str;
  return str;
}

function getMaxDate(obj){     // check out 필드 처리
  let minDate;
  if(getPageName() != "reservation")
    minDate = document.getElementsByClassName("minDate")[0];
  else
    minDate = document.getElementsByClassName("minDate")[1];

  const min = minDate.value;
  let minStr = calDate(new Date(min), 0, 0, 1);
  let result = calDate(new Date(min), 0, 1, 0);

  result = result[0] + "-" + result[1] + "-" + result[2];
  minStr = minStr[0] + "-" + minStr[1] + "-" + minStr[2];

  obj.min = minStr;
  obj.max = result;
  minDateValue = minStr;
  maxDateValue = result;
}

function calDate(date, addYear, addMonth, addDay) {     // 날짜와 더하고자 하는 년월일을 입력하면 더한 값을 출력하는 함수
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  const addedDate = new Date(
    year + addYear,
    month + addMonth,
    0
  );

  let result = new Array(3);
  result[0] = addedDate.getFullYear() + "";
  result[1] = addedDate.getMonth() + 1;
  result[2] = addedDate.getDate();

  if(day + addDay > addedDate.getDate()){
    result[2] = 1;
    if(result[1] + 1 > 12){
      result[1] = 1;
      result[0] += 1;
    }
    else {
      result[1] += 1;
    }
  } else{
    result[2] = day + addDay;
  }

  if(result[1] < 10)
    result[1] = "0" + result[1];
  else
    result[1] = result[1] + "";

  if(result[2] < 10)
    result[2] = "0" + result[2];
  else
    result[2] = result[2] + "";

  return result;
}

function reservationFormCheck(obj){     // book 버튼을 눌렀을 때 정보가 제대로 입력되었는지 확인하는 함수
  let form;
  if(getPageName() != "reservation")
    form = document.getElementsByClassName("menuForm")[0];
  else
    form = document.getElementsByClassName("menuForm")[1];

    // 새로고침한 상태에서 submit하기 전에 다시 한번 maxDateValue와 minDateValue 체크
  getMinDate(form.startDate);
  getMaxDate(form.endDate);

  if((form.startDate.value == "") || form.endDate.value == "" || form.adults.value == "" || form.children.value == ""){
    alert("All reservation information must be filled.");
    return;
  }

  const date = calDate(new Date(),0,0,0);
  let today = "";
  for(i in date){
    if(i == date.length - 1)
      today += date[i];
    else
      today += date[i] + "-";
  }

  if(compareDate(form.startDate.value, today) == today){
    alert("Invalid StartDate.");
    form.startDate.value = null;
    form.startDate.type = "text";
    form.endDate.value = null;
    form.endDate.type = "text";
    return;
  }
  if(compareDate(form.endDate.value, minDateValue) == minDateValue || compareDate(form.endDate.value, maxDateValue) == form.endDate.value){
    alert("Invalid EndDate.");
    form.startDate.value = null;
    form.startDate.type = "text";
    form.endDate.value = null;
    form.endDate.type = "text";
    return;
  }
  form.submit();
}

function mobileBook(){    // 모바일 페이지에서 book 버튼을 눌렀을 때 처리하는 함수(오늘 날짜, 내일 날짜, 어른 1명, 아이 1명 지정)
  initDateForm().submit();
}

function initDateForm(){      // 모바일 페이지에서 book 버튼을 눌러 reservation 페이지로 넘어갈때 form의 값을 전달하는 함수
  let form;
  if(getPageName() != "reservation")
    form = document.getElementsByClassName("menuForm")[0];
  else
    form = document.getElementsByClassName("menuForm")[1];

  form.startDate.type = "date";
  getMinDate(form.startDate);
  form.startDate.value = form.startDate.min;
  form.startDate.type = "date";
  getMaxDate(form.endDate);
  form.endDate.value = form.endDate.min;
  form.adults.value = "1";
  form.children.value = "1";

  return form;
}

/* -------------------- ios 환경에서 date 정보를 받아오지 못해서 추가한 함수 -----------------------*/

function onFocusMinDate(obj){
  obj.type = "date";
  getMinDate(obj);
  obj.focus();
}

function onFocusMaxDate(obj){
  obj.type = "date";
  getMaxDate(obj);
  obj.focus();
}

/* ---------------------------------------------------------------------------------------------*/

function compareDate(str1, str2){   // 문자열로 된 두 날짜를 비교하여 큰 쪽을 출력하는 함수
  const date1 = new Date(str1);
  const date2 = new Date(str2);

  if(date1 > date2)
    return str1;
  else if(date2 > date1)
    return str2;
  else
    return 0;
}

function setNavMenuTransition(){       // 스크롤이 어느정도 내려왔을 때 헤더 부분을 최소화하는 함수
    // header 부분 show, hide 처리 부분
  if (window.pageYOffset > document.body.clientHeight - window.innerHeight - document.getElementsByTagName("footer")[0].clientHeight) {
    hideMenu();
  }
  else{
    showMenu();
  }
}
