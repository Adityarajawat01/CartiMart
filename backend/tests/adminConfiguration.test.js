import assert from "node:assert/strict";
import test from "node:test";
import { validateAdminConfiguration } from "../utils/ensureAdminAccount.js";

const adminKeys = [
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_NAME",
  "ADMIN_MOBILE",
];

const withAdminEnvironment = (values, callback) => {
  const originalValues = Object.fromEntries(
    adminKeys.map((key) => [key, process.env[key]]),
  );

  for (const key of adminKeys) {
    if (Object.hasOwn(values, key)) {
      process.env[key] = values[key];
    } else {
      delete process.env[key];
    }
  }

  try {
    callback();
  } finally {
    for (const key of adminKeys) {
      if (originalValues[key] === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = originalValues[key];
      }
    }
  }
};

test("normalizes a valid server-configured admin account", () => {
  withAdminEnvironment(
    {
      ADMIN_EMAIL: "  ADMIN@example.com ",
      ADMIN_PASSWORD: "a-private-password-with-more-than-12",
      ADMIN_NAME: "  Store Admin ",
      ADMIN_MOBILE: "9876543210",
    },
    () => {
      assert.deepEqual(validateAdminConfiguration(), {
        email: "admin@example.com",
        name: "Store Admin",
        mobile: 9876543210,
        password: "a-private-password-with-more-than-12",
      });
    },
  );
});

test("refuses to start without all required admin credentials", () => {
  withAdminEnvironment({}, () => {
    assert.throws(validateAdminConfiguration, /Admin account is not configured/);
  });
});

test("rejects weak admin configuration", () => {
  withAdminEnvironment(
    {
      ADMIN_EMAIL: "not-an-email",
      ADMIN_PASSWORD: "short",
      ADMIN_NAME: "",
      ADMIN_MOBILE: "123",
    },
    () => {
      assert.throws(validateAdminConfiguration, /Admin configuration is invalid/);
    },
  );
});
