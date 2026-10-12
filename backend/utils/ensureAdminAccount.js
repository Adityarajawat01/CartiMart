import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

export const validateAdminConfiguration = () => {
  const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, ADMIN_MOBILE } = process.env;

  if (
    ADMIN_EMAIL === undefined ||
    ADMIN_PASSWORD === undefined ||
    ADMIN_NAME === undefined ||
    ADMIN_MOBILE === undefined
  ) {
    throw new Error(
      "Admin account is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, and ADMIN_MOBILE before starting the API.",
    );
  }

  const email = ADMIN_EMAIL.trim().toLowerCase();
  const mobile = ADMIN_MOBILE.replace(/\D/g, "");

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !ADMIN_NAME.trim() ||
    ADMIN_PASSWORD.length < 12 ||
    !/^\d{10}$/.test(mobile)
  ) {
    throw new Error(
      "Admin configuration is invalid. Use a valid email, a password of at least 12 characters, and a 10-digit mobile number.",
    );
  }

  return {
    email,
    name: ADMIN_NAME.trim(),
    mobile: Number(mobile),
    password: ADMIN_PASSWORD,
  };
};

const ensureAdminAccount = async () => {
  const { email, name, mobile, password: configuredPassword } =
    validateAdminConfiguration();
  const password = await bcrypt.hash(configuredPassword, 12);
  const administratorFields = {
    name,
    email,
    mobile,
    password,
    role: "admin",
  };
  let admin;

  try {
    admin = await User.findOneAndUpdate(
      { email },
      {
        $set: administratorFields,
        $setOnInsert: { image: "" },
      },
      { upsert: true, new: true, runValidators: true },
    );
  } catch (error) {
    if (error.code !== 11000) throw error;

    admin = await User.findOneAndUpdate(
      { email },
      { $set: administratorFields },
      { new: true, runValidators: true },
    );
    if (!admin) throw error;
  }

  await User.updateMany(
    { role: "admin", _id: { $ne: admin._id } },
    { $set: { role: "customer" } },
  );

  console.log("The configured administrator account is ready.");
};

export default ensureAdminAccount;
