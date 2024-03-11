import { BaseComponent } from "@flamework/components";

type LogFunctionName = ExtractKeys<typeof Log, Callback>;

const DISABLED: Partial<Record<LogFunctionName, boolean>> = {
  component: true
};

const log = (category: LogFunctionName, message: string): void => {
  if (DISABLED[category]) return;
  print(`[${category.upper()}]: ${message}`);
}

namespace Log {
  export function info(message: string): void {
    log("info", message);
  }

  export function warning(message: string): void {
    log("warning", message);
  }

  /**
   * @throws If called from server
   * @param name Name of the component class
   * @param component The component itself
   */
  export async function component(name: string, component: BaseComponent): Promise<void> {
    const { Player } = await import("./utilities/client");
    log("component", `Started ${name} on ${component.instance.GetFullName().gsub(`Players.${Player.Name}.`, "")[0]}`);
  }
}

export default Log;