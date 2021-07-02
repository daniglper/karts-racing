import http from "http";
import express, { Express } from "express";
import morgan from "morgan";
import routes from "./routes/pilot-routes";
import mongoose from "mongoose";
import dotenv from "dotenv";

const router: Express = express();

/** Logging */
router.use(morgan("dev"));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** RULES OF OUR API */
router.use((req, res, next) => {
  // set the CORS policy
  res.header("Access-Control-Allow-Origin", "*");
  // set the CORS headers
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );
  // set the CORS method headers
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    return res.status(200).json({});
  }
  next();
});

/** Routes */
router.use("/", routes);

/** Error handling */
router.use((req, res, next) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

// Load .env
dotenv.config();

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);

const DB_URI: any = process.env.DB_URI;
mongoose.connect(
  DB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err: any) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Connected to MongoDb");
    }
  }
);
