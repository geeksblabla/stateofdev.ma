import { actions } from "astro:actions";

export const submitAnswers = (data: any) => {
  return actions.submitAnswers(data);
};
