import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = "BASICSECRET";

export default {
  async register(userData) {
    if (userData.password !== userData.rePassword) {
      throw new Error("Password missmatch!");
    }

    const userCount = await User.countDocuments({ email: userData.email });
    if (userCount > 0) {
      throw new Error("Email already exists");
    }

    return User.create(userData);
  },
  async login(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid email or password!");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error("Invalid email or password!");
    }

    const payload = {
      id: user.id,
      email: user.email,
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: "2h" });

    return token;
  },
};
