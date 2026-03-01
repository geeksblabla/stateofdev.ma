import type { PDFFont } from "pdf-lib";
import type { UserReportPayload } from "./user-report";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  generateUserReportPdf,
  sanitizeForPdf,
  wrapText

} from "./user-report";

/**
 * Small fake font object – only widthOfTextAtSize is needed by wrapText.
 */
const fakeFont: PDFFont = {
  widthOfTextAtSize: (text: string, size: number) =>
    text.length * size * 0.5
} as unknown as PDFFont;

describe("sanitizeForPdf", () => {
  it("keeps regular ASCII text as-is", () => {
    expect(sanitizeForPdf("Hello World! 123")).toBe("Hello World! 123");
  });

  it("strips emojis and non-WinAnsi characters", () => {
    const input = "Hello 😊 World 🌍";
    const output = sanitizeForPdf(input);

    // We expect emojis to be removed but basic letters/spaces kept
    expect(output).toBe("Hello  World ");
  });

  it("returns empty string for empty input", () => {
    expect(sanitizeForPdf("")).toBe("");
  });
});

describe("wrapText", () => {
  it("wraps long text into multiple lines based on max width", () => {
    const text = "one two three four five six seven eight";
    const lines = wrapText(text, 40, fakeFont, 10);

    expect(lines.length).toBeGreaterThan(1);
    const joined = lines.join(" ");
    expect(joined).toContain("one");
    expect(joined).toContain("eight");
  });

  it("returns a single line when text fits in max width", () => {
    const text = "short text";
    const lines = wrapText(text, 1000, fakeFont, 10);

    expect(lines.length).toBe(1);
    expect(lines[0]).toBe("short text");
  });
});

describe("generateUserReportPdf", () => {
  let originalDocument: Document | undefined;
  let originalURL: typeof URL | undefined;

  let createElementMock: ReturnType<typeof vi.fn>;
  let appendChildMock: ReturnType<typeof vi.fn>;
  let createObjectURLMock: ReturnType<typeof vi.fn>;
  let revokeObjectURLMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Save originals to restore later
    originalDocument = globalThis.document;
    originalURL = globalThis.URL;

    const fakeLink = {
      href: "",
      download: "",
      click: vi.fn(),
      remove: vi.fn()
    } as unknown as HTMLAnchorElement;

    createElementMock = vi.fn(() => fakeLink);
    appendChildMock = vi.fn();
    createObjectURLMock = vi.fn(() => "blob:fake");
    revokeObjectURLMock = vi.fn();

    globalThis.document = {
      createElement: createElementMock,
      body: {
        appendChild: appendChildMock
      }
    } as unknown as Document;

    globalThis.URL = {
      createObjectURL: createObjectURLMock,
      revokeObjectURL: revokeObjectURLMock
    } as unknown as typeof URL;
  });

  afterEach(() => {
    vi.restoreAllMocks();

    if (originalDocument) {
      globalThis.document = originalDocument;
    }

    if (originalURL) {
      globalThis.URL = originalURL;
    }
  });

  it("generates a PDF and triggers a download without throwing", async () => {
    const payload: UserReportPayload = {
      userId: "test-user",
      submittedAt: "2025-01-01T00:00:00Z",
      sections: [
        {
          id: "profile",
          name: "Profile",
          items: [
            {
              id: "profile-q-0",
              label: "What is your gender?",
              answer: "Male"
            },
            {
              id: "profile-q-1",
              label: "What is your age?",
              answer: "25 to 34 years"
            }
          ]
        }
      ]
    };

    await expect(generateUserReportPdf(payload)).resolves.toBeUndefined();

    // Assert that our DOM/URL mocks were actually used
    expect(createElementMock).toHaveBeenCalledWith("a");
    expect(appendChildMock).toHaveBeenCalled();
    expect(createObjectURLMock).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalled();
  });
});
