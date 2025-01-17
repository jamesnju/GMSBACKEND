import express from "express"

const logger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(
      `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
    );
    next();
  };
  export default logger;
  