const express = require('express');
const userRouter = require('./routes/UserRoutes');
const jobRouter = require('./routes/JobRoutes');
const connectDB = require('./db/db');
require('dotenv').config({path:'./config.env'});
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

app.get("/sample", (req,res)=>{
    res.send("API HIT!!!");
});


//connectDB
connectDB();

//middleware

//routes
app.use(express.json());

//connect app
app.use('/api/user',userRouter);
app.use('/api/job',jobRouter);





app.listen(PORT, ()=>console.log(`Server is running on PORTTT ${PORT}`));