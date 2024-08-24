
# Contabilizador de Números Usando Multicast

O trabalho deve obrigatoriamente usar Multicast IP para contabilizar números.
Cada processo enviará periodicamente um inteiro no intervalo [1, 10].
A cada X segundos (2, por exemplo), os processos devem verificar qual o inteiro com maior frequência e informar localmente (saída padrão).

## Requisitos:

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

## Instruções:

- Execute `npm run build` para compilar o programa
- Execute `npm run start` em um terminal (ou máquina remota) para executar o programa
- Faça o mesmo para as outras instâncias do programa

## Dupla:

    André de Campos, Kalyl Henings
