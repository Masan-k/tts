/*globals window, document, setInterval, event , localStorage */
'use strict';

const APP_CODE = 'tss';

const m_json = {
  data: "-1",
  getData: function () {return this.data;},
  setData: function (newData) {this.data = newData;}
};
function clickNext(){
  console.log('call click Next');
  clickUp();
  clickPlayNo(); 
}

function clickUpdateCheck(){
  console.log('call click update check');
  //localStorage.setItem('aaa,bbbb');
}

function getCurrentData(){
  const valueNo = document.getElementById('inputNo').value;
  return m_json.getData().filter(row => row.code === valueNo.toString().padStart(2, '0'));
}
function textareaUpdate(){
  const eSelectCheckValues = document.getElementsByName('selectCheckValues');
  const eCheckSwitch = document.getElementById('checkSwitch');

  const eCheckAnswer = document.getElementById('checkAnswer');
  const eAnswer = document.getElementById('answer');
  const eCheckMemo = document.getElementById('checkMemo');
  const eMemo = document.getElementById('memo');
  const eCheckNote = document.getElementById('checkNote');
  const eNote = document.getElementById('note');
  const eCheckCurrent = document.getElementById('checkCurrent');
  let eCurrent = document.getElementById('current');
  let currentData;

  if(eCheckAnswer.checked){eAnswer.style.display = 'block';
  }else{                   eAnswer.style.display = 'none';}
  if(eCheckMemo.checked){eMemo.style.display = 'block';
  }else{                 eMemo.style.display = 'none';}
  if(eCheckNote.checked){eNote.style.display = 'block';
  }else{                 eNote.style.display = 'none';}

  if(eCheckCurrent.checked){
    eCurrent.style.display = 'block';
    currentData = getCurrentData();
    if(currentData.length === 1){
      eCurrent.value = currentData[0].en; 
    }else{
      eCurrent.value = 'ERROR Get current data(current data length: ' + currentData.length + ')';
    }
  }else{
    eCurrent.style.display = 'none';
  }

  eSelectCheckValues.forEach(eValue => {
    if(!eCheckSwitch.checked){
      eValue.style.display = 'none';
    }else{
      eValue.style.display = 'inline-block';
    }
  });
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
    eStatus.textContent = 'status : Running...';
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
  const LANG='en-US'
  const eStatus = document.getElementById('lblStatus');
  const eSpeed = document.getElementById('inputSpeed');
  let currentRow = getCurrentData();
  let utterance
  let rate;

  if(currentRow.length != 1){
    eStatus.textContent='ERROR get sentence data(sentence count:' + currentRow.length + ')';
    return;
  }
  utterance = new SpeechSynthesisUtterance(currentRow[0].en);
  utterance.lang = LANG;
  rate = 1.0;
  if (!isNaN(eSpeed.value)) {
    rate = eSpeed.value; 
  }
  utterance.rate = rate; 
  speechSynthesis.speak(utterance);
}
