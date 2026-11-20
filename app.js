const $ = id => document.getElementById(id);
const words = Array.isArray(window.WORDS) ? window.WORDS : [];
let level = localStorage.getItem('gl_level') || 'A1';
let chapter = 1, cardIndex = 0, quizIndex = 0, mode = 'meaning', points = 0;
let learned = JSON.parse(localStorage.getItem('gl_learned') || '[]');
let flags = JSON.parse(localStorage.getItem('gl_flags') || '[]');
const bn = n => String(n).replace(/\d/g, d => '০১২৩৪৫৬৭৮৯'[d]);
const currentWords = () => words.filter(w => w.level === level && (chapter ? w.chapter === chapter : true));
const allLevel = l => words.filter(w => w.level === l);
function persist(){localStorage.setItem('gl_learned',JSON.stringify(learned));localStorage.setItem('gl_flags',JSON.stringify(flags));}
function render(){
  $('currentLevel').textContent=level;$('courseTitle').textContent=`Netzwerk neu ${level} অগ্রগতি`;
  document.querySelectorAll('.level-card').forEach(b=>b.classList.toggle('active',b.dataset.level===level));
  ['A1','A2'].forEach(l=>{const arr=allLevel(l),done=arr.filter(w=>learned.includes(key(w))).length,p=arr.length?Math.round(done/arr.length*100):0;$(`${l.toLowerCase()}Meta`).textContent=`${bn(arr.length)}টি শব্দ • ${p}% সম্পন্ন`;$(`${l.toLowerCase()}Bar`).style.width=p+'%';});
  const arr=allLevel(level),done=arr.filter(w=>learned.includes(key(w))).length,p=arr.length?Math.round(done/arr.length*100):0;
  $('progressText').textContent=`${done} / ${arr.length} (${p}%)`;$('courseBar').style.width=p+'%';$('chapterCount').textContent=bn(arr.length)+'টি শব্দ';
  $('chapterGrid').innerHTML=Array.from({length:12},(_,i)=>`<button class="chapter-chip ${chapter===i+1?'active':''}" data-ch="${i+1}">Kapitel ${i+1}</button>`).join('');
  $('totalLearned').textContent=learned.length;$('totalFlagged').textContent=flags.length;$('totalPoints').textContent=points;$('score').textContent='স্কোর '+points;
  $('streak').textContent='🔥 '+(localStorage.getItem('gl_streak')||'0');
  $('flashLevel').textContent='Netzwerk '+level;renderCard();renderQuiz();
}
function key(w){return `${w.level}-${w.chapter}-${w.word}`;}
function renderCard(){
 const arr=currentWords(); if(!arr.length){$('cardPosition').textContent='কার্ড 0 / 0';$('flashChapter').textContent=`#0 Kap ${chapter}`;$('flashContent').innerHTML='<span class="eyebrow">DEUTSCH</span><h2>শব্দ যোগ করুন</h2><p>words.js ফাইলে নিজের শব্দতালিকা যোগ করুন।</p>';return;}
 cardIndex=(cardIndex+arr.length)%arr.length;const w=arr[cardIndex];$('cardPosition').textContent=`কার্ড ${cardIndex+1} / ${arr.length}`;$('flashChapter').textContent=`#${cardIndex+1} Kap ${w.chapter}`;$('flashContent').innerHTML=`<span class="eyebrow">DEUTSCH</span><h2>${escapeHtml(w.word)}</h2><p>${escapeHtml(w.pronunciation||'উচ্চারণ যোগ করা হয়নি')}</p><p id="cardMeaning" hidden><b>বাংলা অর্থ:</b> ${escapeHtml(w.meaning||'')}</p><button class="secondary-btn" id="revealBtn">অর্থ দেখতে কার্ডে ট্যাপ করুন</button>`;$('cardMeaning').hidden=true;$('revealBtn').onclick=()=>{$('cardMeaning').hidden=!$('cardMeaning').hidden;};$('learnBtn').textContent=learned.includes(key(w))?'✓ শেখা হয়েছে':'✓ শেখা হয়েছে';
}
function renderQuiz(){
 const arr=currentWords();$('quizFeedback').textContent='';if(!arr.length){$('quizWord').textContent='শব্দ যোগ করুন';$('quizHint').textContent='words.js ফাইলে শব্দ যোগ করলে কুইজ চালু হবে।';$('quizOptions').innerHTML='';$('quizCounter').textContent=`KAPITEL ${chapter} • #0`;return;}
 quizIndex=(quizIndex+arr.length)%arr.length;const w=arr[quizIndex];$('quizCounter').textContent=`KAPITEL ${w.chapter} • #${quizIndex+1}`;$('quizWord').textContent=mode==='article'?w.word:w.word;$('quizHint').textContent=mode==='article'?'সঠিক Artikel নির্বাচন করুন':'শব্দটির বাংলা অর্থ কোনটি?';
 let opts=mode==='article'?['der','die','das']:[w.meaning,...words.filter(x=>x.level===level&&x.meaning!==w.meaning).slice(0,3).map(x=>x.meaning)].filter(Boolean);
 opts=[...new Set(opts)].sort(()=>Math.random()-.5);$('quizOptions').innerHTML=opts.map(o=>`<button class="option">${escapeHtml(o)}</button>`).join('');
 document.querySelectorAll('.option').forEach(btn=>btn.onclick=()=>{const correct=mode==='article'?btn.textContent===w.article:btn.textContent===w.meaning;btn.classList.add(correct?'correct':'wrong');$('quizFeedback').textContent=correct?'সঠিক উত্তর! +১ পয়েন্ট':'সঠিক উত্তর: '+(mode==='article'?w.article:w.meaning);if(correct){points++;localStorage.setItem('gl_points',points);$('totalPoints').textContent=points;$('score').textContent='স্কোর '+points;}document.querySelectorAll('.option').forEach(b=>b.disabled=true);});
}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
document.querySelectorAll('.level-card').forEach(b=>b.onclick=()=>{level=b.dataset.level;chapter=1;cardIndex=quizIndex=0;localStorage.setItem('gl_level',level);render();});
$('chapterGrid').onclick=e=>{const b=e.target.closest('[data-ch]');if(b){chapter=+b.dataset.ch;cardIndex=quizIndex=0;render();}};
$('prevCard').onclick=()=>{cardIndex--;renderCard()};$('nextCard').onclick=()=>{cardIndex++;renderCard()};
$('learnBtn').onclick=()=>{const w=currentWords()[cardIndex];if(!w)return;const k=key(w);learned=learned.includes(k)?learned.filter(x=>x!==k):[...learned,k];persist();render();};
$('speakBtn').onclick=()=>{const w=currentWords()[cardIndex];if(w&&'speechSynthesis'in window){const u=new SpeechSynthesisUtterance(w.word);u.lang='de-DE';speechSynthesis.speak(u);}};
document.querySelectorAll('.quiz-tab').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;document.querySelectorAll('.quiz-tab').forEach(x=>x.classList.toggle('active',x===b));quizIndex=0;renderQuiz();});
$('nextQuiz').onclick=()=>{quizIndex++;renderQuiz();};
$('themeBtn').onclick=()=>{document.body.classList.toggle('light');localStorage.setItem('gl_theme',document.body.classList.contains('light')?'light':'dark');};
if(localStorage.getItem('gl_theme')==='light')document.body.classList.add('light');
$('saveName').onclick=()=>{localStorage.setItem('gl_name',$('profileName').value);alert('প্রোফাইল নাম সেভ হয়েছে।');};
$('profileName').value=localStorage.getItem('gl_name')||'';
$('exportBtn').onclick=()=>{const data={level,learned,flags,points,profile:localStorage.getItem('gl_name')||''};const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download='german-learner-backup.json';a.click();URL.revokeObjectURL(a.href);};
$('resetBtn').onclick=()=>{if(confirm(`${level} কোর্সের শেখা শব্দের অগ্রগতি রিসেট করবেন?`)){learned=learned.filter(k=>!k.startsWith(level+'-'));flags=flags.filter(k=>!k.startsWith(level+'-'));persist();render();}};
$('searchInput').oninput=e=>{const q=e.target.value.trim().toLowerCase();if(!q){chapter=1;render();return;}const found=words.findIndex(w=>w.level===level&&[w.word,w.meaning,w.pronunciation].some(v=>String(v||'').toLowerCase().includes(q)));if(found>=0){const w=allLevel(level)[found];chapter=w.chapter;cardIndex=currentWords().findIndex(x=>key(x)===key(w));render();}};
points=Number(localStorage.getItem('gl_points')||0);render();