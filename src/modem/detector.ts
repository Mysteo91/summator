import {ModemInfo} from "./modem";
import SerialPort, {PortInfo} from "serialport";
import {logger} from "../logger";
import {CommandAT} from "./command/at";
import {CommandATI} from "./command/ati";
import {execCommandAndWaitResult} from "./command";
import {CommandATGSV} from "./command/at_gsv";

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ping -n 3 8.8.8.8');
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}
console.log(`This platform is ${process.platform}`);
lsExample();
