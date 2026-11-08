// Convierte la hoja (Markdown con la estructura fija) en un .docx con la misma jerarquía.
window.HojaDocx = (function () {
  const D = window.docx;
  const TINTA = "100100", MORADO = "6E2F80", GRIS = "7A6F66", FUENTE = "Calibri", DISPLAY = "Georgia";

  // Texto con **negritas** y citas [Ficha N, nombre]
  function runs(texto, base = {}) {
    const out = [];
    const partes = texto.split(/(\*\*[^*]+\*\*|\[Ficha \d+[^\]]*\])/g).filter(Boolean);
    for (const p of partes) {
      if (/^\*\*/.test(p)) out.push(new D.TextRun({ text: p.slice(2, -2), bold: true, font: FUENTE, size: 22, color: TINTA, ...base }));
      else if (/^\[Ficha/.test(p)) out.push(new D.TextRun({ text: p, font: FUENTE, size: 18, color: MORADO, smallCaps: true, ...base }));
      else out.push(new D.TextRun({ text: p, font: FUENTE, size: 22, color: TINTA, ...base }));
    }
    return out;
  }

  function parse(md) {
    const lineas = md.split(/\r?\n/);
    const parrafos = [];
    let primeraMeta = false;
    const h1 = { font: DISPLAY, size: 40, bold: true, color: TINTA };
    for (let i = 0; i < lineas.length; i++) {
      const l = lineas[i];
      if (!l.trim()) continue;
      let m;
      if ((m = l.match(/^# (.*)/))) { parrafos.push(new D.Paragraph({ children: [new D.TextRun({ text: m[1], ...h1 })], spacing: { after: 120 } })); primeraMeta = true; continue; }
      if ((m = l.match(/^## (.*)/))) { parrafos.push(new D.Paragraph({ children: [new D.TextRun({ text: m[1], font: DISPLAY, size: 28, bold: true, color: MORADO })], spacing: { before: 360, after: 120 } })); continue; }
      if ((m = l.match(/^(\d+)\.\s+(.*)/))) { parrafos.push(new D.Paragraph({ children: runs(m[2]), numbering: { reference: "num", level: 0 }, spacing: { after: 120 }, alignment: D.AlignmentType.JUSTIFIED })); continue; }
      if ((m = l.match(/^[-*]\s+(.*)/))) { parrafos.push(new D.Paragraph({ children: runs(m[1]), bullet: { level: 0 }, spacing: { after: 120 } })); continue; }
      if (/^Esta hoja se basa únicamente/.test(l)) { parrafos.push(new D.Paragraph({ children: [new D.TextRun({ text: l, font: FUENTE, size: 18, color: GRIS, italics: true })], spacing: { before: 360 }, border: { top: { style: D.BorderStyle.SINGLE, size: 4, color: "D9D1C5", space: 8 } } })); continue; }
      if (primeraMeta) { parrafos.push(new D.Paragraph({ children: [new D.TextRun({ text: l, font: FUENTE, size: 20, color: GRIS })], spacing: { after: 240 } })); primeraMeta = false; continue; }
      if (/^"/.test(l.trim())) { parrafos.push(new D.Paragraph({ children: runs(l, { italics: true }), indent: { left: 567 }, spacing: { after: 160 }, shading: { fill: "F7F3EC" } })); continue; }
      parrafos.push(new D.Paragraph({ children: runs(l), spacing: { after: 160, line: 312 }, alignment: D.AlignmentType.JUSTIFIED }));
    }
    return parrafos;
  }

  async function descargar(md, meta) {
    const doc = new D.Document({
      creator: "Asistente Inteligente para la Innovación Pública Local",
      title: "Hoja de recomendaciones",
      numbering: { config: [{ reference: "num", levels: [{ level: 0, format: D.LevelFormat.DECIMAL, text: "%1.", alignment: D.AlignmentType.START, style: { paragraph: { indent: { left: 567, hanging: 360 } } } }] }] },
      styles: { default: { document: { run: { font: FUENTE, size: 22 } } } },
      sections: [{
        properties: { page: { margin: { top: 1418, right: 1418, bottom: 1418, left: 1701 }, borders: { pageBorderLeft: { style: D.BorderStyle.THICK, size: 36, color: "58A068", space: 24 } } } },
        headers: { default: new D.Header({ children: [new D.Paragraph({ children: [new D.TextRun({ text: "Asistente Inteligente para la Innovación Pública Local · Municipios que Incluyen · Ashanti Perú", font: FUENTE, size: 16, color: GRIS })], border: { bottom: { style: D.BorderStyle.SINGLE, size: 6, color: "79368C", space: 4 } } })] }) },
        footers: { default: new D.Footer({ children: [new D.Paragraph({ alignment: D.AlignmentType.RIGHT, children: [new D.TextRun({ text: "Página ", font: FUENTE, size: 16, color: GRIS }), new D.TextRun({ children: [D.PageNumber.CURRENT], font: FUENTE, size: 16, color: GRIS })] })] }) },
        children: parse(md)
      }]
    });
    const blob = await D.Packer.toBlob(doc);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    const fecha = new Date().toISOString().slice(0, 10);
    a.download = `Hoja_de_recomendaciones_${fecha}.docx`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  return { descargar };
})();
