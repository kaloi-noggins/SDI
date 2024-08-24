import { createSocket } from "dgram"
import { RemoteInfo } from "dgram"

/**Endereço IP do Multicast*/
const MULTICAST_ADDRESS = "224.0.0.1"
/**Porta do Multicast*/
const MULTICAST_PORT = 7777

/**Socket UDP*/
const socket = createSocket("udp4")

/**Mapa de occorências*/
const occurrences: Record<number, number> = {}

/**
 * Função que envia um numero aleatório entre 1 e 10 para o endereço e porta de multicast
 * definidos em *MULTICAST_ADDRESS* e *MULTICAST_PORT*
 */
function sendRandomNumber() {
    const randInt = Math.floor(Math.random() * 10) + 1
    const message = Buffer.from(randInt.toString())

    socket.send(message, MULTICAST_PORT, MULTICAST_ADDRESS, (err) => {
        if (err) {
            console.error(err)
        } else {
            console.log(`Enviado ${randInt}`)
        }
    })
}

function messageHandler(msg: Buffer, rinfo: RemoteInfo) {
    const parsedNumber = parseInt(msg.toString(),10)
    
    if (!occurrences[parsedNumber]) {
        occurrences[parsedNumber] = 0
    }

    occurrences[parsedNumber]++
    console.log(`Recebido: ${parsedNumber} de ${rinfo.address}:${rinfo.port}`)
}


function printMostFrequent(){
    let mostFrequent = null;
    let maxOccurences = 0;

    for (const number in occurrences) {
        if (occurrences[number]>maxOccurences) {
            mostFrequent = number
            maxOccurences = occurrences[number]
        }
    }

    if (mostFrequent!=null) {
        console.log(`Número mais recorrente: ${mostFrequent}. Recorrências: ${maxOccurences}`)
        for (const number in occurrences) {
            occurrences[number] = 0
        }
    }
}

socket.bind(MULTICAST_PORT, ()=>{
    socket.addMembership(MULTICAST_ADDRESS)
    console.log(`Escutando por mensagens multicast em ${MULTICAST_ADDRESS}:${MULTICAST_PORT}`);
})

socket.on("message", messageHandler)

setInterval(sendRandomNumber,1000)
setInterval(printMostFrequent,5000)