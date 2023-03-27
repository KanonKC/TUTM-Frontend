const macAddress = require('node-macaddress')

async function getMacAddress(){
    await macAddress.one((err, addr) => {
        if(!err){
            return addr
        }
        return "00:00:00:00:00:00"
    })
}

getMacAddress().then(res => console.log(res))