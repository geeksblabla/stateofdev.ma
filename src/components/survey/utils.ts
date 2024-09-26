import { actions } from "astro:actions";

export const submitAnswers = (
  data: Parameters<typeof actions.submitAnswers>[0]
) => {
  return actions.submitAnswers(data);
};

export const goToThanksPage = () => {
  window.location.href = "/thanks";
};
