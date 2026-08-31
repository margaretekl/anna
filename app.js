(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const campos = {
    fName: "pName",
    fTitle: "pTitle",
    fSubtitle: "pSubtitle",
    fBase: "pBase",
    fDynamic: "pDynamic",
    fCareer: "pCareer",
    fRelations: "pRelations",
    fDecisions: "pDecisions"
  };

  function atualizarPreview() {
    Object.entries(campos).forEach(([entrada, saida]) => {
      const a = $(entrada);
      const b = $(saida);
      if (a && b) b.textContent = a.value.trim() || "—";
    });
  }

  Object.keys(campos).forEach(id => {
    const el = $(id);
    if (el) el.addEventListener("input", atualizarPreview);
  });
  atualizarPreview();

  function nomeArquivo() {
    const nome = ($("fName")?.value || "Cliente")
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "");
    return `Relatorio_${nome || "Cliente"}.pdf`;
  }

  function carregarScript(src) {
    return new Promise((resolve, reject) => {
      const existente = [...document.scripts].find(s => s.src === src);
      if (existente) {
        if (window.html2pdf) return resolve();
        existente.addEventListener("load", resolve, { once: true });
        existente.addEventListener("error", reject, { once: true });
        return;
      }

      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function baixarPDF() {
    atualizarPreview();

    const pagina = $("paper");
    if (!pagina) {
      alert('Não encontrei o relatório. O elemento da página precisa ter id="paper".');
      return;
    }

    const botao =
      $("downloadPdfBtn") ||
      $("pdfBtn") ||
      $("printBtn");

    const textoOriginal = botao?.textContent;
    if (botao) {
      botao.disabled = true;
      botao.textContent = "Gerando PDF...";
    }

    try {
      if (!window.html2pdf) {
        await carregarScript(
          "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
        );
      }

      if (!window.html2pdf) {
        throw new Error("A biblioteca html2pdf não foi carregada.");
      }

      // Aguarda fontes e imagens para evitar PDF incompleto.
      if (document.fonts?.ready) await document.fonts.ready;

      const imagens = [...pagina.querySelectorAll("img")];
      await Promise.all(
        imagens.map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.addEventListener("load", resolve, { once: true });
            img.addEventListener("error", resolve, { once: true });
          });
        })
      );

      const opcoes = {
        margin: 0,
        filename: nomeArquivo(),
        image: {
          type: "jpeg",
          quality: 0.98
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          logging: false,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
          compress: true
        },
        pagebreak: {
          mode: ["css", "legacy"]
        }
      };

      await window.html2pdf()
        .set(opcoes)
        .from(pagina)
        .save();

    } catch (erro) {
      console.error(erro);
      alert(
        "Não foi possível gerar o PDF. Verifique se o navegador está com acesso à internet para carregar a biblioteca html2pdf.js."
      );
    } finally {
      if (botao) {
        botao.disabled = false;
        botao.textContent = textoOriginal;
      }
    }
  }

  // Liga automaticamente ao botão existente no HTML.
  const ids = ["downloadPdfBtn", "pdfBtn", "printBtn"];

  ids.forEach(id => {
    const antigo = $(id);
    if (!antigo) return;

    // Remove event listener antigo, inclusive window.print(), substituindo o nó.
    const novo = antigo.cloneNode(true);
    antigo.parentNode.replaceChild(novo, antigo);
    novo.addEventListener("click", baixarPDF);
  });

  // Também permite usar onclick="baixarPDF()" no HTML.
  window.baixarPDF = baixarPDF;
  window.gerarPDF = baixarPDF;
})();