const AWS = require('aws-sdk');
const firehose = new AWS.Firehose();

exports.handler = async (event) => {
  const records = event.Records.map(r => {
    const newImage = r.dynamodb.NewImage
      ? AWS.DynamoDB.Converter.unmarshall(r.dynamodb.NewImage)
      : null;
    const oldImage = r.dynamodb.OldImage
      ? AWS.DynamoDB.Converter.unmarshall(r.dynamodb.OldImage)
      : null;

    return {
      Data: JSON.stringify({
        eventName:  r.eventName,
        timestamp:  r.dynamodb.ApproximateCreationDateTime,
        newImage,
        oldImage
      }) + '\n'
    };
  });

  try {
    const resp = await firehose.putRecordBatch({
      DeliveryStreamName: process.env.FIREHOSE_STREAM,
      Records: records
    }).promise();

    console.log(`Enviados ${records.length - resp.FailedPutCount}/${records.length} registros a Firehose`);
    if (resp.FailedPutCount > 0) {
      console.error('Errores:', resp.RequestResponses.filter(r => r.ErrorMessage));
    }
  } catch (err) {
    console.error('Error en putRecordBatch:', err);
    throw err;
  }
};

