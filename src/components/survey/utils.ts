import { actions } from "astro:actions";

export async function submitAnswers(data: Parameters<typeof actions.submitAnswers>[0]) {
  return actions.submitAnswers(data);
}

export function goToThanksPage() {
  window.location.href = "/thanks";
}
