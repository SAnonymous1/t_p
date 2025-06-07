const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const validarToken = require('./validarToken');

exports.ModificarProducto = async (event) => {
  try {
    const body = event.body;
    const { tenant_id, producto_id, datos } = body;
    if (!tenant_id || !producto_id || !datos) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Faltan tenant_id, producto_id o datos' })
      };
    }
    const fields = Object.keys(datos);
    const expr = 'SET ' + fields.map((k,i) => `#f${i}= :v${i}`).join(', ');
    const names  = {};
    const values = {};
    fields.forEach((k,i) => {
      names[`#f${i}`]  = k;
      values[`:v${i}`] = datos[k];
    });
    const params = {
      TableName: process.env.PRODUCTS_TABLE,
      Key: { tenant_id: tenant_id, producto_id: producto_id },
      UpdateExpression: expr,
      ExpressionAttributeNames: names,
      ExpressionAttributeValues: values,
      ReturnValues: 'ALL_NEW'
    };
    const result = await dynamo.update(params).promise();
    return { statusCode: 200, body: JSON.stringify(result.Attributes) };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ message: err.message || 'Error interno' })
    };
  }
};
