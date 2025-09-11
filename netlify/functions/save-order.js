const { Octokit } = require("@octokit/rest");

exports.handler = async function (event, context) {
  // Verificar se é um POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: "Método não permitido" }),
    };
  }

  try {
    // Parsear o corpo da requisição
    const data = JSON.parse(event.body);

    // Validação dos dados
    if (
      !data ||
      !data.name ||
      !data.date ||
      !data.deliveryType ||
      !data.cep ||
      !data.street ||
      !data.number ||
      !data.neighborhood ||
      !data.city ||
      !data.state ||
      !data.whatsapp ||
      !data.flavor ||
      !data.price
