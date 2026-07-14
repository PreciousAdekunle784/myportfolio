document.addEventListener("DOMContentLoaded",()=>{
/* ── INTAKE MODAL ─────────────────────────────── */
const overlay=document.getElementById('intake-overlay');
const progressBar=document.getElementById('intake-progress');
const closeBtn=document.getElementById('intake-close');
const steps={email:0,1:20,2:40,3:60,4:80,done:100};
function showStep(id){
  document.querySelectorAll('.intake-step').forEach(s=>s.classList.remove('active'));
  const target=document.querySelector(`.intake-step[data-step="${id}"]`);
  if(target)target.classList.add('active');
  progressBar.style.width=(steps[id]!==undefined?steps[id]:100)+'%';
}
function openModal(){overlay.classList.add('open');showStep('email');document.body.style.overflow='hidden';}
function closeModal(){overlay.classList.remove('open');document.body.style.overflow='';}
// Intercept all Calendly CTA links except the final done-step one
document.querySelectorAll('a[href*="calendly"]').forEach(link=>{
  if(link.classList.contains('intake-calendly'))return;
  link.addEventListener('click',e=>{e.preventDefault();openModal();});
});
closeBtn.addEventListener('click',closeModal);
overlay.addEventListener('click',e=>{if(e.target===overlay)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
// Shake animation helper
function shake(el){el.classList.add('error');el.focus();setTimeout(()=>el.classList.remove('error'),600);}
// Validate email format
function isValidEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);}
// Next / Back navigation
let currentLeadId = null;
overlay.addEventListener('click',e=>{
  const next=e.target.closest('.intake-next');
  const back=e.target.closest('.intake-back');
  if(next){
    const curr=document.querySelector('.intake-step.active');
    const currId=curr?curr.dataset.step:'email';
    const nextId=next.dataset.next;
    // Validate email step
    if(currId==='email'){
      const nameEl=document.getElementById('lead-name');
      const emailEl=document.getElementById('lead-email');
      let valid=true;
      if(!nameEl.value.trim()){shake(nameEl);valid=false;}
      if(!isValidEmail(emailEl.value.trim())){shake(emailEl);valid=false;}
      if(!valid)return;
      // Personalise the done screen with their name
      const firstName=nameEl.value.trim().split(' ')[0];
      const doneQ=document.querySelector('.intake-step[data-step="done"] .intake-question');
      if(doneQ)doneQ.textContent=`Perfect, ${firstName}. I know exactly how to help you.`;
      
      // Store lead in localStorage with ID
      currentLeadId = Date.now().toString();
      const lead={id: currentLeadId, name:nameEl.value.trim(),email:emailEl.value.trim(),ts:new Date().toISOString(), answers:{}};
      const leads=JSON.parse(localStorage.getItem('preciousLeads')||'[]');
      leads.push(lead);
      localStorage.setItem('preciousLeads',JSON.stringify(leads));
    } else if(currId!=='done'){
      // Validate radio selection
      const radios=curr.querySelectorAll('input[type=radio]');
      const answered=[...radios].find(r=>r.checked);
      if(!answered && nextId !== 'done'){
        next.textContent='← Pick one first!';
        setTimeout(()=>{next.textContent= nextId === 'done' ? 'See My Results →' : 'Next →';},1500);
        return;
      }
      
      // Save answer to the lead
      if(answered && currentLeadId) {
        const leads=JSON.parse(localStorage.getItem('preciousLeads')||'[]');
        const lead = leads.find(l => l.id === currentLeadId);
        if(lead) {
            lead.answers[`q${currId}`] = answered.value;
            localStorage.setItem('preciousLeads', JSON.stringify(leads));
        }
      }
    }

    // IF WE ARE MOVING TO THE DONE STEP -> Send Data to Email!
    if(nextId === 'done' && currentLeadId) {
        const leads=JSON.parse(localStorage.getItem('preciousLeads')||'[]');
        const lead = leads.find(l => l.id === currentLeadId);
        if(lead) {
            const answers = lead.answers || {};
            // Send data silently to your email via FormSubmit
            fetch("https://formsubmit.co/ajax/preciousadekunle784@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: "🔥 New Funnel Lead: " + lead.name,
                    "Client Name": lead.name,
                    "Client Email": lead.email,
                    "1. Business Type": answers.q1 || "Skipped",
                    "2. Biggest Headache": answers.q2 || "Skipped",
                    "3. Monthly Revenue": answers.q3 || "Skipped",
                    "4. Urgency": answers.q4 || "Skipped"
                })
            })
            .then(res => res.json())
            .then(data => console.log("Lead successfully emailed!"))
            .catch(err => console.error("Error sending lead:", err));
        }
    }

    showStep(nextId);
  }
  if(back)showStep(back.dataset.back);
});
/* ── 1. PRELOADER ─────────────────────────────── */
const preloader=document.getElementById('preloader');
if(preloader){
  setTimeout(()=>{
    preloader.style.opacity='0';
    preloader.style.visibility='hidden';
    setTimeout(()=>preloader.remove(),800);
  },2000);
}
/* ── 2. CURSOR GLOW ───────────────────────────── */
const cursor=document.getElementById('cursor-glow');
document.addEventListener('mousemove',e=>{
  cursor.style.left=e.clientX+'px';
  cursor.style.top=e.clientY+'px';
});
/* ── 3. PARTICLE CANVAS ───────────────────────── */
const canvas=document.getElementById('particle-canvas');
const ctx=canvas.getContext('2d');
let particles=[];
const resize=()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;};
resize();
window.addEventListener('resize',resize);
class Particle{
  constructor(){this.reset();}
  reset(){
    this.x=Math.random()*canvas.width;
    this.y=Math.random()*canvas.height;
    this.size=Math.random()*1.5+.5;
    this.speedX=(Math.random()-.5)*.3;
    this.speedY=(Math.random()-.5)*.3;
    this.opacity=Math.random()*.4+.1;
  }
  update(){
    this.x+=this.speedX;this.y+=this.speedY;
    if(this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height)this.reset();
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
    ctx.fillStyle=`rgba(0,255,163,${this.opacity})`;
    ctx.fill();
  }
}
for(let i=0;i<80;i++)particles.push(new Particle());
(function animateParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{p.update();p.draw();});
  requestAnimationFrame(animateParticles);
})();
/* ── 4. TYPEWRITER HERO ───────────────────────── */
const el=document.getElementById('typewriter');
const words=['Cold Traffic','Skeptical Clicks','Cold Leads','Raw Attention'];
let wi=0,ci=0,deleting=false;
function type(){
  const word=words[wi];
  el.textContent=deleting?word.substring(0,ci--):word.substring(0,ci++);
  let speed=deleting?60:100;
  if(!deleting&&ci===word.length+1){speed=1800;deleting=true;}
  if(deleting&&ci<0){deleting=false;wi=(wi+1)%words.length;speed=300;}
  setTimeout(type,speed);
}
type();
/* ── 5. NAV SHRINK ON SCROLL ──────────────────── */
const nav=document.querySelector('.glass-nav');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>50);
});
/* ── 6. MAGNETIC BUTTONS ──────────────────────── */
document.querySelectorAll('.magnetic-btn').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{
    const r=btn.getBoundingClientRect();
    const x=e.clientX-r.left-r.width/2;
    const y=e.clientY-r.top-r.height/2;
    btn.style.transform=`translate(${x*.15}px,${y*.15}px)`;
  });
  btn.addEventListener('mouseleave',()=>{btn.style.transform='translate(0,0)';});
});
/* ── 7. 3D TILT CARDS ─────────────────────────── */
document.querySelectorAll('.tilt-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=((e.clientX-r.left)/r.width-.5)*14;
    const y=((e.clientY-r.top)/r.height-.5)*-14;
    card.style.transform=`perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02,1.02,1.02)`;
  });
  card.addEventListener('mouseleave',()=>{card.style.transform='perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)';});
});
/* ── 8. SCROLL REVEAL ─────────────────────────── */
const revealIO=new IntersectionObserver((entries,obs)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add('active');
    // animate bars
    entry.target.querySelectorAll('.bar-fill').forEach(bar=>{
      const pct=(parseFloat(bar.dataset.width)/parseFloat(bar.dataset.max))*100;
      bar.style.width=Math.min(pct,100)+'%';
    });
    // animate counters
    entry.target.querySelectorAll('.counter').forEach(el=>animateCounter(el));
    obs.unobserve(entry.target);
  });
},{threshold:.15,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.reveal').forEach(el=>revealIO.observe(el));
/* ── 9. NUMBER COUNTER ────────────────────────── */
function animateCounter(el){
  const target=+el.dataset.target;
  const suffix=el.dataset.suffix||'';
  const isDecimal=el.dataset.decimal==='true';
  let current=0;
  const step=target/60;
  const timer=setInterval(()=>{
    current=Math.min(current+step,target);
    el.textContent=(isDecimal?(current/10).toFixed(1):Math.floor(current))+suffix;
    if(current>=target)clearInterval(timer);
  },20);
}
});
