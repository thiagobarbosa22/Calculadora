# Calculadora de Retenção

Aplicação interna para gerar ofertas, estimar valores de encerramento, preparar encaixes e auxiliar na redação de mensagens de retenção.

## Executar

1. Entre em `backend` e execute `npm install`.
2. Copie `.env.example` para `.env` e informe `OPENAI_API_KEY`.
3. Execute `npm start`.
4. Abra `http://localhost:3000`.

O backend serve o frontend e a API na mesma origem. Em produção, configure `ALLOWED_ORIGINS` apenas se o frontend for hospedado em outro domínio.

Quando aberto pelo GitHub Pages, o frontend usa automaticamente `https://calculadora-xggm.onrender.com/api/chat`. Em ambiente local ou quando servido pelo Render, usa `/api/chat` na mesma origem.

## Testes

Dentro de `backend`, execute `npm test`.

Os testes cobrem cálculos em centavos, validações, cronogramas promocionais, normalização de cidades, histórico do chat e remoção de dados pessoais.

## Segurança e operação

- Nunca envie CPF, telefone, endereço, contrato ou outros dados pessoais ao assistente.
- O backend limita tamanho, frequência e histórico das solicitações.
- CORS é restrito, erros internos recebem um código de ocorrência e respostas são exibidas como texto, não como HTML.
- `INTERNAL_API_TOKEN` é opcional e só deve ser usado quando um proxy confiável inserir o cabeçalho; não coloque segredo no JavaScript do navegador.
- Valores, descontos, visitas e ações sugeridas precisam ser confirmados no sistema oficial.

## Decisões sobre as ofertas Relâmpago

O código anterior não informava os meses 7 a 9 e possuía um `valor_fixo` sem uso. O cronograma agora informa explicitamente:

- Escalonada: meses 1–3, 4–6, 7–9 pelo valor regular e 10–12.
- Flat: meses 1–3, 4–6 e retorno ao valor regular a partir do 7º mês.
- Especial: meses 1–7, 8–9 e 10–12.

Essa interpretação deve ser validada pela área comercial. Se a campanha oficial usar outro cronograma, altere `criarCronogramaRelampago` em `core.js` e os respectivos testes juntos.
