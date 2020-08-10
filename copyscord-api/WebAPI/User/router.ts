import postUser from "./Controller/POST/postUser";
import getUserID from "./Controller/GET/getUserID";

const router = (app) => {
  //POST
  app.post("/user", postUser);
  //GET
  app.get("/user/:id", getUserID);
};

export default router;
