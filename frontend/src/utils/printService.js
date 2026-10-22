/**
 * ==============================================================================
 * A3 JEWELLERY SOLUTION - ENTERPRISE PRINT ENGINE
 * Isolated, high-fidelity print service for A4 Invoices and Thermal POS receipts.
 * 
 * Eliminates browser screenshot artifacts, modal backdrops, sidebars, and
 * UI chrome by rendering solely the target document in an isolated frame.
 * ==============================================================================
 */

/**
 * Print a DOM element by ID or element reference in an isolated, pure-paper frame.
 * 
 * @param {string|HTMLElement} elementOrId - Target ID or DOM node to print
 * @param {Object} options - Configuration options
 * @param {string} options.title - Document title for the PDF / print job header
 * @param {'A4'|'A4_LANDSCAPE'|'THERMAL_80MM'|'THERMAL_58MM'} options.format - Page geometry
 */
export function printDocument(elementOrId, options = {}) {
  const {
    title = 'A3_Jewellery_Document',
    format = 'A4'
  } = options;

  const targetEl = typeof elementOrId === 'string'
    ? document.getElementById(elementOrId)
    : elementOrId;

  if (!targetEl) {
    console.warn(`[PrintService] Target element '${elementOrId}' not found. Falling back to native print.`);
    window.print();
    return;
  }

  // Create isolated, invisible iframe
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.visibility = 'hidden';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow || iframe;
  const frameDoc = iframe.contentDocument || iframe.contentWindow.document;

  const isThermal = format.startsWith('THERMAL');
  const isLandscape = format === 'A4_LANDSCAPE';

  const pageSize = isThermal
    ? (format === 'THERMAL_58MM' ? '58mm auto' : '80mm auto')
    : (isLandscape ? 'A4 landscape' : 'A4 portrait');

  const pageMargin = isThermal ? '1.5mm 2.5mm' : '8mm 10mm';

  // Extract all loaded styles and fonts from the parent window
  let collectedStyles = '';
  document.querySelectorAll('link[rel="stylesheet"], style').forEach(node => {
    collectedStyles += node.outerHTML + '\n';
  });

  // Dedicated Print Calibration Stylesheet
  const printEngineCSS = `
    @page {
      size: ${pageSize};
      margin: ${pageMargin};
    }

    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      color: #000000 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: ${isThermal ? '10px' : '11pt'};
      line-height: ${isThermal ? '1.25' : '1.35'};
      width: 100% !important;
      height: auto !important;
    }

    /* Print-Specific Container Sizing */
    ${isThermal ? `
      .print-document-container {
        width: 100% !important;
        max-width: ${format === 'THERMAL_58MM' ? '54mm' : '74mm'} !important;
        margin: 0 auto !important;
        padding: 0 !important;
        font-family: "Courier New", Courier, monospace, monospace !important;
        color: #000000 !important;
      }
    ` : `
      .print-document-container {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        color: #000000 !important;
      }
    `}

    /* Remove screen-only button controls and action bars */
    button, input, select, textarea,
    .no-print, .print\\:hidden, .modal-controls,
    [data-print-ignore="true"] {
      display: none !important;
      visibility: hidden !important;
      height: 0 !important;
      width: 0 !important;
    }

    /* Table page break optimization */
    table {
      width: 100% !important;
      border-collapse: collapse !important;
      page-break-inside: auto;
    }

    tr {
      page-break-inside: avoid !important;
      page-break-after: auto;
    }

    thead {
      display: table-header-group;
    }

    tfoot {
      display: table-footer-group;
    }

    /* Neutralize dark-mode colors for pristine ink/toner printing */
    .bg-surface-900, .bg-surface-950, .bg-surface-card, 
    .bg-surface-canvas, .bg-surface-subtle {
      background-color: #ffffff !important;
      color: #000000 !important;
    }

    .text-surface-100, .text-surface-200, .text-surface-300, .text-surface-secondary {
      color: #000000 !important;
    }

    .text-surface-400, .text-surface-500, .text-surface-600 {
      color: #374151 !important;
    }

    .border-surface-700, .border-surface-800, .border-surface-border, .border-surface-input {
      border-color: #d1d5db !important;
    }

    /* Force sharp crisp borders */
    .border, .border-b, .border-t, .border-l, .border-r {
      border-color: #9ca3af !important;
    }
  `;

  frameDoc.open();
  frameDoc.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        ${collectedStyles}
        <style>${printEngineCSS}</style>
      </head>
      <body>
        <div class="print-document-container">
          ${targetEl.outerHTML}
        </div>
      </body>
    </html>
  `);
  frameDoc.close();

  // Trigger print after resources and fonts resolve
  setTimeout(() => {
    try {
      frameWindow.focus();
      frameWindow.print();
    } catch (err) {
      console.error('[PrintService] Isolated print failed, falling back to window.print():', err);
      window.print();
    } finally {
      // Remove temporary iframe after print dialog completes
      setTimeout(() => {
        if (iframe && iframe.parentNode) {
          iframe.parentNode.removeChild(iframe);
        }
      }, 3000);
    }
  }, 300);
}

/**
 * Convenient shortcut for Standard A4 Invoices, Reports & Tax Vouchers
 */
export function printA4(elementOrId, title = 'Tax_Document') {
  printDocument(elementOrId, { title, format: 'A4' });
}

/**
 * Convenient shortcut for A4 Landscape Statements & Rojnamcha Ledgers
 */
export function printA4Landscape(elementOrId, title = 'Audit_Ledger') {
  printDocument(elementOrId, { title, format: 'A4_LANDSCAPE' });
}

/**
 * Convenient shortcut for 80mm / 3-inch POS Thermal Slips
 */
export function printThermal(elementOrId, title = 'Thermal_Receipt') {
  printDocument(elementOrId, { title, format: 'THERMAL_80MM' });
}
