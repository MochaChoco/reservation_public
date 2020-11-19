const mysqlConnector = require('../dbConfig.js')();
const date = require('./date.js');
let flag = false;

module.exports = {
  temp:'',
  timer:'',
  showAvaliable:function(startDate, endDate, callbackFunc){     // 예매 가능한 방 정보 표시
    const connection = mysqlConnector.getInstance();
    const sqlString = 'call reservation.showAvaliable(' + '\'' + startDate + '\' , \'' + endDate + '\')';
    connection.query(sqlString, function (err, result) {
      if(err){
        console.log(err);
          return err;
      } else{
        let arr = new Array();
        for(let i = 0 ; i < 6 ; i++){
          let map = new Map([
            ['name',''],
            ['count', 0],
            ['adult', 0],
            ['child', 0],
            ['price', 0]
          ]);

          switch(i){
              case 0:
                map.set('name', 'Classic Single Suites');
                map.set('adult', 1);
                map.set('child', 1);
                map.set('price', 89);
                break;
              case 1:
                map.set('name', 'Classic Double Suites');
                map.set('adult', 2);
                map.set('child', 1);
                map.set('price', 129);
                break;
              case 2:
                map.set('name', 'Luxury Single Suites');
                map.set('adult', 2);
                map.set('child', 1);
                map.set('price', 109);
                break;
              case 3:
                map.set('name', 'Luxury Double Suites');
                map.set('adult', 4);
                map.set('child', 2);
                map.set('price', 149);
                break;
              case 4:
                map.set('name', 'Royal Single Suites');
                map.set('adult', 2);
                map.set('child', 2);
                map.set('price', 129);
                break;
              case 5:
                map.set('name', 'Royal Double Suites');
                map.set('adult', 4);
                map.set('child', 3);
                map.set('price', 169);
                break;
          }
          arr.push(map);
        }

        for(i in result[0]){
          if(result[0][i]['name'] == 'Classic Single Suites')
            arr[0].set('count', arr[0].get('count') + 1);
          else if(result[0][i]['name'] == 'Classic Double Suites')
            arr[1].set('count', arr[1].get('count') + 1);
          else if(result[0][i]['name'] == 'Luxury Single Suites')
            arr[2].set('count', arr[2].get('count') + 1);
          else if(result[0][i]['name'] == 'Luxury Double Suites')
            arr[3].set('count', arr[3].get('count') + 1);
          else if(result[0][i]['name'] == 'Royal Single Suites')
            arr[4].set('count', arr[4].get('count') + 1);
          else if(result[0][i]['name'] == 'Royal Double Suites')
            arr[5].set('count', arr[5].get('count') + 1);
        }
        callbackFunc(arr);
      }
    });
  },
  inputBookInfo:function(jsonData, callbackFunc){      // reservation페이지에서 book페이지로 넘어갈때 예매한 방의 정보를 post형식으로 넘겨줌(임시로 예약 진행)
    const connection = mysqlConnector.getInstance();
    let sqlString = 'call reservation.inputBookInfo(\'' + jsonData.startDate + '\', \'' + jsonData.endDate + '\', ' + parseInt(jsonData.classicSingleSuites) + ', ' + parseInt(jsonData.classicDoubleSuites) + ', ' + parseInt(jsonData.luxurySingleSuites) + ', ' + parseInt(jsonData.luxuryDoubleSuites) + ', ' + parseInt(jsonData.royalSingleSuites) + ', ' + parseInt(jsonData.royalDoubleSuites) + ', @resTime, @resNo)';

    connection.query(sqlString, function (err, result) {
      if(err){
        console.log(err);
          return err;
      } else {
        if(result.length != 3)
          callbackFunc(false);
        else
          callbackFunc(true, result[0][0].resultTime, result[1][0].resultNo);
      }
    });
  },
  startTimer:function(curTime, reservationNo){      // 사용자가 임시 예약 후 예약을 안할 수도 있으므로 시간이 지나면 자동으로 예약이 취소되서 다른 사람이 예약할 수 있도록 타이머 설정
    console.log("예약 시작, 카운트다운  // 예약 번호 : " + reservationNo);
    timer = setTimeout(function(){
      const connection = mysqlConnector.getInstance();
      let sqlString = 'DELETE from reservation.rooms WHERE (reservationTime = \'' + curTime + '\' && ' + reservationNo + ')';
      connection.query(sqlString, function (err, result) {
        if(err){
          console.log(err);
            return err;
        } else{
          console.log("시간 만료되서 삭제 처리됨 // 예약 번호 : " + reservationNo);
        }
      });
    }, 1000 * 60 * 5);  // 5분 지나면 만료
  },
  stopTimer:function(name, password, phoneNum, cardNo, reservationTime, reservationNo, callbackFunc){       // 예약에 성공하면 타이머를 중단한다.
    console.log("예약 성공, 타이머 취소");
    clearTimeout(timer);

    const connection = mysqlConnector.getInstance();
    let sqlString = 'UPDATE reservation.rooms set name = \'' + name + '\', password = \'' + password + '\', phoneNum = \'' + phoneNum + '\', cardNum = \'' + cardNo + '\' WHERE (reservationTime = \'' + reservationTime + '\' && reservationNo = ' + reservationNo + ')';
    connection.query(sqlString, function (err, result) {
      if(err){
        console.log(err);
          return err;
      } else{
        if(result.changedRows == 0){
          console.log("시간 초과");
          callbackFunc(false);
        } else {
          console.log("업데이트 완료");
          callbackFunc(true);
        }
      }
    });
  },
  findOrder:function(reservationNo, password, callbackFunc){          // 사용자가 입력한 order 정보를 확인한다.
    const connection = mysqlConnector.getInstance();
    let sqlString = 'SELECT no, name, roomType, date_format(checkIn, \'%Y-%m-%d %T\'), date_format(checkOut, \'%Y-%m-%d %T\'), date_format(reservationTime, \'%Y-%m-%d %T\'), phoneNum, cardNum, reservationNo, price from reservation.rooms where reservationNo = \'' + reservationNo + '\' && + password = \'' + password + '\' order by roomType';

    connection.query(sqlString, function (err, result) {
      if(err){
        console.log(err);
          return err;
      } else{
        callbackFunc(result);
      }
    });
  },
  clearPreorder:function(){
    const connection = mysqlConnector.getInstance();
    const sqlString = 'DELETE from reservation.rooms where name = \'\' && phoneNum = \'\' && cardNum = \'\' && password = \'\'';
    connection.query(sqlString, function (err, result) {
      if(err){
        console.log(err);
          return err;
      }
    });
  }
}
