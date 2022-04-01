<template>
  <div class="plaid-transactions-wrapper container fluid" style="margin-top:1rem;" v-if="user">
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Amount</th>
            <th class="text-left">Name</th>
            <th class="text-left">Date</th>
            <th class="text-left">Category</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction.id">
            <td>${{ transaction.amount }}</td>
            <td>{{ transaction.name }}</td>
            <td>{{ transaction.date }}</td>
            <td>{{ transaction.category.join(", ") }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      error: null,
      itemId: null,
      accessToken: null,
      accounts: null,
      transactions: null,
      item: null,
      user: null,
    }
  },
  async mounted() {

    if (!this.$store.state.user) {
      this.$router.push("/fake-signin");
    } else {  
      this.user = this.$store.state.user;
      await this.getItem();
      await this.getAccounts();
      await this.getTransactions();
    }
  },
  methods: {
    async getItem() {
      console.log(this.$store.state.plaidMeta);
      const { public_token } = this.$store.state.plaidMeta;
      if (!public_token) {
        this.error = "No valid Plaid meta detected. Sorry!"
      } else {
        try {
          const exchangeResponse = await axios.post("/api/exchange-public-token", { public_token });
          const { data } = exchangeResponse;
          const { item_id, access_token } = data;
          this.itemId = item_id;
          this.accessToken = access_token;
        } catch(error) {
          this.error = error.message;
        }
      }
    },
    async getAccounts() {
      try {
        const accountsResponse = await axios.post("/api/accounts", { access_token: this.accessToken });
        const { data } = accountsResponse;
        this.accounts = data.accounts;        
        this.item = data.item;
      } catch (error) {
        console.error(error);
      }
    },
    async getTransactions() {
      try {
        const transactionsResponse = await axios.post("/api/transactions", { access_token: this.accessToken });
        const { data } = transactionsResponse;
        this.transactions = data.transactions;        
      } catch (error) {
        console.error(error);
      }
    }
  }
}
</script>
