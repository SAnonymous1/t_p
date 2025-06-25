import { Client as ESClient } from '@elastic/elasticsearch';
import { unmarshall } from '@aws-sdk/util-dynamodb';

const es = new ESClient({ node: 'http://3.93.76.201:9200' }); // PONER LA IP DE MV BUSQUEDA ACÁ

export const handler = async (event) => {
  console.log('🚀 Lambda ejecutada con', event.Records.length, 'registro(s)');

  try {
    console.log('Haciendo ping a Elasticsearch...');
    await es.ping();
    console.log('Elasticsearch responde correctamente');

    for (const record of event.Records) {
      const keys = unmarshall(record.dynamodb.Keys);
      const id = keys.producto_id;

      if (record.eventName === 'REMOVE') {
        console.log(`🗑️ Eliminando producto con ID: ${id}`);
        await es.delete({
          index: 'idx_productos',
          id
        }).catch(err => {
          if (err.meta?.statusCode !== 404) throw err;
        });
        console.log(`✔️ Producto eliminado: ${id}`);
      } else {
        const doc = unmarshall(record.dynamodb.NewImage);
        console.log(`📥 Indexando producto con ID: ${id}`, doc);
        await es.index({
          index: 'idx_productos',
          id,
          body: doc
        });
        console.log(`✔️ Producto indexado: ${id}`);
      }
    }

    return {
      statusCode: 200,
      body: `✅ Procesados ${event.Records.length} cambios`
    };
  } catch (error) {
    console.error('❌ Error durante ejecución:', error);
    throw error;
  }
};