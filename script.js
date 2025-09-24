  // ===== Improved JS: robust, accessible, defensive & lighter =====
  (function(){
    'use strict';
    const qs = s => document.querySelector(s);
    const qsa = s => Array.from(document.querySelectorAll(s));

    // Typing effect (non-blocking) — guard against long-running loops
    (function type(){
      const el = qs('#typed'); if(!el) return;
      const phrases = ['Frontend • HTML, CSS, JavaScript','React, Tailwind & modern UI','Node.js & Python backends','SEO-focused • Performance-first','Open-source builder • Creator'];
      let pi=0, ci=0, forward=true, timeoutId=null;
      function tick(){
        const cur = phrases[pi];
        if(forward){ ci++; el.textContent = cur.slice(0,ci); if(ci>=cur.length){forward=false; timeoutId = setTimeout(tick,900); return} }
        else { ci--; el.textContent = cur.slice(0,ci); if(ci<=0){ forward=true; pi=(pi+1)%phrases.length; } }
        timeoutId = setTimeout(tick, forward?32:18);
      }
      tick();
      // cleanup on unload (good for SPA integrations)
      window.addEventListener('pagehide', ()=>{ if(timeoutId) clearTimeout(timeoutId); });
    })();

    // set year
    qs('#year').textContent = new Date().getFullYear();

    // Mobile nav toggle (class toggling, accessible)
    const menuBtn = qs('#menuBtn');
    const nav = qs('#primaryNav');
    if(menuBtn){
      menuBtn.addEventListener('click', ()=>{
        const open = nav.classList.toggle('open');
        menuBtn.textContent = open ? '✕' : '☰';
        menuBtn.setAttribute('aria-expanded', String(open));
        if(open){ const first = nav.querySelector('a'); first?.focus(); }
      });
    }

    // Smooth in-page link scrolling + close nav on small screens (single delegated handler)
    document.addEventListener('click', (e)=>{
      const a = e.target.closest('a[href^="#"]'); if(!a) return;
      const href = a.getAttribute('href'); if(!href || href==='#') return;
      const t = document.querySelector(href);
      if(t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth',block:'start'});
        if(window.innerWidth <= 1000){ nav.classList.remove('open'); menuBtn && (menuBtn.textContent = '☰'); menuBtn && menuBtn.setAttribute('aria-expanded','false'); }
      }
    });

    // Project filters (delegated) — fewer listeners
    const filterBar = qs('.filterbar');
    if(filterBar){
      filterBar.addEventListener('click', (ev)=>{
        const btn = ev.target.closest('.filterbtn'); if(!btn) return;
        qsa('.filterbar .filterbtn').forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
        btn.classList.add('active'); btn.setAttribute('aria-pressed','true');
        const f = btn.getAttribute('data-filter');
        qsa('#projectsGrid .project').forEach(p=>{
          if(!f || f==='*'){ p.hidden = false; return }
          const tags = (p.getAttribute('data-tags')||'').split(/\s+/);
          p.hidden = !tags.includes(f);
        });
      });
    }

    // Project modal handler (delegated)
    const modal = qs('#projModal');
    const modalLink = qs('#modalLink');
    document.addEventListener('click', (ev)=>{
      const b = ev.target.closest('[data-action="open"]'); if(!b) return;
      qs('#modalTitle').textContent = b.dataset.title || 'Project';
      qs('#modalDesc').textContent = b.dataset.desc || '';
      modalLink.href = b.dataset.link || '#';
      modal.classList.add('open'); modal.setAttribute('aria-hidden','false');
      qs('#closeModal')?.focus();
    });

    function closeModal(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden','true'); }
    qs('#closeModal')?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });
    document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

    // Intersection observer for reveal animations
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.style.transform='translateY(0)'; en.target.style.opacity=1; io.unobserve(en.target); } });
    }, {threshold:0.12});
    qsa('.project, .hero-card, .contact-card, .skill-item').forEach(el=>{ el.style.transform='translateY(16px)'; el.style.opacity=0; io.observe(el); });

    // Animate circular progress when visible
    const circles = Array.from(document.querySelectorAll('.skill-svg circle[data-val]'));
    const svgIO = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if(en.isIntersecting){
          const c = en.target; const val = parseInt(c.dataset.val,10) || 80; const r = parseFloat(c.getAttribute('r')) || 50; const len = 2 * Math.PI * r; const to = Math.round(len * (1 - val/100));
          c.setAttribute('stroke-dasharray', String(len)); c.setAttribute('stroke-dashoffset', String(len));
          requestAnimationFrame(()=>{ c.style.transition = 'stroke-dashoffset 1200ms cubic-bezier(.2,.9,.3,1)'; c.setAttribute('stroke-dashoffset', String(to)); });
          svgIO.unobserve(c);
        }
      });
    }, {threshold:0.2});
    circles.forEach(s=>svgIO.observe(s));

    // 3D tilt — pointer events
    qsa('.project').forEach(card=>{
      card.addEventListener('pointermove', (e)=>{
        const r = card.getBoundingClientRect(); const px = (e.clientX - r.left)/r.width; const py = (e.clientY - r.top)/r.height; const rx = (py - 0.5)*8; const ry = (px - 0.5)*-8; card.style.transform = `perspective(900px) translateZ(0) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', ()=>{ card.style.transform='translateY(0)'; });
    });

    // Copy email helper
    qs('#copyEmail')?.addEventListener('click', async ()=>{
      try{ await navigator.clipboard.writeText('jaydatt@itisuniqueofficial.com'); alert('Email copied to clipboard'); }
      catch(e){ prompt('Copy email', 'jaydatt@itisuniqueofficial.com'); }
    });

    // Contact form mailto fallback
    qs('#contactForm')?.addEventListener('submit', (e)=>{
      e.preventDefault(); const nm=qs('#nm').value.trim(); const em=qs('#em').value.trim(); const msg=qs('#msg').value.trim(); if(!nm||!em||!msg){ alert('Please complete the form'); return }
      const subject = encodeURIComponent('Portfolio contact from '+nm); const body = encodeURIComponent(msg + '\n\n' + nm + '\n' + em);
      window.location.href = `mailto:jaydatt@itisuniqueofficial.com?subject=${subject}&body=${body}`;
    });

  })();
