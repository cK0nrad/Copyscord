import GETAuthorize from "./Controller/GET/authorize";

const router = (app) => {
  app.get("/authorize", GETAuthorize);
};

export default router;
