# Trabalho Final

Alunos: André de Campos, Kalyl Henings

## Descrição fornecida

- A empresa XYZ possui 150 filiais.

- Para diminuir os custos, a empresa vai centralizar a compra de produtos, ou seja, é necessário controlar o estoque de todas as lojas.

- Cada loja tem um banco de dados local.

- A empresa quer controlar os pedidos e gerar a rota de entrega.

## Elaboração do problema

### Dados

- A quantidade de produtos em estoque em cada uma das filiais em um determinado periodo
- Quantos produtos foram vendidos em cada filial em um determinado periodo
- Quantos produtos tem em estoque no centro(s) de distribuição (a principio 1)

### Então

- Quantos produtos devem ser comprados para manter a quantidade adequada de produtos em estoque?
- Quais produtos devem ser enviados para quais lojas? Quando esses produtos devem ser enviados?
- A partir da ultima informação, qual a rota de entrega mais adequada?

## Possivel solução

- Replicar o banco das lojas no banco do centro de distribuição
  - As lojas constantemente enviam o estado de seus bancos para o servidor central
- Com essa réplica em mãos, periodicamente (de hora em hora, por exemplo):
  - Gerar cortes consistentes do estado do estoque distribuido
  - Com essa integralização do estoque feita, faz-se o seguinte:
    - Planeja-se rotas de entrega com o máximo de produtos por veículo
      - Algoritmo a definir
    - Essas rotas de entregas são planejadas num dia e executadas no outro
      - Pode-se definir um nível crítico mínimo de um produto no estoque das filiais
      - Caso seja detectado alguma ocorrência dessa situação, uma "rota de entrega
        de emergência" pode ser gerada, carregando o produto crítico em falta para
        a filial, com o máximo de produtos possíveis nessa rota
      - Atualiza-se as demais rotas existentes (essa rota de emergência pode
        alterar as outras rotas)

## Notas

- Considera-se (inicialmente) que a entrega é feita apenas do centro de distribuição para as lojas,
  não podendo ocorrer distribuição de loja para loja (fazer isso poderia aumentar a eficiência)
- Não foi pensado o meio de atualização do banco das filiais ao ser feito o envio dos produtos
  - Atualização automática feita do centro de distribuição nos bancos das filiais?
  - Esperar funcionários atualizarem estoque local com entrega?
    - Reflete melhor realidade
      - Funcionários são obrigados a conferir e dar entrada nos produtos
    - Fator de erro humano introduzido
- A solução não é final
