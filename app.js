import { Game, WORLDS } from './engine.js';
import { createMusicPlayer } from './music.js';
const $=id=>document.getElementById(id);
const canvas=$('game'),ctx=canvas.getContext('2d');
const game=new Game(),input={};
let viewWidth=1200,viewHeight=480,last=0,visualTime=0,sound=true,audioContext,toastUntil=0,previousStatus='',helpWasPlaying=false;
const music=createMusicPlayer(()=>audioContext);
const ink='#52604b';
const nareshSprite=new Image();
nareshSprite.src=new URL('./assets/naresh-cartoon.png',import.meta.url).href;
const aravindSprite=new Image();
aravindSprite.src=new URL('./assets/aravind-cartoon.png',import.meta.url).href;
const vimalSprite=new Image();
vimalSprite.src=new URL('./assets/vimal-cartoon.png',import.meta.url).href;
const maniSprite=new Image();
maniSprite.src=new URL('./assets/mani-cartoon.png',import.meta.url).href;
function path(c,points,color=ink,width=1.5,fill){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));if(fill){c.closePath();c.fillStyle=fill;c.fill();}c.strokeStyle=color;c.lineWidth=width;c.lineJoin='round';c.lineCap='round';c.stroke();}
function ellipse(c,x,y,rx,ry,fill,stroke=ink,width=1.5){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();}}
function curve(c,x,y,cx,cy,ex,ey,color=ink,width=1.5){c.beginPath();c.moveTo(x,y);c.quadraticCurveTo(cx,cy,ex,ey);c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke();}
function star(c,x,y,r=9,color='#e0bd6d',rotate=0){const pts=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5+rotate;const radius=i%2?r*.46:r;pts.push([x+Math.cos(a)*radius,y+Math.sin(a)*radius]);}path(c,pts,'#ae965b',1,color);}
function heart(c,x,y,size=12){c.save();c.translate(x,y);c.scale(size/20,size/20);c.beginPath();c.moveTo(0,5);c.bezierCurveTo(-28,-11,-13,-27,0,-13);c.bezierCurveTo(13,-27,28,-11,0,5);c.fillStyle='#d58e81';c.fill();c.strokeStyle='#ac7067';c.lineWidth=1.4;c.stroke();c.restore();}
// Each character is drawn with paths, preserving the friendly, imperfect sketchbook style.
function character(c,kind,x,y,size=1,facing=1,time=0,running=false){
 c.save();c.translate(x,y);c.scale(size*facing,size);const stride=running?Math.sin(time*13)*5:0;
 if(kind==='naresh'){
   if(nareshSprite.complete&&nareshSprite.naturalWidth){
     c.save();c.translate(0,running?stride*.2:0);c.rotate(running?Math.sin(time*13)*.025:0);
     c.drawImage(nareshSprite,-34,-65,68,90);c.restore();
   }else{
     ellipse(c,-11,23+stride*.3,8,4,'#394047');ellipse(c,11,23-stride*.3,8,4,'#394047');
     ellipse(c,0,5,20,21,'#f0ead7');path(c,[[-17,-2],[-7,8],[0,1],[7,8],[17,-2]],ink,1.2);
     ellipse(c,0,-20,24,24,'#b87854');path(c,[[-22,-23],[-22,-39],[-10,-47],[11,-44],[23,-33],[20,-22],[12,-35],[-3,-33],[-14,-27]],ink,1.5,'#282c2e');
     ellipse(c,-8,-19,2,2,ink,null);ellipse(c,8,-19,2,2,ink,null);curve(c,-9,-9,0,-1,10,-9,ink,1.8);
   }
 }else if(kind==='mani'){
  if(maniSprite.complete&&maniSprite.naturalWidth){
   c.drawImage(maniSprite,-30,-65+stride*.12,60,90);
  }else{
   path(c,[[14,3],[30,-5],[23,-14],[34,-24],[24,-35],[12,-13]],ink,1.5,'#e2c778');
   ellipse(c,-8,22+stride*.4,7,4,'#e3ca83');ellipse(c,9,22-stride*.4,7,4,'#e3ca83');
   ellipse(c,0,5,19,22,'#e4ce8b');
   path(c,[[-14,-18],[-24,-50],[-15,-54],[-3,-25]],ink,1.5,'#e4ce8b');path(c,[[4,-25],[14,-54],[23,-50],[15,-17]],ink,1.5,'#e4ce8b');
   path(c,[[-24,-50],[-21,-41],[-12,-45],[-15,-54]],ink,1,'#797c5c');path(c,[[14,-54],[11,-45],[20,-40],[23,-50]],ink,1,'#797c5c');
   ellipse(c,0,-14,21,20,'#e4ce8b');ellipse(c,-8,-18,2,3,ink,null);ellipse(c,8,-18,2,3,ink,null);ellipse(c,-14,-9,4,3,'#d69675',null);ellipse(c,14,-9,4,3,'#d69675',null);path(c,[[-2,-11],[1,-10],[3,-11]],ink,1.2);curve(c,-4,-4,0,1,5,-4);
   curve(c,-12,1,-17,15,-7,15);curve(c,12,1,17,15,7,15);
  }
 }else if(kind==='aravind'){
  if(aravindSprite.complete&&aravindSprite.naturalWidth){
   c.drawImage(aravindSprite,-30,-65+stride*.12,60,90);
  }else{
   ellipse(c,-10,22+stride*.4,7,4,'#777c68');ellipse(c,10,22-stride*.4,7,4,'#777c68');
   ellipse(c,-24,-6,5,9,'#dcc5a8');ellipse(c,24,-6,5,9,'#dcc5a8');ellipse(c,0,-8,24,31,'#e3d0b3');
   path(c,[[-24,-14],[-25,-33],[-17,-40],[-7,-44],[13,-41],[24,-31],[23,-12],[18,-29],[8,-28],[3,-34],[-8,-30],[-13,-34],[-21,-24]],ink,1.6,'#85836e');
   for(let i=0;i<7;i++)curve(c,-18+i*5,-35,-6+i*3,-44,17-i*2,-32,'#555d4c',.8);
   path(c,[[-17,-16],[-6,-14]],ink,2.4);path(c,[[5,-14],[16,-16]],ink,2.4);ellipse(c,-10,-11,1.7,2.2,ink,null);ellipse(c,11,-11,1.7,2.2,ink,null);
   path(c,[[0,-10],[-4,0],[2,2]],ink,1);curve(c,-12,7,0,23,14,6);curve(c,-12,7,0,4,14,6);path(c,[[-8,10],[10,10]],ink,.8);curve(c,-10,4,-4,-1,0,4,ink,2);curve(c,0,4,6,-1,12,4,ink,2);
  }
 }else if(kind==='vimal'){
  if(vimalSprite.complete&&vimalSprite.naturalWidth){
   c.drawImage(vimalSprite,-30,-65+stride*.12,60,90);
  }else{
   path(c,[[-14,10],[-13,24+stride*.3],[-4,24+stride*.3],[-2,10]],ink,1,'#e0c9a7');path(c,[[4,10],[5,24-stride*.3],[14,24-stride*.3],[14,10]],ink,1,'#e0c9a7');
   path(c,[[-20,-10],[-23,10],[20,12],[16,-13]],ink,1.5,'#c58a75');path(c,[[-23,10],[-21,19],[-3,19],[0,14],[2,19],[20,18],[20,12]],ink,1.3,'#d4bf80');
   ellipse(c,-23,-7,6,6,'#e6d3b3');ellipse(c,19,-8,6,6,'#e6d3b3');
   ellipse(c,0,-24,27,21,'#e8d5b8');ellipse(c,22,-20,8,10,'#e8d5b8');
   path(c,[[-25,-27],[-24,-42],[-15,-48],[-6,-42],[4,-47],[17,-40],[22,-30],[13,-37],[3,-35],[-4,-39],[-13,-33],[-20,-33]],ink,1.3,'#696d5d');
   curve(c,-17,-31,-11,-38,-5,-31,ink,3);curve(c,4,-31,12,-37,18,-29,ink,3);
   ellipse(c,-10,-24,7,8,'#fffaf0');ellipse(c,11,-24,7,8,'#fffaf0');ellipse(c,-8,-24,2.4,3,ink,null);ellipse(c,10,-24,2.4,3,ink,null);
   curve(c,-4,-11,1,-7,6,-11);path(c,[[-14,-5],[-12,0],[-6,-2]],ink,1);
  }
 }
 c.restore();
}
function cloud(x,y,s,alpha=1){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.globalAlpha=alpha;ctx.beginPath();ctx.moveTo(-42,9);ctx.bezierCurveTo(-58,-5,-41,-24,-25,-19);ctx.bezierCurveTo(-25,-47,11,-47,17,-22);ctx.bezierCurveTo(44,-30,55,-9,43,8);ctx.closePath();ctx.fillStyle='#fbfbef';ctx.fill();ctx.strokeStyle='#d1d8c3';ctx.lineWidth=1;ctx.stroke();curve(ctx,-40,14,0,18,44,13,'#cdd5bf',.8);ctx.restore();}
function cityScenery(index){
 const city=WORLDS[index].name;
 for(let i=0;i<1;i++){
   const x=viewWidth*.68-Math.sin(game.camera/1600)*30;
   ctx.save();ctx.globalAlpha=1;
   if(city==='Bangalore'){
     // Vidhana Soudha: long granite wings, a columned portico and five domes.
     const stone='#bfc5aa',lit='#e9e9d4',shadow='#a3ad91';
     ctx.fillStyle=stone;ctx.fillRect(x-152,276,304,72);
     path(ctx,[[x-159,277],[x-148,267],[x+148,267],[x+159,277]],shadow,1.3,stone);
     ctx.fillStyle=shadow;ctx.fillRect(x-160,344,320,5);
     for(let j=-7;j<=7;j++){
       const px=x+j*19;ctx.fillStyle=lit;ctx.fillRect(px-4,288,8,47);
       path(ctx,[[px-6,286],[px+6,286],[px+5,290],[px-5,290]],shadow,.8,lit);
       path(ctx,[[px-6,336],[px+6,336]],shadow,.8);
     }
     for(const side of [-1,1]){
       const dx=x+side*119;ctx.fillStyle=stone;ctx.fillRect(dx-15,259,30,18);
       ellipse(ctx,dx,258,15,11,stone,shadow,1);ellipse(ctx,dx,249,8,8,stone,shadow,.9);
       path(ctx,[[dx,241],[dx,234]],shadow,1.4);
     }
     // Raised central entrance and the broad onion-shaped main dome.
     ctx.fillStyle='#d2d6ba';ctx.fillRect(x-53,257,106,88);
     path(ctx,[[x-60,257],[x-47,247],[x+47,247],[x+60,257]],shadow,1.3,stone);
     for(let j=-2;j<=2;j++){
       const px=x+j*22;ctx.fillStyle=lit;ctx.fillRect(px-6,275,12,59);
       path(ctx,[[px-9,273],[px+9,273]],shadow,1.1);
     }
     ctx.fillStyle='#8e9b82';ctx.fillRect(x-15,314,30,29);
     ellipse(ctx,x,246,43,19,stone,shadow,1.4);
     path(ctx,[[x-29,245],[x-25,219],[x+25,219],[x+29,245]],shadow,1.2,stone);
     ellipse(ctx,x,217,25,23,stone,shadow,1.2);
     ellipse(ctx,x,196,11,9,stone,shadow,1);path(ctx,[[x,187],[x,178]],shadow,1.2);
     for(let step=0;step<4;step++){
       ctx.fillStyle=step%2?'#d7dac2':'#c9cfb3';ctx.fillRect(x-44-step*8,346+step*3,88+step*16,3);
     }
     ctx.fillStyle='#718266';ctx.font='bold 8px "DM Sans",sans-serif';ctx.textAlign='center';ctx.fillText('VIDHANA SOUDHA',x,368);
   }else if(city==='Thanjavur'){
     // Brihadeeswara Temple: a Chola courtyard and the tall tiered vimana.
     const stone='#c9a984',lit='#e7cfaa',line='#aa876a';
     ctx.fillStyle='#b99a7b';ctx.fillRect(x-161,337,322,15);
     for(const side of [-1,1]){
       ctx.fillStyle=stone;ctx.fillRect(x+side*114-48,308,96,29);
       path(ctx,[[x+side*114-53,309],[x+side*114-35,296],[x+side*114+35,296],[x+side*114+53,309]],line,1,stone);
       for(let j=-1;j<=1;j++){const px=x+side*114+j*23;ctx.fillStyle=lit;ctx.fillRect(px-5,316,10,19);}
     }
     ctx.fillStyle=stone;ctx.fillRect(x-79,307,158,35);
     for(let tier=0;tier<9;tier++){
       const y=307-tier*19,w=77-tier*6.8;
       path(ctx,[[x-w-3,y],[x+w+3,y],[x+w-5,y-17],[x-w+5,y-17]],line,1.1,tier%2?stone:'#d2b28d');
       path(ctx,[[x-w-5,y-17],[x+w-5,y-17]],lit,2);
       for(let j=-w+9;j<w;j+=13){
         const px=x+j;path(ctx,[[px-4,y-4],[px-4,y-12],[px,y-15],[px+4,y-12],[px+4,y-4]],line,.65,lit);
       }
       for(const side of [-1,1])ellipse(ctx,x+side*(w-2),y-18,3,3,lit,line,.7);
     }
     ellipse(ctx,x,132,13,9,stone,line,1.2);ellipse(ctx,x,124,7,6,lit,line,.8);
     path(ctx,[[x,118],[x,112]],line,1.2);
     ctx.fillStyle='#b49778';ctx.fillRect(x-92,342,184,5);
     for(let step=0;step<4;step++){ctx.fillStyle=step%2?lit:stone;ctx.fillRect(x-48-step*9,347+step*3,96+step*18,3);}
     ctx.fillStyle='#846e5b';ctx.font='bold 8px "DM Sans",sans-serif';ctx.textAlign='center';ctx.fillText('THANJAVUR BIG TEMPLE',x,370);
   }else{
     // Chennai Central: red-brick wings, white-trimmed arches and a clock tower.
     const brick='#bd8072',deep='#986b63',trim='#f3e9d7';
     ctx.fillStyle=brick;ctx.fillRect(x-166,269,332,79);
     path(ctx,[[x-172,270],[x-165,254],[x-42,254],[x-36,267],[x+36,267],[x+42,254],[x+165,254],[x+172,270]],deep,1.5,brick);
     for(const side of [-1,1]){
       const tx=x+side*143;ctx.fillStyle=brick;ctx.fillRect(tx-19,245,38,103);
       path(ctx,[[tx-23,245],[tx-15,231],[tx+15,231],[tx+23,245]],trim,1.3,brick);
       ctx.fillStyle=trim;ctx.fillRect(tx-15,278,30,3);
     }
     for(let j=-7;j<=7;j++){
       const px=x+j*21;if(Math.abs(j)<2)continue;
       ctx.beginPath();ctx.moveTo(px-6,327);ctx.lineTo(px-6,302);ctx.arc(px,302,6,Math.PI,0);ctx.lineTo(px+6,327);ctx.closePath();ctx.fillStyle='#e8ddc8';ctx.fill();ctx.strokeStyle=deep;ctx.lineWidth=.8;ctx.stroke();
       ctx.fillStyle=trim;ctx.fillRect(px-8,286,16,2);
     }
     ctx.fillStyle=brick;ctx.fillRect(x-27,202,54,145);
     for(let band=0;band<3;band++){ctx.fillStyle=trim;ctx.fillRect(x-30,227+band*35,60,4);}
     path(ctx,[[x-31,203],[x-23,183],[x+23,183],[x+31,203]],trim,1.5,brick);
     path(ctx,[[x-22,182],[x-15,164],[x+15,164],[x+22,182]],trim,1.4,brick);
     path(ctx,[[x-13,163],[x,151],[x+13,163]],trim,1.3,brick);
     ellipse(ctx,x,211,14,14,trim,deep,1.5);
     path(ctx,[[x,211],[x,201]],deep,1.1);path(ctx,[[x,211],[x+7,214]],deep,1.1);
     for(const side of [-1,1]){
       const px=x+side*14;ctx.fillStyle=trim;ctx.fillRect(px-4,245,8,16);
     }
     path(ctx,[[x-17,346],[x-17,309],[x,297],[x+17,309],[x+17,346]],trim,1,deep);
     ctx.fillStyle=trim;ctx.fillRect(x-66,264,132,11);
     ctx.fillStyle=deep;ctx.font='bold 8px "DM Sans",sans-serif';ctx.textAlign='center';ctx.fillText('CHENNAI CENTRAL',x,272);
     ctx.fillStyle='#92746a';ctx.fillRect(x-174,347,348,5);
     for(const side of [-1,1]){
       const ax=x+side*101;ellipse(ctx,ax-8,359,4,4,deep,null);ellipse(ctx,ax+9,359,4,4,deep,null);
       path(ctx,[[ax-16,354],[ax-8,345],[ax+9,345],[ax+16,354]],deep,1,'#d8be79');
       ctx.fillStyle='#8b9b80';ctx.fillRect(ax-4,349,8,6);
     }
   }
   ctx.restore();
 }
}
function palm(x,y,scale=1){
 ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
 curve(ctx,0,0,10,-34,4,-83,'#829984',3.1);
 for(let k=-3;k<=3;k++){
   const tip=k*18;
   curve(ctx,4,-83,tip*.55,-103,tip,-81+Math.abs(k)*5,'#8faa87',2.5);
   curve(ctx,4,-83,tip*.65,-94,tip*1.05,-71+Math.abs(k)*5,'#9bb893',1.2);
 }
 ellipse(ctx,4,-81,3,3,'#a88a68',null);
 ctx.restore();
}
function cityHorizon(theme){
 const city=theme.name;
 ctx.save();ctx.globalAlpha=.48;
 for(let i=-1;i<Math.ceil(viewWidth/105)+2;i++){
   const x=i*105-(game.camera*.14%105);
   if(city==='Chennai'){
     const height=27+(i*29+67)%27;
     ctx.fillStyle='#bfaca2';ctx.fillRect(x,335-height,76,height);
     ctx.fillStyle='#dfd5c8';for(let j=0;j<3;j++)ctx.fillRect(x+10+j*21,342-height,8,13);
     path(ctx,[[x-3,335-height],[x+80,335-height]],'#b49d96',1);
     if(i%4===0){ctx.fillStyle='#c9b6a7';ctx.fillRect(x+26,259,10,50);path(ctx,[[x+24,259],[x+31,246],[x+38,259]],'#ae9a8f',1,'#c9b6a7');}
   }else if(city==='Thanjavur'){
     ctx.fillStyle='#d3b99a';ctx.fillRect(x,323,89,27);
     path(ctx,[[x-4,324],[x+18,313],[x+72,313],[x+93,324]],'#bda081',1,'#dfc8a8');
     for(let j=0;j<4;j++)ctx.fillRect(x+10+j*21,327,7,15);
     if(i%4===0)palm(x+103,347,.8);
   }else{
     const height=30+(i*23+89)%51;
     ctx.fillStyle='#b1bfae';ctx.fillRect(x+4,344-height,71,height);
     ctx.fillStyle='#e7eee0';for(let row=0;row<3;row++)for(let col=0;col<3;col++)ctx.fillRect(x+13+col*18,352-height+row*15,8,6);
     ctx.fillStyle='#c9d5bd';ctx.fillRect(x+15,338-height,48,5);
   }
 }
 ctx.restore();
}
function hills(theme){
 const sky=ctx.createLinearGradient(0,0,0,430);
 sky.addColorStop(0,theme.sky);sky.addColorStop(.72,theme.skyBottom);sky.addColorStop(1,theme.hill);
 ctx.fillStyle=sky;ctx.fillRect(0,0,viewWidth,viewHeight);
 const cx=viewWidth*.78-game.camera*.035;
 const glow=ctx.createRadialGradient(cx,92,5,cx,92,105);
 glow.addColorStop(0,'#fff8d591');glow.addColorStop(.45,'#fff2cf35');glow.addColorStop(1,'#fff2cf00');
 ctx.fillStyle=glow;ctx.fillRect(cx-105,0,210,210);
 ellipse(ctx,cx,92,34,34,theme.accent,null);ellipse(ctx,cx,92,40,40,null,theme.accent,.6);
 for(let i=0;i<12;i++){const a=i*Math.PI/6;path(ctx,[[cx+Math.cos(a)*47,92+Math.sin(a)*47],[cx+Math.cos(a)*52,92+Math.sin(a)*52]],theme.accent,.9);}
 for(let i=0;i<7;i++){const x=((i*305+130-game.camera*.16)%(viewWidth+380)+viewWidth+380)%(viewWidth+380)-100;cloud(x,88+(i%3)*29,.65+(i%2)*.2,.78);}
 for(let i=0;i<6;i++){
   const x=((i*249+45-game.camera*.08)%(viewWidth+260)+viewWidth+260)%(viewWidth+260)-80;
   const y=151+i%3*37;
   if(i%2===0){curve(ctx,x-7,y,x,y-5,x+2,y,'#a8aa96',.9);curve(ctx,x+2,y,x+7,y-5,x+12,y,'#a8aa96',.9);}
 }
 for(let layer=0;layer<2;layer++){
   const offset=game.camera*(.10+layer*.09);ctx.beginPath();ctx.moveTo(-100,420);
   const relief=theme.name==='Bangalore'?40:theme.name==='Thanjavur'?25:13;
   for(let x=-100;x<=viewWidth+30;x+=10){const y=335-layer*9+Math.sin((x+offset)/(160-layer*20))*relief+Math.sin((x+offset)/71)*relief*.22;ctx.lineTo(x,y);}
   ctx.lineTo(viewWidth+30,480);ctx.lineTo(-100,480);ctx.closePath();ctx.fillStyle=layer?theme.hill:theme.skyBottom;ctx.globalAlpha=layer?.8:.6;ctx.fill();ctx.globalAlpha=1;
 }
 cityHorizon(theme);
 cityScenery(game.index);
 // Hand-drawn shrubs, paper trees and scattered wind lines in the distance.
 for(let i=0;i<20;i++){const x=i*210-game.camera*.4; if(x<-100||x>viewWidth+100)continue;const y=332+Math.sin(i*4)*18;
   if(theme.name==='Chennai'&&i%3===0)palm(x,y+45,.84);
   else if(theme.name==='Bangalore'&&i%3===0){path(ctx,[[x,y+48],[x+2,y-55]],'#a7b296',1.3);ellipse(ctx,x,y-52,23,33,'#d2dcbf','#bac6a7',1);path(ctx,[[x,y-27],[x-10,y-44],[x,y-34],[x+12,y-54]],'#b2bfa0',1);}
   else if(theme.name==='Thanjavur'&&i%4===0){path(ctx,[[x,y+40],[x,y-13]],'#a99278',2);ellipse(ctx,x,y-16,5,5,'#e7b985','#b69a7d',1);}
   else{curve(ctx,x-25,y+32,x-23,y+5,x,y+18,'#b9c4a7',1);curve(ctx,x,y+18,x+10,y-4,x+22,y+28,'#b9c4a7',1);}
 }
 for(let i=0;i<25;i++){const x=(i*131+17)%viewWidth,y=(i*67+33)%350;path(ctx,[[x,y],[x+2,y-1]],'#a3ab8b',.55);}
}
function platform(p,theme){
 const x=Math.round(p.x-game.camera);if(x+p.w<0||x>viewWidth)return;
 ctx.fillStyle=theme.dirt;ctx.fillRect(x,p.y,p.w,p.h);path(ctx,[[x,p.y+p.h],[x,p.y],[x+p.w,p.y],[x+p.w,p.y+p.h]],'#8c967c',1.2);
 ctx.fillStyle=theme.grass;ctx.fillRect(x,p.y,p.w,p.ground?9:6);
 path(ctx,[[x,p.y],[x+p.w,p.y]],'#71835f',1.5);
 for(let n=8;n<p.w;n+=19){const xx=x+n; if(xx<0||xx>viewWidth)continue;path(ctx,[[xx,p.y+5],[xx+3,p.y+10],[xx+7,p.y+6]],'#8a9b6f',.8);}
 if(p.ground){
   if(theme.name==='Chennai'){
     ctx.fillStyle='#e6ddd0';ctx.fillRect(x,p.y+8,p.w,15);
     path(ctx,[[x,p.y+8],[x+p.w,p.y+8],[x+p.w,p.y+23]],'#b9b5a5',.8);
     for(let n=0;n<p.w;n+=42){const xx=x+n;if(xx<0||xx>viewWidth)continue;path(ctx,[[xx,p.y+9],[xx,p.y+22]],'#c5c0b2',.7);}
   }else if(theme.name==='Thanjavur'){
     ctx.fillStyle='#d6bba0';ctx.fillRect(x,p.y+8,p.w,11);
     for(let n=0;n<p.w;n+=52){const xx=x+n;if(xx<0||xx>viewWidth)continue;path(ctx,[[xx,p.y+8],[xx+10,p.y+18]],'#baa184',.65);}
   }
   for(let n=12;n<p.w;n+=30){const xx=x+n;if(xx<0||xx>viewWidth)continue;const yy=p.y+24+(n*3%43);path(ctx,[[xx,yy],[xx+4,yy+2]],'#c0b69d',.8);if(n%90===12)path(ctx,[[xx+10,yy+15],[xx+13,yy+20]],'#c0b69d',.8);}
   if(theme.name==='Bangalore')for(let n=45;n<p.w;n+=93){const xx=x+n;const h=8+Math.sin(n)*3;path(ctx,[[xx-5,p.y-2],[xx-3,p.y-h],[xx,p.y-2],[xx+3,p.y-h-3],[xx+5,p.y-2]],'#8f9f70',1.2);if(n%3===0){path(ctx,[[xx+18,p.y-1],[xx+17,p.y-13]],'#91a079',1);ellipse(ctx,xx+17,p.y-14,3,3,'#dfc282',null);}}
 }else{for(let n=10;n<p.w;n+=17)path(ctx,[[x+n,p.y+11],[x+n+4,p.y+15]],'#c2b397',.7);}
}
function flag(x,y,active,finish=false){const xx=x-game.camera;path(ctx,[[xx,y],[xx,y-(finish?133:81)]],'#818a70',2);path(ctx,[[xx,y-(finish?131:79)],[xx+(finish?61:33),y-(finish?121:73)],[xx+2,y-(finish?100:53)]],active?'#638164':'#b09b73',1,active?'#a0b68b':'#dcc591');ellipse(ctx,xx,y-(finish?135:83),3,3,'#c6b481');if(finish){ctx.font='bold 13px "Space Grotesk",sans-serif';ctx.fillStyle='#526d52';ctx.fillText(WORLDS[game.index].year,xx+9,y-111);ctx.font='9px "DM Sans",sans-serif';ctx.fillStyle='#748269';ctx.fillText(WORLDS[game.index].name.toUpperCase(),xx-20,y+25);star(ctx,xx+65,y-141,6,'#f1e5ad');}}
function draw(){
 ctx.clearRect(0,0,viewWidth,viewHeight);const theme=WORLDS[game.index];hills(theme);
 for(const p of game.level.platforms)platform(p,theme);
 flag(game.level.checkpoint.x,397,game.level.checkpoint.active);flag(game.level.finish+35,397,true,true);
 const welcomeX=200-game.camera;path(ctx,[[welcomeX,397],[welcomeX,350]],'#9a967e',2);path(ctx,[[welcomeX-35,338],[welcomeX+37,338],[welcomeX+43,350],[welcomeX+36,363],[welcomeX-35,363]],'#9b967c',1.1,'#e8ddbf');ctx.fillStyle='#81866c';ctx.font='8px "DM Sans", sans-serif';ctx.fillText(`${theme.name.toUpperCase()} →`,welcomeX-26,354);
 for(const s of game.level.stars){if(s.taken||s.x-game.camera<-20||s.x-game.camera>viewWidth)continue;star(ctx,s.x+9-game.camera,s.y+9+Math.sin(visualTime*2+s.x)*3,9);}
 for(const h of game.level.hearts)if(!h.taken)heart(ctx,h.x+11-game.camera,h.y+14+Math.sin(visualTime*3)*3,12);
 for(const e of game.level.enemies)if(e.alive&&e.x-game.camera>-80&&e.x-game.camera<viewWidth+80){ellipse(ctx,e.x+19-game.camera,398,18,3,'#72806020',null);character(ctx,e.kind,e.x+19-game.camera,e.y+29+Math.sin(e.phase)*1.5,.68,e.vx>0?1:-1,visualTime,true);}
 for(const b of game.bullets){ellipse(ctx,b.x+7-game.camera,b.y+4,10,5,'#f2de90','#bba264',1);path(ctx,[[b.x-game.camera-(b.vx>0?10:-23),b.y+4],[b.x-game.camera-(b.vx>0?2:-16),b.y+4]],'#d1b574',2);}
 for(const b of game.enemyBullets)star(ctx,b.x-game.camera,b.y,7,'#c29184',visualTime*3);
 const p=game.player;ellipse(ctx,p.x+19-game.camera,Math.min(p.y+50,399),19,3,'#72806020',null);
 if(!(p.invincible>0&&Math.floor(visualTime*13)%2)){character(ctx,'naresh',p.x+19-game.camera,p.y+31,.73,p.facing,visualTime,Math.abs(p.vx)>30&&p.grounded);}
 for(const q of game.particles){ctx.globalAlpha=Math.max(0,q.life/q.max);ellipse(ctx,q.x-game.camera,q.y,2.5,2.5,q.color,null);ctx.globalAlpha=1;}
 // Subtle paper fibers stay fixed to the page instead of the camera.
 ctx.globalAlpha=.06;for(let i=0;i<180;i++){const x=(i*137.3)%viewWidth,y=(i*83.7)%viewHeight;path(ctx,[[x,y],[x+2,y+.4]],'#677556',.6);}ctx.globalAlpha=1;
}
function resize(){const rect=canvas.getBoundingClientRect();viewWidth=480*rect.width/rect.height;viewHeight=480;const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);ctx.setTransform(canvas.width/viewWidth,0,0,canvas.height/480,0,0);}
function unlockAudio(){if(!sound)return;try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;audioContext??=new Audio();if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});}catch{}}
function tone(type){if(!sound)return;try{unlockAudio();if(!audioContext)return;const o=audioContext.createOscillator(),g=audioContext.createGain();const now=audioContext.currentTime;const notes={start:[390,585],jump:[260,520],shoot:[640,210],star:[880,1320],enemy:[200,65],hurt:[140,65],win:[520,1040],heart:[700,950],checkpoint:[550,830]};const f=notes[type]||[440,660];o.type=type==='shoot'?'triangle':'sine';o.frequency.setValueAtTime(f[0],now);o.frequency.exponentialRampToValueAtTime(f[1],now+.13);g.gain.setValueAtTime(.06,now);g.gain.exponentialRampToValueAtTime(.001,now+.2);o.connect(g);g.connect(audioContext.destination);o.start();o.stop(now+.22);}catch{}}
function syncMusic(){if(sound&&game.status==='playing'&&!document.hidden){unlockAudio();music.start();}else music.stop();}
function toast(message){$('toast').textContent=message;$('toast').classList.add('visible');toastUntil=performance.now()+2400;}
function sync(){
 $('score').textContent=String(game.score).padStart(2,'0');$('star-total').textContent=`/ ${game.level.stars.length}`;
 $('hearts').textContent='♥ '.repeat(game.player.health)+'♡ '.repeat(3-game.player.health);$('hearts').setAttribute('aria-label',`${game.player.health} hearts`);
 $('progress-fill').style.width=`${Math.max(0,Math.min(100,game.player.x/game.level.finish*100))}%`;
 $('pause-button').disabled=game.status==='ready'||game.status==='won'||game.status==='lost';
 $('pause-button').textContent=game.status==='paused'?'▷':'Ⅱ';$('pause-button').setAttribute('aria-label',game.status==='paused'?'Resume game':'Pause game');
 if(previousStatus===game.status)return;previousStatus=game.status;syncMusic();
 $('level-label').textContent=`LEVEL 0${game.index+1} · ${WORLDS[game.index].year}`;$('world-title').textContent=WORLDS[game.index].name;$('level-badge').innerHTML=`${WORLDS[game.index].year} <span>· 0${game.index+1}/03</span>`;
 $('overlay').classList.toggle('hidden',game.status==='playing');
 const states={ready:[`LEVEL 0${game.index+1} · ${WORLDS[game.index].name.toUpperCase()} · ${WORLDS[game.index].year}`,'A little courage.<br>A little <em>pew pew.</em>',`Reach the ${WORLDS[game.index].year} flag to finish this chapter.`,'Let’s play','PRESS ENTER TO START'],paused:['TAKE A LITTLE BREATHER','A pause in<br>the <em>adventure.</em>','Your paper world will be right here.','Keep going','PRESS P OR ENTER TO RESUME'],lost:['EVERY HERO GETS ANOTHER CHANCE','One more<br><em>little adventure?</em>',`You found ${game.score} stars. Let’s give it another go.`,'Try again','PRESS ENTER TO RESTART'],won:[`${WORLDS[game.index].name.toUpperCase()} · ${WORLDS[game.index].year} COMPLETE`,game.index===2?'A small hero.<br>A <em>big victory.</em>':'A new page.<br>A <em>new adventure.</em>',game.index===2?`All three cities complete! ${game.totalScore+game.score} / 108 stars collected.`:`${game.score} / 36 stars collected. Next stop: ${WORLDS[game.index+1].name}, ${WORLDS[game.index+1].year}.`,game.index===2?'Play again':'Next city','PRESS ENTER TO CONTINUE']};
 if(states[game.status]){const [eyebrow,title,copy,button,hint]=states[game.status];$('overlay-eyebrow').textContent=eyebrow;$('overlay-title').innerHTML=title;$('overlay-copy').textContent=copy;$('play-button').innerHTML=`${button} <span>→</span>`;$('overlay-hint').textContent=hint;}
 $('scene-label').textContent=game.status==='playing'?'MAKE A LITTLE MAGIC':game.status==='ready'?'A NEW ADVENTURE AWAITS':game.status==='won'?'LOOK AT YOU GO, LITTLE HERO':'YOUR ADVENTURE, YOUR PACE';
}
function clearInput(){Object.keys(input).forEach(k=>input[k]=false);document.querySelectorAll('.touch-controls .pressed').forEach(button=>button.classList.remove('pressed'));}
function primary(){const newChapter=game.status!=='paused';unlockAudio();clearInput();if(game.status==='won')game.next();else if(game.status==='lost')game.restart();else game.start();previousStatus='';sync();if(newChapter)tone('start');canvas.focus({preventScroll:true});if(window.matchMedia('(max-width:620px)').matches)document.querySelector('.game-shell').scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});}
function pause(){if(game.status==='playing'){game.status='paused';clearInput();}else if(game.status==='paused'){unlockAudio();game.start();}sync();}
const keys={ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right',Space:'jump',ArrowUp:'jump',KeyW:'jump',KeyX:'shoot',KeyJ:'shoot'};
window.addEventListener('keydown',e=>{if($('help-dialog').open)return;if(keys[e.code]){e.preventDefault();unlockAudio();input[keys[e.code]]=true;}if(e.repeat)return;if(e.code==='Enter'&&e.target.tagName!=='BUTTON'&&game.status!=='playing'){e.preventDefault();primary();}if(e.code==='KeyP'||e.code==='Escape')pause();if(e.code==='KeyR'&&game.status!=='ready'){unlockAudio();game.restart();previousStatus='';sync();}});
window.addEventListener('keyup',e=>{if(keys[e.code]){e.preventDefault();input[keys[e.code]]=false;}});
window.addEventListener('blur',()=>{clearInput();if(game.status==='playing'){game.status='paused';sync();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&game.status==='playing'){clearInput();game.status='paused';sync();}});
for(const button of document.querySelectorAll('[data-control]')){button.addEventListener('pointerdown',e=>{e.preventDefault();unlockAudio();button.setPointerCapture(e.pointerId);button.classList.add('pressed');input[button.dataset.control]=true;});for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>{input[button.dataset.control]=false;button.classList.remove('pressed');});}
$('play-button').addEventListener('click',primary);$('pause-button').addEventListener('click',pause);$('restart-button').addEventListener('click',()=>{unlockAudio();clearInput();game.restart();previousStatus='';sync();canvas.focus({preventScroll:true});});
$('sound-button').addEventListener('click',()=>{sound=!sound;$('sound-button').innerHTML=`<span id="sound-icon">♪</span> Sound ${sound?'on':'off'}`;$('sound-button').setAttribute('aria-pressed',String(sound));if(sound){unlockAudio();tone('star');}syncMusic();});
$('how-button').addEventListener('click',()=>{helpWasPlaying=game.status==='playing';if(helpWasPlaying)pause();$('help-dialog').showModal();});
function closeHelp(){$('help-dialog').close();}
$('close-help').addEventListener('click',closeHelp);$('got-it').addEventListener('click',closeHelp);$('help-dialog').addEventListener('close',()=>{clearInput();if(helpWasPlaying){game.start();sync();}canvas.focus({preventScroll:true});});
window.addEventListener('resize',resize);
function drawPortraits(){
 for(const portrait of document.querySelectorAll('.portrait')){
  const c=portrait.getContext('2d');c.clearRect(0,0,portrait.width,portrait.height);
  if(portrait.dataset.character==='naresh'&&nareshSprite.complete&&nareshSprite.naturalWidth){
   c.drawImage(nareshSprite,260,10,520,670,12,0,136,150);
  }else if(portrait.dataset.character==='aravind'&&aravindSprite.complete&&aravindSprite.naturalWidth){
   c.drawImage(aravindSprite,0,0,aravindSprite.naturalWidth,aravindSprite.naturalHeight,30,0,100,150);
  }else if(portrait.dataset.character==='vimal'&&vimalSprite.complete&&vimalSprite.naturalWidth){
   c.drawImage(vimalSprite,245,20,550,650,12,0,136,150);
  }else if(portrait.dataset.character==='mani'&&maniSprite.complete&&maniSprite.naturalWidth){
   c.drawImage(maniSprite,255,20,520,650,12,0,136,150);
  }else character(c,portrait.dataset.character,80,97,1.55,1,0,false);
 }
}
aravindSprite.addEventListener('load',drawPortraits);
nareshSprite.addEventListener('load',drawPortraits);
vimalSprite.addEventListener('load',drawPortraits);
maniSprite.addEventListener('load',drawPortraits);
drawPortraits();
resize();sync();
function frame(now){const dt=Math.min((now-last)/1000||0,1/30);last=now;visualTime+=dt;game.update(dt,input,viewWidth);for(const event of game.events){tone(event);if(event==='checkpoint')toast('Checkpoint! A little progress, safely saved.');if(event==='heart')toast('A little love. One heart restored.');}game.events=[];if(now>toastUntil)$('toast').classList.remove('visible');draw();sync();requestAnimationFrame(frame);}
requestAnimationFrame(frame);
