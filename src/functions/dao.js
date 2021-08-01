const AWS = require('aws-sdk');

/**
 * Clase Dao para la conexion a la base de datos Dynamo
 */
class Dao {
    /**
     * Metodo para hacer un put del item, con la informacion de la secuencia de ADN y un flag
     * para saber si es mutante o no
     * @param {*} dna
     */
    async saveDnaAndResult(dna) {
        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        const params  = {
            TableName: process.env.VERIFIED_DNA_TABLE,
            Item: dna,
        };
        return await dynamoDb.put(params).promise();
    }

    /**
     * Metodo que devuelve todos los registros de ADN
     */
    async scanAllDna() {
        const dynamoDb = new AWS.DynamoDB.DocumentClient();
        const params = {
            TableName: process.env.VERIFIED_DNA_TABLE,
            ProjectionExpression: 'dna, isMutant',
        };
        let results = await dynamoDb.scan(params).promise();
        return results;
    }
}

module.exports = Dao;
