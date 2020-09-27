const express = require('express');
const rateLimit = require('express-rate-limit');

const app = express();

const port = process.env.PORT

app.disable('x-powered-by');


const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 100 // limits each IP to 100 requests per windowMs
});

app.use(limiter)

// Connect to Routes
require("./routes")(app)

// Connect to MongoDB
require("./utils/db")()


if (process.env.NODE_ENV === 'production') {
    if (!process.env.CORS_ORIGIN) {
        throw new Error('FATAL ERROR: CORS_ORIGIN is not defined.');
    }
    if (!process.env.DB) {
        throw new Error('FATAL ERROR: DB is not defined.');
    }
    if (!process.env.JWT_TOKEN) {
        throw new Error('FATAL ERROR: JWT_TOKEN is not defined.');
    }
    if (!process.env.TOKEN_TYPE) {
        throw new Error('FATAL ERROR: TOKEN_TYPE is not defined.');
    }
    if (!process.env.TOKEN_EXP_TIME) {
        throw new Error('FATAL ERROR: TOKEN_EXP_TIME is not defined.');
    }
    // if (!process.env.SENDGRID_API_KEY) {
    //     throw new Error('FATAL ERROR: SENDGRID_API_KEY is not defined.');
    // }
}

app.listen(port, () => console.log(`Listening on port ${port}...`));
