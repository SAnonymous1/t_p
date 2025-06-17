const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const validarToken = require('./validarToken');

exports.CrearProducto = async (event) => {
  try {
    const { tenant_id } = await validarToken(event.headers);
    const body = event.body;
    const { producto_id, ...attrs } = body;
    if (!producto_id) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Falta producto_id' }) };
    }
    const now = new Date().toISOString();
    const item = {
      tenant_id: tenant_id,
      producto_id: producto_id,
      ...attrs,
      createdAt: now,
      updatedAt: now
    };
    await dynamo.put({
      TableName: process.env.PRODUCTS_TABLE,
      Item: item,
      ConditionExpression: 'attribute_not_exists(PK) AND attribute_not_exists(SK)'
    }).promise();
    return {
      statusCode: 201,
      body: JSON.stringify(item)
    };
  } catch (err) {
    const code = err.code === 'ConditionalCheckFailedException' ? 409 : err.statusCode || 500;
    const msg  = err.code === 'ConditionalCheckFailedException'
      ? 'Producto ya existe'
      : (err.message || 'Error interno');
    return {
      statusCode: code,
      body: JSON.stringify({ message: msg })
    };
  }
};