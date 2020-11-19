const mysqlConnector = require('../dbConfig.js')();
const date = require('./date.js');
const sanitizeHTML = require('sanitize-html');

module.exports = {
  totalReviewNum: 0,
  startNum: 0,
  endNum: 0,
  lastPageNum: 0,
  showingReviewCount: 0,

  getInfoValue:function(curPageNum, callbackFunc){    // db에서 테이블 정보값을 받아와서 변수에 세팅하는 함수
    const connection = mysqlConnector.getInstance();
    let sqlString = 'SELECT * from reservation.reviewinfo';
    connection.query(sqlString, function (err, result) {
      if(err){
        console.log(err);
      } else{
        curPageNum = curPageNum;
        totalReviewNum = result[0]['totalReviewNum'];
        lastPageNum = result[0]['lastPageNum'];
        showingReviewCount = result[0]['showingReviewCount'];
        callbackFunc();
      }
    });
  },
  setInfoValue:function(num, callbackFunc){    // db에서 테이블 정보값을 받아와서 변수에 세팅하는 함수
    const connection = mysqlConnector.getInstance();
    let sqlString = "call reservation.setInfoValue(" + num + ")";
    connection.query(sqlString, function (err, result) {
      if(err){
        console.log(err);
      }
      else{
        callbackFunc();
      }
    });
  },
  checkPageNum:function(pageNum){     // 사용자가 주소창에 없는 페이지 번호를 입력했는지 체크하는 함수
    if(pageNum > lastPageNum || pageNum < 0)
      return false;
    else
      return true;
  },
  calStartNum:function(pageNum){    // 현재 페이지에서 시작 글번호 계산
    startNum = ((pageNum - 1) * showingReviewCount);
  },
  calEndNum:function(pageNum, callbackFunc){      // 현재 페이지에서 마지막 글번호 계산
    const result = showingReviewCount;
    if(result > totalReviewNum){
      endNum = totalReviewNum;
    }
    else{
      endNum = result;
    }
    callbackFunc();
  },
  showTable:function(callbackFunc){       // startNum과 endNum을 이용하여 현재 페이지의 리뷰 게시글들을 db에서 불러옴
    const connection = mysqlConnector.getInstance();
    sqlString = `select id, score, description, author, created from review ORDER BY id desc Limit ` + startNum + `, ` + endNum;

    connection.query(sqlString, function (err, result) {
      if(err){
        console.log(err);
        callbackFunc(result);
      }
      else
        callbackFunc(result);
    })
  },
  getLastPageNum:function(){      // 마지막 페이지 번호를 불러옴
    return lastPageNum;
  },
  createReview:function(id, name, password, score, description, callbackFunc){    // 사용자가 작성한 리뷰를 db에 등록함.
    const connection = mysqlConnector.getInstance();
    const sanitizedName = sanitizeHTML(name);       // 사용자가 악의적인 정보들을 담았을 경우를 대비하여 sanitize한 정보를 입력한다.
    const sanitizedPassword = sanitizeHTML(password);
    const sanitizedDescription = sanitizeHTML(description);
    const createdDate = date.dateToStr(new Date());
    sqlString = "INSERT INTO `reservation`.`review`(`score`,`description`,`created`,`author`,`password`) VALUES (" + score + ",\"" + sanitizedDescription + "\",\"" + createdDate + "\",\"" + sanitizedName + "\",\"" + sanitizedPassword + "\")";

    connection.query(sqlString, function (err, result) {
      if(err){
        console.log(err);
      } else{
      callbackFunc();
      }
    });
  },
  loadFormData:function(id, callbackFunc){        // 글을 업데이트할 때 id를 이용하여 기존에 작성했던 리뷰글 정보를 불러옴
    const connection = mysqlConnector.getInstance();
    const sqlString = "select id, score, description, created, author from review where id = " + id;

    connection.query(sqlString, function (err, result) {
      if(err){
        console.log(err);
      } else{
        callbackFunc(result);
      }
    });
  },
  checkPassword:function(id, password, callbackFunc){       // 리뷰를 업데이트 또는 삭제할 때 패스워드 입력을 처리하는 함수
    const connection = mysqlConnector.getInstance();
    const sqlString = "select password from review where id = " + id;

    connection.query(sqlString, function (err, result) {
      if(err){
        console.log(err);
      } else{
        if(password == result[0]['password']){
          callbackFunc(true);
        } else{
          callbackFunc(false);
        }
      }
    });
  },
  updateReview:function(id, score, description, password, callbackFunc){        // 사용자가 작성한 리뷰 정보를 db에 에서 id와 일치하는 리뷰글에 업데이트 시킴
    const connection = mysqlConnector.getInstance();
    const sanitizedPassword = sanitizeHTML(password);
    const sanitizedDescription = sanitizeHTML(description);
    const sqlString = "UPDATE reservation.review SET score= " + score + ", description='" + sanitizedDescription + "', password='" + sanitizedPassword + "' WHERE id=" + id;

    connection.query(sqlString, function (err, result) {
      if(err){
        console.log(err);
      }
      else {
        callbackFunc();
      }
    });
  },
  deleteReview:function(id, callbackFunc){      // db에서 id에 해당하는 리뷰를 삭제함.
    const connection = mysqlConnector.getInstance();
    const sqlString = "DELETE from reservation.review WHERE `id` = " + id;
    connection.query(sqlString, function (err, result) {
      if(err){
        console.log(err);
      }
      else {
        callbackFunc();
      }
    });
  }
}
