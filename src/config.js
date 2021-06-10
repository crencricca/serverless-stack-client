const config = {
    s3: {
      REGION: "us-east-2",
      BUCKET: "catie-notes-upload",
    },
    apiGateway: {
      REGION: "us-east-2",
      URL: "https://iswozdb21m.execute-api.us-east-2.amazonaws.com/prod",
    },
    cognito: {
      REGION: "us-east-2",
      USER_POOL_ID: "us-east-2_p37LNzKOB",
      APP_CLIENT_ID: "2ei3nuoaehh8i4gv57d0vdt4np",
      IDENTITY_POOL_ID: "us-east-2:8cb6792f-9879-45a0-96e4-ac798f4cb9fa",
    },
  };
  
  export default config;