export const WORLDS = [
  { name: 'Chennai', year: '2024', sky: '#e8eff0', skyBottom: '#f8e7d7', hill: '#cbdad6', grass: '#97aaa0', dirt: '#d8cfc1', accent: '#e1b67c' },
  { name: 'Thanjavur', year: '2025', sky: '#f3e8dd', skyBottom: '#f7d9bd', hill: '#e9d7bc', grass: '#b3ab7d', dirt: '#e2cbb4', accent: '#d99076' },
  { name: 'Bangalore', year: '2026', sky: '#edf0e3', skyBottom: '#e1eacb', hill: '#d9e1c6', grass: '#9ead7c', dirt: '#e7dcc5', accent: '#dcb478' },
];
export const overlaps = (a, b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
export function createLevel(index = 0) {
  const platforms = [], stars = [], enemies = [], hearts = [];
  const gaps = [[930, 1040], [1800, 1940], [2750, 2900], [3750, 3910]];
  let start = 0;
  for (const [a, b] of gaps) { platforms.push({ x: start, y: 397, w: a - start, h: 180, ground: true }); start = b; }
  platforms.push({ x: start, y: 397, w: 5000 - start, h: 180, ground: true });
  const ledges = [[330,305,155],[600,240,135],[855,293,135],[1110,310,155],[1380,254,150],[1650,296,140],[1800,228,150],[2020,308,140],[2260,251,170],[2600,300,165],[2770,224,130],[3020,300,160],[3290,246,150],[3570,305,130],[3770,239,120],[4000,307,130],[4260,250,150],[4530,310,155]];
  for (const [x, y, w] of ledges) platforms.push({ x, y: y - (index === 2 ? 8 : 0), w, h: 22, ground: false });
  for (const p of platforms.filter(p => !p.ground)) for (let i = 0; i < 2; i++) stars.push({ x:p.x+35+i*54, y:p.y-37, w:18, h:18, taken:false });
  const spawns = [570,1190,1480,2110,2460,3100,3410,4050,4440];
  spawns.forEach((x,i) => enemies.push({ x, y:351, w:38, h:46, vx: (i%2 ? -1 : 1)*(39+index*13), left:x-90, right:x+95, kind:['mani','aravind','vimal'][i%3], alive:true, phase:i*2, shotTimer:2+i*.3 }));
  hearts.push({x:2320,y:211,w:23,h:23,taken:false});
  return { platforms, stars, enemies, hearts, width:5000, finish:4800, checkpoint:{x:2470,y:397,active:false} };
}
export class Game {
  constructor(){this.totalScore=0;this.status='ready';this.load(0);}
  load(index){this.index=index;this.level=createLevel(index);this.player={x:95,y:340,w:38,h:49,vx:0,vy:0,facing:1,grounded:false,health:3,invincible:0,coyote:0,jumpBuffer:0};this.bullets=[];this.enemyBullets=[];this.particles=[];this.camera=0;this.score=0;this.time=0;this.cooldown=0;this.previousJump=false;this.events=[];this.spawn={x:95,y:340};}
  start(){this.status='playing';}
  restart(){this.load(this.index);this.start();}
  next(){this.totalScore+=this.score;if(this.index<2){this.load(this.index+1);this.start();}else{this.totalScore=0;this.load(0);this.start();}}
  event(type){this.events.push(type);}
  burst(x,y,color,count=10){for(let i=0;i<count;i++){const angle=i/count*Math.PI*2;this.particles.push({x,y,vx:Math.cos(angle)*(35+i*7),vy:Math.sin(angle)*85-25,life:.6,max:.6,color});}}
  hurt(fall=false){const p=this.player;if(p.invincible>0&&!fall)return;p.health--;this.event('hurt');this.burst(p.x+19,p.y+25,'#d18b76');if(p.health<=0){p.health=0;this.status='lost';return;}p.invincible=1.8;if(fall){p.x=this.spawn.x;p.y=this.spawn.y;p.vx=0;p.vy=0;this.camera=Math.max(0,p.x-160);this.enemyBullets=[];}else{p.vy=-245;p.vx=-p.facing*180;}}
  update(dt,input={},viewWidth=1200){
    if(this.status!=='playing')return;
    dt=Math.min(dt,1/30);this.time+=dt;const p=this.player,l=this.level;
    p.invincible=Math.max(0,p.invincible-dt);this.cooldown=Math.max(0,this.cooldown-dt);
    p.coyote=p.grounded?.11:Math.max(0,p.coyote-dt);
    if(input.jump&&!this.previousJump)p.jumpBuffer=.13;else p.jumpBuffer=Math.max(0,p.jumpBuffer-dt);
    this.previousJump=!!input.jump;
    const direction=(input.right?1:0)-(input.left?1:0);
    const target=direction*245;
    p.vx+=(target-p.vx)*Math.min(1,dt*(p.grounded?15:9));if(direction)p.facing=direction;
    if(p.jumpBuffer>0&&p.coyote>0){p.vy=-535;p.grounded=false;p.coyote=0;p.jumpBuffer=0;this.event('jump');}
    if(!input.jump&&p.vy<-190)p.vy+=1600*dt;
    p.vy=Math.min(800,p.vy+1330*dt);
    p.x+=p.vx*dt;
    p.x=Math.max(8,Math.min(l.width-p.w,p.x));
    const oldBottom=p.y+p.h;p.y+=p.vy*dt;p.grounded=false;
    for(const platform of l.platforms){if(p.vy>=0&&p.x+p.w>platform.x&&p.x<platform.x+platform.w&&oldBottom<=platform.y+1&&p.y+p.h>=platform.y){p.y=platform.y-p.h;p.vy=0;p.grounded=true;}}
    if(p.y>570){this.hurt(true);if(this.status!=='playing')return;}
    if(input.shoot&&this.cooldown<=0){this.bullets.push({x:p.x+(p.facing>0?34:-8),y:p.y+25,w:15,h:9,vx:p.facing*580,life:1.2});this.cooldown=.25;this.event('shoot');}
    for(const b of this.bullets){b.x+=b.vx*dt;b.life-=dt;for(const e of l.enemies){if(e.alive&&b.life>0&&overlaps(b,e)){e.alive=false;b.life=0;this.burst(e.x+19,e.y+20,'#c59d70',13);this.event('enemy');}}}
    this.bullets=this.bullets.filter(b=>b.life>0);
    for(const e of l.enemies){if(!e.alive)continue;e.x+=e.vx*dt;e.phase+=dt*5;if(e.x<e.left||e.x>e.right)e.vx*=-1;
      if(this.index>0&&e.kind==='aravind'&&Math.abs(e.x-p.x)<650){e.shotTimer-=dt;if(e.shotTimer<=0){this.enemyBullets.push({x:e.x+18,y:e.y+22,w:12,h:12,vx:Math.sign(p.x-e.x)*155,life:3.5});e.shotTimer=2.5;}}
      if(overlaps(p,e)){if(p.vy>90&&oldBottom<e.y+17){e.alive=false;p.vy=-355;this.burst(e.x+19,e.y+20,'#c59d70');this.event('enemy');}else this.hurt();}
    }
    for(const b of this.enemyBullets){b.x+=b.vx*dt;b.life-=dt;if(overlaps(p,b)){this.hurt();b.life=0;}}this.enemyBullets=this.enemyBullets.filter(b=>b.life>0);
    for(const s of l.stars){if(!s.taken&&overlaps(p,s)){s.taken=true;this.score++;this.event('star');this.burst(s.x+9,s.y+9,'#d6b166',6);}}
    for(const h of l.hearts){if(!h.taken&&p.health<3&&overlaps(p,h)){h.taken=true;p.health++;this.event('heart');this.burst(h.x,h.y,'#d9908e');}}
    if(!l.checkpoint.active&&p.x>l.checkpoint.x&&p.grounded){l.checkpoint.active=true;this.spawn={x:l.checkpoint.x+35,y:340};this.event('checkpoint');}
    if(p.x>l.finish){this.status='won';this.event('win');}
    for(const q of this.particles){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vy+=180*dt;q.life-=dt;}this.particles=this.particles.filter(q=>q.life>0);
    const desired=Math.max(0,Math.min(l.width-viewWidth,p.x-viewWidth*.3));this.camera+=(desired-this.camera)*Math.min(1,dt*6);
  }
}
