// index.mjs
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Client } from '@elastic/elasticsearch';

const ddb = new DynamoDBClient();  // el Lambda ya tiene las credenciales por defecto
const es  = new Client({ node: 'http://3.85.146.42:9200' });

export const handler = async (event) => {
  console.log('🔥 Lambda invocada con', event.Records.length, 'registros');

  for (const record of event.Records) {
    const keys = unmarshall(record.dynamodb.Keys);
    const id   = keys.producto_id;

    if (record.eventName === 'REMOVE') {
      console.log(`🗑️ Eliminando ID: ${id}`);
      await es.delete({ index: 'idx_productos', id })
              .catch(err => { if (err.meta?.statusCode !== 404) throw err; });

    } else {
      const doc = unmarshall(record.dynamodb.NewImage);
      console.log(`📥 Indexando ID: ${id}`, doc);

      await es.index({ index: 'idx_productos', id, body: doc });
    }
  }

  return {
    statusCode: 200,
    body: `✅ Procesados ${event.Records.length} cambios desde DynamoDB Streams.`
  };
};
