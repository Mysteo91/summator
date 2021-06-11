

const app = async () => {
  
  const util = require('util');
  const exec = util.promisify(require('child_process').exec);
  const sss = process.platform;
  async function lsExample() {
    if (sss === 'linux') {
      
      const { stdout, stderr } = await exec('ls /dev/ | grep ttyUSB');
      for (let val in stdout){
        
        console.log(val)
        
      }
      
    }
    else {
      
      const { stdout, stderr } = await exec('ping -n 3 8.8.8.8');
      console.log('stdout:', stdout);
      console.error('stderr:', stderr);
      
    }
  }
  lsExample();

}

app()

