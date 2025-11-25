import type { InspectionEvent } from "xstate";

export function createSurveyInspector() {
  return (inspectionEvent: InspectionEvent) => {
    const timestamp = new Date().toISOString().split("T")[1].split(".")[0];

    if (inspectionEvent.type === "@xstate.event") {
      const { event } = inspectionEvent;
      // Filter out internal XState events
      if (event.type.startsWith("xstate.")) {
        return;
      }
      console.warn(`📨 [${timestamp}] Event:`, event);
    }

    if (inspectionEvent.type === "@xstate.snapshot") {
      const { event, snapshot } = inspectionEvent;

      // Filter out transitions triggered by internal XState events
      if (event.type.startsWith("xstate.")) {
        return;
      }

      // eslint-disable-next-line no-console
      console.group(`🔄 [${timestamp}] State Transition`);
      console.warn("Triggered by:", event);
      // eslint-disable-next-line ts/no-unsafe-member-access
      console.warn("State:", (snapshot as any).value);
      // eslint-disable-next-line ts/no-unsafe-member-access
      console.warn("Context:", (snapshot as any).context);
      // eslint-disable-next-line no-console
      console.groupEnd();
    }

    if (inspectionEvent.type === "@xstate.actor") {
      const { actorRef } = inspectionEvent;
      console.warn(
        `🎭 [${timestamp}] Actor:`,
        // eslint-disable-next-line ts/no-unsafe-member-access
        (actorRef as any).id,
        inspectionEvent
      );
    }
  };
}
