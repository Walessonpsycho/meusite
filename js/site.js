/* Scripts do site — os blocos estavam inline no fim do index.html, na mesma ordem.
   Carregado no fim do <body>: o HTML todo já existe quando ele roda. */

/* ── bloco 1 ─────────────────────────────── */
  // Scroll reveal
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // FAQ accordion
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

/* ── bloco 2 ─────────────────────────────── */
// ════════════════════════════════════════════════════════
// 1. PARTICLE SYSTEM — floating neural network
// ════════════════════════════════════════════════════════
(function() {
  if (window.matchMedia('(max-width: 768px), (hover: none)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  document.body.insertBefore(canvas, document.body.firstChild);
  const ctx = canvas.getContext('2d');

  let W, H, particles, mouse = { x: -999, y: -999 };
  const PARTICLE_COUNT = 55;
  const CONNECTION_DIST = 140;
  const COLORS = ['#1C3A4A','#7A9E8E','#C4826A','#2B526A'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 2 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update & draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      p.pulse += 0.02;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Mouse repulsion
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 100) {
        p.vx += (dx / dist) * 0.08;
        p.vy += (dy / dist) * 0.08;
        // clamp speed
        const speed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
        if (speed > 2) { p.vx = (p.vx/speed)*2; p.vy = (p.vy/speed)*2; }
      }

      const pulseR = p.r + Math.sin(p.pulse) * 0.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, pulseR, 0, Math.PI * 2);
      ctx.fillStyle = p.color + '90';
      ctx.fill();

      // Connections
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const ex = p.x - q.x, ey = p.y - q.y;
        const ed = Math.sqrt(ex*ex + ey*ey);
        if (ed < CONNECTION_DIST) {
          const alpha = (1 - ed / CONNECTION_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(28,58,74,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); initParticles(); });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  resize(); initParticles(); draw();
})();

// ════════════════════════════════════════════════════════
// 2. SCROLL PROGRESS BAR
// ════════════════════════════════════════════════════════
const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.insertBefore(progressBar, document.body.firstChild);

window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  progressBar.style.transform = `scaleX(${Math.min(pct, 1)})`;
}, { passive: true });

// ════════════════════════════════════════════════════════
// 3. PARALLAX — hero elements on scroll
// ════════════════════════════════════════════════════════
const heroLeft  = document.querySelector('.hero-left');
const heroRight = document.querySelector('.hero-right');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y < window.innerHeight) {
    if (heroLeft)  heroLeft.style.transform  = `translateY(${y * 0.12}px)`;
    if (heroRight) heroRight.style.transform = `translateY(${y * 0.07}px)`;
  }
}, { passive: true });

// ════════════════════════════════════════════════════════
// 4. 3D MAGNETIC TILT — id-cards & service-cards
// ════════════════════════════════════════════════════════
function addMagneticTilt(selector, intensity) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const rx = ((e.clientY - cy) / (r.height / 2)) * intensity;
      const ry = ((e.clientX - cx) / (r.width  / 2)) * -intensity;
      card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(14px)`;
      card.style.boxShadow = `${ry * 1.5}px ${rx * 1.5}px 40px rgba(28,58,74,0.15)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}
addMagneticTilt('.service-card', 6);
addMagneticTilt('.testi-card', 5);

/* ── bloco 3 ─────────────────────────────── */
// ══ Deep 3D tilt for about section ══
const aboutContent = document.querySelector('.about-content');
if (aboutContent) {
  aboutContent.addEventListener('mousemove', e => {
    const r = aboutContent.getBoundingClientRect();
    const rx = ((e.clientY - r.top  - r.height/2) / (r.height/2)) * 2;
    const ry = ((e.clientX - r.left - r.width/2)  / (r.width/2))  * -2;
    aboutContent.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  aboutContent.addEventListener('mouseleave', () => {
    aboutContent.style.transform = '';
    aboutContent.style.transition = 'transform 0.6s ease';
  });
}

// ══ Scroll-driven section depth shift ══
const sections3d = document.querySelectorAll('.identify, .services, .faq, .blog-section, .cta-final');
window.addEventListener('scroll', () => {
  sections3d.forEach(sec => {
    const r = sec.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.top < vh && r.bottom > 0) {
      const prog = 1 - (r.top / vh);
      const depth = (prog - 0.5) * 6;
      sec.style.boxShadow = `0 ${Math.abs(depth) * 4}px ${Math.abs(depth) * 12}px rgba(28,58,74,${Math.abs(depth)*0.008})`;
    }
  });
}, { passive:true });

// ══ CTA button: particle burst on click ══
document.querySelectorAll('.cta, .nav-cta').forEach(btn => {
  btn.addEventListener('click', function(e) {
    for (let i = 0; i < 8; i++) {
      const spark = document.createElement('span');
      const angle = (i / 8) * 360;
      const dist  = 40 + Math.random() * 30;
      spark.style.cssText = `
        position:fixed; width:6px; height:6px; border-radius:50%;
        background:var(--terra); pointer-events:none; z-index:9999;
        left:${e.clientX}px; top:${e.clientY}px;
        animation: spark-out 0.5s ease forwards;
      `;
      const rad = angle * Math.PI / 180;
      spark.style.setProperty('--dx', Math.cos(rad) * dist + 'px');
      spark.style.setProperty('--dy', Math.sin(rad) * dist + 'px');
      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 500);
    }
  });
});

/* ── bloco 4 ─────────────────────────────── */
// ══ SELF-CHECK ══════════════════════════════════════════════
// 7 perguntas, mesma escala (últimas 2 semanas), 0–3 pontos cada → total 0–21.
// Cada pergunta mede uma área; a 7ª é de segurança e abre o aviso do CVV.
const SC_SCALE = ['Nunca', 'Em alguns dias', 'Em mais da metade dos dias', 'Quase todos os dias'];
const scQuestions = [
  { area: 'humor',      q: 'Você se sentiu para baixo, sem ânimo ou sem esperança?' },
  { area: 'interesse',  q: 'Perdeu o interesse ou o prazer em coisas que antes gostava — amigos, hobbies, sexo, trabalho?' },
  { area: 'ansiedade',  q: 'Ficou tenso, preocupado ou com a cabeça acelerada, sem conseguir desligar?' },
  { area: 'irritacao',  q: 'Ficou irritado, impaciente ou explodiu por coisas pequenas?' },
  { area: 'energia',    q: 'Dormiu mal ou acordou cansado, mesmo depois de descansar?' },
  { area: 'escape',     q: 'Usou álcool, trabalho em excesso, telas ou outros escapes para não pensar no que sente?' },
  { area: 'risco',      q: 'Teve pensamentos de que seria melhor não estar aqui, ou de se machucar?' },
];

// Faixas do total (0–21)
const SC_LEVELS = [
  { max: 4,  id: 'estavel',    color: 'var(--sage)', title: 'Seu bem-estar parece estável',
    msg: 'Seus indicadores estão numa faixa saudável. Continue cuidando do sono, das relações e do corpo — e, se algo mudar, procurar ajuda cedo faz diferença.' },
  { max: 9,  id: 'atencao',    color: '#B8963E',     title: 'Há sinais que merecem atenção',
    msg: 'Alguns pontos já estão pesando no seu dia a dia. Conversar com um psicólogo agora ajuda a entender o que está acontecendo antes que vire algo maior.' },
  { max: 14, id: 'sobrecarga', color: 'var(--rust)', title: 'Você está carregando muito peso',
    msg: 'Seus indicadores mostram sobrecarga emocional. Esse é o momento certo para ter apoio profissional — você não precisa esperar chegar ao limite.' },
  { max: 21, id: 'apoio',      color: '#B33A2B',     title: 'É importante buscar apoio agora',
    msg: 'Suas respostas apontam sofrimento significativo. Por favor, não enfrente isso sozinho: dê o primeiro passo hoje.' },
];

// O que cada área quer dizer quando pesa (resposta ≥ 2)
const SC_AREAS = {
  humor:     { label: 'Humor',          tip: 'Tristeza ou desânimo frequentes não são “frescura” — são um sinal do corpo e da mente pedindo pausa.' },
  interesse: { label: 'Prazer e interesse', tip: 'Perder a vontade pelo que antes fazia sentido é um dos primeiros sinais de depressão em homens.' },
  ansiedade: { label: 'Ansiedade',      tip: 'A mente que não desliga cansa o corpo. Dá para aprender a regular isso com técnica.' },
  irritacao: { label: 'Irritabilidade', tip: 'Nos homens, a raiva costuma ser a porta de saída de outras emoções que não encontram espaço.' },
  energia:   { label: 'Sono e energia', tip: 'Sono ruim e cansaço constante pioram humor, foco e paciência — e costumam melhorar com acompanhamento.' },
  escape:    { label: 'Escapes',        tip: 'Quando álcool, trabalho ou telas viram a forma de não sentir, vale olhar para o que está por baixo.' },
  risco:     { label: 'Desesperança',   tip: '' },
};

let scAnswers = [];
let scCurrent = 0;

function scInit() {
  scCurrent = 0; scAnswers = [];
  document.querySelector('.sc-result').style.display = 'none';
  document.querySelector('.sc-body').style.display = 'block';
  document.querySelector('.sc-footer').style.display = 'flex';
  document.querySelector('.sc-progress-wrap').style.display = 'block';
  scShowQuestion();
}

function scShowQuestion() {
  const q = scQuestions[scCurrent];
  document.querySelector('.sc-question').innerHTML = `<span class="sc-when">Nas últimas 2 semanas…</span>${q.q}`;
  document.querySelector('.sc-progress-fill').style.width = ((scCurrent / scQuestions.length) * 100) + '%';
  document.querySelector('.sc-options').innerHTML = SC_SCALE.map((o, i) => `
    <button type="button" class="sc-option${scAnswers[scCurrent] === i ? ' selected' : ''}" onclick="scSelect(${i})">
      <span class="sc-option-dot"></span><span>${o}</span>
    </button>`).join('');
  document.querySelector('.sc-btn-next').disabled = scAnswers[scCurrent] === undefined;
  document.querySelector('.sc-btn-next').textContent = scCurrent === scQuestions.length - 1 ? 'Ver resultado →' : 'Próxima →';
  document.querySelector('.sc-btn-back').style.display = scCurrent > 0 ? 'block' : 'none';
}

function scSelect(idx) {
  scAnswers[scCurrent] = idx;
  document.querySelectorAll('.sc-option').forEach((o, i) => o.classList.toggle('selected', i === idx));
  document.querySelector('.sc-btn-next').disabled = false;
}

function scNext() {
  if (scAnswers[scCurrent] === undefined) return;
  scCurrent++;
  if (scCurrent >= scQuestions.length) scShowResult();
  else scShowQuestion();
}

function scBack() {
  if (scCurrent > 0) { scCurrent--; scShowQuestion(); }
}

function scScore(answers) {
  const total = answers.reduce((a, b) => a + b, 0);
  const risk = answers[6] || 0;
  let level = SC_LEVELS.find(l => total <= l.max);
  if (risk >= 2) level = SC_LEVELS[3];                         // pensamento frequente → sempre "buscar apoio"
  else if (risk === 1 && level.id === 'estavel') level = SC_LEVELS[1];
  const areas = scQuestions
    .map((q, i) => ({ area: q.area, value: answers[i] }))
    .filter(a => a.value >= 2 && a.area !== 'risco')
    .sort((a, b) => b.value - a.value)
    .slice(0, 3);
  return { total, max: scQuestions.length * 3, level, areas, risk };
}

function scShowResult() {
  const r = scScore(scAnswers);
  document.querySelector('.sc-body').style.display = 'none';
  document.querySelector('.sc-footer').style.display = 'none';
  document.querySelector('.sc-progress-wrap').style.display = 'none';
  const result = document.querySelector('.sc-result');
  result.style.display = 'block';

  const areasHtml = r.areas.length ? `
    <div class="sc-areas">
      <div class="sc-areas-title">O que mais pesou nas suas respostas</div>
      ${r.areas.map(a => `<div class="sc-area"><strong>${SC_AREAS[a.area].label}</strong><span>${SC_AREAS[a.area].tip}</span></div>`).join('')}
    </div>` : '';
  const riskHtml = r.risk > 0 ? `
    <div class="sc-risk" role="alert">
      <strong>Você contou que teve pensamentos de não estar aqui.</strong>
      Isso merece cuidado agora. Ligue <a href="tel:188">188</a> (CVV, 24h, gratuito) ou procure o pronto-atendimento mais próximo. Se estiver em perigo imediato, ligue 192.
    </div>` : '';

  result.innerHTML = `
    <div class="sc-result-level" style="color:${r.level.color}"><span class="sc-result-dot"></span>${r.level.title}</div>
    <div class="sc-meter" style="--p:${(r.total / r.max * 100).toFixed(1)}%; --c:${r.level.color}" aria-label="Pontuação ${r.total} de ${r.max}">
      <div class="sc-meter-bar"><span></span></div>
      <div class="sc-meter-scale"><span>Estável</span><span>Atenção</span><span>Sobrecarga</span><span>Apoio</span></div>
    </div>
    ${riskHtml}
    <p class="sc-result-text">${r.level.msg}</p>
    ${areasHtml}
    <a href="https://wa.me/message/Z5P3WIFHEBGJJ1" target="_blank" rel="noopener" class="cta cta--block">
      <svg class="cta-ico" aria-hidden="true"><use href="#i-whatsapp"/></svg>
      <span>Conversar no WhatsApp</span>
    </a>
    <button type="button" class="sc-redo" onclick="scInit()">Refazer o check</button>
    <p class="sc-result-note">Este check é uma orientação, não um diagnóstico. Suas respostas não são enviadas a ninguém. <a href="politica-de-privacidade.html#autoavaliacao">Privacidade</a></p>
  `;
}

scInit();


// ══ STICKY CTA — hide when hero is visible ══════════════════
const hero = document.querySelector('.whero');
const stickyCta = document.querySelector('.sticky-mobile-cta');
if (hero && stickyCta) {
  const heroObs = new IntersectionObserver(entries => {
    stickyCta.style.transform = entries[0].isIntersecting ? 'translateY(100%)' : 'translateY(0)';
    stickyCta.style.transition = 'transform 0.3s ease';
  }, { threshold: 0.1 });
  heroObs.observe(hero);
}

// ══ MAPA SOB DEMANDA (LGPD/cookies: Google Maps só depois do clique) ══
document.querySelectorAll('.map-consent').forEach(box => {
  box.querySelector('.map-load').addEventListener('click', () => {
    const map = document.createElement('iframe');
    map.src = box.dataset.src;
    map.title = 'Localização do consultório no Google Maps';
    map.referrerPolicy = 'no-referrer-when-downgrade';
    map.allowFullscreen = true;
    box.replaceWith(map);
  });
});

/* ── bloco 5 ─────────────────────────────── */
(function() {
// ── Modal data ──────────────────────────────────────────────
const modals = {
  ansiedade: {
    title: 'Ansiedade e Ataques de Pânico',
    desc: 'A ansiedade masculina costuma ser ignorada ou confundida com estresse comum. Mas quando o corpo entra em modo de alerta constante — coração acelerado, respiração curta, pensamentos que não param — o sofrimento é real e merece atenção.',
    signs: ['Dificuldade para respirar em momentos de pressão','Pensamentos acelerados e cenários catastróficos','Sensação de perigo iminente sem motivo claro','Evitar situações por medo das reações do próprio corpo','Irritabilidade intensa e imprevisível'],
    how: 'A terapia identifica os gatilhos específicos da sua ansiedade e constrói ferramentas concretas para que você possa regular seu sistema nervoso e retomar o controle da sua vida.'
  },
  depressao: {
    title: 'Depressão Masculina',
    desc: 'No homem, a depressão raramente se parece com choro e tristeza visível. Ela aparece como raiva sem motivo, isolamento progressivo, perda de interesse no trabalho ou nas pessoas que ama, consumo de álcool e sensação de vazio.',
    signs: ['Perda de prazer em atividades que antes gostava','Irritabilidade e explosões de raiva frequentes','Cansaço profundo que não melhora com descanso','Isolamento social e afastamento da família','Pensamentos de inutilidade ou de que seria melhor não estar aqui'],
    how: 'Com acompanhamento especializado, é possível identificar a origem do quadro, trabalhar os padrões de pensamento que alimentam a depressão e reconstruir motivação e significado na vida cotidiana.'
  },
  suicidio: {
    title: 'Pensamentos Suicidas e Crise Emocional',
    desc: 'Homens representam cerca de 80% das mortes por suicídio no Brasil. O silêncio e a resistência em pedir ajuda são fatores determinantes. Se você está tendo pensamentos de que seria melhor não existir, isso é um sinal de que precisa de apoio — não de força de vontade.',
    signs: ['Pensamentos recorrentes de que seria melhor não estar aqui','Sensação de ser um peso para os outros','Planos ou ideias sobre como se machucar','Despedidas veladas ou doação de pertences','Calma súbita após período de desespero'],
    how: 'Você não precisa atravessar isso sozinho. Entre em contato agora — há um caminho de volta, e ele começa com uma conversa.'
  },
  rotina: {
    title: 'Falta de Rotina e Procrastinação',
    desc: 'A procrastinação crônica e a ausência de estrutura no dia a dia não são preguiça — são frequentemente sintomas de ansiedade, baixa autoestima ou sobrecarga emocional não processada. O caos externo reflete o caos interno.',
    signs: ['Dias que passam sem que nada importante seja feito','Culpa constante por adiar tarefas importantes','Dificuldade para iniciar mesmo quando quer fazer','Sensação de estar sempre atrasado na própria vida','Alternância entre períodos de hiperprodutividade e paralisia'],
    how: 'A terapia ajuda a entender o que está por trás da procrastinação e a construir uma estrutura de rotina sustentável que respeite seus limites reais.'
  },
  sono: {
    title: 'Distúrbios do Sono e Insônia',
    desc: 'A mente que não desliga à noite está tentando processar o que não teve espaço durante o dia. Insônia, pesadelos, acordar exausto — são sintomas emocionais com cara de problema físico.',
    signs: ['Dificuldade para adormecer mesmo estando cansado','Acordar várias vezes durante a noite','Pensamentos intrusivos que aparecem na hora de dormir','Cansaço constante mesmo após horas na cama','Irritabilidade e baixa concentração no dia seguinte'],
    how: 'Trabalhamos os fatores psicológicos que sabotam o sono e desenvolvemos estratégias práticas para que você consiga descansar de verdade.'
  },
  autocuidado: {
    title: 'Negligência com o Próprio Corpo e Mente',
    desc: 'Homens tendem a ser os últimos a cuidar de si mesmos. Ignorar sinais do corpo, evitar médico, nunca tirar férias de verdade, não conseguir descansar sem culpa. O autocuidado não é luxo — é manutenção.',
    signs: ['Ignorar dores físicas por semanas ou meses','Não conseguir parar sem sentir que deveria estar fazendo algo','Última vez no médico foi "há um tempão"','Comer mal, beber pouco e dormir pouco sem perceber','Sensação de que cuidar de si é egoísmo'],
    how: 'A terapia reconstrói a relação do homem consigo mesmo, ajudando a desenvolver práticas de autocuidado que se encaixam na realidade da sua vida sem culpa.'
  },
  autoestima: {
    title: 'Baixa Autoestima e Autoimagem Negativa',
    desc: 'A sensação de nunca ser suficiente — como pai, parceiro, chefe, filho. Esse padrão costuma ter raízes antigas e se manifesta em decisões, relacionamentos e na forma como você se trata todos os dias.',
    signs: ['Dificuldade em aceitar elogios','Comparação constante com outros homens','Perfeccionismo paralisante','Medo intenso de errar ou decepcionar','Autocrítica excessiva após qualquer falha'],
    how: 'Trabalhamos a origem desses padrões e construímos uma relação mais honesta e compassiva com você mesmo — sem falsa modéstia e sem exigência impossível.'
  },
  raiva: {
    title: 'Raiva, Impulsividade e Controle Emocional',
    desc: 'A raiva é frequentemente a única emoção que o homem foi autorizado a expressar. Por isso, tristeza, medo e frustração acabam chegando como explosão. Não é falta de caráter — é falta de vocabulário emocional.',
    signs: ['Explosões de raiva que você lamenta depois','Dificuldade de se acalmar após conflitos','Comportamentos impulsivos com dinheiro, comida ou relacionamentos','Sensação de que "perco o controle" com frequência','Afastamento de pessoas após episódios de raiva'],
    how: 'A terapia oferece ferramentas reais de regulação emocional e ajuda a identificar o que está por trás da raiva — para que você possa expressar o que realmente sente.'
  },
  estresse: {
    title: 'Gerenciamento do Estresse e Pressão',
    desc: 'Quando viver no limite vira o modo padrão, o corpo e a mente cobram a conta. Pressão no trabalho, responsabilidades em casa, exigências externas — o estresse crônico não tratado evolui para condições mais sérias.',
    signs: ['Tensão muscular constante, especialmente no pescoço e ombros','Dificuldade de "desligar" mesmo nos momentos de descanso','Irritabilidade com situações pequenas','Esquecimento e dificuldade de concentração','Sensação de estar sempre "apagando incêndios"'],
    how: 'Desenvolvemos juntos estratégias personalizadas de gestão do estresse que funcionam na sua rotina real — não receitas genéricas, mas ferramentas que fazem sentido para você.'
  },
  burnout: {
    title: 'Burnout e Esgotamento Profissional',
    desc: 'O burnout não acontece de repente. É o resultado de meses ou anos colocando o trabalho acima de tudo — saúde, família, descanso. Quando o colapso vem, parece que o chão some.',
    signs: ['Exaustão que não passa mesmo nas férias','Cinismo e distanciamento emocional do trabalho','Sensação de que o esforço não vale mais a pena','Erros frequentes em tarefas que antes eram automáticas','Doenças físicas recorrentes sem causa aparente'],
    how: 'O processo terapêutico ajuda a mapear as causas, reconstruir limites saudáveis e redefinir a relação com o trabalho de forma que sua saúde não seja o preço pago pelo sucesso.'
  },
  proposito: {
    title: 'Crise de Propósito e Identidade Profissional',
    desc: 'Chegar aos 40 ou 50 anos com a sensação de que viveu a vida dos outros. Ou concluir uma carreira de sucesso e se perguntar: "era isso?". A crise de propósito é um convite — não uma sentença.',
    signs: ['Sensação de vazio apesar das conquistas','Perguntas existenciais que aparecem com frequência crescente','Dificuldade de tomar decisões sobre o futuro','Inveja de pessoas que parecem ter "encontrado seu lugar"','Resistência em continuar no mesmo caminho sem saber qual outro seguir'],
    how: 'Trabalhamos o autoconhecimento profundo para ajudá-lo a clarificar seus valores reais e construir um sentido de vida autêntico para esta fase.'
  },
  relacionamentos: {
    title: 'Conflitos Afetivos e Comunicação',
    desc: 'Brigas que se repetem sem resolução, distância emocional que aumenta com o tempo, dificuldade de se abrir com quem você ama. Os padrões relacionais têm raízes — e podem ser transformados.',
    signs: ['As mesmas brigas acontecem repetidamente','Sensação de não ser compreendido ou ouvido','Dificuldade em expressar necessidades afetivas','Afastamento emocional mesmo estando fisicamente presente','Medo de intimidade ou de se tornar dependente'],
    how: 'A terapia ajuda a mapear os padrões relacionais que se repetem, entender sua origem e desenvolver uma comunicação mais autêntica e conectada.'
  },
  paternidade: {
    title: 'Paternidade e Pressão como Pai',
    desc: 'O medo de repetir os erros do seu próprio pai. A culpa por não estar presente o suficiente. A dificuldade de mostrar afeto quando não foi ensinado a fazer isso. A paternidade ativa exige um trabalho interno que ninguém ensina.',
    signs: ['Medo de não ser um pai bom o suficiente','Dificuldade em demonstrar afeto físico ou verbal','Conflitos frequentes com filhos adolescentes','Culpa pelo tempo que passa fora de casa','Sentir que repete comportamentos que jurou que nunca teria'],
    how: 'Trabalhamos o seu histórico familiar, as crenças sobre paternidade e as ferramentas práticas para construir uma relação mais presente e afetiva com seus filhos.'
  },
  dependencia: {
    title: 'Uso de Álcool e Substâncias como Escape',
    desc: 'Beber para relaxar, para dormir, para não pensar, para se soltar socialmente. Quando o consumo deixa de ser escolha consciente e vira necessidade, há sempre uma dor não tratada por trás.',
    signs: ['Beber ou usar substâncias para lidar com emoções difíceis','Dificuldade de relaxar sem o auxílio de substâncias','Promessas quebradas de "parar ou diminuir"','Ocultamento do consumo de pessoas próximas','Sensação de culpa após o uso, seguida de novo uso'],
    how: 'O trabalho terapêutico vai além da substância — acessamos o que está sendo anestesiado e construímos estratégias de enfrentamento que não dependem de escape.'
  },
  masculinidade: {
    title: 'Masculinidade e Novos Papéis de Gênero',
    desc: 'Crescer ouvindo "homem não chora", "tem que ser forte", "resolve sozinho" — e ao mesmo tempo ser cobrado por mais sensibilidade e presença emocional. Essa contradição gera confusão real.',
    signs: ['Sensação de não saber mais "o que é ser homem"','Conflito entre como foi criado e o que o mundo pede hoje','Dificuldade de equilibrar assertividade e sensibilidade','Medo de ser visto como fraco ao mostrar emoções','Identidade masculina muito ligada ao trabalho ou ao status'],
    how: 'A terapia oferece um espaço para construir sua própria referência de masculinidade — autêntica, livre de imposições, baseada em quem você realmente é.'
  }
};

// ── Filter ──────────────────────────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.spec-card').forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.cat !== filter);
    });
  });
});

// ── Modal ───────────────────────────────────────────────────
const overlay = document.getElementById('modal-overlay');
const closeBtn = document.getElementById('modal-close');

document.querySelectorAll('.spec-card').forEach(card => {
  card.addEventListener('click', () => {
    const key = card.dataset.modal;
    const data = modals[key];
    if (!data) return;
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-desc').textContent = data.desc;
    document.getElementById('modal-how').textContent = data.how;
    const ul = document.getElementById('modal-signs-list');
    ul.innerHTML = data.signs.map(s => `<li>${s}</li>`).join('');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}
closeBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── Reveal ──────────────────────────────────────────────────
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* ── bloco 6 ─────────────────────────────── */
(function() {
// ════════════════════════════════════════════════════
// 3. HERO FLOATING SHAPES
// ════════════════════════════════════════════════════
const hero = document.querySelector('.page-hero');
if (hero) {
  ['hero-shape-1','hero-shape-2','hero-shape-3'].forEach(cls => {
    const el = document.createElement('div');
    el.className = 'hero-shape ' + cls;
    hero.appendChild(el);
  });
}

// ════════════════════════════════════════════════════
// 4. MAGNETIC 3D TILT — spec cards
// ════════════════════════════════════════════════════
document.querySelectorAll('.spec-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const cx = r.left + r.width/2, cy = r.top + r.height/2;
    const rx = ((e.clientY - cy) / (r.height/2)) * 7;
    const ry = ((e.clientX - cx) / (r.width/2)) * -7;
    card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(16px) scale(1.02)`;
    card.style.boxShadow = `${-ry*2}px ${rx*2}px 50px rgba(28,58,74,0.18), 0 2px 8px rgba(0,0,0,0.08)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.175,0.885,0.32,1.1), box-shadow 0.5s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });
});

// ════════════════════════════════════════════════════
// 5. STAGGERED 3D CARD ENTRANCE
// ════════════════════════════════════════════════════

const cardObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.closest('.spec-grid').querySelectorAll('.spec-card:not(.card-in)'));
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('card-in'), Math.max(0, idx) * 70);
      cardObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.spec-card').forEach(el => cardObs.observe(el));

// ════════════════════════════════════════════════════
// ════════════════════════════════════════════════════
// 7. FILTER BUTTON — ripple effect
// ════════════════════════════════════════════════════
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const r = btn.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:80px; height:80px; margin-left:-40px; margin-top:-40px;
      background:rgba(255,255,255,0.25);
      left:${e.clientX - r.left}px; top:${e.clientY - r.top}px;
      animation: ripple-out 0.5s ease forwards;
      pointer-events:none;
    `;
    btn.style.position = 'relative'; btn.style.overflow = 'hidden';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 500);
  });
});
})();

/* ── bloco 7 ─────────────────────────────── */
// ══ NAV — marca a seção visível ══════════════════════════════
(function() {
  const links = [...document.querySelectorAll('.site-nav .nav-links a[href^="#"]')];
  const byId = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const sections = [...byId.keys()].map(id => document.getElementById(id)).filter(Boolean);
  if (!sections.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.remove('is-active'));
      byId.get(e.target.id).classList.add('is-active');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => obs.observe(s));
})();

/* ── bloco 8 ─────────────────────────────── */
// ══ MENU — hambúrguer (tablet/celular) e menu compacto ao rolar ══
(function() {
  const nav = document.querySelector('.site-nav');
  const btn = nav && nav.querySelector('.nav-toggle');
  if (!nav || !btn) return;
  const setOpen = open => {
    nav.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  btn.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
  nav.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ══ EFEITOS DE ROLAGEM ═══════════════════════════════════════
(function() {
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('fx-js');

  // cascata: cada filho de [data-stagger] entra um pouco depois do anterior
  document.querySelectorAll('[data-stagger]').forEach(g =>
    [...g.children].forEach((c, i) => c.style.setProperty('--i', i)));

  // hero: arte e texto se separam devagar enquanto a página sobe
  const hero = document.querySelector('.whero');
  if (hero && !calm) {
    let ticking = false;
    const update = () => {
      const p = Math.min(Math.max(window.scrollY / hero.offsetHeight, 0), 1);
      hero.style.setProperty('--hp', p.toFixed(4));
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
    // hero mais alta que a tela: gruda só quando o rodapé dela chega embaixo
    const stick = () => hero.style.setProperty('--stick-top', Math.min(0, innerHeight - hero.offsetHeight) + 'px');
    window.addEventListener('resize', stick);
    stick();
  }

  // "para quem é": cada card sabe quantos outros já subiram por cima dele
  const idCards = [...document.querySelectorAll('.identify .id-card')];
  idCards.forEach((c, i) => c.style.setProperty('--i', i));
  if (idCards.length && !calm) {
    let ticking = false;
    const update = () => {
      const tops = idCards.map(c => c.getBoundingClientRect().top);
      // quanto cada card já percorreu até encostar no anterior (0 a 1)
      const cover = idCards.map((c, i) => i === 0 ? 0 :
        Math.min(Math.max((tops[i - 1] + idCards[i - 1].offsetHeight - tops[i]) / idCards[i - 1].offsetHeight, 0), 1));
      idCards.forEach((c, i) => {
        const depth = cover.slice(i + 1).reduce((a, b) => a + b, 0);
        c.style.setProperty('--depth', depth.toFixed(3));
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  // "como posso te ajudar": a rolagem vertical empurra os cards para o lado
  const svc = document.querySelector('.services');
  const pin = svc && svc.querySelector('.hs-pin');
  const track = svc && svc.querySelector('.services-grid');
  const bar = svc && svc.querySelector('.hs-progress');
  if (pin && track && !calm) {
    let dist = 0, ticking = false;
    const move = () => {
      if (svc.classList.contains('is-hscroll')) {
        const range = svc.offsetHeight - pin.offsetHeight;
        const p = range > 0 ? Math.min(Math.max(-svc.getBoundingClientRect().top / range, 0), 1) : 0;
        track.style.transform = `translate3d(${(-p * dist).toFixed(1)}px,0,0)`;
        bar.style.setProperty('--p', p.toFixed(4));
      }
      ticking = false;
    };
    const layout = () => {
      svc.classList.add('is-hscroll');
      svc.style.height = '';
      track.style.transform = '';
      dist = track.offsetWidth - pin.clientWidth;
      // só liga se tudo couber na altura da tela e houver o que deslizar
      if (dist <= 0 || pin.scrollHeight > pin.clientHeight + 1) {
        svc.classList.remove('is-hscroll');
        return;
      }
      svc.style.height = (pin.offsetHeight + dist) + 'px';
      move();
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(move); } }, { passive: true });
    // no celular a barra do navegador some e volta (resize só de altura): ignora
    let lastW = innerWidth;
    window.addEventListener('resize', () => { if (innerWidth !== lastW) { lastW = innerWidth; layout(); } });
    window.addEventListener('load', layout);
    layout();
  }

})();

/* ── bloco 9 ─────────────────────────────── */
// ══ CELULAR — estrutura e efeitos ════════════════════════════
(function() {
  const mobile = window.matchMedia('(max-width: 640px)');


  // faixa de selos: segunda cópia para o letreiro correr sem emenda
  const trust = document.querySelector('.trust-bar');
  if (trust) {
    const track = document.createElement('div');
    track.className = 'trust-track';
    [...trust.children].forEach(item => track.appendChild(item));
    [...track.children].forEach(item => {
      const copy = item.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.classList.add('trust-copy');
      track.appendChild(copy);
    });
    trust.appendChild(track);
  }

  // carrosséis (especialidades e serviços): trilho que mostra onde você está
  document.querySelectorAll('.spec-grid, .services-grid').forEach(rail => {
    rail.classList.add('swipe');
    const bar = document.createElement('div');
    bar.className = 'swipe-progress';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<span></span>';
    rail.after(bar);
    const thumb = bar.firstChild;
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth;
      const size = rail.clientWidth / rail.scrollWidth;
      thumb.style.width = (size * 100) + '%';
      thumb.style.transform = `translateX(${max > 0 ? (rail.scrollLeft / max) * (1 / size - 1) * 100 : 0}%)`;
    };
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    // filtro de especialidades muda a quantidade de cards: volta ao início
    document.querySelectorAll('.filter-btn').forEach(b => b.addEventListener('click', () => {
      rail.scrollTo({ left: 0 }); setTimeout(update, 50);
    }));
    update();
  });

  // artigo do blog: mostra o começo do 1º tópico e um botão que abre o artigo completo
  const topics = document.querySelector('.blog-topics');
  if (topics) {
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'blog-more';
    more.innerHTML = 'Continuar lendo <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6l4 4 4-4"/></svg>';
    topics.classList.add('is-collapsed');
    topics.after(more);
    more.addEventListener('click', () => {
      topics.classList.remove('is-collapsed');
      more.remove();
      // o foco vai para onde o texto continua (leitor de tela e teclado não se perdem)
      const next = topics.querySelector('.blog-topic:nth-child(2) h3');
      if (next) { next.tabIndex = -1; next.focus({ preventScroll: true }); }
    });
  }

  // barra fixa: some enquanto o menu está aberto e quando o CTA final aparece
  const sticky = document.querySelector('.sticky-mobile-cta');
  const finalCta = document.querySelector('.cta-final');
  if (sticky && finalCta) {
    new IntersectionObserver(entries => {
      sticky.classList.toggle('is-away', entries[0].isIntersecting);
    }, { threshold: 0.2 }).observe(finalCta);
  }
})();
