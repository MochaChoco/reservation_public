  // 리팩토링했음
  // GET http://127.0.0.1:3000/favicon.ico 500 (Internal Server Error)를 없애기 위해
  // <link rel="shortcut icon" href="#"> 추가
  // 이 방법은 페이지가 두번 로드되는 문제가 발생할수도 있음
  // 그럴땐 https://stackoverflow.com/questions/2009092/page-loads-twice-in-google-chrome 참조
module.exports = {
  includeCSS:function(title){       // 페이지 이름(title)에 맞는 css 파일을 include함
    return `
      <link rel="stylesheet" href="/css/header.css" type="text/css">
      <link rel="stylesheet" href="/css/nav.css" type="text/css">
      <link rel="stylesheet" href="/css/${title}.css" type="text/css">
      <link rel="stylesheet" href="/css/footer.css" type="text/css">
    `;
  },
  includeJS:function(title){       // 페이지 이름(title)에 맞는 js 파일을 include함
    return `
      <script src="/Js/header.js" type="text/javascript"></script>
      <script src="/Js/nav.js" type="text/javascript"></script>
      <script src="/Js/${title}.js" type="text/javascript"></script>
    `;
  },
  loadBodyContent:function(title){       // 페이지 이름(title)에 맞는 html 파일을 include함
    return `
      <main w3-include-html="/html/${title}.html"></main>
    `;
  },
  html:function(title, func){       // 불러온 js, css, html 파일을 하나의 형식으로 통합하여 출력
    return `
    <!DOCTYPE HTML>
    <html>
    <head>
    <meta charset="utf-8">
    	<title>${title}</title>
      <!--  <link rel="shortcut icon" href="#"> -->`
      + this.includeCSS(title) + `
    	<script src="/Js/include.js" type="text/javascript"></script>
    </head>
    <body>
      <header w3-include-html="/html/header.html"></header>
      <nav w3-include-html="/html/nav.html"></nav>`
      + func
      + `<footer w3-include-html="/html/footer.html"></footer>`
      + this.includeJS(title) +
    `</body>
    </html>
    `;
  },
  loadForm:function(action, id, name, password, score, description, maxLength){     // create, update review에서 쓰이는 몸통 부분
    return `
      <main>
        <section>
          <h1>Write a review</h1>
          <div id="formLeft">
              <div id="formWrapper">
                <p class="formMargin1">name</p>
                <p class="formMargin1">password</p>
                <p class="formMargin1">score</p>
                <p>description</p>
              </div>
            </div>
          <div id="formRight">
            <div id="formWrapper">
              <form id="contentForm" action="${action}" method="post">
                <input type="hidden" name="id" value ="${id}">
                <input class="formName formMargin1" type="text" name="name" maxlength="10" value="${name}"></br>
                <input class="formPassword formMargin1" type="password" name="password" maxlength="10" value="${password}"></br>
                <select class="formScore formMargin2" name="score">
                  <option value="5">★★★★★
                  <option value="4">★★★★☆
                  <option value="3">★★★☆☆
                  <option value="2">★★☆☆☆
                  <option value="1">★☆☆☆☆
                </select></br>
                <textarea id="formDescription" name="description" onkeyup="lengthCheck()">${description}</textarea></br>
                <p class="descriptionLength">(0 / ${maxLength}bytes)</p>
                <div id="buttonWrapper">
                  <div id="formSubmit" onClick="createFormCheck(lengthCheck())"><p>submit</p></div>
                  <div id="formCancle" onClick="confirmCancle()"><p>cancle</p></div>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
      <script>
        const maxDescriptionLength = ${maxLength};
        isUpdate();
        updateScore();

        function updateScore(){
          const id = document.getElementById("contentForm").id.value;
          if(id != "")
            document.getElementById("contentForm").score.selectedIndex = Math.abs("${score}" - 5);
        }
        function isUpdate(){
          if("${action}" != "/review/create_process"){
            const name = document.getElementsByClassName("formName")[0];
            name.readOnly = true;
            name.style.background = "#BDBDBD";
          }
        }
        function confirmCancle(){
          if(confirm("Are you sure you want to stop writing? If you do that what you write will disappear.")){
            if("${action}" != "/review/create_process")
              location.replace("/review/1");
            else
              location.href = "1";
          }
        }
      </script>
    `;
  },
  alertPassword:function(id, str){      // 패스워드를 잘못 입력했을 때 뜨는 경고창
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>alert</title>
      </head>
      <body>
        <script>
          alert("Wrong password");
          location.href= "/review/${str}/${id}";
        </script>
      </body>
      </html>
    `
  },
  alertBook:function(){       // book을 진행할 떄 이미 예약이 된 방이면 뜨는 경고창
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>alert</title>
      </head>
      <body>
        <script>
          alert("The room you selected has already been booked. After resetting the period, choose another room.");
          location.href= "/main";
        </script>
      </body>
      </html>
    `
  },
  alertTimeOver:function(){       // 세션이 만료됐을 때 경고창
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>alert</title>
      </head>
      <body>
        <script>
          alert("The time is over, Please try again.");
          location.href= "/main";
        </script>
      </body>
      </html>
    `
  },
  checkPasswordForm:function(action, id){       // 패스워드 입력 화면
    return `
      <main>
        <section>
        <div id="passwordCheckWrapper">
          <div id="top">
          </div>
          <div id="bottom">
          <p>Input your password below.</p>
          <form id="targetForm" action="${action}" method="post">
            <input type="hidden" name="id" value ="${id}">
            <input id="pass" type="password" name="password">
            <div id="buttonWrapper">
              <div id="formSubmit" onClick="clickedSubmit()"><p>submit</p></div>
              <div id="formCancle" onClick="clickedCancle()"><p>cancle</p></div>
            </div>
          </form>
          </div>
        </div>
        </section>
        <script>
          function clickedSubmit(){
            const target = document.getElementById("targetForm");
            if("${action}" == ("/review/delete/" + ${id})){
              if(confirm("Do you really want to delete this review? If you do that We can't recover never again.")){
                target.submit();
              } else{
                location.href = "/review/1";
              }
            }
            target.submit();
          }

          function clickedCancle(){
            location.href = "/review/1";
          }
        </script>
      </main>
    `;
  },
  noWritenForm:function(){          // 카테고리에 해당하는 뉴스가 아직 작성되지 않았을때 출력되는 화면
    return `
      <main>
        <section>
          <div id="warningNoSearch">
            <img src="/Images/warning.png">
            <h1>There is no written news yet.</h1>
            <a href="/news/recent/1"><p>Home</p></a>
          </div>
        </section>
      </main>
    `
  },
  noSearchForm:function(){        // 검색 결과가 없으면 출력
    return `
      <main>
        <section>
          <div id="warningNoSearch">
            <img src="/Images/warning.png">
            <h1>No search results were found.</h1>
            <a href="/news/recent/1"><p>Home</p></a>
          </div>
        </section>
      </main>
    `
  },                              // 예약 화면
  reservationForm:function(startDate, endDate, adults, children, rooms, avaliableList){
    return `
      <main>
        <section>
          <div id="orderListWrapper">
            <h1>Order List</h1>
            <div class="ceil">
              <div class="menuNameWrapper">
              <div class="fixMenuSize">Check in</div>
              <div class="fixMenuSize">Check out</div>
              <div class="fixMenuSize formSmall">Adults</div>
              <div class="fixMenuSize formSmall">Children</div>
              <div class="fixMenuSize formSmall">Rooms</div>
              </div>
            </div>
            <div class="contents">
              <form id="menuForm" action="/reservation" method="post">
                <div class="inputForm fixMenuSize">
                  <input name="startDate" class="formContents minDate" placeholder="check in" type="date" onmouseover="getMinDate(this)" value="${startDate}">
                </div>
                <div class="inputForm fixMenuSize">
                  <input name="endDate" class="formContents" placeholder="check out" type="date" onmouseover="getMaxDate(this)" value="${endDate}">
                </div>
                <div class="inputForm fixMenuSize formSmall">
                <select name="adults" class="formContents">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </select>
                </div>
                <div class="inputForm fixMenuSize formSmall">
                  <select name="children" class="formContents">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </select>
                </div>
                <div class="inputForm fixMenuSize formSmall">
                  <select name="rooms" class="formContents">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                </div>
              </form>
            </div>
            <h1>Selected</h1>
            <div class="ceil">
            </div>
            <div class="contents">
            </div>
            <h1>Available Rooms</h1>
            <div class="ceil">
            </div>
            <div class="contents avaliableList">
              <form id="avaliableList">
                <div class="rooms">
                <p class="roomsName">Classic Single Suites</p>
                <p>Only ${avaliableList.get('classicSingleSuites')} remain.</p>
                <select name="rooms" class="formContents">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                </form>
              </div>
            </div>
          </div>
      </section>
      </main>
      <script>
        let curDate = new Date();
        document.getElementById("menuForm").adults.selectedIndex = ${adults} - 1;
        document.getElementById("menuForm").children.selectedIndex = ${children} - 1;
        document.getElementById("menuForm").rooms.selectedIndex = ${rooms} - 1;

      </script>
      `
  },                  // 임시 예약 이후 사용자 정보 입력 화면
  bookForm:function(action, reservationTime, reservationNo){
    return `
    <main>
      <section>
        <h1>Write your inform</h1>
        <div id="formLeft">
            <div id="formWrapper">
              <p class="formMargin1">name</p>
              <p class="formMargin1">password</p>
              <p class="formMargin1">phoneNum</p>
              <p class="formMargin2">card No.</p>
              <p>terms</p>
            </div>
          </div>
        <div id="formRight">
          <div id="formWrapper">
            <form id="bookForm" action="${action}" method="post">
              <input type="hidden" name="reservationTime" value ="${reservationTime}">
              <input type="hidden" name="reservationNo" value ="${reservationNo}">
              <input class="formName formMargin1" type="text" name="name" maxlength="10" value=""></br>
              <input class="formPassword formMargin1" type="password" name="password" maxlength="10" value=""></br>
              <input class="formPhoneNum formMargin1" type="text" name="phoneNum" maxlength="13" value=""></br>
              <input class="formCardNo formMargin2" type="text" name="cardNo" value=""></br>
              <iframe src="/html/terms.html">
              </iframe>
              <div id="checkDiv">
                <input name="termCheck" class="checkBox" type="checkBox" disabled='disabled'>
                <span class="checkBoxText">I have read all the terms and agree to the terms.</span>
                <div id="termsPopup" onclick='showTermsPopup()'></div>
              </div>
              <div id="buttonWrapper">
                <div id="formSubmit" onClick="bookFormCheck()"><p>submit</p></div>
                <div id="formCancle" onClick="location.href='/main'"><p>cancle</p></div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
    `;
  },
  bookComplete:function(reservationNo){          // 예약이 완료됐을 시 최종 출력 화면
    return `
      <main id="resizeHeight">
        <section>
          <div id="completeResult">
            <div id="mainTitle">Thank you</div>
            <h3>reservationNo : ${reservationNo}</h3>
            <h2>All booking process is done. Just pay your payment when you enter the room.</br>If you have any changes or questions, please contact us below:</h2>
            <div id="spanWrapper">
              <span>Phone: +10 1234 5678</span><span id="spanRight">Mail: starsis@gmail.com</span>
            </div>
            <a href="/main"><p>Home</p></a>
          </div>
        </section>
      </main>
    `
  },
  checkOrderForm:function(action){            // order 체크 화면
    return `
      <main>
        <section>
        <div id="checkWrapper">
          <div id="top">
          </div>
          <div id="bottom">
          <p id="notice">Input your information below.</p>
          <form id="targetForm" action="${action}" method="post">
            <p class="reservationNo">reservationNo</p><input class="reservationNo checkForm" type="text" name="reservationNo">
            <p class="password">password</p><input class="password checkForm" type="password" name="password">
            <div id="buttonWrapper">
              <div id="formSubmit" onClick="orderFormCheck()"><p>submit</p></div>
              <div id="formCancle" onClick="clickedCancle()"><p>cancle</p></div>
            </div>
          </form>
          </div>
        </div>
        </section>
        <script>
        </script>
      </main>
    `;
  },
  noOrderForm:function(){         // order 검색 결과가 없을 때 출력 화면
    return `
      <main id="noOrderForm">
        <section>
          <div id="warningNoSearch">
            <img src="/Images/warning.png">
            <h1>There is no order result for the information</br> you entered.</h1>
            <a href="/main"><p>Home</p></a>
          </div>
        </section>
      </main>
    `
  },
}
