const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const validarToken = require('./validarToken');

exports.EliminarProducto = async (event) => {
  try {
    const { tenantId } = await validarToken(event.headers);
    const body = event.body;
    const { tenant_id, producto_id } = body;
    if (!tenant_id || !producto_id) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Faltan tenant_id o producto_id' }) };
    }
    await dynamo.delete({
      TableName: process.env.PRODUCTS_TABLE,
      Key: { tenant_id: tenant_id, producto_id: producto_id }
    }).promise();
    return { statusCode: 204, body: '' };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ message: err.message || 'Error interno' })
    };
  }
};