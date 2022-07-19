'use strict'
const AWS = require('aws-sdk');
//const uuid = require('uuid');

AWS.config.update({region: "us-east-1"});

exports.handler = async (event) => {
    
    const documentClient = new AWS.DynamoDB.DocumentClient({region:"us-east-1"});
    
    let responseBody = "";
    let statusCode = 0;
    
    console.log(event)
    
    const { playerName, elements } = JSON.parse(event.body);
    
    const params = {
        TableName: "dr_elements",
        Item: {
            id: "654321",
            playerName: playerName,
            elements: elements
        }
    }
    
     try{
        const data = await documentClient.put(params).promise();
        responseBody = JSON.stringify(data.Item);
        statusCode = 201;
    }catch(err){
        responseBody = `Unable to put user data:` + err;
        statusCode = 500;
    }
    
    const response = {
        statusCode : statusCode,
        body: responseBody
    }
    
    return response;
};
