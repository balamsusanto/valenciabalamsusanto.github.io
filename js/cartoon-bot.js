/* ===== CartoonBot: expressive robot ===== */
window.CartoonBot = (() => {
  const W = 48, C = { out:'#26364a', head:'#d9f4f8', headSh:'#a9dbe6', face:'#26364a', ear:'#e2553f', earHi:'#ff8a6b',
    body:'#4fb9d6', bodySh:'#2f8fb0', belly:'#a9e3ef', claw:'#e2553f', shoe:'#26364a', blush:'#f3a0a8',
    ink:'#26364a', spark:'#ffd166', heart:'#e2553f', smoke:'#9aa3b5', wave:'#4fb9d6', bubble:'#ffffff' };
  function bot(r, o) {
    const X = o.dx||0, Y = o.dy||0, R = (x,y,w,h,c)=>r(X+x,Y+y,w,h,c), f = o.f||0;
    const ew = o.ears||0;
    // ears
    R(12,6-ew,5,4,C.out); R(13,7-ew,3,3,C.ear); R(13,7-ew,1,1,C.earHi);
    R(31,6+ew,5,4,C.out); R(32,7+ew,3,3,C.ear); R(32,7+ew,1,1,C.earHi);
    // legs
    R(18,36,4,3,C.out); R(19,36,2,2,C.bodySh); R(26,36,4,3,C.out); R(27,36,2,2,C.bodySh);
    R(17,39,6,2,C.shoe); R(25,39,6,2,C.shoe);
    // body
    R(15,26,18,11,C.out); R(16,27,16,9,C.body); R(19,28,10,6,C.belly); R(16,35,16,1,C.bodySh);
    const lt = (f%4<2)?C.ear:C.spark; R(23,29,2,2,o.light||lt);
    // arms
    armB(R,'L',o.armL||'down',f); armB(R,'R',o.armR||'down',f);
    // head
    R(10,9,28,17,C.out); R(9,11,30,13,C.out);
    R(11,10,26,15,C.head); R(10,12,28,11,C.head); R(11,23,26,2,C.headSh);
    // face
    face(R, o.eyes||'open', o.mouth||'smile', f);
    if (o.blush) { R(13,19,3,1,C.blush); R(32,19,3,1,C.blush); }
  }
  function armB(R, side, pose, f) {
    const L = side==='L', x = L ? 11 : 33;
    if (pose==='down') { R(x,27,4,8,C.out); R(x+1,28,2,6,C.body); R(x,34,4,2,C.claw); }
    else if (pose==='up') { R(x+(L?-1:1),17,4,10,C.out); R(x+(L?0:2),18,2,8,C.body); R(x+(L?-1:1),15,4,2,C.claw); }
    else if (pose==='wave') { const w=f%2; R(x+1,18,4,9,C.out); R(x+2,19,2,7,C.body); R(x+1+w,15,4,3,C.claw); }
    else if (pose==='point') { R(x,27,4,4,C.out); R(x+1,28,2,2,C.body); R(x+(L?-4:3),28,5,3,C.out); R(x+(L?-5:7),28,2,3,C.claw); }
  }
  function face(R, e, m, f) {
    const k = C.face;
    if (e==='open') { R(16,14,3,4,k); R(29,14,3,4,k); R(16,14,1,1,'#fff'); R(29,14,1,1,'#fff'); }
    else if (e==='wide') { R(15,13,5,5,k); R(28,13,5,5,k); R(16,14,2,2,'#fff'); R(29,14,2,2,'#fff'); }
    else if (e==='closed') { R(15,16,5,1,k); R(28,16,5,1,k); }
    else if (e==='happy') { R(15,16,1,1,k); R(16,15,1,1,k); R(17,14,1,1,k); R(18,15,1,1,k); R(19,16,1,1,k);
                           R(28,16,1,1,k); R(29,15,1,1,k); R(30,14,1,1,k); R(31,15,1,1,k); R(32,16,1,1,k); }
    else if (e==='x') { [[0,0],[1,1],[2,2],[3,3],[0,3],[1,2],[2,1],[3,0]].forEach(([a,b])=>{R(15+a,13+b,1,1,k); R(28+a,13+b,1,1,k);}); }
    else if (e==='spin') { const ring=[[1,0],[2,0],[3,1],[3,2],[2,3],[1,3],[0,2],[0,1]];
      ring.forEach(([a,b],i)=>{ const on = (i - f%8 + 8)%8 < 3; R(15+a,13+b,1,1,on?k:C.headSh); R(28+a,13+b,1,1,on?k:C.headSh); }); }
    else if (e==='heart') { [[16,14],[18,14],[29,14],[31,14]].forEach(([x,y])=>R(x,y,2,1,C.heart));
      R(15,15,6,2,C.heart); R(28,15,6,2,C.heart); R(16,17,4,1,C.heart); R(29,17,4,1,C.heart); R(17,18,2,1,C.heart); R(30,18,2,1,C.heart); }
    else if (e==='side') { R(17+(f%4<2?0:1),14,3,4,k); R(30+(f%4<2?0:1),14,3,4,k); }
    else if (e==='laugh') { [[0,0],[1,1],[2,2],[1,3],[0,4]].forEach(([a,b])=>{R(16+a,13+b,1,1,k); R(32-a,13+b,1,1,k);}); }
    else if (e==='scared') { R(15,12,5,6,k); R(28,12,5,6,k); R(16,13,3,4,'#fff'); R(29,13,3,4,'#fff'); R(17+(f%2),14,1,2,k); R(30+(f%2),14,1,2,k); }
    if (m==='smile') { R(22,20,4,1,k); R(21,19,1,1,k); R(26,19,1,1,k); }
    else if (m==='open') { R(21,19,6,3,k); R(22,21,4,1,C.ear); }
    else if (m==='talk') { if (f%2) R(21,19,6,3,k); else R(21,20,6,1,k); }
    else if (m==='flat') { R(21,20,6,1,k); }
    else if (m==='laugh') { R(20,19,8,1,k); R(20,20,8,3,k); R(21,20,6,1,'#fff'); R(22,22,4,1,C.ear); }
    else if (m==='wobble') { R(21,20,6,2,k); [[21,20],[23,21],[25,20]].forEach(([x,y])=>R(x,y,1,1,'#fff')); }
    else if (m==='o') { R(23,19,2,2,k); }
    else if (m==='zig') { [[20,20],[21,19],[22,20],[23,19],[24,20],[25,19],[26,20],[27,19]].forEach(([x,y])=>R(x,y,1,1,k)); }
  }
  function extra(r, kind, f) {
    if (kind==='waves') { const n=f%3; for(let i=0;i<=n;i++){ r(40+i*2,13-i,1,6+i*2,C.wave); r(7-i*2,13-i,1,6+i*2,C.wave);} }
    else if (kind==='spark') [[3,6],[42,4],[43,26],[2,28]].forEach(([x,y],i)=>{ if((f+i)%2) return; r(x+1,y,1,3,C.spark); r(x,y+1,3,1,C.spark); });
    else if (kind==='smoke') { const y=(f%3); [[20,4-y],[25,2-y],[29,4-y]].forEach(([x,yy])=>{ if(yy<0) return; r(x,yy,3,2,C.smoke);}); }
    else if (kind==='z') [[38,8],[41,4],[44,0]].forEach(([x,y],i)=>{ if ((f%4) < i) return; r(x,y,3,1,C.ink); r(x+1,y+1,1,1,C.ink); r(x,y+2,3,1,C.ink); });
    else if (kind==='haha') { const y=f%2; [[3,5+y],[40,3-y]].forEach(([x,yy])=>{ r(x,yy,1,3,C.ink); r(x+2,yy,1,3,C.ink); r(x+1,yy+1,1,1,C.ink); r(x+4,yy,1,3,C.ink); r(x+6,yy,1,3,C.ink); r(x+5,yy+1,1,1,C.ink);}); r(8,16,1,2,'#7fd3ea'); r(39,16,1,2,'#7fd3ea'); }
    else if (kind==='sweat') { const y=f%3; r(40,9+y,2,3,'#7fd3ea'); r(40,9+y,1,1,'#fff'); r(5,24,1,1,C.ink); r(43,24,1,1,C.ink); r(4,21,1,1,C.ink); r(44,21,1,1,C.ink); }
    else if (kind==='bulb') { r(40,1,5,5,C.out); r(41,2,3,3,f%2?C.spark:'#fff3c4'); r(41,6,3,2,C.smoke); }
  }
  const STATES = {
    idle:       {fps:4, desc:'Blinks and wiggles its ears', fn:f=>({eyes:f%10===0?'closed':'open', ears:f%4<2?0:1, dy:f%4<2?0:1})},
    listening:  {fps:4, desc:'Hearing your message', fn:f=>({eyes:'wide', mouth:'o', ears:1, overlay:'waves'})},
    processing: {fps:8, desc:'Working on the answer', fn:f=>({eyes:'spin', mouth:'flat', light:f%2?'#ffd166':'#4fb9d6'})},
    talking:    {fps:5, desc:'Replying to you', fn:f=>({eyes:'open', mouth:'talk', dy:f%2})},
    happy:      {fps:5, desc:'Proud of its answer', fn:f=>({eyes:'happy', mouth:'open', dy:f%2?-2:0, blush:true, overlay:'spark', ears:f%2?1:-1})},
    love:       {fps:4, desc:'Thanks for the kind words', fn:f=>({eyes:'heart', mouth:'smile', blush:true, dy:f%2})},
    idea:       {fps:4, desc:'Has a bright idea', fn:f=>({eyes:'side', mouth:'smile', overlay:'bulb'})},
    error:      {fps:4, desc:'Something broke', fn:f=>({eyes:'x', mouth:'zig', overlay:'smoke', dx:f%2, light:'#e2553f'})},
    laugh:      {fps:6, desc:'Something was funny', fn:f=>({eyes:'laugh', mouth:'laugh', blush:true, dy:f%2?-1:1, ears:f%2?1:-1, overlay:'haha'})},
    scared:     {fps:10, desc:'Startled or worried', fn:f=>({eyes:'scared', mouth:'wobble', dx:f%2?1:-1, ears:-1, light:'#e2553f', overlay:'sweat'})},
    sleepy:     {fps:2, desc:'Standby mode', fn:f=>({eyes:'closed', mouth:'flat', overlay:'z', dy:f%2, light:'#2f8fb0'})},
  };
  function mount(canvas, state='idle') {
    const ctx = canvas.getContext('2d'), s = canvas.width/W;
    const r = (x,y,w,h,c)=>{ ctx.fillStyle=c; ctx.fillRect(x*s,y*s,w*s,h*s); };
    let cur=state, f=0, last=0, raf; const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    function frame(t){ const st=STATES[cur];
      if (t-last > 1000/st.fps || !last) { last=t; ctx.clearRect(0,0,canvas.width,canvas.height);
        const o = st.fn(reduce?1:f); o.f = reduce?1:f; r(12,42,24,2,'rgba(40,60,80,.18)'); bot(r,o); if(o.overlay) extra(r,o.overlay,o.f); f++; }
      raf=requestAnimationFrame(frame); }
    raf=requestAnimationFrame(frame);
    return { setState(n){ if(STATES[n]){cur=n;f=0;last=0;} }, get state(){return cur}, stop(){cancelAnimationFrame(raf)} };
  }
  return { mount, states: STATES };
})();

export const CartoonBot = window.CartoonBot;
