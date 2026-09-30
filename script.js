/* Hershini & Vinit — wedding invitation */
const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Shoonya+Farm+Retreat+Belgundi+Karnataka+591108";
const TARGET = new Date("2027-02-15T17:51:00+05:30").getTime();
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

/* MUSIC — starts only from the user's H&V tap */
const audio = $("#audio"), musicBtn = $("#music");
let musicOK = true;
audio.addEventListener("error",()=>{musicOK=false;musicBtn.hidden=true;});
function setMusic(on){musicBtn.classList.toggle("on",on);musicBtn.setAttribute("aria-pressed",String(on));musicBtn.setAttribute("aria-label",on?"Pause wedding music":"Play wedding music");}
musicBtn.addEventListener("click",()=>{
  if(!musicOK)return;
  if(audio.paused) audio.play().then(()=>setMusic(true)).catch(()=>{});
  else {audio.pause();setMusic(false);}
});

/* FULL-SCREEN 3D ENVELOPE — H&V seal is the only opener */
const env=$("#env"), gate=$("#gate"), seal=$("#seal");
let opened=false;
function openInvitation(){
  if(opened)return;
  opened=true;
  env.classList.add("cracked");
  setTimeout(()=>env.classList.add("open"),350);
  document.body.classList.remove("locked");
  if(musicOK){
    musicBtn.hidden=false;
    audio.volume=.62;
    audio.currentTime=0;
    audio.play().then(()=>setMusic(true)).catch(()=>{});
  }
  setTimeout(()=>env.classList.add("out"),2800);
  setTimeout(()=>{
    gate.classList.add("open");
    window.scrollTo({top:0,behavior:"instant"});
    startPetals();
    $$("#hero .rv").forEach((el,i)=>setTimeout(()=>el.classList.add("in"),180+i*320));
  },3600);
}
seal.addEventListener("click",openInvitation);
seal.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openInvitation();}});

/* Falling petals */
const pc=$("#petals"),pg=pc.getContext("2d");
let petals=[],petalsOn=false,PW,PH;
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
const PCOL=["232,201,200","244,228,226","183,122,124","217,190,143","90,38,48"];
function psize(){PW=pc.width=innerWidth;PH=pc.height=innerHeight;}
addEventListener("resize",psize);psize();
function mk(top=false,big=false){return{x:Math.random()*PW,y:top?-20:Math.random()*PH*(big?.6:1),s:5+Math.random()*9,vy:(big?1.4:.4)+Math.random()*.9,vx:(Math.random()-.5)*(big?3:.6),r:Math.random()*6,vr:(Math.random()-.5)*.04,f:Math.random()*6,c:PCOL[Math.random()*PCOL.length|0],a:.45+Math.random()*.45,tmp:big};}
function startPetals(){
  if(petalsOn||reduced)return;petalsOn=true;
  const n=innerWidth<600?22:42;for(let i=0;i<n;i++)petals.push(mk(false));
  (function loop(){
    pg.clearRect(0,0,PW,PH);
    petals=petals.filter(p=>{p.y+=p.vy;p.f+=.03;p.x+=p.vx+Math.sin(p.f)*.5;p.r+=p.vr;if(p.y>PH+20){if(p.tmp)return false;Object.assign(p,mk(true));}pg.save();pg.translate(p.x,p.y);pg.rotate(p.r);pg.scale(Math.cos(p.f*1.7),1);pg.fillStyle=`rgba(${p.c},${p.a})`;pg.beginPath();pg.ellipse(0,0,p.s,p.s*.55,0,0,7);pg.fill();pg.restore();return true;});
    requestAnimationFrame(loop);
  })();
}
window.petalBurst=()=>{if(!reduced){startPetals();for(let i=0;i<50;i++)petals.push(mk(false,true));}};

/* Scroll reveals */
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting&&!e.target.closest("#hero")){e.target.classList.add("in");io.unobserve(e.target);}}),{threshold:.18});
$$('.rv').forEach(el=>io.observe(el));

/* Timeline line */
const tl=$("#tl"),fill=$("#tlFill");let ticking=false;
function onScroll(){
  ticking=false;
  if(!tl||!fill)return;
  const r=tl.getBoundingClientRect(),vh=innerHeight;
  const p=Math.min(1,Math.max(0,(vh*.62-r.top)/Math.max(r.height,1)));
  fill.style.transform=`scaleY(${p})`;
}
addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(onScroll); }},{passive:true});onScroll();

/* Scratch-to-reveal */
(function(){
  const cv=$("#scratchCv"),card=$("#card"),ctx=cv.getContext("2d",{willReadFrequently:true});
  let W,H,drawing=false,last=null,moves=0,done=false;
  function paint(){
    const dpr=Math.min(devicePixelRatio||1,2),b=cv.getBoundingClientRect();W=b.width;H=b.height;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,"#EBD0CE");g.addColorStop(.5,"#F4E4E2");g.addColorStop(1,"#E3BFBE");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    for(let i=0;i<2600;i++){ctx.fillStyle=`rgba(${Math.random()>.5?"255,255,255":"124,65,71"},${Math.random()*.08})`;ctx.fillRect(Math.random()*W,Math.random()*H,1.4,1.4);}
    for(let i=0;i<900;i++){const gold=Math.random()>.5;ctx.fillStyle=gold?`rgba(217,190,143,${.4+Math.random()*.6})`:`rgba(255,255,255,${.4+Math.random()*.6})`;const z=.8+Math.random()*1.8;ctx.fillRect(Math.random()*W,Math.random()*H,z,z);}
    ctx.strokeStyle="rgba(169,139,98,.75)";ctx.lineWidth=1;ctx.strokeRect(14,14,W-28,H-28);ctx.strokeRect(20,20,W-40,H-40);
    ctx.strokeStyle="rgba(169,139,98,.3)";
    for(let x=40;x<W-20;x+=46)for(let y=40;y<H-20;y+=46)for(let k=0;k<4;k++){ctx.save();ctx.translate(x,y);ctx.rotate(k*Math.PI/2);ctx.beginPath();ctx.ellipse(0,-7,3.5,8,0,0,7);ctx.stroke();ctx.restore();}
    ctx.fillStyle="#F8F1EC";ctx.fillRect(W/2-100,H/2-36,200,72);ctx.strokeStyle="#A98B62";ctx.strokeRect(W/2-96,H/2-32,192,64);
    ctx.fillStyle="#7C4147";ctx.textAlign="center";ctx.font="500 15px 'Cormorant Garamond',serif";ctx.fillText("S C R A T C H",W/2,H/2-4);ctx.font="italic 14px 'Cormorant Garamond',serif";ctx.fillText("to reveal our day",W/2,H/2+18);
  }
  function pos(e){const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top};}
  function scratch(p){ctx.globalCompositeOperation="destination-out";ctx.lineWidth=38;ctx.lineCap=ctx.lineJoin="round";ctx.beginPath();ctx.moveTo((last||p).x,(last||p).y);ctx.lineTo(p.x,p.y);ctx.stroke();last=p;if(++moves%8===0)check();}
  function check(){if(done)return;const d=ctx.getImageData(0,0,cv.width,cv.height).data;let clear=0,total=0;for(let i=3;i<d.length;i+=64){total++;if(d[i]<20)clear++;}if(clear/total>.5)reveal();}
  function reveal(){if(done)return;done=true;cv.classList.add("gone");card.classList.add("done");window.petalBurst?.();$("#revealBtn").classList.add("hidden");}
  cv.addEventListener("pointerdown",e=>{drawing=true;last=null;cv.setPointerCapture(e.pointerId);scratch(pos(e));});
  cv.addEventListener("pointermove",e=>{if(drawing)scratch(pos(e));});
  ["pointerup","pointercancel"].forEach(t=>cv.addEventListener(t,()=>{drawing=false;last=null;check();}));
  $("#revealBtn").addEventListener("click",reveal);
  (document.fonts?document.fonts.ready:Promise.resolve()).then(paint);
})();

/* Countdown to 17:51 PM */
(function(){
  const d=$("#cd-d"),h=$("#cd-h"),m=$("#cd-m"),s=$("#cd-s"),pad=(n,l=2)=>String(n).padStart(l,"0");
  function tick(){const diff=TARGET-Date.now();if(diff<=0){$("#cd").classList.add("hidden");$("#cd-done").classList.remove("hidden");clearInterval(t);return;}const S=Math.floor(diff/1000);d.textContent=pad(Math.floor(S/86400),3);h.textContent=pad(Math.floor(S%86400/3600));m.textContent=pad(Math.floor(S%3600/60));s.textContent=pad(S%60);s.classList.remove("tick");void s.offsetWidth;s.classList.add("tick");}
  const t=setInterval(tick,1000);tick();
})();

/* Google Maps */
$$('[data-maps]').forEach(a=>a.href=GOOGLE_MAPS_URL);

/* 3D: envelope tilt, hero parallax, hover-tilt cards */
(function(){
  const gi=$(".gate-inner"),ly=$$(".hero .ly"),nm=$(".hero .names"),cl=v=>Math.max(-.5,Math.min(.5,v));
  let tx=0,ty=0,cx=0,cy=0;
  addEventListener("pointermove",e=>{tx=e.clientX/innerWidth-.5;ty=e.clientY/innerHeight-.5;});
  addEventListener("deviceorientation",e=>{if(e.gamma==null)return;tx=cl(e.gamma/40);ty=cl((e.beta-50)/60);});
  (function f(){
    cx+=(tx-cx)*.07;cy+=(ty-cy)*.07;
    if(!gate.classList.contains("open")) gi.style.transform=`perspective(1400px) rotateX(${-cy*9}deg) rotateY(${cx*12}deg)`;
    else if(scrollY<innerHeight*1.2){
      ly.forEach(l=>{const d=+l.dataset.d;l.style.translate=`${-cx*d}px ${-cy*d*.7+scrollY*d*.012}px`;});
      nm.style.rotate=`${-cy} ${cx} 0 ${Math.hypot(cx,cy)*12}deg`;
    }
    requestAnimationFrame(f);
  })();
  function tilt(el,max){
    el.classList.add("tiltable");
    el.addEventListener("pointermove",e=>{if(e.pointerType!=="mouse"||e.buttons)return;const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;el.style.rotate=`${-y} ${x} 0 ${Math.hypot(x,y)*max}deg`;});
    el.addEventListener("pointerleave",()=>{el.style.rotate="0 0 0 0deg";});
  }
  $$(".venue-photo-wrap,.cd div,#card").forEach(el=>tilt(el,el.id==="card"?9:12));
})();
