const moment = require("moment");

const admin = require("../config/firebase.admin.js");

const db = admin.firestore();

async function updateExpiredVouchers() {
  const snapshot = await db.collection("vouchers").get();
  if (snapshot.empty) return;
  for (const doc of snapshot.docs) {
    const voucherData = { id: doc.id, ...doc.data() };
    const snapshotSub = await db
      .collection("vouchers")
      .doc(doc.id)
      .collection("users_recieved")
      .get();
    if (!snapshotSub.empty) {
      let expiredNotRedeemedVouchers = 0;
      for (const docSub of snapshotSub.docs) {
        const usersRecievedData = { id: docSub.id, ...docSub.data() };
        if (
          !usersRecievedData.isRedeemed &&
          moment(usersRecievedData.expiry_date.toDate()).isBefore(moment())
        ) {
          expiredNotRedeemedVouchers = expiredNotRedeemedVouchers + 1;
        }
      }
      if (voucherData.number_expired != expiredNotRedeemedVouchers) {
        voucherData.number_expired = expiredNotRedeemedVouchers;
        await db.collection("vouchers").doc(voucherData.id).update(voucherData);
      }
    }
  }
}

module.exports = updateExpiredVouchers;
