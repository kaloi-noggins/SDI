import amqp from 'amqplib';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { OperatorPrices, OperatorStats, Vehicle } from "./types/vehicle";

/**
 * IP do host RabbitMQ
 */
const RABBITMQ_HOST: string = process.env.RABBITMQ_HOST!;

/**
 * Custos do operado OPERADOR_1
 */
const OPERADOR_1_PRICES: OperatorPrices = JSON.parse(process.env.OPERADOR_1_PRICES!)

/**
 * Custos do operado OPERADOR_2
 */
const OPERADOR_2_PRICES: OperatorPrices = JSON.parse(process.env.OPERADOR_2_PRICES!)

/**
 * Custos do operado OPERADOR_3
 */
const OPERADOR_3_PRICES: OperatorPrices = JSON.parse(process.env.OPERADOR_3_PRICES!)

/**
 * Custos do operado NAO_INDENTIFICADO
 */
const NAO_INDENTIFICADO_PRICES: OperatorPrices = JSON.parse(process.env.NAO_INDENTIFICADO_PRICES!)

/**
 * Data de início da execução do programa
 */
const START_DATE = new Date().toISOString();

/**
 * Função que atualiza os logs do operador em disco
 * @param vehicle 
 * @param OPERATOR_QUEUE_NAME 
 */
function writeConsumerLog(vehicle: Vehicle, OPERATOR_QUEUE_NAME: Vehicle["operator"]) {
    const logDir = path.resolve(__dirname, `../logs/${OPERATOR_QUEUE_NAME}`);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }

    const vehicleLogPath = path.resolve(logDir, `vehicles_${START_DATE}.txt`);
    fs.appendFileSync(vehicleLogPath, `${JSON.stringify(vehicle)}\n`);

    const statsLogPath = path.resolve(logDir, `stats_${START_DATE}.json`);
    const statsFileDescriptor = fs.openSync(statsLogPath, "a+");
    let stats: OperatorStats;

    const statsContent = fs.readFileSync(statsFileDescriptor, "utf-8");
    if (statsContent) {
        stats = JSON.parse(statsContent);
    } else {
        stats = {
            totalVehicleCount: 0,
            totalToll: 0,
            A: { vehiclesCount: 0, tollCount: 0 },
            B: { vehiclesCount: 0, tollCount: 0 },
            C: { vehiclesCount: 0, tollCount: 0 },
            D: { vehiclesCount: 0, tollCount: 0 },
            E: { vehiclesCount: 0, tollCount: 0 }
        };
    }

    stats.totalVehicleCount += 1;
    switch (OPERATOR_QUEUE_NAME) {
        case "OPERADOR_1":
            stats.totalToll += OPERADOR_1_PRICES[vehicle.vehicleCategory];
            stats[vehicle.vehicleCategory].vehiclesCount += 1;
            stats[vehicle.vehicleCategory].tollCount += OPERADOR_1_PRICES[vehicle.vehicleCategory];
            break;
        case 'OPERADOR_2':
            stats.totalToll += OPERADOR_2_PRICES[vehicle.vehicleCategory];
            stats[vehicle.vehicleCategory].vehiclesCount += 1;
            stats[vehicle.vehicleCategory].tollCount += OPERADOR_2_PRICES[vehicle.vehicleCategory];
            break;
        case 'OPERADOR_3':
            stats.totalToll += OPERADOR_3_PRICES[vehicle.vehicleCategory];
            stats[vehicle.vehicleCategory].vehiclesCount += 1;
            stats[vehicle.vehicleCategory].tollCount += OPERADOR_3_PRICES[vehicle.vehicleCategory];
            break;
        case 'NAO_INDENTIFICADO':
            stats.totalToll += NAO_INDENTIFICADO_PRICES[vehicle.vehicleCategory];
            stats[vehicle.vehicleCategory].vehiclesCount += 1;
            stats[vehicle.vehicleCategory].tollCount += NAO_INDENTIFICADO_PRICES[vehicle.vehicleCategory];
            break;
    }

    fs.writeFileSync(statsLogPath, JSON.stringify(stats,null,2));
}


/**
 * Inicializa o consumirdo do operador *OPERATOR_QUEUE_NAME*
 * @param OPERATOR_QUEUE_NAME 
 */
async function startConsumer(OPERATOR_QUEUE_NAME: Vehicle["operator"]) {
    try {
        console.log("Estabelecendo conexão...");
        const connection = await amqp.connect(`amqp://${RABBITMQ_HOST}`);
        console.log("Criando canal...");
        const channel = await connection.createChannel();

        // Criação das filas de mensagens dos operadores
        console.log(`Estabelecendo conexão com a fila ${OPERATOR_QUEUE_NAME}...`);
        await channel.assertQueue(`${OPERATOR_QUEUE_NAME}`);

        // consome as mensagens da fila
        console.log(`Conectado com a fila ${OPERATOR_QUEUE_NAME}. Aguardando mensagens..`);
        channel.consume(OPERATOR_QUEUE_NAME, (msg) => {
            if (msg) {
                const vehicle: Vehicle = JSON.parse(msg.content.toString())

                console.log(`Veículo recebido na pelo consumidor de ${OPERATOR_QUEUE_NAME}:`)
                console.log(vehicle)

                // Atualiza os logs do operador em disco
                writeConsumerLog(vehicle, OPERATOR_QUEUE_NAME)

                // Envia um ACK para informar o RabbitMQ que a 
                // mensagem foi consumida com sucesso
                channel.ack(msg)
            }
        })
    } catch (error) {
        console.error(error)
    }
}

// Recebe o nome da fila que será consumida atráves da linha de comando
if (process.argv[2] && ["OPERADOR_1", "OPERADOR_2", "OPERADOR_3", "NAO_INDENTIFICADO"].some(opearador => opearador == process.argv[2])) {
    console.log(`Operador selecionado: ${process.argv[2]}`)
    startConsumer(process.argv[2] as Vehicle["operator"])
} else {
    console.log("Por favor forneça um nome válido para a fila do operador.\nNomes válidos: OPERADOR_1, OPERADOR_2, OPERADOR_3, NAO_INDENTIFICADO")
}