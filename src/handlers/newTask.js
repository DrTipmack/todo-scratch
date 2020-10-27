const randomBytes = require('crypto').randomBytes;
const atob = require("atob");

const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];


exports.handler = (event, context, callback) => {
    /*if (!event.requestContext.authorizer) {
      errorResponse('Authorization not configured', context.awsRequestId, callback);
      return;
    }
    */

    const taskId = toUrlString(randomBytes(16));
    console.log('Received event ', taskId, );

    const requestBody = JSON.parse(event.body);

    const JWT = parseJwt(event.headers["Authorization"]);
    //console.log(JWT)



    // Because we're using a Cognito User Pools authorizer, all of the claims
    // included in the authentication token are provided in the request context.
    // This includes the username as well as other attributes.
    const email = JWT['email'];


    // The body field of the event in a proxy integration is a raw string.
    // In order to extract meaningful values, we need to first parse this string
    // into an object. A more robust implementation might inspect the Content-Type
    // header first and use a different parsing strategy based on that value.


    const taskName = requestBody.taskName;

    const dateIn = requestBody.taskDate;
    const taskDate = new Date(Date.parse(dateIn)).toISOString();
    const taskDay = days[new Date(Date.parse(requestBody.taskDate)).getDay()];


    recordTask(taskId, email, taskName, taskDate, taskDay).then(() => {
        callback(null, {
            statusCode: 201,
            body: JSON.stringify({
                user: email,
                taskID: taskId,
                taskName: taskName,
                taskDueDate: taskDate,
                taskDueDay: taskDay,
                taskSetDate: new Date().toISOString()
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        });
    }).catch((err) => {
        console.error(err);

        errorResponse(err.message, context.awsRequestId, callback)
    });
};


// This is where you would implement logic to find the optimal unicorn for
// this ride (possibly invoking another Lambda function as a microservice.)
// For simplicity, we'll just pick a unicorn at random.

function recordTask(TaskId, email, TaskName, TaskDate, TaskDay) {
    return ddb.put({
        TableName: 'ToDo',
        Item: {
            email: email,
            taskID: TaskId,
            taskName: TaskName,
            taskDueDate: TaskDate,
            taskDueDay: TaskDay,
            taskSetDate: new Date().toISOString()
        },
    }).promise();
}


function toUrlString(buffer) {
    return buffer.toString("base64")
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

function errorResponse(errorMessage, awsRequestId, callback) {
    callback(null, {
        statusCode: 500,
        body: JSON.stringify({
            Error: errorMessage,
            Reference: awsRequestId,
        }),
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    });
}
function parseJwt (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
