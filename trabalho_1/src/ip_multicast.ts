import { randomInt } from "crypto";
import { createSocket } from "dgram";
import 'dotenv/config';

const IP = process.env.IP!
const PORT = parseInt(process.env.PORT!)

const soc = createSocket("udp4",(msg,rinfo)=>{
    console.log(msg,rinfo)
})

soc.on("message",(msg,rinfo)=>{
    console.log(`Nova mensagem de ${rinfo.address}:${rinfo.port}: ${msg.toString("utf-8")}`)
})

setInterval(()=>{
    soc.send(randomInt(10).toString(),PORT,IP)
},2000)

// soc.setBroadcast(true)
soc.bind(PORT,IP)

