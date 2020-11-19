var startDate, endDate, period, reqAdult, reqChild;
let roomList;
let selectedLength = 0, resultPrice = 0;
let adultNum, childNum;
let countArr;

includeHTML(init);

function init(){        // init 함수
  headerInit();
  navInit();
  hideBookMenu();
}

function sendRoomsData(arr, startDate, endDate, period, reqAdult, reqChild){      // ejs 부분(서버 사이드)에서 클라이언트 사이드로 변수 값을 보내와서 그 값을 세팅해줌
  roomList = arr;
//  console.log(roomList);
  setRoomsData();
  this.startDate = startDate;
  this.endDate = endDate;
  this.period = period;
  this.reqAdult = reqAdult;
  this.reqChild = reqChild;
  countArr = new Array(0, 0, 0, 0, 0, 0);
}

function setRoomsData(){        // 서버로부터 받은 정보를 통해 현재 남아있는 방의 정보를 출력하는 함수
  const rooms = document.getElementsByClassName("rooms");
  const roomImage = document.getElementsByClassName("roomsImg");
  const roomName = document.getElementsByClassName("roomsName");
  const roomDescription = document.getElementsByClassName("roomsDescription");
  const roomCount = document.getElementsByClassName("roomsCount");
  const roomPrice = document.getElementsByClassName("roomsPrice");

  for(i in roomList){
    roomName[i].innerHTML = roomList[i].get('name');
    const imgName = roomName[i].innerHTML.replace(/ /gi, "");   // 문자열 공백 제거
    roomImage[i].src = '/Images/' + imgName + '.png';

    if(roomList[i].get('adult') > 1) {
      if(roomList[i].get('child') > 1)
        roomDescription[i].innerHTML = roomList[i].get('adult') + ' adults and '+ roomList[i].get('child') + ' children can stay.'
      else
        roomDescription[i].innerHTML = roomList[i].get('adult') + ' adults and '+ roomList[i].get('child') + ' child can stay.'
    } else {
      if(roomList[i].get('child') > 1)
        roomDescription[i].innerHTML = roomList[i].get('adult') + ' adult and '+ roomList[i].get('child') + ' children can stay.'
      else
        roomDescription[i].innerHTML = roomList[i].get('adult') + ' adult and '+ roomList[i].get('child') + ' child can stay.'
    }

    if(roomList[i].get('count') == 1)
      roomCount[i].innerHTML = 'Only ' + roomList[i].get('count')  + ' room will be able to that period.';
    else
      roomCount[i].innerHTML = roomList[i].get('count')  + ' rooms will be able to that period.';

    roomPrice[i].innerHTML = '<p>$' + roomList[i].get('price') + '/Night</p>';

    if(roomList[i].get('count') == 0)
      rooms[i].style.display = 'none';

    adultNum = 0;
    childNum = 0;
    countButton(i, 'init');
  }
}

function countButton(contentNum, work){         // count 버튼을 처리하는 함수(count 수에 따라 처리함)
  let maxCount;
  const num = document.getElementsByClassName("countNum")[contentNum];
  const plus = document.getElementsByClassName("buttonPlus")[contentNum];
  const minus = document.getElementsByClassName("buttonMinus")[contentNum];

  maxCount = roomList[contentNum].get('count');

  if(work == 'init'){
    if(maxCount == 1){
      minus.style.visibility = 'hidden';
      plus.style.visibility = 'hidden';
    }
    else {
      minus.style.visibility = 'hidden';
    }
    return;
  } else if(work == 'plus'){
    if(parseInt(num.innerHTML) + 1 > maxCount);
    else
      num.innerHTML = parseInt(num.innerHTML) + 1;

    if((num.innerHTML) == maxCount)
      plus.style.visibility = 'hidden';
    if((num.innerHTML) != 1)
      minus.style.visibility = 'visible';
  } else if(work == 'minus'){
    if(parseInt(num.innerHTML) - 1 < 1);
    else
      num.innerHTML = parseInt(num.innerHTML) - 1;

    if((num.innerHTML) == 1)
      minus.style.visibility = 'hidden';
    if((num.innerHTML) != maxCount)
      plus.style.visibility = 'visible';
  }
}

function addButton(contentNum){       // add 버튼을 누르면 Selected 카테고리에 현재 선택한 방을 등록함(장바구니 기능)
  const selected = document.getElementsByClassName("selectedContentWrapper")[0];
  const addButton = document.getElementsByClassName("buttonAdd")[contentNum];
  const resetButton = document.getElementsByClassName("buttonReset")[0];
  const bookButton = document.getElementsByClassName("buttonBook")[0];
  const price = document.getElementsByClassName("roomsPrice")[contentNum];
  const countWrapper = document.getElementsByClassName("countWrapper")[contentNum];

  if(addButton.childNodes[0].innerHTML != 'Added'){
   if(selectedLength == 0){
    selected.innerHTML = '';
    resetButton.style.display = 'inline-block';
    bookButton.style.display = 'inline-block';
  }
   selected.innerHTML += `
     <div class="selectedRooms">
       <img class="selectedRoomsImg"></img>
       <div class="selectedContent">
        <p class="selectedRoomsName"></p>
        <p class="selectedRoomsDescription"></p>
       </div>
     </div>
     `;

   const selectedImg = document.getElementsByClassName("selectedRoomsImg")[selectedLength];
   const selectedName = document.getElementsByClassName("selectedRoomsName")[selectedLength];
   const selectedDescription = document.getElementsByClassName("selectedRoomsDescription")[selectedLength];
   const selectedResultPrice = document.getElementsByClassName("resultPrice")[0];
   const selectedPrice = roomList[contentNum].get('price');
   const name = roomList[contentNum].get('name');
   const imgName = name.replace(/ /gi, "");
   const num = document.getElementsByClassName("countNum")[contentNum].innerHTML;

   if(selectedLength == 0){
     selected.parentNode.style.height = 'auto';
     selectedResultPrice.style.display = 'block';
   }

   selectedImg.src = '/Images/' + imgName + '.png';
   selectedName.innerHTML = num + ' ' + name + ' selected.';
   selectedDescription.innerHTML = '$' + selectedPrice + ' x ' + num + ' room(s) x ' + period + ' day(s) = $' + (selectedPrice * num * period);
   resultPrice += selectedPrice * num * period;
   selectedResultPrice.innerHTML = 'Your payment is $' + resultPrice;

   adultNum += num * roomList[contentNum].get('adult');
   childNum += num * roomList[contentNum].get('child');
   selectedLength++;

   addButton.childNodes[0].innerHTML = 'Added';
   addButton.style.cursor = 'auto';
   addButton.style.backgroundColor = 'gray';
   addButton.style.color = 'white';
   price.classList.add("buttonAddAfter");
   countWrapper.style.display = 'none';
   countArr[contentNum] = num;
  }
}

function resetButton(obj){      // selected 카테고리에 담긴 방들을 비우는 함수(장바구니 비우기 기능)
  if(selectedLength > 0){
    const selected = document.getElementsByClassName("selectedContentWrapper")[0];
    const addButton = document.getElementsByClassName("buttonAdd");
    const bookButton = document.getElementsByClassName("buttonBook")[0];
    const price = document.getElementsByClassName("roomsPrice");
    const selectedResultPrice = document.getElementsByClassName("resultPrice")[0];
    const countWrapper = document.getElementsByClassName("countWrapper");

   selected.parentNode.style.height = '50px';
   selectedResultPrice.style.display = 'none';
   selected.innerHTML = `
     <p class="noRoomsSelected">No Rooms selected</p>
   `;

   adultNum = 0;
   childNum = 0;
   resultPrice = 0;
   selectedLength = 0;

   for(let i = 0 ; i < addButton.length ; i++){
     addButton[i].innerHTML = 'Add';
     addButton[i].style.cursor = 'pointer';
     addButton[i].style.backgroundColor = '#FFBF00';
     addButton[i].style.color = 'black';
     price[i].classList.remove("buttonAddAfter");
     countWrapper[i].style.display = 'block';
     countArr[i] = 0;
   }

   obj.style.display = 'none';
   bookButton.style.display = 'none';
  }
}

function bookButton(){        // selected 카테고리(장바구니 폼)에 등록된 내용을 다음 페이지에 post 형식으로 전송
  const selected = document.getElementsByClassName("selectedContentWrapper")[0];
  const data = document.getElementsByClassName("bookData")[0];

  if(!checkNumberOfPeople()){
    alert('The number of people trying to book has exceeded the capacity of the room.\nTotal capacity of the currently selected rooms : adult - ' + adultNum + ' , child - ' + childNum);
    return;
  }

  const formInfo = new Object();
  formInfo.startDate = startDate;
  formInfo.endDate = endDate;
  formInfo.classicSingleSuites = countArr[0];
  formInfo.classicDoubleSuites = countArr[1];
  formInfo.luxurySingleSuites = countArr[2];
  formInfo.luxuryDoubleSuites = countArr[3];
  formInfo.royalSingleSuites = countArr[4];
  formInfo.royalDoubleSuites = countArr[5];
  formInfo.price = resultPrice;

  const json = JSON.stringify(formInfo);
  data.value = json;
  document.getElementsByClassName("bookForm")[0].submit();
}

function checkNumberOfPeople(){       // 입력한 성인, 어린이 수를 충족하는지 확인
  return (adultNum >= reqAdult && childNum >= reqChild);
}
