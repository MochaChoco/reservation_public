function includeHTML(callbackFunc) {      // 스니펫 함수
  let z, i, elmnt, file, xhttp;
  // 모든 HTML 요소의 컬렉션을 반복
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    // 특정 속성을 가진 요소 검색
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      // 속성 값을 파일 이름으로 사용하여 HTTP 요청을 작성하
      xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          //  속성을 제거하고 이 함수를 한 번 더 호출함
          elmnt.removeAttribute("w3-include-html");
          includeHTML(callbackFunc);
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();

      return;
    }
  }
  callbackFunc();   // 페이지 불러오기가 끝나면 init 함수를 콜백
}
