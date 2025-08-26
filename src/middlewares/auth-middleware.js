import jwt from "jsonwebtoken";

const SECRET = "BASICSECRET";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies["auth"];

  if (!token) {
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, SECRET);

    req.user = decodedToken;
    res.locals.user = decodedToken;

    next();
  } catch (err) {
    res.setError("Invalid Authentication!");
    res.clearCookie("auth");
    res.redirect("/auth/login");
  }
};

export const isAuth = (req, res, next) => {
  if (!req.user) {
    res.setError("You must be logged in in order to do that!");
    return res.redirect("/auth/login");
  }

  next();
};
