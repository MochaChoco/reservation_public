var orderList, period;

includeHTML(init);

function init(){      // order 페이지 init 함수
  headerInit();
  navInit();
}

function sendBookData(orderList, period){      // ejs 부분(서버 사이드)에서 클라이언트 사이드로 변수 값을 보내줌
  this.orderList = orderList;
  this.period = period;
}

function setOrderInit(){        // order 페이지의 init가 완료되면 호출
  if(orderList != undefined)
    setValue();
}

function orderFormCheck(){      // order 폼에 정보가 제대로 기입되었는지 체크
  reservationNo = document.getElementsByClassName("reservationNo")[1].value;
  password = document.getElementsByClassName("password")[1].value;
  const regRes = /^[0-9]+$/;      // 문자열이 숫자로 이루어져 있는지 체크
  const regPass = /^[^`|^'|^"]+$/;       // '나 `등 쿼리에 영향 줄 수 있는 특수 문자가 있는지 체크
  const regSpace = /^[^ ]/;       // 아무 문자 없이 공백만 있는지 체크

  if(!regRes.test(reservationNo) || !regPass.test(password)){
    alert("It is wrong reservationNo or password you entered.");
    return;
  }
  if(!regSpace.test(reservationNo) || !regSpace.test(password)){
    alert("Blank characters are not allowed.");
    return;
  }

  clickedSubmit();
}

function clickedSubmit(){   // 폼 제출
  const target = document.getElementById("targetForm");
    target.submit();
}

function clickedCancle(){   // 취소하고 메인으로 이동
  location.href = "/main";
}

function setValue(){      // 서버에서 받은 값들을 세팅하여 클라이언트 화면에 출력.
  let result = 0;
  const roomsName = document.getElementsByClassName("roomsName");
  const roomsPrice = document.getElementsByClassName("roomsPrice");
  const roomsPeriod = document.getElementsByClassName("roomsPeriod");
  const roomsResult = document.getElementsByClassName("roomsResult");
  const allResultPrice = document.getElementById("allResultPrice");

  for(let i = 1 ; i < roomsName.length ; i++){
    if(sizeState != 2)
      roomsName[i].innerHTML = orderList[i - 1].get('roomType');
    else if(sizeState == 2){    // 모바일 해상도에서는 여백이 적어 type을 모두 표시할 수 없으므로 약어로 표시한다.
      switch (orderList[i - 1].get('roomType')) {
        case 'Classic Single Suites':
          roomsName[i].innerHTML = "CSS";
          break;
        case 'Classic Double Suites':
          roomsName[i].innerHTML = "CDS";
          break;
        case 'Luxury Single Suites':
          roomsName[i].innerHTML = "LSS";
          break;
        case 'Luxury Double Suites':
          roomsName[i].innerHTML = "LDS";
          break;
        case 'Royal Single Suites':
          roomsName[i].innerHTML = "RSS";
          break;
        case 'Royal Double Suites':
          roomsName[i].innerHTML = "RDS";
          break;
      }
      roomsName[i].style.textAlign = "center";    // 기존과 정렬이 일치하지 않는 문제 수정
    }

    roomsPrice[i].innerHTML =  "$" + orderList[i - 1].get('price') / period;
    roomsPeriod[i].innerHTML = period + " day(s)";
    roomsResult[i].innerHTML =  "$" + orderList[i - 1].get('price');
    result += orderList[i - 1].get('price');
  }
  if(sizeState == 2)
    document.getElementsByClassName("roomsName priceInfoMenu")[0].innerHTML = "type";

  allResultPrice.innerHTML += "The total payment : $" + result;
}
