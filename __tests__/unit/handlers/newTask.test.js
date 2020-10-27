// Import dynamodb from aws-sdk
const dynamodb = require('aws-sdk/clients/dynamodb');

// Import all functions from put-item.js
const lambda = require('../../../src/handlers/newTask');

// This includes all tests for putItemHandler
describe('Test newTestHandler', () => {
    let putSpy;

    // One-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown
    beforeAll(() => {
        // Mock DynamoDB put method
        // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
    });

    // Clean up mocks
    afterAll(() => {
        putSpy.mockRestore();
    });

    // This test invokes putItemHandler and compares the result
    it('should add id to the table', async () => {
        // Return the specified value whenever the spied put function is called
        putSpy.mockReturnValue({
            promise: () => Promise.resolve('data'),
        });

        const event = {
            httpMethod: 'POST',
            body: '{"taskName": "Name", "taskDate": "08 17 2020"}',
            headers: {"Authorization":'eyJraWQiOiJPUmxzczdQcFhob2s3N3Fsaks0XC9PakN0UVcrZk91dFoyXC9wU29ZR1NNYXc9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoiUTZ3V2xjSXhaNFM3LTlaZERPN3NwZyIsInN1YiI6IjE4NTVlZTYyLWU5YWItNDc1Yy1hZWI5LTNmOTViMTZmMjZmOCIsImNvZ25pdG86Z3JvdXBzIjpbImV1LXdlc3QtMl91RWh2cXFtU21fR29vZ2xlIl0sImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMi5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTJfdUVodnFxbVNtIiwiY29nbml0bzp1c2VybmFtZSI6Imdvb2dsZV8xMDc2MzcwMzk0MDc2MjMxOTcwODkiLCJub25jZSI6ImFJaXRZQS0yd3V3YTI2NnVOSEdwT1U1YzZDbmVIdnFJOGdWNFFyLTNPNElvajBhQzdPM1VZWEx4ZTdfYnhXcU1fclNzZlBXTWZ0anBweXl2OTdkbU1qTjFRNUlYNFU3OW1wNWNOQ2ZNODA3ZnpBdXBQVnZUVUdYaW1WQVFCcTZkWV9NWURxb3Q1ajhzQ1Z4a3hpOThvOUJycGxsZjBMRHhQMGlNemVpbHZOZyIsImF1ZCI6IjZ2ZGt0cnVnMTRrNzJwcXZzNjNsZ2tyNGszIiwiaWRlbnRpdGllcyI6W3sidXNlcklkIjoiMTA3NjM3MDM5NDA3NjIzMTk3MDg5IiwicHJvdmlkZXJOYW1lIjoiR29vZ2xlIiwicHJvdmlkZXJUeXBlIjoiR29vZ2xlIiwiaXNzdWVyIjpudWxsLCJwcmltYXJ5IjoidHJ1ZSIsImRhdGVDcmVhdGVkIjoiMTU5NzY1NTkyMjU1OSJ9XSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2MDM4MTk1OTUsImV4cCI6MTYwMzgyMzE5NSwiaWF0IjoxNjAzODE5NTk1LCJlbWFpbCI6InJ1emdhci5hbHRpbmVyQGdvb2dsZW1haWwuY29tIn0.XzbancMdrJ3vtFibUnr3apJMMKmaJKsC7di1BQLepSuR4eDBB23LhvnCAIKRAMLQbqDLq_mnpO677pc53CASc88Sml4RAfPZpKm9uU0pqYEtCpAPx89VObJo8wNLbkVUCX5lfddzbFZPVjsgmjE-k6WFJGaCMkmIcUYxvWRjMrZn_KHQsvphGUs64wRzu9nc0RwRKEqi0uP0yEfCzLSWtIJ3eLJ-aZ9y3O3sYZcMGk5RmuDsCOZSWVvj2OYfkj1RTCjS2dp8K5g_SP8RBOnq4bFOzpy6TOi_aa4jB_8QKplmg3e3qDx5yld6TDKbq2MkC9vjtgJRK4sOOujp5VU_3w'},
        };

        // Invoke putItemHandler()
        const result = JSON.parse(await lambda.handler(event));
        const expectedResult = {
            statusCode: 200,
            body: event.body,
        };

        // Compare the result with the expected result
        expect(result.statusCode).toEqual(201);
        expect(result.body.user).toEqual("ruzgar.altiner@goooglemail.com");
        expect(result.body.taskID).toEqual(expect.anything());
        expect(result.body.taskName).toEqual("Name");
        expect(result.body.taskDueDate).toEqual("2020-10-28T00:00:00.000Z");
        expect(result.body.taskDueDay).toEqual("Wednesday");
        expect(result.body.taskSetDate).toEqual("2020-10-27T17:28:53.541Z");


    });
});
