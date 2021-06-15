import getSerialPortList from './serial_list'

const app = async () => {

 const paths = await getSerialPortList();
 console.log(paths)

}
  







app()

