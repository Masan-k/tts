/*globals window, document, setInterval, event */
'use strict';

const APP_CODE = 'tss-v2';
const m_db = new Dexie(APP_CODE);
m_db.version(3).stores({entryCheck: "code,check",entryHint:"code,hint1,hint2",entryAnswer:"++id,code,answer,date"});

const m_json = {
  data: "-1",
  getData: function () {return this.data;},
  setData: function (newData) {this.data = newData;}
};

function getCurrentData(){
  const valueNo = document.getElementById('inputNo').value;
  return m_json.getData().filter(row => row.code === valueNo.toString().padStart(2, '0'))[0];
}

function clickUpdateHint(){
  const valueNo = document.getElementById('inputNo').value;
  const valueHint1 = document.getElementById('hint1').value;
  const valueHint2 = document.getElementById('hint2').value;
  const eStatus = document.getElementById('lblStatus');

  m_db.entryHint
    .put({code: valueNo, hint1: valueHint1, hint2: valueHint2}).then(no => {
      eStatus.textContent = `STATUS : Put successful(hint1,hint2)! Record NO: ${no}`
    })
    .catch((error)=>{
      console.error(error);
      eStatus.textContent = 'STATUS : ERROR! EntryHint Update => '+ error;
    });
 }

function clickUpdateAnswer(){
  const valueNo = document.getElementById('inputNo').value;
  const valueAnswer = document.getElementById('answer').value;
  const eStatus = document.getElementById('lblStatus');

  const now = new Date();
  const localStringJP = now.toLocaleString("ja-JP");

  m_db.entryAnswer
    .put({code:valueNo, answer:valueAnswer, date: localStringJP}).then(()=> {
      eStatus.textContent = `STATUS : Put successful(answer)! Record NO: ${valueNo}`
    })
    .catch((error)=>{
      console.error(error);
      eStatus.textContent = 'STATUS : ERROR! EntryHint Update => '+ error;
    });
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
      eStatus.textContent = `STATUS : Put successful(check)! Record NO: ${no}`
    })
    .catch((error)=>{
      console.error(error);
      eStatus.textContent = 'STATUS : ERROR! EntryCheck Update => '+ error;
    });
}

function textareaUpdate(){
  const eCheckAnswer = document.getElementById('checkAnswer');
  const eAnswer = document.getElementById('answer');
  const eCheckHint1 = document.getElementById('checkHint1');
  const eHint1 = document.getElementById('hint1');
  const eCheckHint2 = document.getElementById('checkHint2');
  const eHint2 = document.getElementById('hint2');
  const eCheckCurrentEn = document.getElementById('checkCurrentEn');
  const eCheckCurrentJp = document.getElementById('checkCurrentJp');
  const eCurrentEn = document.getElementById('currentEn');
  const eCurrentJp = document.getElementById('currentJp');
  const valueNo = document.getElementById('inputNo').value;
  let currentData;
  
  if(eCheckAnswer.checked){eAnswer.style.display = 'block';
  }else{                   eAnswer.style.display = 'none';}
  if(eCheckHint1.checked){eHint1.style.display = 'block';
  }else{                 eHint1.style.display = 'none';}
  if(eCheckHint2.checked){eHint2.style.display = 'block';
  }else{                 eHint2.style.display = 'none';}
  if(eCheckCurrentEn.checked){
    eCurrentEn.style.display = 'block';
    currentData = getCurrentData();
    if(currentData != undefined){
      eCurrentEn.value = currentData.en; 
    }else{
      eCurrentEn.value = 'ERROR Not Found current english word data.';
    }
  }else{
    eCurrentEn.style.display = 'none';
  }
  if(eCheckCurrentJp.checked){
    eCurrentJp.style.display = 'block';
    currentData = getCurrentData();
    if(currentData != undefined){
      eCurrentJp.value = currentData.jp; 
    }else{
      eCurrentJp.value = 'ERROR Not Found current japanese word data. ';
    }
  }else{
    eCurrentJp.style.display = 'none';
  }

  m_db.entryHint.get(valueNo).then(row => {
    if(row){
      eHint1.value = row.hint1;
      eHint2.value = row.hint2;
    }else{
      eHint1.value = '';
      eHint2.value = '';
    }
  });
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
    if(row){
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
      });
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

function clickPlay(){
  const eStatus = document.getElementById('lblStatus');
  const eSpeed = document.getElementById('inputSpeed');
  const eInputNo = document.getElementById('inputNo');
  const eLoop = document.getElementById('inputLoop');
  const currentRow = getCurrentData();
  //let loopCount = 0;

  if(currentRow == undefined){
    eStatus.textContent='ERROR get sentence data(Input Code:\"' + eInputNo.value + "\")";
    return;
  }

  const audioPath = "voice/" + currentRow["code"] + ".wav";
  const audio = new Audio(audioPath); // WAVファイルのパスを指定

  if(!isNaN(eSpeed.value)) {
    audio.playbackRate = eSpeed.value;
  }

  audio.play();
  audio.addEventListener('ended', function() {
    if(eLoop.checked){
      this.currentTime = 0; // 再生位置を最初に戻す
      this.play();
    }
  });
}

function resetLoopCheck(){
  let eLoop = document.getElementById('inputLoop');
  eLoop.checked=false
}
function clickUp(){
  let eNo = document.getElementById('inputNo');
  if (!isNaN(eNo.value)) {
    eNo.value++; 
  }
  resetLoopCheck();
  textareaUpdate();
}
function clickDown(){
  let eNo = document.getElementById('inputNo');
  if (!isNaN(eNo.value)) {
    eNo.value--; 
  }
  resetLoopCheck();
  textareaUpdate();
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
