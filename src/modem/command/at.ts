import {ModemCommand, ModemCommandResult, NL} from "../command";
import {logger} from "../../logger";

export type CommandATResult = {

} & ModemCommandResult

export const CommandAT: ModemCommand<CommandATResult> = {
  command: "AT",
  parser: (response) => {
    
    logger.debug(`AT response = "${response}"`)
    
    return {
      isOk: response.indexOf(`AT${NL}OK`) !== -1
    }
  }
}
