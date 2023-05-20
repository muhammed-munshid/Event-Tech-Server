/* eslint-disable no-undef */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connection from './config/dbConfig.js'
connection()

import userRoute from './routes/UserRoute.js'
import managerRoute from './routes/managerRoute.js';
import adminRoute from './routes/adminRoute.js';

dotenv.config();

const app = express();

// when ever the api is having the variables to destructure from the client that means the login will send the 
// username and password in the format of json format so to destructre the json use the code 
app.use(express.json());
//then only it will be destructured

app.use(cors());
app.use('/',userRoute)
app.use('/manager', managerRoute);
app.use('/admin', adminRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server Started At Port ${port}`));
