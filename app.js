(() => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  const counter = document.getElementById('slideCounter');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const fsBtn = document.getElementById('fsBtn');

  let current = 0;

  function showSlide(index) {
    if (index < 0) index = 0;
    if (index >= total) index = total - 1;
    current = index;
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  }

  function nextSlide() { showSlide(current + 1); }
  function prevSlide() { showSlide(current - 1); }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);
  fsBtn.addEventListener('click', toggleFullscreen);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'Home') {
      e.preventDefault();
      showSlide(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      showSlide(total - 1);
    } else if (e.key.toLowerCase() === 'f') {
      e.preventDefault();
      toggleFullscreen();
    } else if (e.key >= '1' && e.key <= '9') {
      showSlide(Number(e.key) - 1);
    }
  });

  // ==========================================
  // DIAPOSITIVA 3: INDICADORES INTERACTIVOS
  // ==========================================
  const solBtns = Array.from(document.querySelectorAll('.sol-item'));
  const solZones = {
    length: document.getElementById('solZoneLength'),
    straight: document.getElementById('solZoneStraight'),
    opening: document.getElementById('solZoneOpening')
  };

  function setSolZone(key) {
    solBtns.forEach((b) => b.classList.toggle('active-sol', b.dataset.sol === key));
    Object.entries(solZones).forEach(([k, el]) => {
      if (el) el.classList.toggle('visible', k === key);
    });
  }

  solBtns.forEach((btn) => {
    btn.addEventListener('click', () => setSolZone(btn.dataset.sol));
  });
  setSolZone('length');

  // ==========================================
  // DIAPOSITIVA 5: DEMOSTRACIÓN ANIMADA
  // ==========================================
  const demoSteps = [
    {
      kicker: '01 · PRESENTAR',
      text: 'El operario coloca la rosa',
      svg: 'demoStep1Svg',
      laptop: false,
      human: false
    },
    {
      kicker: '02 · CAPTURAR',
      text: 'La cámara obtiene la imagen',
      svg: 'demoStep2Svg',
      laptop: false,
      human: false
    },
    {
      kicker: '03 · VERIFICAR',
      text: 'Tres características visibles',
      svg: 'demoStep3Svg',
      laptop: false,
      human: false
    },
    {
      kicker: '04 · AVISAR',
      text: 'El resultado aparece en pantalla',
      svg: null,
      laptop: true,
      human: false
    },
    {
      kicker: '05 · CONFIRMAR',
      text: 'El operario toma la decisión',
      svg: 'demoStep5Svg',
      laptop: true,
      human: true
    }
  ];

  let demoIdx = 0;
  let demoTimer = null;

  const demoKicker = document.getElementById('demoStepKicker');
  const demoText = document.getElementById('demoStepText');
  const demoHuman = document.getElementById('demoHumanBadge');
  const demoLaptop = document.getElementById('demoLaptopOverlay');
  const demoDots = Array.from(document.querySelectorAll('#demoDots .demo-dot'));

  function renderDemoStep(idx) {
    demoIdx = Math.max(0, Math.min(demoSteps.length - 1, idx));
    const step = demoSteps[demoIdx];

    demoKicker.textContent = step.kicker;
    demoText.textContent = step.text;
    demoHuman.classList.toggle('show', step.human);
    demoLaptop.classList.toggle('show', step.laptop);

    ['demoStep1Svg', 'demoStep2Svg', 'demoStep3Svg', 'demoStep5Svg'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('show', id === step.svg);
    });

    demoDots.forEach((d, i) => d.classList.toggle('active', i === demoIdx));
  }

  function stopDemo() {
    if (demoTimer) {
      clearInterval(demoTimer);
      demoTimer = null;
    }
  }

  function playDemo() {
    stopDemo();
    if (demoIdx >= demoSteps.length - 1) {
      renderDemoStep(0);
    }
    demoTimer = setInterval(() => {
      if (demoIdx < demoSteps.length - 1) {
        renderDemoStep(demoIdx + 1);
      } else {
        stopDemo();
      }
    }, 2600);
  }

  document.getElementById('demoPlayBtn')?.addEventListener('click', playDemo);
  document.getElementById('demoPauseBtn')?.addEventListener('click', stopDemo);
  document.getElementById('demoResetBtn')?.addEventListener('click', () => {
    stopDemo();
    renderDemoStep(0);
  });
  document.getElementById('demoPrevBtn')?.addEventListener('click', () => {
    stopDemo();
    renderDemoStep(demoIdx - 1);
  });
  document.getElementById('demoNextBtn')?.addEventListener('click', () => {
    stopDemo();
    renderDemoStep(demoIdx + 1);
  });

  renderDemoStep(0);

  // ==========================================
  // DIAPOSITIVA 6: SIMULADOR INTERACTIVO
  // ==========================================
  let simExample = 'A';
  let simTimeout = null;

  const simImg = document.getElementById('simRoseImg');
  const simScanLine = document.getElementById('simScanLine');
  const simSvgOverlay = document.getElementById('simSvgOverlay');
  const simCamTag = document.getElementById('simCamTag');
  const simValLength = document.getElementById('simValLength');
  const simValStraight = document.getElementById('simValStraight');
  const simValOpening = document.getElementById('simValOpening');
  const simStatusBox = document.getElementById('simStatusBox');
  const simStatusTitle = document.getElementById('simStatusTitle');
  const simStatusMsg = document.getElementById('simStatusMsg');
  const simTabA = document.getElementById('simTabA');
  const simTabB = document.getElementById('simTabB');
  const simRunBtn = document.getElementById('simRunBtn');

  function selectSimExample(ex) {
    simExample = ex;
    if (simTimeout) {
      clearTimeout(simTimeout);
      simTimeout = null;
    }
    simTabA.classList.toggle('active', ex === 'A');
    simTabB.classList.toggle('active', ex === 'B');
    simImg.src = ex === 'A' ? 'assets/rosa_tallo_recto.png' : 'assets/rosa_tallo_curvo.png';
    simScanLine.classList.remove('scanning');
    simSvgOverlay.classList.remove('show');
    simCamTag.textContent = 'RosaScan · Estación de inspección';
    simValLength.textContent = '—';
    simValStraight.textContent = '—';
    simValOpening.textContent = '—';
    simStatusBox.className = 'sim-status-box idle';
    simStatusTitle.textContent = 'LISTO PARA INSPECCIÓN';
    simStatusMsg.textContent = 'Presiona INICIAR INSPECCIÓN para simular el análisis.';
  }

  function runSimInspection() {
    if (simTimeout) clearTimeout(simTimeout);
    simCamTag.textContent = 'Captura ilustrativa';
    simScanLine.classList.add('scanning');
    simSvgOverlay.classList.add('show');
    simStatusBox.className = 'sim-status-box idle';
    simStatusTitle.textContent = 'ANALIZANDO...';
    simStatusMsg.textContent = 'Verificando longitud, rectitud visible y apertura.';

    simTimeout = setTimeout(() => {
      simScanLine.classList.remove('scanning');
      if (simExample === 'A') {
        simValLength.textContent = '70 cm (ilustrativo)';
        simValStraight.textContent = 'Sin alerta';
        simValOpening.textContent = 'Grado 2 (ilustrativo)';
        simStatusBox.className = 'sim-status-box';
        simStatusTitle.textContent = 'SIN ALERTAS';
        simStatusMsg.textContent = 'Continúa la operación.';
      } else {
        simValLength.textContent = '70 cm (ilustrativo)';
        simValStraight.textContent = 'Requiere revisión';
        simValOpening.textContent = 'Grado 2 (ilustrativo)';
        simStatusBox.className = 'sim-status-box warn';
        simStatusTitle.textContent = 'REVISAR RECTITUD';
        simStatusMsg.textContent = 'El operario verifica el tallo antes de continuar.';
      }
    }, 1800);
  }

  simTabA?.addEventListener('click', () => selectSimExample('A'));
  simTabB?.addEventListener('click', () => selectSimExample('B'));
  simRunBtn?.addEventListener('click', runSimInspection);

  showSlide(0);
})();
