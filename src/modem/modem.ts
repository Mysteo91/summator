import {PortInfo} from "serialport";
import {ModemCommandATIResult} from "./command/ati";

export type ModemInfo = {
  portInfo: PortInfo
} & ModemCommandATIResult
