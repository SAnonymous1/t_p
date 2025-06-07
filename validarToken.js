const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TOKENS_TABLE;

module.exports = async function validateToken(headers) {
  const auth = headers.Authorization || headers.authorization;
  if (!auth) throw { statusCode: 401, message: 'Missing Authorization header' };
  const token = auth.replace(/^Bearer\s+/, '');

  const { Item } = await dynamo.get({
    TableName: TABLE_NAME,
    Key: { token }
  }).promise();

  if (!Item) throw { statusCode: 403, message: 'Token no existe' };

  const now = new Date();
  const exp = new Date(Item.expires);
  if (now > exp) throw { statusCode: 403, message: 'Token expirado' };

  return { userId: Item.userId, tenantId: Item.tenantId };
};