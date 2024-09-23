import amqp from "amqplib";
import 'dotenv/config';
import fs from "fs";
import path from "path";
import { Vehicle } from "./types/vehicle";

/**
 * IP do host RabbitMQ
 */
const RABBITMQ_HOST: string = process.env.RABBITMQ_HOST!;

/**
 * Frequência de produção de veículos, em ms
 */
const VEHICLE_DISPATCH_INTERVAL: number = parseInt(process.env.VEHICLE_DISPATCH_INTERVAL!);

/**
 * Número de veículos a serem gerados. -1 indica que devem ser gerados
 * infinitos veículos
 */
const VEHICLE_COUNT: number = parseInt(process.env.VEHICLE_COUNT!);

/**
 * Data de início da execução do programa
 */
const START_DATE =  new Date().toISOString();

async function startProducer() {
    try {
        console.log("Estabelecendo conexão...");
        const connection = await amqp.connect(`amqp://${RABBITMQ_HOST}`);
        console.log("Criando canal...");
        const channel = await connection.createChannel();

        // Criação das filas de mensagens dos operadores
        console.log("Criando filas...");
        await channel.assertQueue("OPERADOR_1",);
        await channel.assertQueue("OPERADOR_2",);
        await channel.assertQueue("OPERADOR_3",);
        await channel.assertQueue("NAO_IDENTIFICADO");

        console.log("Tudo pronto! Gerando veículos...");
        let generateVehicleCount = 0;
        let isChannelClosed = false; // Flag para garantir que o canal feche uma única vez

        const producerInterval = setInterval(() => {
            const categoriasVeiculos = ["A", "B", "C", "D", "E"];
            const operadores = ["OPERADOR_1", "OPERADOR_2", "OPERADOR_3", "NAO_IDENTIFICADO"];

            const newVehicle: Vehicle = {
                licensePlate: (Math.random() + 1).toString(36).substring(5).toUpperCase(),
                vehicleCategory: categoriasVeiculos[Math.floor(Math.random() * categoriasVeiculos.length)] as Vehicle["vehicleCategory"],
                operator: operadores[Math.floor(Math.random() * operadores.length)] as Vehicle['operator']
            };

            channel.sendToQueue(newVehicle.operator, Buffer.from(JSON.stringify(newVehicle)));

            console.log("Veículo gerado:");
            console.log(newVehicle);

            const logDir = path.resolve(__dirname, `../logs`);
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
            }

            const logPath = path.resolve(__dirname, `../logs/producer_log_${START_DATE}.txt`);
            fs.appendFileSync(logPath, `${JSON.stringify(newVehicle)}\n`);

            generateVehicleCount++;
        }, VEHICLE_DISPATCH_INTERVAL);

        // Cria um intervalo de checagem se veículos não forem infinitos
        if (VEHICLE_COUNT != -1) {
            const checkInterval = setInterval(() => {
                if (generateVehicleCount === VEHICLE_COUNT && !isChannelClosed) {
                    clearInterval(producerInterval);
                    clearInterval(checkInterval);
                    console.log("Encerrando conexão...");
                    channel.close().then(() => {
                        isChannelClosed = true; // Marca o canal como fechado
                        return connection.close();
                    }).then(() => {
                        console.log("Conexão encerrada.");
                    }).catch((error) => {
                        console.error("Erro ao fechar o canal/conexão:", error);
                    });
                }
            }, 1000);
        }
    } catch (error) {
        console.error("Erro ao iniciar o produtor:", error);
    }
}

startProducer();
