import type { PDFFont } from "pdf-lib";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

import geeksLogo from "@/assets/geeksblabla-logo.png";
import stateOfDevLogo from "@/assets/stateOfDev-logo.png";

export interface UserReportItem {
  id: string;
  label: string;
  answer: string;
}

export interface UserReportSection {
  id: string;
  name?: string;
  description?: string;
  items: UserReportItem[];
}

export interface UserReportPayload {
  userId: string;
  submittedAt: string | null;
  sections: UserReportSection[];
}

/**
 * Strip characters that WinAnsi / built-in fonts can’t encode (emojis etc.)
 * to avoid runtime errors like “WinAnsi cannot encode ...”.
 */
export function sanitizeForPdf(text: string): string {
  if (!text)
    return "";
  return Array.from(text)
    .map((ch) => {
      const code = ch.codePointAt(0) ?? 0;
      if (code < 32 || code > 255)
        return "";
      return ch;
    })
    .join("");
}

/**
 * Wrap text into multiple lines that fit a given width.
 */
export function wrapText(
  text: string,
  maxWidth: number,
  font: PDFFont,
  fontSize: number
): string[] {
  const clean = sanitizeForPdf(text);
  const words = clean.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const testLine = current ? `${current} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width > maxWidth && current) {
      lines.push(current);
      current = word;
    }
    else {
      current = testLine;
    }
  }

  if (current)
    lines.push(current);
  return lines;
}

/**
 * Generate and trigger download of a per-user survey report PDF.
 */
export async function generateUserReportPdf(
  payload: UserReportPayload
): Promise<void> {
  const pdfDoc = await PDFDocument.create();

  // ---- Fonts ----------------------------------------------------------------
  // Monospace dev vibe: Courier everywhere.
  const bodyFont = await pdfDoc.embedFont(StandardFonts.Courier);
  const headingFont = await pdfDoc.embedFont(StandardFonts.CourierBold);
  const titleFont = headingFont; // big bold Courier for title

  // ---- Colors & layout ------------------------------------------------------
  const brandBlue = rgb(0.18, 0.29, 0.66);
  const softGrey = rgb(0.55, 0.55, 0.55);
  const borderGrey = rgb(0.82, 0.82, 0.84);
  const rowDivider = rgb(0.9, 0.9, 0.92);
  const textDark = rgb(0.12, 0.12, 0.12);

  const marginX = 56;
  const marginY = 56;
  const lineGap = 4;

  let page = pdfDoc.addPage();
  let { width, height } = page.getSize();
  let cursorY = height - marginY;
  const contentWidth = width - marginX * 2;

  const ensureSpace = (needed: number) => {
    if (cursorY - needed < marginY) {
      page = pdfDoc.addPage();
      ({ width, height } = page.getSize());
      cursorY = height - marginY;
    }
  };

  const drawLine = (
    text: string,
    size: number,
    opts?: { font?: PDFFont; color?: ReturnType<typeof rgb> }
  ) => {
    const safe = sanitizeForPdf(text);
    const usedFont = opts?.font ?? bodyFont;
    const color = opts?.color ?? textDark;
    const textHeight = size;

    ensureSpace(textHeight + lineGap);

    page.drawText(safe, {
      x: marginX,
      y: cursorY - textHeight,
      size,
      font: usedFont,
      color
    });

    cursorY -= textHeight + lineGap;
  };

  // ---- 1. Logos + title block ----------------------------------------------

  try {
    const [leftBytes, rightBytes] = await Promise.all([
      fetch(stateOfDevLogo.src).then(async res => res.arrayBuffer()),
      fetch(geeksLogo.src).then(async res => res.arrayBuffer())
    ]);

    const leftImg = await pdfDoc.embedPng(leftBytes);
    const rightImg = await pdfDoc.embedPng(rightBytes);

    const logoHeight = 15;
    const leftScale = logoHeight / leftImg.height;
    const rightScale = (logoHeight + 7) / rightImg.height;

    page.drawImage(leftImg, {
      x: marginX,
      y: cursorY - logoHeight,
      width: leftImg.width * leftScale,
      height: logoHeight
    });

    page.drawImage(rightImg, {
      x: width - marginX - rightImg.width * rightScale,
      y: cursorY - logoHeight,
      width: rightImg.width * rightScale,
      height: logoHeight + 7
    });

    cursorY -= logoHeight + 18;
  }
  catch {
    cursorY -= 12;
  }

  // Title: terminal-style banner, centered
  const title = "=== SURVEY REPORT ===";
  const titleSize = 16;
  const titleWidth = titleFont.widthOfTextAtSize(title, titleSize);
  const titleX = marginX + (contentWidth - titleWidth) / 2;
  const titleY = cursorY - titleSize;

  page.drawText(sanitizeForPdf(title), {
    x: titleX,
    y: titleY,
    size: titleSize,
    font: titleFont,
    color: textDark
  });

  // Short underline (40% width)
  const underlineWidth = contentWidth * 0;
  const underlineX = marginX + (contentWidth - underlineWidth) / 2;

  page.drawRectangle({
    x: underlineX,
    y: titleY - 6,
    width: underlineWidth,
    height: 1,
    color: brandBlue
  });

  cursorY = titleY - 18;

  // Subtitle in softer grey
  const subtitle
    = "This document contains the answers you submitted to the State of Dev in Morocco survey. It is intended for your personal reference.";

  const subtitleLines = wrapText(subtitle, contentWidth, bodyFont, 10);
  for (const line of subtitleLines) {
    drawLine(line, 10, { font: bodyFont, color: softGrey });
  }

  cursorY -= 8;

  // ---- 2. Metadata “card” (compact) ----------------------------------------

  const cardTop = cursorY;
  const cardPaddingX = 10;
  const cardPaddingY = 8;
  const labelSize = 10;
  const valueSize = 10;
  const rowHeight = labelSize + 4;

  const metaRows: Array<[string, string]> = [
    ["Submitted", payload.submittedAt ?? "N/A"],
    ["User ID", payload.userId],
    ["Website", "https://stateofdev.ma"]
  ];

  const cardHeight = cardPaddingY * 2 + metaRows.length * rowHeight;

  ensureSpace(cardHeight + 12);

  page.drawRectangle({
    x: marginX,
    y: cursorY - cardHeight,
    width: contentWidth,
    height: cardHeight,
    borderColor: borderGrey,
    borderWidth: 0.8,
    color: rgb(1, 1, 1)
  });

  let metaCursorY = cursorY - cardPaddingY - labelSize;

  metaRows.forEach(([label, value]) => {
    const labelText = `${label}:`;

    page.drawText(sanitizeForPdf(labelText), {
      x: marginX + cardPaddingX,
      y: metaCursorY,
      size: labelSize,
      font: headingFont,
      color: textDark
    });

    const valueX
      = marginX
        + cardPaddingX
        + headingFont.widthOfTextAtSize(labelText, labelSize)
        + 6;

    page.drawText(sanitizeForPdf(value), {
      x: valueX,
      y: metaCursorY,
      size: valueSize,
      font: bodyFont,
      color: softGrey
    });

    metaCursorY -= rowHeight;
  });

  cursorY = cardTop - cardHeight - 18;

  // ---- 3. Sections as blocks (minimal + terminal flair) --------------------

  const rowGap = 10;
  const qaGap = 2;
  const questionColor = textDark;
  const answerColor = rgb(0.25, 0.25, 0.25);

  for (const section of payload.sections) {
    cursorY -= 16;
    ensureSpace(90);

    // Section header bar (left) with terminal-style label
    const barHeight = 18;
    // const barWidth = contentWidth * 0.35;
    const barWidth = contentWidth;
    const barY = cursorY - barHeight;

    page.drawRectangle({
      x: marginX,
      y: barY,
      width: barWidth,
      height: barHeight,
      color: brandBlue
    });

    const rawLabel = section.name ?? section.id ?? "";
    const sectionLabel = `> ${rawLabel.toUpperCase()}`;

    page.drawText(sanitizeForPdf(sectionLabel), {
      x: marginX + 8,
      y: barY + 4,
      size: 11,
      font: headingFont,
      color: rgb(1, 1, 1)
    });

    cursorY = barY - 12;

    if (section.description) {
      const descLines = wrapText(
        section.description,
        contentWidth,
        bodyFont,
        9.5
      );
      for (const line of descLines) {
        drawLine(line, 9.5, { font: bodyFont, color: softGrey });
      }
      cursorY -= 4;
    }

    for (const item of section.items) {
      const qLines = wrapText(item.label, contentWidth, headingFont, 10.5);
      for (const line of qLines) {
        drawLine(line, 10.5, { font: headingFont, color: questionColor });
      }

      cursorY -= qaGap;

      const answerText = item.answer || "Not answered";
      const aLines = wrapText(`   ${answerText}`, contentWidth, bodyFont, 10);
      for (const line of aLines) {
        drawLine(line, 10, { font: bodyFont, color: answerColor });
      }

      const dividerHeight = 0.5;
      ensureSpace(dividerHeight + rowGap);
      page.drawRectangle({
        x: marginX,
        y: cursorY - dividerHeight - 2,
        width: contentWidth,
        height: dividerHeight,
        color: rowDivider
      });

      cursorY -= rowGap;
    }
  }

  // ---- 4. Footer on every page ---------------------------------------------

  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  pages.forEach((p, index) => {
    const footerY = marginY - 30;
    const footerCenterX = marginX + (p.getSize().width - marginX * 2) / 2;

    const signature = "StateOfDev.ma · Geeksblabla";
    const sigWidth = bodyFont.widthOfTextAtSize(signature, 9);

    p.drawText(sanitizeForPdf(signature), {
      x: footerCenterX - sigWidth / 2,
      y: footerY,
      size: 9,
      font: bodyFont,
      color: softGrey
    });

    const pageText = `Page ${index + 1} / ${totalPages}`;
    const pageWidth = bodyFont.widthOfTextAtSize(pageText, 9);

    p.drawText(pageText, {
      x: p.getSize().width - marginX - pageWidth,
      y: footerY,
      size: 9,
      font: bodyFont,
      color: softGrey
    });
  });

  // ---- 5. Export & download -------------------------------------------------
  const pdfBytes = await pdfDoc.save();
  const byteArray = new Uint8Array(pdfBytes);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "stateofdev-my-survey-report.pdf";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
