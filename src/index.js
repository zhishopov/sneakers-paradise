import express from "express";
import handlebars from "express-handlebars";
import expressSession from "express-session";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import routes from "./routes.js";
import { authMiddleware } from "./middlewares/auth-middleware.js";
import { tempData } from "./middlewares/temp-data-middleware.js";

const app = express();

try {
  const defaultUri = "mongodb://localhost:27017/sneakers-paradise";
  await mongoose.connect(defaultUri);

  console.log("DB Connected Successfuly!");
} catch (err) {
  console.log("Cannot connect to DB");
  console.error(err.message);
}

app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
  })
);
app.set("view engine", "hbs");
app.set("views", "./src/views");

app.use("/static", express.static("src/public"));
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(
  expressSession({
    secret: "laskjdlsakjdlaskjdlkasdjska123123easdas",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
    },
  })
);
app.use(tempData);
app.use(authMiddleware);

app.use(routes);

app.listen(5001, () =>
  console.log("Server is listening on http://localhost:5001...")
);
