import { Router } from "express";

import homeController from "./controllers/home-controller.js";
import authController from "./controllers/auth-controller.js";
import sneakerController from "./controllers/sneaker-controller.js";

const routes = Router();

routes.use(homeController);
routes.use("/sneakers", sneakerController);
routes.use("/auth", authController);

routes.get("*", (req, res) => {
  res.render("404");
});

export default routes;
