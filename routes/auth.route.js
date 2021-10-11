const express = require("express");

const router = express.Router();

const { signUp, signIn } = require("../controllers/auth.controller");

/**
 *  @swagger
 *  /api/v1/auth/signup:
 *    post:
 *      summary: Sign Up. Create an account in the application and log in.
 *      tags:
 *        - auth
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  name:
 *                    type: string
 *                    description: The user's name.
 *                    example: John Dou
 *                  email:
 *                    type: string
 *                    description: The user's email.
 *                    example: john.dou@gmail.com
 *                  password:
 *                    type: string
 *                    description: The user's password.
 *                    example: password1234
 *      responses:
 *        200:
 *          description: Created an accoount
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    token:
 *                      type: string
 *                      description: JWT token for further Bearer Authentication
 *                      example: sadfREWTHGDFGDsdfdgSDAGSHGSTREWSsdfdgffsdgdszmmcxp
 *        400:
 *          description: Refused to create an account and log in
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: All fields are required!
 *                      example: All fields are required!
 *        409:
 *          description: Refused to create an account and log in
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Email is already in use!
 *                      example: Email is already in use!
 */
router.post("/signup", signUp);

/**
 *  @swagger
 *  /api/v1/auth/signin:
 *    post:
 *      summary: Sign Up. Create an account in the application and log in.
 *      tags:
 *        - auth
 *      requestBody:
 *          required: true
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  email:
 *                    type: string
 *                    description: The user's email.
 *                    example: john.dou@gmail.com
 *                  password:
 *                    type: string
 *                    description: The user's password.
 *                    example: password1234
 *      responses:
 *        200:
 *          description: Checked if the user exist and has access
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    token:
 *                      type: string
 *                      description: JWT token for further Bearer Authentication
 *                      example: sadfREWTHGDFGDsdfdgSDAGSHGSTREWSsdfdgffsdgdszmmcxp
 *        400:
 *          description: Refused to log in
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Invalid email or password
 *                      example: Invalid email or password
 */
router.post("/signin", signIn);

router.get("/health-check", async function hello(req, res) {
  res.status(200).json({
    body: "health-check endpoint",
  });
});

module.exports = router;
