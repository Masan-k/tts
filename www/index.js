/*globals window, document, setInterval, event , localStorage */
'use strict';
const m_json = {
  data: "-1",
  getData: function () {return this.data;},
  setData: function (newData) {this.data = newData;}
};
const m_mode = {
  data: -1,
  getData: function () {return this.data;},
  setData: function (newData) {this.data = newData;}
};

window.onload = function(){
  const requestURL = './contents.json';
  let request = new XMLHttpRequest();

  function init(){
    let param = location.search.split('&')
    if(param.length === 2){
      m_mode.setData(param[0].split('=')[1]);
      m_targetCode.setData(param[1].split('=')[1]);
    }else{
      //alert('The parameters at the time of calling are not set.\n(url:' + location.href + ')\n\nPlease start from the menu screen.');
      return;
    }
/*
    prgTime.max = 120;
    prgTime.value = 120;
    lblQuestion.innerText = 'file loading..';

    lblScore.innerText = 'SCORE:';
    lblTime.innerText = 'TIME:';
    lblCount.innerText = 'COUNT:';
*/
  }

  init();

  //btnMenu.addEventListener("click", clickMenu, false);
  //btnRetry.addEventListener("click", clickRetry, false);

  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

  request.onload = function (){
    m_json.setData(request.response);
    main();
    return;
  }
}
function speakText() {
    const text = document.getElementById('text').value;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1.0;
    speechSynthesis.speak(utterance);
}

function main(){
  console.log('call main');
  console.log(m_json.getData());
}

