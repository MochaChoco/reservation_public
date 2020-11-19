const express = require('express');
const app = express();
const path = require('path');
const sanitizeHTML = require('sanitize-html');
const template = require('./lib/template.js');
const review = require('./lib/review.js');
const news = require('./lib/news.js');
const date = require('./lib/date.js');
const reservation = require('./lib/reservation.js');
const ejs = require('ejs');
const bodyParser = require('body-parser');    // request.body로 요소에 접근이 가능하다.
const mysqlConnector = require('./dbConfig.js')();

  // 127.0.0.1:3000에서 public 요소에 접근이 가능하게 함.
app.use(express.static(__dirname + "/public"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.get('',function(req, res){
    console.log("주소창에 /main 안붙임, main Page로 리다이렉트");
    res.redirect(`/main`);
});

  // 접속자의 ip와 접속시간을 콘솔에 표시함.
app.get('/:pageId', function(req, res, next){
  let ip = path.parse(req.connection.remoteAddress || req.headers['x-forwarded-for']).base;
  const filteredId = path.parse(req.params.pageId).base;
  const date = new Date();
  ip = ip.split("::ffff:");
  console.log("[client ip=" + ip[1] + " // Time=" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "]: " + filteredId + " 페이지 접속");
  next();
});

app.get('/review/create', function(req, res, next){
    // 폼에 입력받은 정보들을 필터링함.
  const title = 'create';
  const sanitizedTitle = sanitizeHTML(title);
  const html = template.html(title, template.loadForm('/review/create_process', '', '', '', '', '', 750));

  return res.send(html);
});

app.get('/review/update/:pageId', function(req, res, next){
  const reviewNum = sanitizeHTML(path.parse(req.params.pageId).base);
  const title = "checkPassword";
  const html = template.html(title, template.checkPasswordForm('/review/update/' + reviewNum, reviewNum));
  return res.send(html);
});

app.get('/review/delete/:pageId', function(req, res, next){
  const reviewNum = sanitizeHTML(path.parse(req.params.pageId).base);
  const title = "checkPassword";
  const html = template.html(title, template.checkPasswordForm('/review/delete/' + reviewNum, reviewNum));
  return res.send(html);
});

app.post('/review/update/:pageId', function(req, res, next){
  const post = req.body;
  review.checkPassword(post.id, post.password, function(result){
  let html;
    if(result){
      const reviewNum = sanitizeHTML(path.parse(req.params.pageId).base);
      const title = 'create';
      review.loadFormData(reviewNum, function(result){
        const formData = result;
        html = template.html(title, template.loadForm('/review/update_process', formData[0]['id'], formData[0]['author'], '', formData[0]['score'], formData[0]['description'], 750));
        return res.send(html);
      });
    } else{
      html = template.alertPassword(post.id, 'update');
      res.send(html);
    }
  });
});

app.post('/review/delete/:pageId', function(req, res, next){
  const post = req.body;
  review.checkPassword(post.id, post.password, function(result){
    if(result){
      review.deleteReview(post.id, function(){
        review.setInfoValue(-1, function(){
          res.redirect(`/review/1`);
        });
      });
    } else{
      const html = template.alertPassword(post.id, 'delete');
      res.send(html);
    }
  });
});

app.post('/review/create_process', function(req, res){
  const post = req.body;
  review.createReview('', post.name, post.password, post.score, post.description, function(){
    review.setInfoValue(1, function(){
      res.redirect(`/review/1`);
    });
  });
});

app.post('/review/update_process', function(req, res){
  const post = req.body;
  review.updateReview(post.id, post.score, post.description, post.password, function(){
    review.setInfoValue(0, function(){
      res.redirect(`/review/1`);
    });
  });
});

app.get('/review/:pageId', function(req, res, next){
  const curPageNum = sanitizeHTML(path.parse(req.params.pageId).base);    // 요청 들어온 페이지 번호
  const renderResult = function(result){
    if(result == undefined)
      res.redirect('/main');    // 페이지 번호에 문자열 등이 입력됐을 때 리다이렉트 처리
    return res.render('review', {reviewObject: result, lastPageNum : review.getLastPageNum()});
  }

  review.getInfoValue(curPageNum, function(){
    if(!review.checkPageNum(curPageNum)){
      console.log("잘못된 페이지 번호 호출");
      res.redirect(`/review/1`);   // 잘못된 페이지 번호가 들어왔을 때 처리
    } else{
      review.calStartNum(curPageNum);
      review.calEndNum(curPageNum, function(){
        review.showTable(renderResult);
      });
    }
  });
});

app.get('/news/search/:pageId', function(req, res, next){
  const sanitizedKeyword = sanitizeHTML(req.query.text);
  const pageId = sanitizeHTML(path.parse(req.params.pageId).base);    // 요청 들어온 페이지 번호
  const renderResult = function(result){
    return res.render('news', {newsData: result, menuId : "search", keyword : sanitizedKeyword ,newsId : pageId - 1, lastPageNum : news.getLastPageNum()});
  }

  news.getNewsInfo(pageId, "search", sanitizedKeyword, function(result){
    if(result[0].length == 0){
      const html = template.html("news", template.noSearchForm());
      return res.send(html);
    }

    if(!news.checkPageNum(sanitizedKeyword, pageId)){
      console.log("잘못된 페이지 번호 호출");
      res.redirect(`/news/recent/1`);   // 잘못된 페이지 번호가 들어왔을 때 처리
    } else{
      news.calStartNum(pageId);
      news.calEndNum(pageId, function(){
        news.showNews("search",  sanitizedKeyword, renderResult);
      });
    }
  });
});

app.get('/news/category/:categoryName/:pageId', function(req, res, next){
  const categoryName = path.parse(req.params.categoryName).base;    // 요청 들어온 페이지 번호
  const pageId = sanitizeHTML(path.parse(req.params.pageId).base);    // 요청 들어온 페이지 번호
  const renderResult = function(result){
    return res.render('news', {newsData: result, menuId : categoryName, keyword : "", newsId : pageId - 1, lastPageNum : news.getLastPageNum()});
  }
  news.getNewsInfo(pageId, "category", categoryName, function(){
    if(!news.checkPageNum(categoryName, pageId)){
      console.log("잘못된 페이지 번호 호출");
      res.redirect('/news/category/' + categoryName + '/1');   // 잘못된 페이지 번호가 들어왔을 때 처리
    } else{
      news.calStartNum(pageId);
      news.calEndNum(pageId, function(){
        news.showNews("category",  categoryName, renderResult);
      });
    }
  });
});

app.get('/news/recent/:newsId', function(req, res, next){
  const curMenuName = "recent";    // 요청 들어온 페이지 번호
  const pageId = path.parse(req.params.newsId).base;    // 요청 들어온 페이지 번호
  const renderResult = function(result){
//    console.log("렌더링 시작");
      return res.render('news', {newsData: result, menuId: curMenuName, keyword : "", newsId : pageId - 1});
  }
  news.getNewsInfo(pageId, curMenuName, "", function(){
    if(!news.checkPageNum(curMenuName, pageId)){
      console.log("잘못된 페이지 번호 호출");
      res.redirect(`/news/recent/1`);   // 잘못된 페이지 번호가 들어왔을 때 처리
    } else{
      news.calStartNum(pageId);
      news.calEndNum(pageId, function(){
        news.showNews(curMenuName, "", renderResult);
      });
    }
  });
});

app.post('/reservation/bookComplete', function(req, res){
  const post = req.body;
  reservation.stopTimer(post.name, post.password, post.phoneNum, post.cardNo, post.reservationTime, post.reservationNo, function(result){
    let html;
    if(result == false){
      html = template.alertTimeOver();
    } else{
      html = template.html('book', template.bookComplete(post.reservationNo));
    }
    return res.send(html);
  });
});

app.post('/reservation/book', function(req, res, next){
  const post = req.body;
  const jsonData = JSON.parse(post.bookData);
  let html;
  console.log(jsonData);
  reservation.inputBookInfo(jsonData, function(result, reservationTime, reservationNo, priceMap){
    if(result == false){
      html = template.alertBook();
      res.send(html);
    } else{
      reservation.startTimer(reservationTime, reservationNo);
      html = template.html('book', template.bookForm('/reservation/bookComplete', reservationTime, reservationNo));
      return res.send(html);
    }
  });
});

app.post('/reservation', function(req, res){
  const post = req.body;
  reservation.showAvaliable(post.startDate, post.endDate, function(avaliableList){
    return res.render('reservation', {startDate : post.startDate, endDate : post.endDate, adults : post.adults, children : post.children, avaliableList : avaliableList});
  });
});


// 요청이 들어오면 페이지를 처리해주는 부분
app.post('/order/orderList', function(req, res){
  const post = req.body;
  // 구현부;
  reservation.findOrder(post.reservationNo, post.password, function(result){
    if(result == ''){
      const html = template.html('order', template.noOrderForm());
      return res.send(html);
    }
    else{
      return res.render('order', {orderList : result});
    }
  });
});


// 요청이 들어오면 페이지를 처리해주는 부분
app.get('/order', function(req, res){
  const title = 'order';
  const sanitizedTitle = sanitizeHTML(title);
  const html = template.html(title, template.checkOrderForm('/order/orderList'));
  return res.send(html);
});



  // 요청이 들어오면 페이지를 처리해주는 부분
app.get('/:pageId', function(req, res, next){
  const filteredId = path.parse(req.params.pageId).base;
  if(filteredId == 'review'){
    res.redirect(`/review/1`);
  } else if(filteredId == 'news'){
    res.redirect(`/news/recent/1`);
  } else if(filteredId == 'main' || filteredId == 'rooms'){
      // 폼에 입력받은 정보들을 필터링함.
    const title = req.params.pageId;
    const sanitizedTitle = sanitizeHTML(title);
    const html = template.html(title, template.loadBodyContent(title));
    return res.send(html);
  } else if(filteredId == 'reservation'){
  } else if(filteredId == 'book'){
  } else if(filteredId == 'order'){
  } else if(filteredId == 'favicon.ico'){
  } else {
    next(); // 주소창에 위와 일치하는 filteredId가 없다면 잘못된 페이지를 요청했다고 보냄
  }
});

app.use(function(req, res, next){
  console.log("잘못된 주소 입력 - main 페이지로 리다이렉트");
  res.redirect(`/main`);    // 잘못된 주소 입력했을 때 main 페이지로 리다이렉트 처리
//  res.status(404).send("Wrong access!");
});

  // 에러가 있을 때 next()에 어떠한 인자라도 주면 인자가 4개인 미들웨어 함수를 호출함.
app.use(function(err, req, res, next){
  console.log(err);
  res.redirect(`/main`);    // 잘못된 주소 입력했을 때 main 페이지로 리다이렉트 처리
  // res.status(500).send("Data was broken!");
});

app.listen(8001, function() {
  const date = new Date();
  console.log("start!! express server on port 8001![" + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "]");
  reservation.clearPreorder();   // 누군가 예약 중에 서버를 재시작했으면 삭제 카운트가 안돌아가므로 남아있던 더미 예약 기록을 삭제한다.
});
