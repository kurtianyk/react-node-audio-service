const moment = require("moment");

const admin = require("../config/firebase.admin.js");
const getRandomInt = require("../helpers/getRandomInt");

const db = admin.firestore();

async function provideVoucher(req, res) {
  try {
    const user = req.user;
    const snapshot = await db.collection("vouchers").get();
    const allVouchers = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (!allVouchers.length)
      return res.status(400).json({ message: "No vouchers in the system" });

    const num = getRandomInt(allVouchers.length);

    const providedVoucher = allVouchers[num];

    const userVoucher = {
      voucherId: providedVoucher.id,
      business_name: providedVoucher.business_name,
      business_address: providedVoucher.business_address,
      offer_description: providedVoucher.offer_description,
      expiry_date: moment()
        .add(providedVoucher.days_to_use, "days")
        .endOf("day")
        .toDate(),
      isRedeemed: false,
      createdAt: moment().toDate(),
      updatedAt: moment().toDate(),
    };

    const vou = await db
      .collection("users")
      .doc(user.id)
      .collection("provided-vouchers")
      .add(userVoucher);
    const voucherData = await db
      .collection("users")
      .doc(user.id)
      .collection("provided-vouchers")
      .doc(vou.id)
      .get();

    const { voucherId, ...data } = {
      id: voucherData.id,
      ...voucherData.data(),
    };

    const voucherToUpdate = await db
      .collection("vouchers")
      .doc(voucherId)
      .get();
    const voucherToUpdateData = {
      id: voucherToUpdate.id,
      ...voucherToUpdate.data(),
    };

    voucherToUpdateData.times_users_recieved =
      voucherToUpdateData.times_users_recieved + 1;

    await db.collection("vouchers").doc(voucherId).update(voucherToUpdateData);
    const usersRecievedData = {
      userId: user.id,
      providedVoucherId: voucherData.id,
      isRedeemed: false,
      expiry_date: moment()
        .add(providedVoucher.days_to_use, "days")
        .endOf("day")
        .toDate(),
      createdAt: moment().toDate(),
      updatedAt: moment().toDate(),
    };
    await db
      .collection("vouchers")
      .doc(voucherId)
      .collection("users_recieved")
      .add(usersRecievedData);

    res.status(200).json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Opps! Something went wrong! Try again!" });
  }
}

async function getProvidedVouchersList(req, res) {
  try {
    const user = req.user;
    const snapshot = await db
      .collection("users")
      .doc(user.id)
      .collection("provided-vouchers")
      .get();
    const providedVouchersList = snapshot.docs.map((doc) => {
      const { voucherId, ...data } = { id: doc.id, ...doc.data() };
      return data;
    });
    res.status(200).json(providedVouchersList);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Opps! Something went wrong! Try again!" });
  }
}

async function redeemeVoucher(req, res) {
  try {
    const user = req.user;
    const { id } = req.params;

    const voucherData = await db
      .collection("users")
      .doc(user.id)
      .collection("provided-vouchers")
      .doc(id)
      .get();
    if (!voucherData.exists) {
      return res.status(400).json({ message: "Voucher not exists!" });
    }

    const data = { id: voucherData.id, ...voucherData.data() };

    if (data.isRedeemed) {
      return res
        .status(500)
        .json({ message: "Voucher has been already redeemed!" });
    }

    if (moment(data.expiry_date.toDate()).isBefore(moment())) {
      return res.status(500).json({ message: "Voucher has expired!" });
    }

    data.isRedeemed = true;
    data.updatedAt = moment().toDate();

    await db
      .collection("users")
      .doc(user.id)
      .collection("provided-vouchers")
      .doc(id)
      .update(data);

    const voucherToUpdate = await db
      .collection("vouchers")
      .doc(data.voucherId)
      .get();

    if (!voucherToUpdate.exists) {
      return res.status(200).json({
        success: true,
      });
    }

    const voucherToUpdateData = {
      id: voucherToUpdate.id,
      ...voucherToUpdate.data(),
    };

    const usersRecieved = await db
      .collection("vouchers")
      .doc(data.voucherId)
      .collection("users_recieved")
      .where("providedVoucherId", "==", id)
      .get();

    if (usersRecieved.empty) {
      return res.status(200).json({
        success: true,
      });
    }

    const usersRecievedData = usersRecieved.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    const {
      id: usersRecievedId,
      ...usersRecievedDataOne
    } = usersRecievedData[0];

    usersRecievedDataOne.isRedeemed = true;
    usersRecievedDataOne.updatedAt = moment().toDate();

    await db
      .collection("vouchers")
      .doc(data.voucherId)
      .collection("users_recieved")
      .doc(usersRecievedId)
      .update(usersRecievedDataOne);

    const snapshot = await db
      .collection("vouchers")
      .doc(data.voucherId)
      .collection("users_recieved")
      .get();

    const usersRecievedList = snapshot.docs
      .filter((doc) => doc.data().isRedeemed)
      .map((doc) => doc.data().userId);
    const users = new Set(usersRecievedList);

    voucherToUpdateData.times_users_redeemed =
      voucherToUpdateData.times_users_redeemed + 1;
    voucherToUpdateData.number_of_users_redeemed = users.size;
    (voucherToUpdateData.updatedAt = moment().toDate()),
      await db
        .collection("vouchers")
        .doc(data.voucherId)
        .update(voucherToUpdateData);

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Opps! Something went wrong! Try again!" });
  }
}

module.exports = {
  provideVoucher,
  getProvidedVouchersList,
  redeemeVoucher,
};
