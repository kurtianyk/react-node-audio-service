const express = require("express");

const router = express.Router();

const {
  provideVoucher,
  getProvidedVouchersList,
  redeemeVoucher,
} = require("../controllers/voucher.controller.js");

/**
 *  @swagger
 *  /api/v1/voucher/:
 *    get:
 *      security:
 *        - jwt: []
 *      summary: Provide user with a voucher.
 *      tags:
 *        - vouchers
 *      responses:
 *        200:
 *          description: Randomly choose one of available vouchers 
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: The voucher's id.
 *                    example: werjjdofgiowerio
 *                  business_name:
 *                    type: string
 *                    description: The vouchers's business name.
 *                    example: Some Bussiness
 *                  business_address:
 *                    type: string
 *                    description: The vouchers's business address.
 *                    example: London
 *                  offer_description:
 *                    type: string
 *                    description: The vouchers's offer description.
 *                    example: Free drink
 *                  isRedeemed:
 *                    type: boolean
 *                    description: The vouchers's redeeme status.
 *                    example: false
 *                  expiry_date:
 *                    type: object
 *                    description: The vouchers's expiry date timestamp.
 *                    properties:
 *                      _seconds:
 *                        type: number
 *                        example: 12342151425
 *                      _nanoseconds:
 *                        type: number
 *                        example: 7874536433
 *                  createdAt:
 *                    type: object
 *                    description: The vouchers's created at date timestamp.
 *                    properties:
 *                      _seconds:
 *                        type: number
 *                        example: 2435262652265
 *                      _nanoseconds:
 *                        type: number
 *                        example: 2352323455243
 *        400:
 *          description: No vouchers are available to be provided
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: No vouchers in the system
 *                      example: No vouchers in the system
 */
router.get("/", provideVoucher);

/**
 *  @swagger
 *  /api/v1/voucher/list:
 *    get:
 *      security:
 *        - jwt: []
 *      summary: Returns a voucher list that users already won.
 *      tags:
 *        - vouchers
 *      responses:
 *        200:
 *          description: Fetches user`s voucher list
 *          content:
 *            application/json:
 *              schema:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: The voucher's id.
 *                    example: werjjdofgiowerio
 *                  business_name:
 *                    type: string
 *                    description: The vouchers's business name.
 *                    example: Some Bussiness
 *                  business_address:
 *                    type: string
 *                    description: The vouchers's business address.
 *                    example: London
 *                  offer_description:
 *                    type: string
 *                    description: The vouchers's offer description.
 *                    example: Free drink
 *                  isRedeemed:
 *                    type: boolean
 *                    description: The vouchers's redeeme status.
 *                    example: false
 *                  expiry_date:
 *                    type: object
 *                    description: The vouchers's expiry date timestamp.
 *                    properties:
 *                      _seconds:
 *                        type: number
 *                        example: 12342151425
 *                      _nanoseconds:
 *                        type: number
 *                        example: 7874536433
 *                  createdAt:
 *                    type: object
 *                    description: The vouchers's created at date timestamp.
 *                    properties:
 *                      _seconds:
 *                        type: number
 *                        example: 2435262652265
 *                      _nanoseconds:
 *                        type: number
 *                        example: 2352323455243
 */
router.get("/list", getProvidedVouchersList);

/**
 *  @swagger
 *  /api/v1/voucher/redeem/{id}:
 *    post:
 *      security:
 *        - jwt: []
 *      summary: Redeem the voucher for a user an return the status of operation
 *      tags:
 *        - vouchers
 *      parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the voucher to redeem
 *         schema:
 *           type: string
 *      responses:
 *        200:
 *          description: Redeem the voucher for a user an return the status of operation
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    description: Voucher`s redemption status
 *                    example: true

 *        400:
 *          description: No vouchers are available to be provided
 *          content:
 *            application/json:
 *              schema:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                      description: Voucher not exists!
 *                      example: Voucher not exists!
 */
router.post("/redeem/:id", redeemeVoucher);

module.exports = router;
