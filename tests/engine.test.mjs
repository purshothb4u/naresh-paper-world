import test from 'node:test';
import assert from 'node:assert/strict';
import { Game, createLevel, WORLDS } from '../engine.js';
const step=(g,n,input={})=>{for(let i=0;i<n;i++)g.update(1/60,input);};
test('three worlds have 36 stars each and safe checkpoint ground',()=>{for(let i=0;i<3;i++){const l=createLevel(i);assert.equal(l.stars.length,36);assert(l.platforms.some(p=>p.ground&&p.x<l.checkpoint.x&&p.x+p.w>l.checkpoint.x));}});
test('city chapters and destination years follow the requested order',()=>{assert.deepEqual(WORLDS.map(({name,year})=>[name,year]),[['Chennai','2024'],['Thanjavur','2025'],['Bangalore','2026']]);});
test('movement, landing, jumping and pause',()=>{const g=new Game();g.start();step(g,60);assert.equal(g.player.y,348);assert(g.player.grounded);step(g,20,{right:true});assert(g.player.x>145);step(g,5,{jump:true});assert(g.player.y<320);g.status='paused';const x=g.player.x;step(g,60,{right:true});assert.equal(g.player.x,x);});
test('shooting destroys an enemy',()=>{const g=new Game();g.start();g.player.x=430;g.player.y=348;g.level.enemies[0].vx=0;step(g,40,{shoot:true});assert.equal(g.level.enemies[0].alive,false);});
test('fall consumes one heart and returns to checkpoint',()=>{const g=new Game();g.start();g.spawn={x:2505,y:340};g.player.y=600;g.update(1/60);assert.equal(g.player.health,2);assert.equal(g.player.x,2505);assert.equal(g.player.y,340);});
test('stars collect once and health respects invulnerability',()=>{const g=new Game();g.start();const s=g.level.stars[0];g.player.x=s.x;g.player.y=s.y;g.update(1/60);assert.equal(g.score,1);g.update(1/60);assert.equal(g.score,1);g.hurt();g.hurt();assert.equal(g.player.health,2);});
test('losing, restart, world progression and complete replay',()=>{const g=new Game();g.start();g.player.health=1;g.hurt();assert.equal(g.status,'lost');g.restart();assert.equal(g.player.health,3);for(let i=0;i<3;i++){g.score=9;g.player.x=g.level.finish+1;g.update(1/60);assert.equal(g.status,'won');g.next();}assert.equal(g.index,0);assert.equal(g.totalScore,0);assert.equal(g.status,'playing');});
test('stomping an enemy bounces the hero without damage',()=>{const g=new Game();g.start();const e=g.level.enemies[0];e.vx=0;g.player.x=e.x;g.player.y=e.y-g.player.h-1;g.player.vy=190;g.update(1/60);assert.equal(e.alive,false);assert(g.player.vy<0);assert.equal(g.player.health,3);});
test('every world can be traversed with normal movement, shooting and edge jumps',()=>{
  for(let level=0;level<3;level++){
    const g=new Game();g.load(level);g.start();let hold=0;
    for(let frame=0;frame<3600&&g.status==='playing';frame++){
      const p=g.player;
      const ground=g.level.platforms.find(t=>t.ground&&p.x+p.w>t.x&&p.x<t.x+t.w);
      if(p.grounded&&ground&&ground.x+ground.w<4800&&ground.x+ground.w-(p.x+p.w)<18)hold=50;
      g.update(1/60,{right:true,shoot:true,jump:hold>0});hold--;
    }
    assert.equal(g.status,'won',`World ${level+1} must be completable`);
    assert.equal(g.player.health,3);
    assert(g.level.checkpoint.active);
  }
});
