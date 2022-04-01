const { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } = require("plaid");
const moment = require("moment");

const client = createPlaidClient();

export const createLinkToken = async (req, res, next) => {
  const { headers } = req;
  const { userid: userId } = headers;
  if (!userId) {
    res.status(400).send({ 
      message: "MISSING_REQUIRED_HEADER",
      missingHeaders: ["userid"]
    });
  } else {
    const request = {
      user: {
        client_user_id: userId,
      },
      client_name: "PlaidLinkDev",
      products: [Products.Auth, Products.Transactions],
      language: "en",
      country_codes: [CountryCode.Us]
    }

    try {
      console.log(request);
      const createTokenResponse = await client.linkTokenCreate(request);
      res.status(200).send(createTokenResponse.data);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error });
    }
  }
}

export const exchangeForPublicToken = async (req, res, next) => {
  console.log(req.body);
  const { body } = req;
  const { public_token } = body;
  if (!public_token) {
    res.status(400).send({ error: "`public_token` field missing." });
  } else {

    try {
      const response = await client.itemPublicTokenExchange({
        public_token,
      });

      const { data } = response;
      const { item_id, access_token } = data; 
      res.status(200).send({ item_id, access_token });

    } catch(error) {
      console.log(error);
      res.status(500).send({ error });
    }
  }
}

export const getAccounts = async (req, res, next) => {
  try {
    const { body } = req;
    const { access_token } = body; 
    const accountsResponse = await client.accountsGet({
      access_token
    });

    res.status(200).send(accountsResponse.data);
    
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
}


export const getTransactions = async (req, res, next) => {
  try {
    const { body } = req;
    const { access_token } = body;
    const { start_date, end_date } = getThirtyDayTimeBracket();
    console.log(start_date, end_date, access_token);
    const transactionsResponse = await client.transactionsGet({
      access_token,
      start_date,
      end_date,     
      options: {
        count: 250,
        offset: 0,
      }
    
    });
    res.status(200).send(transactionsResponse.data);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
}

function createPlaidClient() {
  try {
    const configuration = new Configuration({
      basePath: PlaidEnvironments["development"],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
          'PLAID-SECRET': process.env.PLAID_SECRET, 
          'Plaid-Version': '2020-09-14',
        }
      }
    });
    const client = new PlaidApi(configuration);
    return client;
  } catch(error) {
    console.log(error);
    return error;
  }
}

function getThirtyDayTimeBracket() {
  const now = moment();
  const today = now.format("YYYY-MM-DD");
  const thirtyDaysAgo = now.subtract(30, 'days').format("YYYY-MM-DD");

  return { start_date: thirtyDaysAgo, end_date: today };
}