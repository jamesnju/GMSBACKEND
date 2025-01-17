import express, { NextFunction, Request, Response } from "express"
import logger from './middleware/logger';
import routes from "./routes/index";
import errorHandler from "./middleware/error";
import dotenv from "dotenv"
import cors from 'cors';



const app = express();
const PORT = 8000;

dotenv.config()
app.use(cors());  // Enable CORS for all routes

//logger middleware
app.use(logger);
// body parser to allow submit json data
app.use(express.json());

//routes
app.use("/api/v1/", routes);

app.use(errorHandler);


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app
