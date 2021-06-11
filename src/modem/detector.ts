import {ModemInfo} from "./modem";
import SerialPort, {PortInfo} from "serialport";
import {logger} from "../logger";
import {CommandAT} from "./command/at";
import {CommandATI} from "./command/ati";
import {execCommandAndWaitResult} from "./command";
import {CommandATGSV} from "./command/at_gsv";
import {delay} from "../utils";

export const detectModems = (): Promise<ModemInfo[]> => {
  
  return new Promise((resolve, reject) => {
    
    SerialPort.list()
      .then((ports) => {
  
        const modems: ModemInfo[] = []
        
        const promises = ports
          //.filter(portInfo => portInfo.path === "COM11")
          .map(portInfo => new Promise((portResolve) => {
  
          const openedPort = new SerialPort(portInfo.path, { baudRate: 115200 }, async (err) => {
            
            if (err) {
              
              logger.debug(`Port ${portInfo.path} can't be opened`)
              
              portResolve(false)
              
            } else {
              
              logger.debug(`Port ${portInfo.path} is open`)
              await delay(5000)
              identifyModemOnPort(openedPort, portInfo)
                .then((modem) => {
                  
                  modems.push(modem)
  
                  logger.info(`Querying port ${portInfo.path} OK`)
                  
                  portResolve(true)
                  
                })
                .catch((err) => {
  
                  logger.warn(`Querying port ${portInfo.path} failed (${err})`)
                  
                  portResolve(false)
                
                })
                .finally(() => {
                  
                  openedPort.close((err) =>
                    err && logger.warn(`Port ${portInfo.path} closed with error. Skipping.`)
                  )
                })
            }
          })
        }))
        
        Promise.all(promises)
          .then(() => resolve(modems))
          .catch(reject)
        
      })
      .catch(reject)
  })
}

const identifyModemOnPort = (port: SerialPort, portInfo: PortInfo): Promise<ModemInfo> => {
  
  return new Promise((resolve, reject) => {
    
    execCommandAndWaitResult(port, CommandAT)
      .then((atResult) => {
        
        if (!atResult.isOk) {
          
          reject(new Error("AT command returned NOT OK."))
          
        } else {
  
          execCommandAndWaitResult(port, CommandATI)
            .then((atiResult) => {
      
              if (!atiResult.isOk) {
                
                execCommandAndWaitResult(port, CommandATGSV)
                  .then((atigsvResult) => {
                    if (!atigsvResult.isOk){
                      
                      reject(new Error("ATI and AT+GSV command returned NOT OK"))
                      
                    } else {
                      
                      resolve({
                        ...atigsvResult,
                        portInfo: portInfo
                      })
                    }
                  })
                
              } else {
                
                resolve({
                  ...atiResult,
                  portInfo: portInfo
                })
              }
      
            })
            .catch(reject)
        }
        
      })
      .catch(reject)
  })
}
