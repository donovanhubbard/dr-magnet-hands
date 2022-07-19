'use strict'
const AWS = require('aws-sdk');

AWS.config.update({region: "us-east-1"});
const ddb = new AWS.DynamoDB({apiVersion:"202-10-08"});
const documentClient = new AWS.DynamoDB.DocumentClient({region:"us-east-1"});

exports.handler = async (event, context) => {

    let responseBody = "";
    let statusCode = 0;

    const params = {
        TableName: "dr_assignments"
    }
    
    try{
        const data = await documentClient.scan(params).promise();
        responseBody = JSON.stringify(data.Items);
        statusCode = 200;
    }catch(err){
        responseBody = `Unable to get user data`;
        statusCode = 403;
    }

    const response = {
        statusCode : statusCode,
        body: responseBody,
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
    }

    return response;    
}
