/*globals window, document, setInterval, event , localStorage */
'use strict';

const m_json = {
  data: "-1",
  getData: function () {return this.data;},
  setData: function (newData) {this.data = newData;}
};


function textareaUpdate(){
  const eCheckMemo = document.getElementById('checkMemo');
  const eMemo = document.getElementById('memo');
  const eCheckNote = document.getElementById('checkNote');
  const eNote = document.getElementById('note');
  const eCheckCurrent = document.getElementById('checkCurrent');
  const valueNo = document.getElementById('inputNo').value;
  let eCurrent = document.getElementById('current');
  let data;

  if(eCheckMemo.checked){eMemo.style.display = 'block';
  }else{                 eMemo.style.display = 'none';}
  if(eCheckNote.checked){eNote.style.display = 'block';
  }else{                 eNote.style.display = 'none';}
  if(eCheckCurrent.checked){eCurrent.style.display = 'block';
  }else{                     eCurrent.style.display = 'none';}

  data = m_json.getData().filter(row => row.code === valueNo.toString().padStart(2, '0'));
  if(data.length === 1){
    eCurrent.value = data[0].word; 
  }else{
    eCurrent.value = 'ERROR Get current data(current data length: ' + data.length + ')';
  }
}
window.onload = function(){
 const requestURL = './contents.json';
  let request = new XMLHttpRequest();
  const eStatus = document.getElementById('lblStatus');
  eStatus.textContent = 'STATUS : sentents file loading..';
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

  request.onload = function (){
    m_json.setData(request.response);
    textareaUpdate();
  }
}

function clickUp(){
  let eNo = document.getElementById('inputNo');
  if (!isNaN(eNo.value)) {
    eNo.value++; 
  }
}
function clickDown(){
  let eNo = document.getElementById('inputNo');
  if (!isNaN(eNo.value)) {
    eNo.value--; 
  }
}
function clickSpeedUp(){
  let eSpeed = document.getElementById('inputSpeed');
  if (!isNaN(eSpeed.value)) {
    eSpeed.value = (Number(eSpeed.value) + 0.1).toFixed(1); 
  }
}
function clickSpeedDown(){
  let eSpeed = document.getElementById('inputSpeed');
  if (!isNaN(eSpeed.value)) {
    eSpeed.value = (Number(eSpeed.value) - 0.1).toFixed(1); 
  }
}

function clickPlayNo(){
  const valueNo = document.getElementById('inputNo').value;
  const eStatus = document.getElementById('lblStatus');
  const eSpeed = document.getElementById('inputSpeed');
  let sentence = null; 
  let rate;
  let data;

  data = m_json.getData().filter(row => row.code === valueNo.toString().padStart(2, '0'));
  if(data.length != 1){
    eStatus.textContent='ERROR get sentence data(sentence count:' + data.length + ')';
    return;
  }
  const utterance = new SpeechSynthesisUtterance(sentence);
  utterance.lang = 'en-US';
  rate = 1.0;
  if (!isNaN(eSpeed.value)) {
    rate = eSpeed.value; 
  }
  utterance.rate = rate; 
  speechSynthesis.speak(utterance);
}

