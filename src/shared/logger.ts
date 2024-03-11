import { BaseComponent } from "@flamework/components";

type LogFunctionName = ExtractKeys<typeof Log, Callback>;

const DISABLED: Partial<Record<LogFunctionName, boolean>> = {

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
  export async function client_component(name: string, component: BaseComponent): Promise<void> {
    const { Player } = await import("./utilities/client");
    log("client_component", `Started ${name} on ${component.instance.GetFullName().gsub(`Players.${Player.Name}.`, "")[0]}`);
  }

  /**
   * @param name Name of the component class
   * @param component The component itself
   */
  export function server_component(name: string, component: BaseComponent): void {
    log("server_component", `Started ${name} on ${component.instance.GetFullName()}`);
  }

  /**
   * @param name Name of the controller
   */
  export function controller(name: string): void {
    log("controller", `Started ${name}`);
  }

  /**
   * @param name Name of the service
   */
  export function service(name: string): void {
    log("service", `Started ${name}`);
  }
}

export default Log;