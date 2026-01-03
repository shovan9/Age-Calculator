function initApp(){
  let firstBtn = document.querySelector(".menu button");
  showSection("age", firstBtn);

  document.getElementById("currentDate").innerText =
    new Date().toDateString();

  renderCalendar();
}

/* MENU */
function toggleMenu(){
  let m = document.getElementById("menu");
  m.style.display = m.style.display === "block" ? "none" : "block";
}
function showSection(id, btn){
  // hide all sections
  document.querySelectorAll(".section")
    .forEach(s => s.style.display = "none");

  // show selected section
  document.getElementById(id).style.display = "block";

  // ACTIVE MENU HIGHLIGHT
  document.querySelectorAll(".menu button")
    .forEach(b => b.classList.remove("active"));
  if(btn) btn.classList.add("active");

  // TITLE TEXT
  let titleMap = {
    age: "Age Calculator",
    stopwatch: "Stopwatch",
    timer: "Timer",
    calculator: "Calculator",
    calendar: "Calendar"
  };

  let title = document.getElementById("appTitle");

  // SMOOTH ANIMATION
  title.classList.add("title-animate");
  setTimeout(()=>{
    title.innerText = titleMap[id] || "Age Calculator";
    title.classList.remove("title-animate");
  },200);

  // close menu
  document.getElementById("menu").style.display = "none";
}

/* AGE CALCULATOR */
function calculateAge(){
  let dobVal = document.getElementById("dob").value;
  if(!dobVal){
    result.innerText = "Please select Date of Birth";
    return;
  }

  let dob = new Date(dobVal);
  let now = new Date();

  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();

  if(days < 0){
    months--;
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  }
  if(months < 0){
    years--;
    months += 12;
  }

  let diffMs = now - dob;
  let totalSec = Math.floor(diffMs / 1000);
  let totalMin = Math.floor(totalSec / 60);
  let totalHr  = Math.floor(totalMin / 60);
  let totalDay = Math.floor(totalHr / 24);

  let bornDay = dob.toLocaleDateString("en",{weekday:"long"});

  let nextBirthday = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
  if(nextBirthday <= now) nextBirthday.setFullYear(now.getFullYear()+1);
  let daysLeft = Math.ceil((nextBirthday-now)/(1000*60*60*24));

  result.innerHTML = `
<b>Exact Age:</b><br>
${years} Years ${months} Months ${days} Days<br><br>
<b>Life Stats:</b><br>
Days: ${totalDay}<br>
Hours: ${totalHr}<br>
Minutes: ${totalMin}<br>
Seconds: ${totalSec}<br><br>
<b>Born On:</b> ${bornDay}<br>
<b>Next Birthday In:</b> ${daysLeft} Days
`;
}

/* STOPWATCH (MS + LAP) */
let swInterval=null, swStart=0, swElapsed=0;

function startSW(){
  if(swInterval) return;
  swStart = Date.now() - swElapsed;
  swInterval = setInterval(()=>{
    swElapsed = Date.now() - swStart;

    let ms = Math.floor((swElapsed%1000)/10);
    let sec = Math.floor(swElapsed/1000);
    let s = sec%60;
    let m = Math.floor(sec/60)%60;
    let h = Math.floor(sec/3600);

    swDisplay.innerText =
      `${h.toString().padStart(2,'0')}:`+
      `${m.toString().padStart(2,'0')}:`+
      `${s.toString().padStart(2,'0')}.`+
      `${ms.toString().padStart(2,'0')}`;
  },10);
}

function stopSW(){
  clearInterval(swInterval);
  swInterval=null;
}

function resetSW(){
  stopSW();
  swElapsed=0;
  swDisplay.innerText="00:00:00.00";
  lapList.innerHTML="";
}

function lapSW(){
  if(!swInterval) return;
  let li=document.createElement("li");
  li.innerText=swDisplay.innerText;
  lapList.appendChild(li);
}

/* TIMER (MANUAL + MS, NO SOUND) */
let timerInterval=null, timerMs=0;

function setTimerPreset(min){
  if(timerInterval) return;
  timerMs=min*60*1000;
  updateTimerDisplay();
}

function setTimerManual(){
  if(timerInterval) return;
  let h=parseInt(tHour.value)||0;
  let m=parseInt(tMin.value)||0;
  let s=parseInt(tSec.value)||0;
  if(m>59)m=59;
  if(s>59)s=59;
  timerMs=((h*3600)+(m*60)+s)*1000;
  updateTimerDisplay();
}

function startTimer(){
  if(timerInterval) return;
  if(timerMs===0) setTimerManual();
  if(timerMs<=0) return;

  timerInterval=setInterval(()=>{
    timerMs-=10;
    if(timerMs<=0){
      timerMs=0;
      updateTimerDisplay();
      stopTimer();
      return;
    }
    updateTimerDisplay();
  },10);
}

function stopTimer(){
  clearInterval(timerInterval);
  timerInterval=null;
}

function resetTimer(){
  stopTimer();
  timerMs=0;
  updateTimerDisplay();
  tHour.value=tMin.value=tSec.value="";
}

function updateTimerDisplay(){
  let totalSec=Math.floor(timerMs/1000);
  let ms=Math.floor((timerMs%1000)/10);
  let s=totalSec%60;
  let m=Math.floor(totalSec/60)%60;
  let h=Math.floor(totalSec/3600);

  timerDisplay.innerText =
    `${h.toString().padStart(2,'0')}:`+
    `${m.toString().padStart(2,'0')}:`+
    `${s.toString().padStart(2,'0')}.`+
    `${ms.toString().padStart(2,'0')}`;
}

/* CALCULATOR */
function addCalc(v){
  calcDisplay.value += v;
}
function clearCalc(){
  calcDisplay.value = "";
}
function calcResult(){
  try{
    calcDisplay.value = eval(calcDisplay.value);
  }catch{
    calcDisplay.value = "Error";
  }
}

/* CALENDAR */
let calDate = new Date();

function renderCalendar(){
  calendarGrid.innerHTML = "";
  monthYear.innerText =
    calDate.toLocaleString("en",{month:"long",year:"numeric"});

  let firstDay =
    new Date(calDate.getFullYear(),calDate.getMonth(),1).getDay();
  let lastDate =
    new Date(calDate.getFullYear(),calDate.getMonth()+1,0).getDate();

  for(let i=0;i<firstDay;i++){
    calendarGrid.innerHTML += "<div></div>";
  }

  for(let d=1; d<=lastDate; d++){
    let div = document.createElement("div");
    div.innerText = d;

    let today = new Date();
    if(d===today.getDate() &&
       calDate.getMonth()===today.getMonth() &&
       calDate.getFullYear()===today.getFullYear()){
      div.classList.add("today");
    }

    calendarGrid.appendChild(div);
  }
}

function prevMonth(){
  calDate.setMonth(calDate.getMonth()-1);
  renderCalendar();
}
function nextMonth(){
  calDate.setMonth(calDate.getMonth()+1);
  renderCalendar();
}