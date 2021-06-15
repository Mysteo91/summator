import SerialPort from "serialport";
import isMockFunction = jest.isMockFunction;
import util from 'util';


const getSerialPortList = async (): Promise<string[]>  => {

  if (process.platform === 'linux') {
        const exec = util.promisify(require('child_process').exec);
        
        const { stdout } = await exec('ls /dev/ | grep ttyUSB');
        
        return stdout.split('\n');
        
      
  
  
  }
  else {
    
    const portInfo = await SerialPort.list();
    
    return portInfo.map(it => it.path)
  };

}

export default getSerialPortList;
