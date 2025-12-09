import type { PDFFont } from "pdf-lib";
// src/lib/pdf/user-report.ts
import {
  PDFDocument,
  rgb,
  StandardFonts

} from "pdf-lib";

export interface UserReportItem {
  id: string;
  label: string;
  answer: string;
}

export interface UserReportSection {
  id: string;
  name: string;
  description?: string;
  items: UserReportItem[];
}

export interface UserReportPayload {
  userId: string;
  submittedAt: string | null;
  sections: UserReportSection[];
}

/**
 * Wrap a long text into multiple lines that fit a given width.
 */
function wrapText(
  text: string,
  maxWidth: number,
  font: PDFFont,
  fontSize: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    }
    else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Generate and trigger download of a per-user survey report PDF.
 * Created entirely client-side using pdf-lib.
 */
export async function generateUserReportPdf(
  payload: UserReportPayload
): Promise<void> {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const marginX = 50;
  const marginY = 50;
  const lineGap = 4;

  let page = pdfDoc.addPage();
  let { width, height } = page.getSize();
  let cursorY = height - marginY;

  const contentWidth = width - marginX * 2;

  const drawLine = (
    text: string,
    size: number,
    bold = false,
    color = rgb(0, 0, 0)
  ): void => {
    const usedFont = bold ? fontBold : font;
    const textHeight = size;

    if (cursorY - textHeight < marginY) {
      page = pdfDoc.addPage();
      ({ width, height } = page.getSize());
      cursorY = height - marginY;
    }

    page.drawText(text, {
      x: marginX,
      y: cursorY - textHeight,
      size,
      font: usedFont,
      color
    });

    cursorY -= textHeight + lineGap;
  };

  // --- Cover / header ------------------------------------------------------
  drawLine("StateOfDev.ma · Geeksblabla", 10, true, rgb(0.3, 0.3, 0.3));
  drawLine("State of Dev in Morocco – My Survey Report", 18, true);

  if (payload.submittedAt) {
    drawLine(
      `Submitted: ${payload.submittedAt}`,
      10,
      false,
      rgb(0.3, 0.3, 0.3)
    );
  }

  drawLine(`User ID: ${payload.userId}`, 10, false, rgb(0.3, 0.3, 0.3));
  drawLine("Website: https://stateofdev.ma", 10, false, rgb(0.3, 0.3, 0.3));

  cursorY -= 10;

  const intro
    = "This document contains the answers you submitted to the State of Dev in Morocco survey. It is intended for your personal reference.";

  const introLines = wrapText(intro, contentWidth, font, 11);
  for (const line of introLines) {
    drawLine(line, 11);
  }

  cursorY -= 14;

  // --- Sections ------------------------------------------------------------

  for (const section of payload.sections) {
    cursorY -= 8;
    drawLine(section.name, 14, true);

    if (section.description) {
      const descLines = wrapText(section.description, contentWidth, font, 10);
      for (const line of descLines) {
        drawLine(line, 10, false, rgb(0.3, 0.3, 0.3));
      }
    }

    cursorY -= 4;

    for (const item of section.items) {
      const qLines = wrapText(item.label, contentWidth, fontBold, 11);
      for (const line of qLines) {
        drawLine(line, 11, true);
      }

      const answerText = item.answer || "Not answered";
      const aLines = wrapText(answerText, contentWidth, font, 10);
      for (const line of aLines) {
        drawLine(line, 10, false, rgb(0.2, 0.2, 0.2));
      }

      cursorY -= 6;
    }

    cursorY -= 8;
  }

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
