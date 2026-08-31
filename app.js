const map = {
  fName: 'pName',
  fTitle: 'pTitle',
  fSubtitle: 'pSubtitle',
  fBase: 'pBase',
  fDynamic: 'pDynamic',
  fCareer: 'pCareer',
  fRelations: 'pRelations',
  fDecisions: 'pDecisions'
};

const defaults = {};

for (const [inputId, outputId] of Object.entries(map)) {
  const input = document.getElementById(inputId);
  const output = document.getElementById(outputId);
  if (!input || !output) continue;

  defaults[inputId] = input.value;
  const sync = () => output.textContent = input.value.trim() || '—';
  input.addEventListener('input', sync);
  sync();
}

// Gera o PDF usando a impressão nativa do navegador.
// No Chrome/Edge, escolha "Salvar como PDF" na janela aberta.
const printBtn = document.getElementById('printBtn');
if (printBtn) {
  printBtn.addEventListener('click', () => {
    // Dá tempo para o navegador terminar de renderizar fontes/imagens.
    requestAnimationFrame(() => {
      setTimeout(() => window.print(), 100);
    });
  });
}

const resetBtn = document.getElementById('resetBtn');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    for (const inputId of Object.keys(map)) {
      const el = document.getElementById(inputId);
      if (!el) continue;
      el.value = defaults[inputId];
      el.dispatchEvent(new Event('input'));
    }
  });
}
