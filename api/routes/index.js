import express from 'express';
import {
  createLinkToken,
  getAccounts,
  exchangeForPublicToken,
  getTransactions,
} from '../methods';

// Declaration of API endpoints.

const router = express.Router();

router.post('/create-link-token', createLinkToken);
router.post('/exchange-public-token', exchangeForPublicToken);
router.post('/accounts', getAccounts);
router.post("/transactions", getTransactions);

module.exports = router;
