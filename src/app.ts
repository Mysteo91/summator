

const app = async () => {
  
  const util = require('util');
  const exec = util.promisify(require('child_process').exec);
  
  async function lsExample() {
    const { stdout, stderr } = await exec('ping -n 3 8.8.8.8');
    console.log('stdout:', stdout);
    console.error('stderr:', stderr);
  }
  console.log(`This platform is ${process.platform}`);
  lsExample();

}

app()

