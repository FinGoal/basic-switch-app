import express from 'express';
import {
  createLinkToken,
  getAccounts,
  exchangeForPublicToken,
  getTransactions,
  createLinkMoneyToken
} from '../methods';

// Declaration of API endpoints.

const router = express.Router();

router.post('/create-link-token', createLinkToken);
router.post('/exchange-public-token', exchangeForPublicToken);
router.post('/accounts', getAccounts);
router.post("/transactions", getTransactions);
router.post("/link-money-token", createLinkMoneyToken);

module.exports = router;
