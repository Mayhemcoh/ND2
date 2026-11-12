/* Night Desk: optional cinematic city overlay. Independent of simulation and input. */
(()=>{'use strict';
 const wrap=document.getElementById('mapwrap'),top=document.getElementById('top');if(!wrap||!top)return;
 const atmos=document.createElement('div');atmos.className='nd-atmos';atmos.setAttribute('aria-hidden','true');
 const skyline=document.createElement('canvas');skyline.className='nd-skyline';
 for(const c of ['nd-grid','nd-sweep','nd-corners']){const d=document.createElement('div');d.className=c;atmos.appendChild(d)}
 atmos.insertBefore(skyline,atmos.firstChild);wrap.appendChild(atmos);
 const btn=document.createElement('button');btn.id='ndVisual';btn.className='ib';btn.type='button';btn.title='Toggle cinematic city effects (visual only)';btn.setAttribute('aria-label','Toggle cinematic city effects');
 const key='nd-cinematic-enabled';let enabled=true;try{enabled=localStorage.getItem(key)!=='off'}catch(e){}
 function update(){wrap.classList.toggle('nd-flat',!enabled);btn.setAttribute('aria-pressed',String(enabled));btn.textContent=enabled?'◈ 3D':'◇ 2D'}
 btn.addEventListener('click',()=>{enabled=!enabled;try{localStorage.setItem(key,enabled?'on':'off')}catch(e){}update()});
 top.insertBefore(btn,document.getElementById('btnTools'));update();
 const ctx=skyline.getContext('2d');let width=0,height=0;
 function rand(n){let x=Math.sin(n*127.1+78.233)*43758.5453;return x-Math.floor(x)}
 function render(){const box=wrap.getBoundingClientRect();if(box.width<1||box.height<1)return;
 const dpr=Math.min(devicePixelRatio||1,2),w=Math.round(box.width),h=Math.round(box.height);
 if(w===width&&h===height)return;width=w;height=h;skyline.width=Math.round(w*dpr);skyline.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 // An isometric skyline along the far edge: purely decorative and never intercepts input.
 const horizon=Math.min(h*.22,115),count=Math.ceil(w/26);
 for(let i=0;i<count;i++){const x=i*26+rand(i+3)*9,bw=13+rand(i+15)*20,bh=16+rand(i+31)*horizon*.8;
 const y=horizon-bh;ctx.fillStyle=i%3===0?'#1c6581':'#12445f';ctx.fillRect(x,y,bw,bh);
 ctx.fillStyle='#398ca6';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+6,y-6);ctx.lineTo(x+bw+6,y-6);ctx.lineTo(x+bw,y);ctx.fill();
 ctx.fillStyle='#09293d';ctx.beginPath();ctx.moveTo(x+bw,y);ctx.lineTo(x+bw+6,y-6);ctx.lineTo(x+bw+6,horizon-6);ctx.lineTo(x+bw,horizon);ctx.fill();
 for(let yy=y+7;yy<horizon-4;yy+=10)for(let xx=x+4;xx<x+bw-2;xx+=7){if(rand(i*100+yy*3+xx)>.5){ctx.fillStyle=rand(i+xx+yy)>.75?'#ffd487':'#6ceaff';ctx.fillRect(xx,yy,2,3)}}
 }
 const grad=ctx.createLinearGradient(0,0,0,horizon+70);grad.addColorStop(0,'#43cfff20');grad.addColorStop(.65,'#2cb0ed08');grad.addColorStop(1,'#2cb0ed00');ctx.fillStyle=grad;ctx.fillRect(0,0,w,horizon+70);
 }
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(render).observe(wrap);else window.addEventListener('resize',render);render();
})();
