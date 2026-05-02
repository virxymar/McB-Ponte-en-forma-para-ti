const $=(s)=>document.querySelector(s);const $$=(s)=>document.querySelectorAll(s);const todayKey=new Date().toISOString().slice(0,10);
const quotes=['No necesito ganas. Necesito cumplir.','Un día hecho vale más que diez planes perfectos.','La mujer que quiero ser se construye en lo que hago hoy.','No negocio con mi objetivo.','Hoy no busco perfección. Busco constancia.'];
const workouts=[
  {name:'Pierna + core',items:[
    {text:'Sentadillas 3x12',guide:'sentadillas'},
    {text:'Zancadas 3x10 por pierna',guide:'zancadas'},
    {text:'Puente glúteo 3x15',guide:'puente-gluteo'},
    {text:'Plancha 3x20 seg',guide:'plancha'}
  ]},
  {name:'Tren superior',items:[
    {text:'Flexiones pared/rodillas 3x10',guide:'flexiones-pared-rodilla'},
    {text:'Fondos en silla 3x10',guide:'fondos-silla'},
    {text:'Superman 3x12',guide:'superman'},
    {text:'Plancha lateral 3x20 seg',guide:'plancha-lateral'}
  ]},
  {name:'Activo',items:[
    {text:'Caminar 30-45 min'},
    {text:'Movilidad 8 min'},
    {text:'Respirar y estirar'}
  ]},
  {name:'Full body',items:[
    {text:'Sentadillas + brazo 3x12',guide:'sentadillas-brazo'},
    {text:'Flexiones completas 3x6-8',guide:'flexiones-completas'},
    {text:'Mountain climbers 3x20-30 seg',guide:'mountain-climbers'},
    {text:'Puente glúteo 3x15',guide:'puente-gluteo'}
  ]},
  {name:'Cardio controlado',items:[
    {text:'Rodillas arriba 3x20-30 seg',guide:'rodillas-arriba'},
    {text:'Mountain climbers 3x20-30 seg',guide:'mountain-climbers'},
    {text:'Sentadillas 3x12',guide:'sentadillas'},
    {text:'Plancha 3x20 seg',guide:'plancha'}
  ]},
  {name:'Activo',items:[
    {text:'Paseo largo'},
    {text:'Agua y sueño'},
    {text:'Sin compensar comida'}
  ]},
  {name:'Descanso',items:[
    {text:'Descanso real'},
    {text:'Preparar comida'},
    {text:'Revisar progreso'}
  ]}
];
const exerciseGuides={
  'sentadillas':{title:'Sentadillas',src:'assets/ejercicios/sentadillas.png'},
  'zancadas':{title:'Zancadas',src:'assets/ejercicios/zancadas.png'},
  'puente-gluteo':{title:'Puente de glúteo',src:'assets/ejercicios/puente-gluteo.png'},
  'plancha':{title:'Plancha',src:'assets/ejercicios/plancha.png'},
  'flexiones-pared-rodilla':{title:'Flexiones pared/rodilla',src:'assets/ejercicios/flexiones-pared-rodilla.png'},
  'fondos-silla':{title:'Fondos en silla',src:'assets/ejercicios/fondos-silla.png'},
  'superman':{title:'Superman',src:'assets/ejercicios/superman.png'},
  'plancha-lateral':{title:'Plancha lateral',src:'assets/ejercicios/plancha-lateral.png'},
  'sentadillas-brazo':{title:'Sentadillas + brazo',src:'assets/ejercicios/sentadillas-brazo.png'},
  'flexiones-completas':{title:'Flexiones completas',src:'assets/ejercicios/flexiones-completas.png'},
  'mountain-climbers':{title:'Mountain climbers',src:'assets/ejercicios/mountain-climbers.png'},
  'rodillas-arriba':{title:'Rodillas arriba',src:'assets/ejercicios/rodillas-arriba.png'}
};
function getData(){return JSON.parse(localStorage.getItem('mcbRetoData')||'{}')}function saveData(d){localStorage.setItem('mcbRetoData',JSON.stringify(d));updateUI()}
function currentDay(){const start=localStorage.getItem('mcbStart')||todayKey;localStorage.setItem('mcbStart',start);const diff=Math.floor((new Date(todayKey)-new Date(start))/86400000)+1;return Math.min(Math.max(diff,1),28)}
function showSection(id){
  const currentY=window.scrollY;
  $$(".section").forEach(s=>s.classList.remove("active-section"));
  $("#"+id).classList.add("active-section");
  $$(".tab").forEach(t=>t.classList.toggle("active",t.dataset.section===id));
  requestAnimationFrame(()=>window.scrollTo({top:currentY,behavior:"auto"}));
  if(id==="certificado") updateCertificateGate();
  if(id==="logro") updateFinalScreen();
  if(id==="alimentacion") updateNutritionUI();
}
function getUserName(){return localStorage.getItem('mcbUserName')||''}
function setUserName(name){localStorage.setItem('mcbUserName',name.trim());syncUserNameUI()}
function syncUserNameUI(){const name=getUserName();const welcome=$('#welcomeName');if(welcome)welcome.textContent=name||'Hoy';const input=$('#certificateName');if(input&&!input.value)input.value=name;const modalInput=$('#userNameInput');if(modalInput)modalInput.value=name}
function openNameModal(){const modal=$('#nameModal');if(modal)modal.classList.remove('hidden');setTimeout(()=>{$('#userNameInput')&&$('#userNameInput').focus()},100)}
function closeNameModal(){const modal=$('#nameModal');if(modal)modal.classList.add('hidden')}
function saveUserNameFromModal(){const input=$('#userNameInput');const name=input?input.value.trim():'';if(!name){alert('Escribe tu nombre para personalizar la app y el certificado.');return}setUserName(name);closeNameModal()}
function ensureUserName(){syncUserNameUI();if(!getUserName())openNameModal()}
function selectBreakfast(name){const data=getData();data[todayKey]=data[todayKey]||{};data[todayKey].breakfast=name;data[todayKey].desayuno=true;saveData(data);$('#breakfastChoice').textContent=`Hoy has elegido: ${name}. Bien. Tu ritual ya trabaja a favor de tu objetivo.`;const cb=document.querySelector('[data-habit="desayuno"]');if(cb)cb.checked=true}

function setNutritionProfile(profile){
  localStorage.setItem('mcbNutritionProfile',profile);
  updateNutritionUI();
  const messages={suave:'Modo suave elegido: vas a cumplir sin castigarte. Movimiento, proteína y constancia.',activa:'Modo activa elegido: base equilibrada, técnica y energía estable.',joven:'Modo ritmo alto elegido: más energía, pero sin convertirlo en descontrol.'};
  const el=$('#nutritionProfileAdvice');if(el)el.textContent=messages[profile]||messages.activa;
}
function selectNutritionChoice(type,label){
  const data=getData();data[todayKey]=data[todayKey]||{};
  data[todayKey].nutritionChoices=data[todayKey].nutritionChoices||{};
  data[todayKey].nutritionChoices[type]=label;
  data[todayKey].alimentacion=true;
  data[todayKey].proteina=true;
  saveData(data);
  updateNutritionUI();
  const cb=document.querySelector('[data-habit="alimentacion"]');if(cb)cb.checked=true;
  const pcb=document.querySelector('[data-habit="proteina"]');if(pcb)pcb.checked=true;
}
function markNutritionDay(){
  const data=getData();data[todayKey]=data[todayKey]||{};
  data[todayKey].alimentacion=true;data[todayKey].proteina=true;
  saveData(data);updateNutritionUI();
  const cb=document.querySelector('[data-habit="alimentacion"]');if(cb)cb.checked=true;
  const pcb=document.querySelector('[data-habit="proteina"]');if(pcb)pcb.checked=true;
  alert('Alimentación consciente marcada. No perfecto: cumplido.');
}
function updateNutritionUI(){
  const profile=localStorage.getItem('mcbNutritionProfile')||'';
  $$('.nutrition-profile').forEach(b=>{const active=b.dataset.profile===profile;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active?'true':'false')});
  const advice=$('#nutritionProfileAdvice');
  if(advice&&!profile)advice.textContent='Elige tu punto real. Comer mejor no es copiar una dieta: es sostenerla.';
  const data=getData(),day=data[todayKey]||{},status=$('#nutritionStatus');
  if(status){
    const choices=day.nutritionChoices||{};
    const list=Object.keys(choices).map(k=>choices[k]);
    status.textContent=day.alimentacion?(list.length?'Hoy has marcado: '+list.join(' · ')+'. Día sumado.':'Hoy has marcado alimentación consciente. Día sumado.'):'Aún no has marcado tu alimentación consciente.';
  }
}
function saveEvent(){localStorage.setItem('mcbEventName',$('#eventName').value.trim());localStorage.setItem('mcbEventDate',$('#eventDate').value);renderCountdown()}
function renderCountdown(){const name=localStorage.getItem('mcbEventName')||'';const date=localStorage.getItem('mcbEventDate')||'';if(name)$('#eventName').value=name;if(date)$('#eventDate').value=date;if(!date){$('#countdownText').textContent='Configura tu objetivo';return}const days=Math.ceil((new Date(date)-new Date(todayKey))/86400000);$('#countdownText').textContent=days>=0?`${days} días`:'Objetivo cumplido';$('#countdownMessage').textContent=days>=0?`${name||'Tu objetivo'}: cada día cuenta. No lo dejes para la última semana.`:'Ahora toca mantener lo conseguido.'}
function renderWorkout(){const d=currentDay(),w=workouts[(d-1)%7];$('#todayLabel').textContent=`Día ${d}`;$('#dayMission').textContent=d<=7?'Semana 1: técnica y activación. No corras, hazlo bien.':d<=14?'Semana 2: más control, menos descanso.':d<=21?'Semana 3: intensidad real, sin excusas.':'Semana 4: definición, foco y cierre fuerte.';$('#workoutBox').innerHTML=`<h3>${w.name}</h3><ul class="clean-list exercise-list">${w.items.map(renderWorkoutItem).join('')}</ul>`}
function renderWorkoutItem(item){
  if(typeof item==='string') return `<li>${item}</li>`;
  const btn=item.guide?`<button type="button" class="guide-btn" onclick="openExerciseGuide('${item.guide}')">Ver cómo se hace</button>`:'';
  return `<li class="exercise-row"><span>${item.text}</span>${btn}</li>`;
}
function openExerciseGuide(key){
  const guide=exerciseGuides[key];
  if(!guide)return;
  const modal=$('#exerciseGuideModal'),img=$('#exerciseGuideImage'),title=$('#exerciseGuideTitle');
  if(title)title.textContent=guide.title;
  if(img){img.src=guide.src;img.alt='Boceto explicativo: '+guide.title;}
  if(modal)modal.classList.remove('hidden');
}
function closeExerciseGuide(){const modal=$('#exerciseGuideModal');if(modal)modal.classList.add('hidden')}
function resetProgram(){
  const ok=confirm('¿Seguro que quieres reiniciar el programa? Se borrará tu progreso, rachas, rutina y certificado. Tu nombre se mantiene.');
  if(!ok)return;
  ['mcbRetoData','mcbStart','mcbChairRoutine','mcbRoutineMood','mcbRoutineCommit','mcbCertificateCode','mcbNutritionProfile'].forEach(k=>localStorage.removeItem(k));
  chairRoutineState={level:'suave',round:1,step:0,started:false,finished:false};
  renderWorkout();renderCountdown();updateUI();loadChairRoutine();
  alert('Programa reiniciado. Vuelves al Día 1.');
  showSection('inicio');
}
function validDay(v){return v&&['entreno','agua','pasos','proteina','desayuno','alimentacion','sueno'].filter(h=>v[h]).length>=4}function completedDays(){return Object.values(getData()).filter(validDay).length}
function calculateStreak(data){let streak=0;for(let i=0;i<365;i++){const d=new Date();d.setDate(d.getDate()-i);const key=d.toISOString().slice(0,10);if(validDay(data[key]))streak++;else if(i>0)break;else break}return streak}
function updateUI(){const data=getData(),day=data[todayKey]||{};$$('[data-habit]').forEach(cb=>cb.checked=!!day[cb.dataset.habit]);$('#breakfastChoice').textContent=day.breakfast?`Hoy has elegido: ${day.breakfast}.`:'Aún no has elegido desayuno.';const done=completedDays(),pct=Math.min(Math.round(done/28*100),100);$('#progressPercent').textContent=pct;$('#progressBar').style.width=`${pct}%`;$('#streakCount').textContent=calculateStreak(data);updateCertificateGate(false);updateFinalScreen();renderRoutineWeekCalendar();updateRoutineFinishCard()}
function updateCertificateGate(showCanvas=true){const done=completedDays(),unlocked=done>=28;const status=$('#certificateStatus');if(!status)return;status.textContent=unlocked?'Certificado desbloqueado. Escribe tu nombre y descárgalo.':`Llevas ${done}/28 días válidos. No se regala: se gana.`;$('#certificateControls').classList.toggle('hidden',!unlocked);$('#certificateGate h3').textContent=unlocked?'Certificado desbloqueado':'Certificado bloqueado';if(showCanvas&&!$('#downloadCertificateBtn').classList.contains('hidden'))generateCertificate()}
function certificateCode(){let c=localStorage.getItem('mcbCertificateCode');if(!c){const y=new Date().getFullYear();c=`MCB-${y}-${String(Math.floor(Math.random()*9999)+1).padStart(4,'0')}`;localStorage.setItem('mcbCertificateCode',c)}return c}
function drawCentered(ctx,text,y,maxWidth,font,color){let size=parseInt(font.match(/(\d+)px/)[1]);const family=font.replace(/\d+px/,`${size}px`);ctx.fillStyle=color;ctx.textAlign='center';ctx.font=family;while(ctx.measureText(text).width>maxWidth&&size>28){size-=2;ctx.font=family.replace(/\d+px/,`${size}px`)}ctx.fillText(text,800,y)}
function generateCertificate(preview=false){const canvas=$('#certificateCanvas'),ctx=canvas.getContext('2d');const savedName=getUserName();const typedName=$('#certificateName')?$('#certificateName').value.trim():'';const name=(typedName||savedName||'NOMBRE DE LA ALUMNA');if($('#certificateName')&&!$('#certificateName').value&&savedName){$('#certificateName').value=savedName;}const g=ctx.createLinearGradient(0,0,1600,1131);g.addColorStop(0,'#030915');g.addColorStop(.45,'#0b1d3e');g.addColorStop(1,'#020713');ctx.fillStyle=g;ctx.fillRect(0,0,1600,1131);ctx.strokeStyle='rgba(248,223,143,.85)';ctx.lineWidth=6;ctx.strokeRect(55,55,1490,1021);ctx.strokeStyle='rgba(248,223,143,.28)';ctx.lineWidth=2;ctx.strokeRect(85,85,1430,961);ctx.fillStyle='rgba(217,168,67,.08)';ctx.font='190px Georgia';ctx.textAlign='center';ctx.fillText('MCB',800,680);const logo=new Image();logo.onload=()=>{ctx.drawImage(logo,560,105,480,320);ctx.fillStyle='#f8df8f';ctx.textAlign='center';ctx.font='38px Georgia';ctx.fillText('CERTIFICADO DE FINALIZACIÓN',800,390);ctx.fillStyle='rgba(255,247,232,.88)';ctx.font='25px system-ui';ctx.fillText('otorgado a',800,450);drawCentered(ctx,name.toUpperCase(),555,1240,'bold 78px Georgia','#ffffff');ctx.fillStyle='#f8df8f';ctx.font='30px Georgia';ctx.fillText('Por elegirte, entrenar, alimentarte con intención y completar MCB',800,640);ctx.fillStyle='rgba(255,247,232,.82)';ctx.font='24px system-ui';ctx.fillText('Reto 28 días · Movimiento, alimentación consciente y constancia',800,690);ctx.strokeStyle='rgba(248,223,143,.42)';ctx.beginPath();ctx.moveTo(420,735);ctx.lineTo(1180,735);ctx.stroke();ctx.fillStyle='rgba(255,247,232,.82)';ctx.font='22px system-ui';ctx.textAlign='left';ctx.fillText('Fecha: '+new Date().toLocaleDateString('es-ES'),150,1035);ctx.textAlign='right';ctx.fillText('Código: '+certificateCode(),1450,1035);ctx.textAlign='center';ctx.fillStyle='#f8df8f';ctx.font='30px Georgia';ctx.fillText('',800,900);$('#downloadCertificateBtn').classList.remove('hidden');$('#shareCertificateBtn').classList.remove('hidden');$('#printCertificateBtn').classList.remove('hidden');
      const firma=new Image();
      firma.onload=()=>{
        ctx.globalAlpha=.92;
        ctx.drawImage(firma,560,800,480,163);
        ctx.globalAlpha=1;
        ctx.fillStyle='#f8df8f';ctx.font='24px Georgia';ctx.textAlign='center';ctx.fillText('Por volver a ti.',800,995);
      };
      firma.src='assets/firma-gold.png';
    };logo.src='assets/logo-premium.png'}
function downloadCertificate(){const a=document.createElement('a');a.download='certificado-mcb.png';a.href=$('#certificateCanvas').toDataURL('image/png');a.click()}
function shareCertificate(){
  const canvas=$('#certificateCanvas');
  canvas.toBlob(async(blob)=>{
    const file=new File([blob],'certificado-mcb.png',{type:'image/png'});
    if(navigator.canShare&&navigator.canShare({files:[file]})){
      await navigator.share({title:'Mi logro con MCB',text:'He completado McB · Ponte en forma para ti. Por volver a ti.',files:[file]});
    }else if(navigator.share){
      await navigator.share({title:'Mi logro con MCB',text:'He completado McB · Ponte en forma para ti. Por volver a ti.'});
    }else{
      downloadCertificate();
      alert('Tu móvil no permite compartir directamente. Te he preparado la descarga del certificado.');
    }
  },'image/png');
}
function updateFinalScreen(){
  const fp=$('#finalPercent'); if(!fp)return;
  const done=completedDays(), pct=Math.min(Math.round(done/28*100),100);
  fp.textContent=pct+'%';
  const ring=document.querySelector('.achievement-ring'); if(ring) ring.style.setProperty('--p',pct);
  const msg=$('#finalMessage');
  if(done>=28) msg.textContent='No llegaste hasta aquí por suerte. Este certificado se ganó.';
  else if(done>=21) msg.textContent='Estás en la parte donde se demuestra la disciplina. No aflojes.';
  else if(done>=14) msg.textContent='Ya no estás empezando: estás construyendo identidad.';
  else if(done>=7) msg.textContent='Primera semana superada. Ahora empieza lo serio.';
  else msg.textContent='Aún estás calentando motores. Cumple hoy y no negocies.';
  const badges=[];
  if(done>=1) badges.push('Primer día marcado');
  if(done>=7) badges.push('7 días válidos: constancia real');
  if(done>=14) badges.push('14 días: ya no es impulso, es hábito');
  if(done>=21) badges.push('21 días: mente fuerte');
  if(done>=28) badges.push('28 días: reto completado');
  $('#badgesList').innerHTML=(badges.length?badges:['Aún no hay logros. Hoy se empieza.']).map(x=>'<li>'+x+'</li>').join('');
  $('#personalRank').textContent=done>=28?'MCB Finalista':done>=21?'Nivel Imparable':done>=14?'Nivel Constancia':done>=7?'Nivel En Marcha':'Nivel Inicio';
}
function printCertificate(){const data=$('#certificateCanvas').toDataURL('image/png');const w=window.open('','_blank');w.document.write(`<html><head><title>Certificado MCB</title><style>body{margin:0;background:#111;display:grid;place-items:center;min-height:100vh}img{max-width:100%;height:auto}@media print{@page{size:A4 landscape;margin:0}body{background:white}img{width:100vw;height:100vh;object-fit:contain}}</style></head><body><img src="${data}" onload="setTimeout(()=>print(),300)"></body></html>`);w.document.close()}
function setupInstall(){let deferredPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#installBar').classList.remove('hidden')});$('#installBtn').addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#installBar').classList.add('hidden')})}
document.addEventListener('DOMContentLoaded',()=>{
  const on=(selector,event,handler)=>{const el=$(selector); if(el) el.addEventListener(event,handler)};
  $$('.tab').forEach(btn=>btn.addEventListener('click',()=>showSection(btn.dataset.section)));
  on('#saveUserNameBtn','click',saveUserNameFromModal);
  on('#userNameInput','keydown',e=>{if(e.key==='Enter')saveUserNameFromModal()});
  on('#editNameBtn','click',openNameModal);
  on('#resetProgramBtn','click',resetProgram);
  on('#closeExerciseGuideBtn','click',closeExerciseGuide);
  const guideModal=$('#exerciseGuideModal'); if(guideModal) guideModal.addEventListener('click',e=>{if(e.target===guideModal)closeExerciseGuide()});
  $$('[data-habit]').forEach(cb=>cb.addEventListener('change',()=>{const data=getData();data[todayKey]=data[todayKey]||{};data[todayKey][cb.dataset.habit]=cb.checked;saveData(data)}));
  on('#newQuoteBtn','click',()=>{$('#dailyQuote').textContent=quotes[Math.floor(Math.random()*quotes.length)]});
  on('#saveEventBtn','click',saveEvent);
  on('#generateCertificateBtn','click',()=>{const n=$('#certificateName').value.trim();if(n)setUserName(n);generateCertificate(false)});
  on('#previewCertificateBtn','click',()=>generateCertificate(true));
  on('#downloadCertificateBtn','click',downloadCertificate);
  on('#shareCertificateBtn','click',shareCertificate);
  on('#printCertificateBtn','click',printCertificate);
  on('#goCertificateBtn','click',()=>showSection('certificado'));
  $$('.routine-level').forEach(btn=>btn.addEventListener('click',()=>selectChairRoutineLevel(btn.dataset.level)));
  $$('.nutrition-profile').forEach(btn=>btn.addEventListener('click',()=>setNutritionProfile(btn.dataset.profile)));
  on('#routineStartBtn','click',startChairRoutine);
  on('#routineDoneBtn','click',nextChairRoutineExercise);
  on('#routineResetBtn','click',resetChairRoutine);
  on('#routineSaveTrainingBtn','click',markRoutineAsTraining);
  on('#routineRepeatBtn','click',repeatChairRoutine);
  on('#routineCommitBtn','click',commitRoutineToday);
  $$('.routine-mood').forEach(btn=>{btn.setAttribute('type','button');btn.addEventListener('click',()=>selectRoutineMood(btn.dataset.mood));});
  $$('.mcb-library-item').forEach(btn=>btn.addEventListener('click',()=>previewChairRoutineExercise(Number(btn.dataset.libraryStep||0))));
  renderWorkout();renderCountdown();updateUI();updateNutritionUI();loadChairRoutine();ensureUserName();setupInstall();
  if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
});

const chairRoutineExercises=[
  {title:'Subir y bajar talones',kicker:'Ejercicio 1 · Piernas',img:'assets/rutina/talones.jpg',goal:'Tonificar piernas',benefit:'estabilidad',muscles:'Pantorrillas · tobillos · equilibrio',steps:['Apoya suavemente las manos en la silla.','Sube los talones sin balancearte.','Baja lento hasta apoyar completamente.'],cue:'Postura alta, abdomen activo y movimiento lento. No rebotes.',text:'Eleva talones, baja lento y mantén abdomen activo.'},
  {title:'Sentarse y levantarse',kicker:'Ejercicio 2 · Piernas y glúteos',img:'assets/rutina/sentarse-levantarse.jpg',goal:'Endurecer glúteos',benefit:'fuerza',muscles:'Glúteos · cuádriceps · isquiotibiales',steps:['Colócate delante de la silla como referencia.','Baja como si fueras a sentarte, sin desplomarte.','Sube empujando desde los talones.'],cue:'No caigas sobre la silla. Rozar o acercarte basta: el músculo trabaja.',text:'Baja como si fueras a sentarte y sube empujando desde talones.'},
  {title:'Sentadillas sumo',kicker:'Ejercicio 3 · Entrepierna y glúteos',img:'assets/rutina/sumo.jpg',goal:'Entrepierna firme',benefit:'control',muscles:'Aductores · glúteos · cuádriceps',steps:['Abre los pies más que el ancho de caderas.','Puntas ligeramente hacia fuera.','Baja controlado y sube contrayendo glúteos.'],cue:'Rodillas siguen la línea de los pies. Espalda larga, no encorvada.',text:'Pies abiertos, puntas hacia fuera. Baja controlado y sube apretando glúteos al final.'},
  {title:'Escalador con apoyo',kicker:'Ejercicio 4 · Abdomen',img:'assets/rutina/escalador.jpg',goal:'Abdomen activo',benefit:'core',muscles:'Abdomen · oblicuos · piernas · glúteos',steps:['Manos firmes sobre la silla estable.','Cuerpo en línea, sin hundir la espalda.','Lleva una rodilla al pecho y alterna.'],cue:'Primero técnica, después ritmo. Si pierdes postura, baja velocidad.',text:'Manos firmes en la silla, cuerpo alineado y rodillas alternas hacia el pecho.'},
  {title:'Rodillas al frente',kicker:'Ejercicio 5 · Metabolismo',img:'assets/rutina/rodillas-frente.jpg',goal:'Activar energía',benefit:'cardio suave',muscles:'Core · piernas · glúteos · brazos',steps:['De pie, espalda recta y mirada al frente.','Eleva una rodilla hacia el pecho.','Alterna con ritmo constante y brazos coordinados.'],cue:'Respira. No corras si pierdes control. El objetivo es terminar bien.',text:'Eleva rodillas alternas, acompaña con brazos y respira constante.'}
];
const chairRoutineLevels={
  suave:{label:'Empiezo suave',rounds:1,reps:'10-15 repeticiones'},
  avance:{label:'Quiero avanzar',rounds:2,reps:'20-30 repeticiones'},
  reto:{label:'Voy a por todo',rounds:3,reps:'50 repeticiones'}
};
let chairRoutineState={level:'suave',round:1,step:0,started:false,finished:false};
function loadChairRoutine(){try{chairRoutineState={...chairRoutineState,...JSON.parse(localStorage.getItem('mcbChairRoutine')||'{}')}}catch(e){} updateChairRoutineUI()}
function saveChairRoutine(){localStorage.setItem('mcbChairRoutine',JSON.stringify(chairRoutineState));updateChairRoutineUI()}
function routineVibrate(){try{if(navigator.vibrate)navigator.vibrate(18)}catch(e){}}
function setRoutineFeedback(message,tone='normal'){const el=$('#routineFeedback');if(!el)return;el.textContent=message;el.classList.remove('pulse','success','soft');el.classList.add(tone==='success'?'success':tone==='soft'?'soft':'pulse');setTimeout(()=>el.classList.remove('pulse'),650)}
function getRoutineStepFeedback(){const level=chairRoutineState.level||'suave';const step=chairRoutineState.step+1;const base={suave:['Bien. Suave también cuenta.','Respira. Lo estás haciendo con cabeza.','No corras. Control antes que intensidad.','Estás cumpliendo: eso es lo importante.','Un ejercicio más y sigues construyendo.'],avance:['Bien. Esto ya es compromiso.','Mantén ritmo limpio.','No negocies ahora. Ya estás dentro.','Cada repetición suma.','Último empujón de esta vuelta.'],reto:['Fuerte. Hoy has venido a demostrarte algo.','Cabeza firme. Sigue.','No busques perfecto: busca terminar.','Esto es disciplina en movimiento.','Cierra fuerte. Tú puedes.']};return (base[level]||base.suave)[(step-1)%5]}
function selectChairRoutineLevel(level){chairRoutineState={level,round:1,step:0,started:true,finished:false};saveChairRoutine();routineVibrate();const cfg=chairRoutineLevels[level]||chairRoutineLevels.suave;setRoutineFeedback('Nivel elegido: '+cfg.label+'. Empezamos sin ruido, con técnica.','success');}
function startChairRoutine(){chairRoutineState.started=true;chairRoutineState.finished=false;chairRoutineState.step=0;chairRoutineState.round=1;saveChairRoutine();routineVibrate();setRoutineFeedback('Perfecto. Hoy no necesitas hacerlo perfecto: necesitas hacerlo.','success')}
function nextChairRoutineExercise(){const cfg=chairRoutineLevels[chairRoutineState.level]||chairRoutineLevels.suave;const msg=getRoutineStepFeedback();chairRoutineState.step++;if(chairRoutineState.step>=chairRoutineExercises.length){chairRoutineState.step=0;chairRoutineState.round++;if(chairRoutineState.round>cfg.rounds){chairRoutineState.finished=true;chairRoutineState.started=false;chairRoutineState.round=cfg.rounds;chairRoutineState.step=chairRoutineExercises.length-1;autoMarkRoutineAsTraining();setRoutineFeedback('Rutina completada. Hoy has cumplido por ti.','success');routineVibrate();saveChairRoutine();return}else{setRoutineFeedback('Vuelta completada. Respira y vamos a la siguiente.','success');routineVibrate();saveChairRoutine();return}}setRoutineFeedback(msg,'soft');routineVibrate();saveChairRoutine()}
function resetChairRoutine(){const level=chairRoutineState.level||'suave';chairRoutineState={level,round:1,step:0,started:false,finished:false};saveChairRoutine();setRoutineFeedback('Rutina reiniciada. Vuelve al primer paso sin castigarte.','soft')}
function repeatChairRoutine(){const level=chairRoutineState.level||'suave';chairRoutineState={level,round:1,step:0,started:true,finished:false};saveChairRoutine();setRoutineFeedback('Nueva vuelta mental: empiezas otra vez con intención.','success')}
function previewChairRoutineExercise(step){chairRoutineState.step=Math.max(0,Math.min(step,chairRoutineExercises.length-1));chairRoutineState.started=true;chairRoutineState.finished=false;if(!chairRoutineState.level)chairRoutineState.level='suave';if(!chairRoutineState.round)chairRoutineState.round=1;saveChairRoutine();setRoutineFeedback('Ejercicio abierto. Mira, entiende y marca Hecho cuando lo completes.','soft')}
function autoMarkRoutineAsTraining(){const data=getData();data[todayKey]=data[todayKey]||{};data[todayKey].entreno=true;data[todayKey].routine=true;data[todayKey].routineLevel=chairRoutineState.level||'suave';data[todayKey].routineCompletedAt=new Date().toISOString();saveData(data)}
function markRoutineAsTraining(){autoMarkRoutineAsTraining();updateChairRoutineUI();alert('Entrenamiento guardado. Ya cuenta dentro del reto de hoy.')}
function getRoutineMotivation(){const level=chairRoutineState.level||'suave';if(level==='reto')return 'Hoy no entrenaste: te demostraste algo.';if(level==='avance')return 'Esto ya es compromiso.';return 'Empezar también cuenta.'}
function commitRoutineToday(){localStorage.setItem('mcbRoutineCommit',todayKey);const msg=$('#routineCommitMessage');if(msg)msg.textContent='Compromiso aceptado. Ahora no pienses demasiado: empieza.';setRoutineFeedback('Compromiso aceptado. Hoy son 10 minutos para ti.','success');routineVibrate();}
function getRoutineMoodMap(){return{baja:{level:'suave',label:'Empiezo suave',msg:'Hoy toca empezar suave. No es poco: es cumplir sin castigarte.',start:'Comenzar suave'},normal:{level:'avance',label:'Quiero avanzar',msg:'Hoy puedes avanzar. Dos vueltas, técnica limpia y constancia.',start:'Comenzar avance'},fuerte:{level:'reto',label:'Voy a por todo',msg:'Hoy vas a por todo. Tres vueltas, 50 repeticiones y cabeza fuerte.',start:'Comenzar reto'}}}
function selectRoutineMood(mood){const map=getRoutineMoodMap();const rec=map[mood]||map.normal;localStorage.setItem('mcbRoutineMood',mood);chairRoutineState={level:rec.level,round:1,step:0,started:false,finished:false};saveChairRoutine();const advice=$('#routineMoodAdvice');if(advice)advice.textContent=rec.msg;const selected=$('#routineMoodSelected');if(selected)selected.textContent='Nivel seleccionado: '+rec.label+'. Puedes empezar cuando quieras.';const start=$('#routineStartBtn');if(start)start.textContent=rec.start;$$('.routine-mood').forEach(b=>{const isActive=b.dataset.mood===mood;b.classList.toggle('active',isActive);b.setAttribute('aria-pressed',isActive?'true':'false')});$$('.routine-level').forEach(b=>b.classList.toggle('active',b.dataset.level===rec.level));routineVibrate();setRoutineFeedback(rec.msg,'success');}
function routineDoneOnDate(data,key){return !!(data[key]&&(data[key].routine||data[key].entreno));}
function getRoutineStats(){const data=getData();let total=0;Object.keys(data).forEach(k=>{if(routineDoneOnDate(data,k))total++});let current=0;for(let i=0;i<365;i++){const d=new Date();d.setDate(d.getDate()-i);const key=d.toISOString().slice(0,10);if(routineDoneOnDate(data,key))current++;else if(i===0)break;else break}let best=0,run=0;const keys=Object.keys(data).filter(k=>/^\d{4}-\d{2}-\d{2}$/.test(k)).sort();let prev=null;keys.forEach(k=>{if(!routineDoneOnDate(data,k))return;const dt=new Date(k);if(prev){const diff=Math.round((dt-prev)/86400000);run=diff===1?run+1:1}else run=1;best=Math.max(best,run);prev=dt});best=Math.max(best,current);return{total,current,best}}
function renderRoutineProgressPanel(){const stats=getRoutineStats();const cs=$('#routineCurrentStreak'),bs=$('#routineBestStreak'),td=$('#routineTotalDone'),next=$('#routineNextMilestone');if(!cs)return;cs.textContent=stats.current+' días';bs.textContent=stats.best+' días';td.textContent=stats.total;let target=stats.total<7?7:stats.total<14?14:stats.total<28?28:null;if(next)next.textContent=target?`Estás a ${target-stats.total} días de tu próximo desbloqueo MCB.`:'Has desbloqueado todos los hitos principales. Ahora toca mantener.';[['milestone7',7],['milestone14',14],['milestone28',28]].forEach(([id,n])=>{const el=$('#'+id);if(el)el.classList.toggle('done',stats.total>=n)});const mood=localStorage.getItem('mcbRoutineMood');const moodMap=getRoutineMoodMap();const rec=moodMap[mood];$$('.routine-mood').forEach(b=>{const isActive=b.dataset.mood===mood;b.classList.toggle('active',isActive);b.setAttribute('aria-pressed',isActive?'true':'false')});if(rec){const advice=$('#routineMoodAdvice');if(advice)advice.textContent=rec.msg;const selected=$('#routineMoodSelected');if(selected)selected.textContent='Nivel seleccionado: '+rec.label+'. Puedes empezar cuando quieras.';const start=$('#routineStartBtn');if(start&&!chairRoutineState.started&&!chairRoutineState.finished)start.textContent=rec.start;}const commit=$('#routineCommitMessage');if(commit&&localStorage.getItem('mcbRoutineCommit')===todayKey)commit.textContent='Compromiso aceptado. Hoy ya no se negocia.';}
function renderRoutineWeekCalendar(){const wrap=$('#routineWeekCalendar');if(!wrap)return;const data=getData();const names=['D','L','M','X','J','V','S'];const today=new Date();const start=new Date(today);start.setDate(today.getDate()-today.getDay());let html='';for(let i=0;i<7;i++){const d=new Date(start);d.setDate(start.getDate()+i);const key=d.toISOString().slice(0,10);const done=!!(data[key]&&data[key].entreno);const isToday=key===todayKey;html+=`<div class="routine-day ${done?'done':''} ${isToday?'today':''}"><span>${names[i]}</span><strong>${d.getDate()}</strong></div>`;}wrap.innerHTML=html}
function updateRoutineFinishCard(){const title=$('#routineFinishTitle');const msg=$('#routineFinishMessage');const note=$('#routineSavedNote');if(!title||!msg)return;title.textContent='Rutina completada. Has cumplido por ti.';msg.textContent=getRoutineMotivation()+' Guarda el entrenamiento y deja que este día sume en tu reto.';const data=getData();const saved=!!(data[todayKey]&&data[todayKey].entreno);if(note)note.textContent=saved?'Entrenamiento guardado automáticamente en tu día de hoy.':'Al terminar la rutina se marca automáticamente Entrenamiento en tu reto.'}
function updateChairRoutineUI(){
  const cfg=chairRoutineLevels[chairRoutineState.level]||chairRoutineLevels.suave;
  const ex=chairRoutineExercises[chairRoutineState.step]||chairRoutineExercises[0];
  const total=cfg.rounds*chairRoutineExercises.length;
  let done=(chairRoutineState.round-1)*chairRoutineExercises.length+chairRoutineState.step;
  if(chairRoutineState.finished)done=total;
  const pct=Math.min(Math.round(done/total*100),100);
  const levelLabel=$('#routineLevelLabel');if(!levelLabel)return;
  const active=chairRoutineState.started||chairRoutineState.finished;
  levelLabel.textContent=cfg.label+' · '+cfg.reps;
  $('#routineRoundLabel').textContent=active?`${chairRoutineState.round}/${cfg.rounds}`:`0/${cfg.rounds}`;
  $('#routineStepLabel').textContent=active?`${Math.min(chairRoutineState.step+1,chairRoutineExercises.length)}/${chairRoutineExercises.length}`:'0/5';
  $('#routineProgressBar').style.width=pct+'%';
  const live=$('#routineLiveProgress');
  if(live) live.textContent=active&&!chairRoutineState.finished?`Ejercicio ${Math.min(chairRoutineState.step+1,chairRoutineExercises.length)} de ${chairRoutineExercises.length} · Vuelta ${chairRoutineState.round} de ${cfg.rounds}`:chairRoutineState.finished?'Rutina completada. Guarda tu entrenamiento.':'Elige tu estado o tu nivel para empezar.';
  $$('.routine-level').forEach(b=>b.classList.toggle('active',b.dataset.level===chairRoutineState.level));
  $$('.mcb-library-item').forEach((b,i)=>b.classList.toggle('active',i===chairRoutineState.step));
  const img=$('#routineExerciseImage');
  const empty=$('#routineEmptyVisual');
  const detail=$('#routineDetailLink');
  $('#routineExerciseKicker').textContent=ex.kicker;
  $('#routineExerciseTitle').textContent=active?ex.title:'Primer ejercicio: '+ex.title;
  $('#routineExerciseText').textContent=(active?ex.text:'Elige un nivel arriba y la rutina empezará aquí. Cuando aparezca el botón Hecho, márcalo para pasar al siguiente ejercicio.')+' Objetivo de hoy: '+cfg.reps+'.';
  if(img){img.src=ex.img;img.classList.remove('hidden')}
  if(empty)empty.classList.add('hidden');
  if(detail){detail.href=ex.img;detail.classList.remove('hidden')}
  const chips=$('#routineChips'); if(chips) chips.innerHTML=[ex.goal,ex.benefit,cfg.reps].map(x=>'<span>'+x+'</span>').join('');
  const steps=$('#routineSteps'); if(steps) steps.innerHTML=ex.steps.map(s=>'<li>'+s+'</li>').join('');
  const cue=$('#routineCue'); if(cue) cue.textContent=ex.cue;
  const muscles=$('#routineMuscles'); if(muscles) muscles.textContent=ex.muscles;
  const startBtn=$('#routineStartBtn');
  if(startBtn){
    const mood=localStorage.getItem('mcbRoutineMood');
    const rec=getRoutineMoodMap()[mood];
    startBtn.textContent=rec&&!active?rec.start:'Comenzar rutina';
    startBtn.classList.toggle('hidden',active);
  }
  $('#routineDoneBtn').classList.toggle('hidden',!active||chairRoutineState.finished);
  $('#routineFinishCard').classList.toggle('hidden',!chairRoutineState.finished);
  updateRoutineFinishCard();
  renderRoutineWeekCalendar();
  renderRoutineProgressPanel();
}
