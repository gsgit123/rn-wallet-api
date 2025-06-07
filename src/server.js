import express from 'express';
import dotenv from 'dotenv';
import {sql} from './config/db.js';
import rateLimiter from './middleware/rate.limiter.js';

import transactionsRoute from './routes/transactionsRoute.js';

dotenv.config();
const app = express();

app.use(rateLimiter);

app.use(express.json());
app.use(express.urlencoded({extended: true}));



async function initDB(){

    try{
        await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
        console.log('Database initialized successfully');
    }
    catch (error) {
        console.log('Error initializing database:', error);
        process.exit(1);
    }
}


app.use("/api/transactions",transactionsRoute);

initDB().then(()=>{
    app.listen(5001, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});

});


