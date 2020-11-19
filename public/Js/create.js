includeHTML(init);

function init(){
  headerInit();
  navInit();
  lengthCheck();
  document.getElementsByClassName("navInputDate")[0].style.height = "38px";   // 하드 코딩
  document.getElementsByClassName("navInputDate")[1].style.height = "38px";
}

function lengthCheck(){     // 현재 form의 글자수를 체크하는 함수
  let formDescription = document.getElementById("formDescription").value;
  formDescription = formDescription.replace(/\\n/g, " ");     // 행바꿈 변환
  formDescription = formDescription.replace(/\\r/g, " ");     // 엔터 변환
  const descriptionLength = document.getElementsByClassName("descriptionLength")[0];

    // UTF-8은 한글 3byte 영어 1byte
  let curLength = (function(s,b,i,c){
    for(b=i=0 ; c=s.charCodeAt(i++) ; b+=c>>11?3:c>>7?2:1) ;
    return b
  })(formDescription);

  descriptionLength.innerHTML = "(" + curLength + " / " + maxDescriptionLength + "bytes)";

  if(curLength > maxDescriptionLength){
    descriptionLength.className = "descriptionLength overflow";
  } else {
    descriptionLength.className = "descriptionLength";
  }
  return curLength;
}

function createFormCheck(curLength){    // form을 제출할 때 특수 문자, 문자 개수 등을 체크
  const form = document.getElementById("contentForm");
  const name = document.getElementsByClassName("formName")[0].value;
  const password = document.getElementsByClassName("formPassword")[0].value;
  const description = document.getElementById("formDescription").value;

  const regName = /[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]+$/;     // 특수 문자 체크
  const regText = /^[^\`|^'|^"]+$/;       // '나 \`등 쿼리에 영향 줄 수 있는 특수 문자가 있는지 체크;

  if(name.length == 0 || password.length == 0 || description.length == 0){
    alert("Everything must be filled.");
    return;
  }

  if(!regName.test(name)){
    alert("Names can only be in Korean, English, and numbers.");
    return;
  }

  if(!regText.test(password) || !regText.test(description)){
    alert("Forbidden characters included in password or description. [Forbidden characters : ' ,` ,\"]");
    return;
  }

  if(curLength > maxDescriptionLength){
    alert("A description is limited to " + maxDescriptionLength + " characters or less.");
    return;
  }
  form.submit();
}
