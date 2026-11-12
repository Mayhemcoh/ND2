/* Night Desk: Neon Skyline v2 — presentation only; simulation and map input untouched. */
(()=>{'use strict';
 const wrap=document.getElementById('mapwrap'),top=document.getElementById('top');if(!wrap||!top)return;
 const atmos=document.createElement('div');atmos.className='nd-atmos';atmos.setAttribute('aria-hidden','true');
 const skyline=document.createElement('canvas');skyline.className='nd-skyline';atmos.appendChild(skyline);
 const depth=document.createElement('canvas');depth.className='nd-depth';atmos.appendChild(depth);
 for(const c of ['nd-grid','nd-sweep','nd-corners','nd-vignette']){const d=document.createElement('div');d.className=c;atmos.appendChild(d)}
 wrap.appendChild(atmos);
 const btn=document.createElement('button');btn.id='ndVisual';btn.className='ib';btn.type='button';btn.title='Toggle dimensional city architecture (visual only)';btn.setAttribute('aria-label','Toggle dimensional city architecture');
 const key='nd-cinematic-enabled';let enabled=true;try{enabled=localStorage.getItem(key)!=='off'}catch(e){}
 function update(){wrap.classList.toggle('nd-flat',!enabled);btn.setAttribute('aria-pressed',String(enabled));btn.textContent=enabled?'◈ DEPTH':'◇ FLAT';render()}
 btn.addEventListener('click',()=>{enabled=!enabled;try{localStorage.setItem(key,enabled?'on':'off')}catch(e){}update()});
 top.insertBefore(btn,document.getElementById('btnTools'));
 const sc=skyline.getContext('2d'),dc=depth.getContext('2d');let width=0,height=0;
 function rand(n){let x=Math.sin(n*127.1+78.233)*43758.5453;return x-Math.floor(x)}
 function prepare(canvas,ctx,w,h){const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h)}
 function building(ctx,x,y,w,h,deep,n){
  const rise=12+rand(n+40)*Math.min(52,h*.12),dx=rise*.55,dy=-rise*.4;
  ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+dx,y+dy);ctx.lineTo(x+w+dx,y+dy);ctx.lineTo(x+w,y);ctx.closePath();ctx.fillStyle='#43d7ed';ctx.fill();
  ctx.beginPath();ctx.moveTo(x+w,y);ctx.lineTo(x+w+dx,y+dy);ctx.lineTo(x+w+dx,y+h+dy);ctx.lineTo(x+w,y+h);ctx.closePath();ctx.fillStyle='#092e58';ctx.fill();
  ctx.fillStyle=deep?'#0b3153':'#104568';ctx.fillRect(x,y,w,h);
  ctx.strokeStyle='#46dbff';ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,w-1,h-1);
  for(let yy=y+7;yy<y+h-4;yy+=11)for(let xx=x+6;xx<x+w-4;xx+=9){if(rand(n*71+xx*3+yy)>.4){ctx.fillStyle=rand(n+xx+yy)>.72?'#ffd99c':'#3ee8ff';ctx.fillRect(xx,yy,3,4)}}
  ctx.fillStyle='#57e6ff';ctx.fillRect(x,y,Math.max(4,w*.4),1.5);
 }
 function render(){const box=wrap.getBoundingClientRect();if(box.width<1||box.height<1)return;
  const w=Math.round(box.width),h=Math.round(box.height);width=w;height=h;prepare(skyline,sc,w,h);prepare(depth,dc,w,h);
  const horizon=Math.min(h*.2,112),count=Math.ceil(w/25);
  for(let i=0;i<count;i++){const x=i*25+rand(i+3)*7,bw=12+rand(i+15)*18,bh=16+rand(i+31)*horizon*.78;
   sc.fillStyle=i%3===0?'#1c6581':'#12445f';sc.fillRect(x,horizon-bh,bw,bh);
   sc.fillStyle='#398ca6';sc.beginPath();sc.moveTo(x,horizon-bh);sc.lineTo(x+6,horizon-bh-6);sc.lineTo(x+bw+6,horizon-bh-6);sc.lineTo(x+bw,horizon-bh);sc.fill();
   for(let yy=horizon-bh+7;yy<horizon-4;yy+=10)for(let xx=x+4;xx<x+bw-2;xx+=7)if(rand(i*100+yy*3+xx)>.5){sc.fillStyle=rand(i+xx+yy)>.75?'#ffd487':'#6ceaff';sc.fillRect(xx,yy,2,3)}
  }
  // Architectural foreground: visible volumetric roofs, sides, and lit windows.
  // Keep the central mission/map area clear and never intercept pointer events.
  const n=Math.max(3,Math.floor(w/115));
  for(let i=0;i<n;i++){
   const side=i%2===0;const bw=Math.min(48,w*.085),x=side?8+rand(i+7)*Math.min(55,w*.08):w-bw-18-rand(i+7)*Math.min(55,w*.08);
   const y=h*.3+rand(i+12)*h*.45,bh=Math.min(h*.13,56)+rand(i+32)*36;
   building(dc,x,y,bw,bh,i%3===0,i+1);
  }
  const grad=dc.createLinearGradient(0,0,0,h);grad.addColorStop(0,'#0df5ff08');grad.addColorStop(1,'#ff32b308');dc.fillStyle=grad;dc.fillRect(0,0,w,h);
 }
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(render).observe(wrap);else window.addEventListener('resize',render);
 update();
})();
