'use strict'
const AWS = require('aws-sdk');

AWS.config.update({region: "us-east-1"});
const ddb = new AWS.DynamoDB({apiVersion:"202-10-08"});
const documentClient = new AWS.DynamoDB.DocumentClient({region:"us-east-1"});

const ASSIGNED_ELEMENTS_COUNT = 4;

let playerNames = [];
let elements = [];
let assignments = [];

function populatePlayerNames(items){
    items.forEach(item=>playerNames.push(item.playerName));
}
function populateElements(items){
    items.forEach(item=>{
        item.elements.forEach(element=>elements.push(element));
    });
}

function getRandomElement(){
    let index = Math.floor(Math.random()*elements.length);
    let element = elements[index];
    elements.splice(index, 1);
    return element;
}

function populateAssignments(){
    for(var i=0;i<playerNames.length;i++){
        let assignedElements = [];
        for(var j=0;j<ASSIGNED_ELEMENTS_COUNT;j++){
            assignedElements.push(getRandomElement())
        }

        let obj = {
            playerName: playerNames[i],
            elements: assignedElements
        }

        assignments.push(obj);
    }
}

function putAssignments(){


    for(let i=0; i<assignments.length;i++){

        let params = {
            TableName: "dr_assignments",
            Item: {
                playerName: assignments[i].playerName,
                elements: assignments[i].elements
            }
        }
        
        console.log(params);
        documentClient.put(params, (err, data)=>{
            console.log("Callback");
            if(err){
                console.log("ERROR"+err,err.stack)
            }
            else{
                console.log("PUTted")
            }
        });
    }
}

function putGmElements(){
    for(let i=0; i<elements.length;i++){

        let params = {
            TableName: "dr_gm_elements",
            Item: {
                element: elements[i]
            }
        }
        
        console.log(params);
        documentClient.put(params, (err, data)=>{
            console.log("Callback");
            if(err){
                console.log("ERROR"+err,err.stack)
            }
            else{
                console.log("PUTted")
            }
        });
    }
}

exports.handler = async (event, context) => {

    const params = {
        TableName: "dr_elements"
    }

    try{
        const data = await documentClient.scan(params).promise();
        populatePlayerNames(data.Items);
        populateElements(data.Items);
        populateAssignments();

        putAssignments();
        putGmElements();
        
    }catch(err){
        console.log("ERROR:"+err);
    }
}

