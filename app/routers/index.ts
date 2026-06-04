import express from "express";
import health from "./health";
import authentication from "./authentication";
import user from "./user";

const router = express.Router();

export default (): express.Router => {
  health(router);
  authentication(router);
  user(router);

  return router;
};
