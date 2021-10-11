const admin = require("../config/firebase.admin.js");

const db = admin.firestore();

async function getUserByEmail(email) {
  try {
    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return false;
    } else {
      const userArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const user = userArr[0];
      return user;
    }
  } catch (err) {
    return res.status(500).json({
      message: "Opps! Something went wrong! Try again!",
    });
  }
}

module.exports = {
  getUserByEmail
};