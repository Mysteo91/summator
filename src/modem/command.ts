import SerialPort from "serialport";
import Readline = SerialPort.parsers.Readline;

export type ModemCommandResult = {
  isOk: boolean
}

export type ModemCommand<T extends ModemCommandResult> = {
  command: string
  parser: (response: string) => T
};

export const NL = "\r\n"
const END = "OK"

export function execCommandAndWaitResult<T extends ModemCommandResult> (port: SerialPort,
                                                                        command: ModemCommand<T>,
                                                                        timeoutMs: number = 1000): Promise<T> {
  
  return new Promise((resolve, reject) => {
  
    const pipe = port.pipe(new Readline({ delimiter: NL }))
  
    const resultBuffer: string[] = []
    
    pipe.on('data', (line) => {
      
      resultBuffer.push(line)
    
      if (line.trim() === END) {
        pipe.end()
      }
    })
    
    pipe.on('end', () => endReceiving(command, pipe, resultBuffer, resolve, reject))
    pipe.on('error', (err) => {
      if (err) {
        endReceiving(command, pipe, resultBuffer, resolve, reject, err)
      }
    })
    
    port.write(`${command.command}${NL}`, (err) => {
      if (err) {
        endReceiving(command, pipe, resultBuffer, resolve, reject, err)
      }
    })
  
    setTimeout(() => {
      
      endReceiving(command, pipe, resultBuffer,
        resolve, reject,
        new Error(`No response from port in timeout ${timeoutMs}ms`)
      )
    
    }, timeoutMs)
  })
}

function endReceiving<T extends ModemCommandResult> (command: ModemCommand<T>,
                                                     pipe: Readline,
                                                     result: string[],
                                                     resolve: any, reject: any,
                                                     err?: Error|null) {
  
  if (result.length > 0) {
    
    resolve(command.parser(
      result.map(line => line.trim())
        .filter(line => line.length > 0)
        .join(NL)
        .trim())
    )
    
  } else {
    
    reject(err ? err : new Error(`Unknown error`))
    
  }
}
