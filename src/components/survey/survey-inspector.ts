/* eslint-disable no-console */
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
      console.log(`📨 [${timestamp}] Event:`, event);
    }

    if (inspectionEvent.type === "@xstate.snapshot") {
      const { event, snapshot } = inspectionEvent;

      // Filter out transitions triggered by internal XState events
      if (event.type.startsWith("xstate.")) {
        return;
      }

      console.group(`🔄 [${timestamp}] State Transition`);
      console.log("Triggered by:", event);
      // eslint-disable-next-line ts/no-unsafe-member-access
      console.log("State:", (snapshot as any).value);
      // eslint-disable-next-line ts/no-unsafe-member-access
      console.log("Context:", (snapshot as any).context);
      console.groupEnd();
    }

    if (inspectionEvent.type === "@xstate.actor") {
      const { actorRef } = inspectionEvent;
      console.log(
        `🎭 [${timestamp}] Actor:`,
        // eslint-disable-next-line ts/no-unsafe-member-access
        (actorRef as any).id,
        inspectionEvent
      );
    }
  };
}
