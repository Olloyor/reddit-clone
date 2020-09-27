module.exports = {
    corsOrigin : process.env.CORS_ORIGIN,
    emailAPI : process.env.SENDGRID_API_KEY,
    secretKey : process.env.JWT_TOKEN,
    tokenType : process.env.TOKEN_TYPE,
    tokenExpTime : process.env.TOKEN_EXP_TIME,  // 24 hour in ms
    database : process.env.DB
}
