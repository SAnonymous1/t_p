const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const validarToken = require('./validarToken');

exports.BuscarProducto = async (event) => {
  try {
    const { tenantId } = await validarToken(event.headers);
    const body = event.body;
    const { tenant_id, producto_id } = body;
    if (!tenant_id || !producto_id) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Faltan tenant_id o producto_id' }) };
    }
    const params = {
      TableName: process.env.PRODUCTS_TABLE,
      Key: { tenant_id: tenant_id, producto_id: producto_id }
    };
    const result = await dynamo.get(params).promise();
    if (!result.Item) {
      return { statusCode: 404, body: JSON.stringify({ message: 'Producto no encontrado' }) };
    }
    return { statusCode: 200, body: JSON.stringify(result.Item) };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ message: err.message || 'Error interno' })
    };
  }
};