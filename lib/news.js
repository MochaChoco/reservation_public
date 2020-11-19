const mysqlConnector = require('../dbConfig.js')();

module.exports = {
  totalNewsNum: 0,
  startNum: 0,
  endNum: 0,
  lastPageNum:0,
  showingNewsCount: 0,
  sideNewsCount:0,
  getNewsInfo:function(curPageNum, menuName, keyword, callbackFunc){    // db에서 테이블 정보값을 받아와서 변수에 세팅하는 함수
    sideNewsCount = 5;
    showingNewsCount = 3;
    lastPageNum = 5;

    const connection = mysqlConnector.getInstance();
    let sqlString = 'call reservation.getNewsInfo(' + sideNewsCount + ', \'' + menuName + '\', \'' + keyword + '\')';

    connection.query(sqlString, function (err, result) {
      if(err){
        console.log(err);
      } else{
        totalNewsNum = result[0].length;
        if(menuName != "recent")
          lastPageNum = Math.ceil(totalNewsNum / showingNewsCount);
        else lastPageNum = 5;

        if(menuName == "search")
          callbackFunc(result);
        else callbackFunc();
      }
    });
  },
  getLastPageNum:function(){        // 마지막 페이지 숫자를 받아옴
    return lastPageNum;
  },
  checkPageNum:function(menuName, pageNum){     // 사용자가 페이지 숫자를 제대로 입력했는지 체크
    let num;
    if(menuName == "recent")
      num = sideNewsCount;
    else num = lastPageNum;

    if(pageNum > num || pageNum < 0)
      return false;
    else
      return true;
  },
  calStartNum:function(pageNum){      // 현재 페이지의 시작 뉴스 번호를 계산함
    startNum = ((pageNum - 1) * showingNewsCount);
  //  console.log("현재 페이지 첫 번호 설정 완료");
  },
  calEndNum:function(pageNum, callbackFunc){      // 현재 페이지의 마지막 뉴스 번호를 계산함
    const result = showingNewsCount;
    if(result > totalNewsNum){
      endNum = totalNewsNum;
    }
    else{
      endNum = result;
    }
  //  console.log("현재 페이지 마지막 번호 설정 완료");
    callbackFunc();
  },
  showNews:function(menuName, keyword, callbackFunc){        // 뉴스 정보를 db에서 받아옴
    //  console.log("렌더링 함수 호출");
    const connection = mysqlConnector.getInstance();
    let sqlString = 'call reservation.showNews(' + sideNewsCount + ', \'' + menuName + '\', \'' + keyword + '\', ' + startNum + ', ' + endNum + ')';

    connection.query(sqlString, function (err, result) {
      if(menuName == 'recent') {
        callbackFunc(result[0]);
      } else {
        let resArray = new Array();
        resArray[0] = result[0];
        resArray[1] = result[1];

        callbackFunc(resArray);
      }
    });
  }
}
