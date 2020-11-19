const mysqlConnector = require('../dbConfig.js')();

module.exports = {
  dateToStr:function(format) {          // 입력받은 date를 'yyyy-mm-dd hh:mm:ss'형식으로 출력
    let year = format.getFullYear();
    let month = format.getMonth() + 1;
    let date = format.getDate();
    let hour = format.getHours();
    let min = format.getMinutes();
    let sec = format.getSeconds();

    if(month < 10)
      month = '0' + month;
    if(date < 10)
      date = '0' + date;
    if(hour < 10)
      hour = '0' + hour;
    if(min < 10)
      min = '0' + min;
    if(sec < 10)
      sec = '0' + sec;
    return year + "-" + month + "-" + date + " " + hour + ":" + min + ":" + sec;
  }
}
