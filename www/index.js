/*globals window, document, setInterval, event */
'use strict';

const APP_CODE = 'tss';
const m_db = new Dexie("tts");
m_db.version(1).stores({entryCheck: "code,check"});

const m_json = {
  data: "-1",
  getData: function () {return this.data;},
  setData: function (newData) {this.data = newData;}
};
function getCurrentData(){
  const valueNo = document.getElementById('inputNo').value;
  return m_json.getData().filter(row => row.code === valueNo.toString().padStart(2, '0'));
}
function clickUpdateCheck(){
  const valueNo = document.getElementById('inputNo').value;
  const radios =  document.getElementsByName('checkValues')
  const eStatus = document.getElementById('lblStatus');

  let selectedValue = null;
  radios.forEach(radio => {
    if (radio.checked) {
      selectedValue = radio.value;
    }
  });

  m_db.entryCheck
    .put({code: valueNo, check: selectedValue}).then(no => {
      eStatus.textContent = `STATUS : Put successful! Record NO: ${no}`
    })
    .catch((error)=>{
      console.error(error);
      eStatus.textContent = 'STATUS : ERROR! EntryCheck Update => '+ error;
    });
  
}

function textareaUpdate(){
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
}

function checkUpdate(){
  const eCheckContainer = document.getElementById('check-container');
  const eCheckSwitch = document.getElementById('checkSwitch');
  const valueNo = document.getElementById('inputNo').value;
  const eCheckValues = document.getElementsByName('checkValues');
  if(!eCheckSwitch.checked){
    eCheckContainer.style.display = 'none'
  }else{
    eCheckContainer.style.display = 'inline-block';
  }

  m_db.entryCheck.get(valueNo).then(row => {
  if (row) {
    eCheckValues.forEach(radio => {
      if(radio.value === row.check){
        radio.checked = true;
      }
    });

  }else{
    eCheckValues.forEach(radio => {
      if(radio.value === 'none'){
        radio.checked = true;
      }
    
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
    checkUpdate();
    eStatus.textContent = 'status : Running...';
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
function clickNext(){
  console.log('call click Next');
  clickUp();
  clickPlayNo(); 
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
