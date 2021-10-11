const moment = require("moment");

const admin = require("../config/firebase.admin.js");

const db = admin.firestore();

async function getAllVouchers(req, res) {
  try {
    const snapshot = await db.collection("vouchers").get();
    const allVouchers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(allVouchers);
  } catch (err) {
    return res.status(500).send(err);
  }
}

async function addVoucher(req, res) {
  try {
    const {
      business_name,
      business_address,
      offer_description,
      days_to_use,
    } = req.body;

    const newVoucher = {
      business_name,
      business_address,
      offer_description,
      days_to_use,
      times_users_recieved: 0,
      times_users_redeemed: 0,
      number_of_users_redeemed: 0,
      number_expired: 0,
      updatedAt: moment().toDate(),
      createdAt: moment().toDate(),
    };

    const savedNewVoucher = await db.collection("vouchers").add(newVoucher);
    const voucherData = await db
      .collection("vouchers")
      .doc(savedNewVoucher.id)
      .get();

    res.status(200).json({ id: voucherData.id, ...voucherData.data() });
  } catch (err) {
    return res.status(500).send(err);
  }
}

async function deleteVoucher(req, res) {
  try {
    const { id } = req.params;
    await db.collection("vouchers").doc(id).delete();

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
}

async function updateVoucher(req, res) {
  try {
    const {
      id,
      business_name,
      business_address,
      offer_description,
      days_to_use,
    } = req.body;

    const newVoucher = {
      business_name,
      business_address,
      offer_description,
      days_to_use,
      updatedAt: moment().toDate(),
    };

    await db.collection("vouchers").doc(id).update(newVoucher);
    const voucherData = await db.collection("vouchers").doc(id).get();

    res.status(200).json({ id: voucherData.id, ...voucherData.data() });
  } catch (err) {
    return res.status(500).send(err);
  }
}

module.exports = {
  getAllVouchers,
  addVoucher,
  deleteVoucher,
  updateVoucher,
};
