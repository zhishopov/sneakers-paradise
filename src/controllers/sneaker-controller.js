import { Router } from "express";
import sneakerService from "../services/sneaker-service.js";
import { isAuth } from "../middlewares/auth-middleware.js";
import { getErrorMessage } from "../utils/error-utils.js";

const sneakerController = Router();

sneakerController.get("/search", async (req, res) => {
  const filter = req.query;
  const sneakers = await sneakerService.getAll(filter);

  res.render("search", { sneakers: sneakers, filter });
});

sneakerController.get("/create", isAuth, (req, res) => {
  res.render("sneaker/create");
});

sneakerController.post("/create", isAuth, async (req, res) => {
  const newSneaker = req.body;
  const userId = req.user?.id;

  try {
    await sneakerService.create(newSneaker, userId);
  } catch (err) {
    return res.render("sneaker/create", {
      movie: newSneaker,
      error: getErrorMessage(err),
    });
  }

  res.redirect("/");
});

sneakerController.get("/:sneakerId/details", async (req, res) => {
  const sneakerId = req.params.sneakerId;
  const sneaker = await sneakerService.getOne(sneakerId);
  const isCreator = sneaker.creator?.equals(req.user?.id);

  res.render("sneaker/details", { sneaker: sneaker, isCreator });
});

sneakerController.get("/:sneakerId/delete", isAuth, async (req, res) => {
  const sneakerId = req.params.sneakerId;

  const sneaker = await sneakerService.getOne(sneakerId);

  if (!sneaker.creator?.equals(req.user?.id)) {
    res.setError("You are not the movie owner!");
    return res.redirect("/404");
  }

  await sneakerService.delete(sneakerId);

  res.redirect("/");
});

sneakerController.get("/:sneakerId/edit", isAuth, async (req, res) => {
  const sneakerId = req.params.sneakerId;
  const sneaker = await sneakerService.getOne(sneakerId);

  res.render("sneaker/edit", { sneaker: sneaker });
});

sneakerController.post("/:sneakerId/edit", isAuth, async (req, res) => {
  const sneakerData = req.body;
  const sneakerId = req.params.sneakerId;

  try {
    await sneakerService.update(sneakerId, sneakerData);
  } catch (err) {
    return res.render("sneaker/edit", {
      sneaker: sneakerData,
      error: getErrorMessage(err),
    });
  }

  res.redirect(`/sneakers/${sneakerId}/details`);
});

sneakerController.post("/:sneakerId/prefer", isAuth, async (req, res) => {
  const sneakerId = req.params.sneakerId;
  const userId = req.user.id;

  try {
    const sneaker = await sneakerService.getOne(sneakerId);

    if (sneaker.preferredList.includes(userId)) {
      return res.redirect(`/sneakers/${sneakerId}/details`);
    }

    sneaker.preferredList.push(userId);
    await sneaker.save();

    res.redirect(`/sneakers/${sneakerId}/details`);
  } catch (err) {
    return res.redirect(`/sneakers/${sneakerId}/details`);
  }
});

export default sneakerController;
