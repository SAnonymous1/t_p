const AWS = require('aws-sdk');
const { Client } = require('@elastic/elasticsearch');

const es = new Client({ node: process.env.ES_HOST });

exports.ActualizarProductos = async (event) => {
  try {
    for (const record of event.Records) {
      const keys = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.Keys);
      const id = keys.producto_id;

      if (record.eventName === 'REMOVE') {
        await es.delete({ index: 'idx_productos', id }).catch(err => {
          if (err.meta && err.meta.statusCode !== 404) throw err;
        });
      } else {
        const doc = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
        await es.index({ index: 'idx_productos', id, body: doc });
      }
    }
    return { statusCode: 200, body: `Processed ${event.Records.length} records.` };
  } catch (error) {
    console.error('Error actualizando productos en ES:', error);
    throw error;
  }
};
