import { logger } from "./logger";
import {detectModems} from "./modem/detector";

const app = async () => {
  
  logger.info('Starting summator app...')
  
  detectModems()
    .then((modems) => {
      logger.info(`Modems found = ${modems.length}`)
  
      modems.forEach(modem => logger.info(`Modem "${modem.vendor}", "${modem.model}", rev "${modem.revision}" is on ${modem.portInfo.path}`))
    })
    .catch(logger.error)
}

app()
  .catch(logger.error)
