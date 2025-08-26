import { Router } from "express";
import sneakerService from "../services/sneaker-service.js";

const homeController = Router();

homeController.get("/", async (req, res) => {
  const sneakers = await sneakerService.getAll(
    {},
    {
      sort: { createdAt: -1 },
      limit: 3,
    }
  );

  res.render("home", { sneakers: sneakers });
});

homeController.get("/catalog", async (req, res) => {
  const sneakers = await sneakerService.getAll();

  res.render("catalog", { sneakers: sneakers });
});

homeController.get("/profile", async (req, res) => {
  const user = req.user;

  const createdSneakers = await sneakerService.getByCreator(user.id);
  const preferredSneakers = await sneakerService.getPreferred(user.id);

  res.render("profile", {
    user,
    createdSneakers,
    preferredSneakers,
  });
});

homeController.post("/sneakers/:id/prefer", async (req, res) => {
  const user = req.user;
  const sneakerId = req.params.id;

  if (!user) {
    return res.redirect("/auth/login");
  }

  try {
    const sneaker = await sneakerService.getOne(sneakerId);
    if (!sneaker.preferredList.includes(user.id)) {
      sneaker.preferredList.push(user.id);
      await sneaker.save();
    }

    res.redirect("/profile");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong.");
  }
});

homeController.get("/about", (req, res) => {
  res.render("about", { pageTitle: "About" });
});

homeController.get("/about", (req, res) => {
  res.render("about", { pageTitle: "About" });
});

export default homeController;
