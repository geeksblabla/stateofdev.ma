import type { UserReportPayload } from "@/lib/pdf/user-report";
import {
  generateUserReportPdf

} from "@/lib/pdf/user-report";

function setupDownloadButton(): void {
  const button = document.getElementById("download-pdf");
  const dataEl = document.getElementById("my-responses-data");
  const errorEl = document.getElementById("pdf-error");

  if (!button || !dataEl) {
    console.warn("[my-responses] Missing button or data element", {
      button,
      dataEl
    });
    return;
  }

  let payload: UserReportPayload | null = null;

  try {
    const raw = dataEl.getAttribute("data-payload") || "{}";
    payload = JSON.parse(raw) as UserReportPayload;
  }
  catch (error) {
    console.error("[my-responses] Failed to parse PDF payload", error);
    if (errorEl) {
      errorEl.classList.remove("hidden");
    }
    return;
  }

  button.addEventListener("click", () => {
    if (!payload) {
      return;
    }

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

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    setupDownloadButton();
  });
}
