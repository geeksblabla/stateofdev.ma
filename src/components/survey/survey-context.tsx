import type { ReactNode } from "react";
import type { SurveyContext } from "./survey-machine";
import type { SurveyQuestionsYamlFile } from "@/lib/validators/survey-schema";
import { createActorContext } from "@xstate/react";
import { useEffect } from "react";
import { createSurveyInspector } from "./survey-inspector";
import { surveyMachine } from "./survey-machine";

const STORAGE_KEY = "survey-state";
const STORAGE_VERSION = 1;

interface PersistedState {
  version: number;
  currentSectionIdx: number;
  currentQuestionIdx: number;
  answers: Record<string, number | number[] | null | string>;
}

function loadPersistedState(): Partial<SurveyContext> | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored)
      return null;

    const parsed = JSON.parse(stored) as PersistedState;

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
  }
  catch (error) {
    console.error("Failed to load persisted survey state:", error);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function persistState(context: SurveyContext) {
  try {
    const toPersist: PersistedState = {
      version: STORAGE_VERSION,
      currentSectionIdx: context.currentSectionIdx,
      currentQuestionIdx: context.currentQuestionIdx,
      answers: context.answers
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
  }
  catch (error) {
    console.error("Failed to persist survey state:", error);
  }
}

function clearPersistedState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  }
  catch (error) {
    console.error("Failed to clear persisted survey state:", error);
  }
}

// Create the actor context
export const SurveyMachineContext = createActorContext(surveyMachine);

interface SurveyProviderProps {
  sections: SurveyQuestionsYamlFile[];
  children: ReactNode;
}

export function SurveyProvider({ sections, children }: SurveyProviderProps) {
  const persisted = loadPersistedState();

  return (
    <SurveyMachineContext.Provider
      options={{
        input: {
          sections,
          persisted: persisted || undefined
        },
        inspect:
          import.meta.env.DEV && import.meta.env.MODE !== "test"
            ? createSurveyInspector()
            : undefined
      }}
    >
      <PersistenceHandler />
      {children}
    </SurveyMachineContext.Provider>
  );
}

// Internal component to handle persistence side effects
function PersistenceHandler() {
  const context = SurveyMachineContext.useSelector(state => state.context);
  const value = SurveyMachineContext.useSelector(state => state.value);

  useEffect(() => {
    if (value === "complete") {
      clearPersistedState();
    }
    else {
      persistState(context);
    }
  }, [context, value]);

  return null;
}
