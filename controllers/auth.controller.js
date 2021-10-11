const bcrypt = require("bcrypt-nodejs");
const moment = require("moment");

const admin = require("../config/firebase.admin.js");
const { generateToken } = require("../helpers/jwt");
const { getUserByEmail } = require("../repositories/user.repository");

const db = admin.firestore();

async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      const salt = await bcrypt.genSaltSync(10);
      const hash = await bcrypt.hashSync(password, salt);

      const newUser = {
        email,
        name,
        password: hash,
        updatedAt: moment().toDate(),
        createdAt: moment().toDate(),
      };
      const savedNewUser = await db.collection("users").add(newUser);
      const token = generateToken({
        id: savedNewUser.id,
        email,
        name,
      });

      return res.status(200).json({ token, name });
    } else {
      return res.status(400).json({ message: "Email is already in use!" });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Opps! Something went wrong! Try again!",
    });
  }
}

async function signIn(req, res) {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      return res.status(400).json({ message: "Incorrect email or password" });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Incorrect email or password" });
    } else {
      const isMatch = await bcrypt.compareSync(password, user.password);
      if (isMatch) {
        const token = generateToken({
          id: user.id,
          email,
          name: user.name,
        });

        return res.status(200).json({ token, name: user.name });
      } else {
        return res.status(400).json({ message: "Incorrect email or password" });
      }
    }
  } catch (err) {
    return res.status(500).json({
      message: "Opps! Something went wrong! Try again!",
    });
  }
}

module.exports = {
  signUp,
  signIn,
};
