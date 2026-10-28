'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const context={window:{}};
vm.runInNewContext(fs.readFileSync('js/motion.js','utf8'),context);
const spring=context.window.PortfolioMotion.spring;
for(const [stiffness,damping] of [[360,34],[600,44],[460,38]])for(const fps of [30,60,120]){
  const axis=spring(0,stiffness,damping);let peak=0;
  for(let i=0;i<fps;i++){const value=axis.step(100,1/fps);assert(Number.isFinite(value));peak=Math.max(peak,value);}
  assert(Math.abs(axis.value-100)<.05,`Spring does not settle at ${fps}Hz`);
  assert(peak<105,`Excessive overshoot at ${fps}Hz`);
  for(let i=0;i<fps;i++)axis.step(0,1/fps);
  assert(Math.abs(axis.value)<.05,`Spring does not return to rest at ${fps}Hz`);
}
const axis=spring();for(let i=0;i<6;i++)axis.step(100,1/60);
const before=axis.value,velocity=axis.velocity;
assert(velocity>0&&before>0&&before<100);
axis.step(-50,1/120);
assert(Math.abs(axis.value-before)<10,'Retargeting must preserve position continuity');
for(let i=0;i<180;i++)axis.step(-50,1/120);
assert(Math.abs(axis.value+50)<.05,'Retargeted spring must settle');
axis.snap(42);assert.equal(axis.value,42);assert.equal(axis.velocity,0);
axis.step(50,5);assert(Number.isFinite(axis.value),'A delayed frame must remain stable');
console.log('Motion checked: preview/control springs at 30/60/120Hz, return to rest, bounded overshoot, continuous retargeting and frame stalls.');
