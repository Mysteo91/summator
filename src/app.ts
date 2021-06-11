

const app = async () => {
  
  const util = require('util');
  const exec = util.promisify(require('child_process').exec);
  const sss = process.platform;
  async function lsExample() {
    if (sss === 'linux') {
      
      const { stdout, stderr } = await exec('ls /dev/ | grep ttyUSB');
      console.log(stdout)
      var arrayOfStrings = stdout.split('\n');
      console.log(arrayOfStrings[1]);
      
      
    }
    else {
      
      const { stdout, stderr } = await exec('type C:\\Users\\arbin\\test.txt');
      console.log('stdout:', stdout);
      console.log(typeof (stdout));
  
    }
  }
  lsExample();

}

app()

