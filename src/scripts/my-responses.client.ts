import type { UserReportPayload } from "../lib/pdf/user-report";
import { generateUserReportPdf } from "../lib/pdf/user-report";

function getPayload(): UserReportPayload | null {
  const dataEl = document.getElementById("my-responses-data");

  if (!dataEl) {
    console.warn("[my-responses] #my-responses-data not found");
    return null;
  }

  const raw = dataEl.getAttribute("data-payload") || "{}";

  try {
    const parsed = JSON.parse(raw) as UserReportPayload;
    return parsed;
  }
  catch (error) {
    console.error("[my-responses] Failed to parse PDF payload", error);
    return null;
  }
}

function setupDownloadButton(): void {
  const button = document.getElementById("download-pdf");
  const errorEl = document.getElementById("pdf-error");

  if (!button) {
    console.warn("[my-responses] #download-pdf not found");
    return;
  }

  const payload = getPayload();
  if (!payload) {
    if (errorEl) {
      errorEl.classList.remove("hidden");
    }
    return;
  }

  button.addEventListener("click", () => {
    if (errorEl) {
      errorEl.classList.add("hidden");
    }

    void generateUserReportPdf(payload).catch((error) => {
      console.error("[my-responses] Failed to generate PDF report", error);
      if (errorEl) {
        errorEl.classList.remove("hidden");
      }
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  setupDownloadButton();
});
