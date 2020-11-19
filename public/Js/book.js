let bookForm, bookName, bookPassword, bookCardNo, bookCheckBox, bookTermPopup;

includeHTML(init);

function init(){      // init 함수
  headerInit();
  navInit();
  bookDataInit();
  hideBookMenu();   // book 페이지일 경우 header 메뉴 부분에서 book 비활성화
  setBookInit();
}

function bookDataInit(){
  bookForm = document.getElementById("bookForm");
  bookCheckBox = document.getElementsByClassName("checkBox")[0];
  bookTermPopup = document.getElementById("termsPopup");
  resizeBookPage();
}

function resizeBookPage(){                  // book페이지에서 브라우저 크기를 변화(사이즈 변경, 화면 로테이트)시켰을 때 호출되는 함수
  const iframe = document.getElementsByTagName("iframe")[0];

  if(iframe != undefined){
    const fontSize = window.getComputedStyle(document.getElementsByTagName("html")[0]).fontSize;
    iframe.contentWindow.setFontSize(fontSize);
  }
}

function bookFormCheck(){       // 폼이 제대로 입력되었는지 체크하는 함수
  bookName = document.getElementsByClassName("formName")[0].value;
  bookPassword = document.getElementsByClassName("formPassword")[0].value;
  bookPhoneNum = document.getElementsByClassName("formPhoneNum")[0].value;
  bookCardNo = document.getElementsByClassName("formCardNo")[0].value;

  if(bookName.length == 0 || bookPassword.length == 0 || bookCardNo.length == 0){
    alert("Everything must be filled.");
    return;
  }
  if(!checkPhoneNum(bookPhoneNum)){
    alert("wrong phoneNum.");
    return;
  }
  if(!checkCardNo(bookCardNo)){
    alert("wrong cardNo.");
    return;
  }
  if(!bookCheckBox.checked){
    alert("You must agree terms.");
    return;
  }
  bookForm.submit();
}

function allRead(){       // term을 모두 읽었으면 체크박스 설정가능하게 변경
  bookCheckBox.disabled = '';
  bookTermPopup.style.display = 'none';
}

function showTermsPopup(){    // 만약 term을 모두 읽지 않은 상태에서 체크박스에 체크를 하려하면 호출되는 함수
  alert("You must read terms first.");
}

function checkPhoneNum(bookPhoneNum){   // 휴대폰 번호 유효성 검사
  const phoneNumber = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;   // 정규식
  return phoneNumber.test(bookPhoneNum);
}

function checkCardNo(bookCardNo){     // 신용카드 번호 유효성 검사
  const cardNumber = /^(?:(94[0-9]{14})|(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;
  return cardNumber.test(bookCardNo);
}
