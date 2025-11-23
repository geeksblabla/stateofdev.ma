import { createActorContext } from "@xstate/react";
import { useEffect, type ReactNode } from "react";
import { surveyMachine, type SurveyContext } from "./survey-machine";
import { createSurveyInspector } from "./survey-inspector";

const STORAGE_KEY = "survey-state";
const STORAGE_VERSION = 1;

type PersistedState = {
  version: number;
  currentSectionIdx: number;
  currentQuestionIdx: number;
  answers: Record<string, number | number[] | null | string>;
};

const loadPersistedState = (): Partial<SurveyContext> | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed: PersistedState = JSON.parse(stored);

    // Version check - clear if outdated
    if (parsed.version !== STORAGE_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return {
      currentSectionIdx: parsed.currentSectionIdx,
      currentQuestionIdx: parsed.currentQuestionIdx,
      answers: parsed.answers
    };
  } catch (error) {
    console.error("Failed to load persisted survey state:", error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

const persistState = (context: SurveyContext) => {
  try {
    const toPersist: PersistedState = {
      version: STORAGE_VERSION,
      currentSectionIdx: context.currentSectionIdx,
      currentQuestionIdx: context.currentQuestionIdx,
      answers: context.answers
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
  } catch (error) {
    console.error("Failed to persist survey state:", error);
  }
};

export const clearPersistedState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear persisted survey state:", error);
  }
};

// Create the actor context
export const SurveyMachineContext = createActorContext(surveyMachine);

type SurveyProviderProps = {
  sections: SurveyQuestionsYamlFile[];
  children: ReactNode;
};

export const SurveyProvider = ({ sections, children }: SurveyProviderProps) => {
  const persisted = loadPersistedState();

  return (
    <SurveyMachineContext.Provider
      options={{
        input: {
          sections,
          persisted: persisted || undefined
        },
        inspect: import.meta.env.DEV ? createSurveyInspector() : undefined
      }}
    >
      <PersistenceHandler />
      {children}
    </SurveyMachineContext.Provider>
  );
};

// Internal component to handle persistence side effects
const PersistenceHandler = () => {
  const context = SurveyMachineContext.useSelector((state) => state.context);
  const value = SurveyMachineContext.useSelector((state) => state.value);

  useEffect(() => {
    if (value === "complete") {
      clearPersistedState();
    } else {
      persistState(context);
    }
  }, [context, value]);

  return null;
};
