import {ModemCommand, ModemCommandResult, NL} from "../command";
import {logger} from "../../logger";

export type ModemCommandATGSVResult = {
  vendor: string
  model: string
  revision: string
} & ModemCommandResult

export const CommandATGSV: ModemCommand<ModemCommandATGSVResult> = {
  command: "AT+GSV",
  parser: (response) => {
    
    logger.debug(`AT+GSV response = "${response}"`)
    
    const lines = response.split(NL)
    
    const vendor = lines[1] || undefined
    const model = lines[2] || undefined
    const rev = (lines[3] || "").trim().match(/revision:(.*)/i) || [];
    
    return {
      isOk: response.indexOf(`AT+GSV${NL}`) === 0 && lines.length >= 3 && !!vendor && !!model && rev.length > 1,
      vendor: vendor || "<no_vendor>",
      model: model || "<no_model>",
      revision: rev.length > 1 ? rev[1].trim() : "<no_revision>"
    }
  }
}
