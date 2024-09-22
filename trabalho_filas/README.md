# Trabalho de Filas com RabbitMQ

O presente trabalho simula um pedágio com multiplos operadores (empresas que fornecem serviço de passagem sem parada para pagar), onde cada operador recebe um veículo com uma placa, categoria e um operador associado, sendo isso uma abstração das tags destes veículos, que estariam associadas aos operadores. Segue a definição de veículo utilizada, presente em src/types/vehicle.ts:

```ts
export interface Vehicle {
  licensePlate: string;
  vehicleCategory: "A" | "B" | "C" | "D" | "E";
  operator: "OPERADOR_1" | "OPERADOR_2" | "OPERADOR_3" | "NAO_INDENTIFICADO";
}
```

Existem 4 operadores, _OPERADOR_1_, _OPERADOR_2_, _OPERADOR_3_, que representam operadores quaisquer, eum 4ºchamadao _NAO_INDENTIFICADO_, que representa o operador que recebe os veículos que não possuem/não tiveram suas tags identificadas no pedágio, e que aplica uma multa nos veículos.

No repositório, há os seguintes arquivos importantes:

- .env: Arquivo com as configurações utilizadas no programa. Segue abaixo um exemplo de .env e significado de cada uma das varáveis de ambiente:

  ```.env
  RABBITMQ_HOST=localhost
  VEHICLE_DISPATCH_INTERVAL=1000
  VEHICLE_COUNT=-1
  OPERADOR_1_PRICES='{"A":4,"B":6,"C":9,"D":12,"E":22}'
  OPERADOR_2_PRICES='{"A":4.5,"B":7,"C":10.15,"D":14,"E":20}'
  OPERADOR_3_PRICES='{"A":3.5,"B":5.5,"C":8.5,"D":12,"E":25}'
  NAO_INDENTIFICADO_PRICES='{"A":150,"B":150,"C":150,"D":150,"E":150}'
  ```

  - RABBITMQ_HOST: Host do RabbitMQ
  - VEHICLE_DISPATCH_INTERVAL: Intervalo de criação de veículos, em ms, utilizado em src/producer.ts
  - VEHICLE_COUNT: Número de veículos a serem criados pelo produtor de mensagens. Use -1 para criar veículos indefinidamente.
  - OPERADOR_1_PRICES: Preços praticados pelo OPERADOR_1, para cada um das categorias de veículos.
  - OPERADOR_2_PRICES: Preços praticados pelo OPERADOR_2, para cada um das categorias de veículos.
  - OPERADOR_3_PRICES: Preços praticados pelo OPERADOR_3, para cada um das categorias de veículos.
  - NAO_INDENTIFICADO_PRICES: Preços praticados pelo NAO_INDENTIFICADO, para cada um das categorias de veículos, representando as multas aplicadas.

    Segue a definição de preços utilizada, presente em src/types/vehicle.ts:

    ```ts
    export interface OperatorPrices {
        A: number;
        B: number;
        C: number;
        D: number;
        E: number;
    }
    ```

- src/producer.ts: Arquivo que produz veículos aleatórios para serem enviados para as filas dos operadores, sendo uma abstração do pedágio.
- src/consumer.ts: Arquivo que consome as mensagens produzidas por src/producer.ts. O programa utiliza variáveis de ambiente para cobrar os preços de cada operador e um argumento passado para ele para conectar-se as filas dos operadores.
- src/types/vehicle.ts: Arquivo com os tipos utilizados no programa.

## Requisitos

É necessário ter instalado Node na versão mais recente. Instruções para realizar a instalação podem ser encontradas [no site oficial](https://nodejs.org/en/download/package-manager).

Segue o script de instalação:

```bash
# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# download and install Node.js (you may need to restart the terminal)
nvm install --lts

# verifies the right Node.js version is in the environment
node -v # should print `v20.17.0`

# verifies the right npm version is in the environment
npm -v # should print `10.8.2`
```

Além disso, é necessário uma [instância de RabbitMQ](https://www.rabbitmq.com/). Recomenda-se utilizar o [Docker](https://www.docker.com/) com a [imagem oficial](https://hub.docker.com/_/rabbitmq?uuid=a3406cd1-65e5-4936-abc8-b2bed8156a8f%0A) do RabbitMQ.

## Instruções de Execução

- Vá para a pasta raiz do projeto
- Execute `npm install` para instalar as dependências do projeto
- Execute `npm run build` para compilar o projeto
- Execute `npm run consumer:NOME_OPERADOR` em um terminal (ou máquina remota) para executar o programa, onde `NOME_OPERADOR` é o nome de um dos operadores em [`OPERADOR_1`, `OPERADOR_2`, `OPERADOR_3`, `NAO_INDENTIFICADO`]
- Execute o passo anterior para cada um dos operadores listados
- Execute `npm run producer` para iniciar a produção das mensagens

Os preços dos operadores e a geração de veículos podem ser configuradas utilizando as variáveis de ambiente, como já citado.

O programa irá gerar logs na pasta logs. O produtor irá gerar um log em logs/, que contem uma lista dos veículos produzidos, e cada um dos consumidores irá gerar um log em logs/NOME_OPERADOR/, sendo um log com a lista de veículos recebidos, e outro um log com métricas do operador, sendo essas: total de veículos recebidos, total arrecadado, e contagem do que foi arrecadado e quantidade de veículos por categoria de veículo. Segue a definição das métricas presente em src/types/vehicle.ts.

```ts
export interface OperatorStats {
  totalVehicleCount: number;
  totalToll: number;
  A: { vehiclesCount: number; tollCount: number };
  B: { vehiclesCount: number; tollCount: number };
  C: { vehiclesCount: number; tollCount: number };
  D: { vehiclesCount: number; tollCount: number };
  E: { vehiclesCount: number; tollCount: number };
}
```

Os logs podem ser utilizados para checar se os veículos gerados pelo produtor estão sendo encaminhados para os consumidores corretos.

## Dupla

    André de Campos, Kalyl Henings
