const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const validarToken = require('./validarToken');

exports.ListarProductos = async (event) => {
  try {
    await validarToken(event.headers);

    const { tenant_id } = event.body;
    if (!tenant_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Falta tenant_id en el body' })
      };
    }

    const params = {
      TableName: process.env.PRODUCTS_TABLE,
      KeyConditionExpression: 'tenant_id = :t',
      ExpressionAttributeValues: { ':t': tenant_id }
    };

    const result = await dynamo.query(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ items: result.Items })
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ message: err.message || 'Error interno' })
    };
  }
};