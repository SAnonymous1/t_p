const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  const registros = event.Records.map((r) => ({
    eventID: r.eventID,
    eventName: r.eventName,
    timestamp: r.dynamodb.ApproximateCreationDateTime,
    newImage: r.dynamodb.NewImage
      ? AWS.DynamoDB.Converter.unmarshall(r.dynamodb.NewImage)
      : null,
    oldImage: r.dynamodb.OldImage
      ? AWS.DynamoDB.Converter.unmarshall(r.dynamodb.OldImage)
      : null
  }));

  const bucket = process.env.REGISTRO_BUCKET;
  const timestamp = Date.now();
  const key = `registros/productos-${timestamp}.json`;

  try {
    await s3.putObject({
      Bucket: bucket,
      Key: key,
      Body: JSON.stringify(registros, null, 2),
      ContentType: 'application/json'
    }).promise();

    console.log(`Guardado en S3: ${key}`);
  } catch (err) {
    console.error('Error al guardar en S3:', err);
    throw err;
  }
};


