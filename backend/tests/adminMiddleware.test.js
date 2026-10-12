import assert from "node:assert/strict";
import test from "node:test";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const createResponse = () => {
  const response = { statusCode: null, body: null };
  response.status = (statusCode) => {
    response.statusCode = statusCode;
    return response;
  };
  response.json = (body) => {
    response.body = body;
    return response;
  };
  return response;
};

test("denies requests without an authenticated admin role", () => {
  for (const request of [{}, { user: { role: "customer" } }]) {
    const response = createResponse();
    let nextCalled = false;

    adminMiddleware(request, response, () => {
      nextCalled = true;
    });

    assert.equal(response.statusCode, 403);
    assert.equal(response.body.success, false);
    assert.equal(nextCalled, false);
  }
});

test("allows requests for an authenticated admin", () => {
  const response = createResponse();
  let nextCalled = false;

  adminMiddleware({ user: { role: "admin" } }, response, () => {
    nextCalled = true;
  });

  assert.equal(nextCalled, true);
  assert.equal(response.statusCode, null);
});
