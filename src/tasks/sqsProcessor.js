//const AWS = require('aws-sdk');
import AWS from "aws-sdk";

// Configurar AWS SQS
const sqs = new AWS.SQS({ region: process.env.AWS_REGION });

/**
 * Processa mensagens da fila SQS.
 */
async function processMessages() {
  try {
    const params = {
      QueueUrl: process.env.SQS_QUEUE_URL,
      MaxNumberOfMessages: 5, // Número máximo de mensagens para buscar
      WaitTimeSeconds: 10, // Tempo de espera para long polling
    };

    const result = await sqs.receiveMessage(params).promise();

    if (result.Messages) {
      for (const message of result.Messages) {
        console.log(`Mensagem recebida: ${message.Body}`);

        // Processar a mensagem
        await handleMessage(message);

        // Deletar a mensagem após o processamento
        await deleteMessage(message.ReceiptHandle);
      }
    } else {
      console.log('Nenhuma mensagem disponível na fila.');
    }
  } catch (error) {
    console.error('Erro ao processar mensagens:', error);
  }
}

/**
 * Lida com a lógica de processamento de uma mensagem.
 */
async function handleMessage(message) {
  console.log('Processando mensagem:', message.Body);
  // Adicione aqui a lógica específica para sua mensagem
  return Promise.resolve(); // Simulando processamento bem-sucedido
}

/**
 * Remove uma mensagem da fila após o processamento.
 */
async function deleteMessage(receiptHandle) {
  const params = {
    QueueUrl: process.env.SQS_QUEUE_URL,
    ReceiptHandle: receiptHandle,
  };

  await sqs.deleteMessage(params).promise();
  console.log('Mensagem removida da fila.');
}

module.exports = {
  processMessages,
};
