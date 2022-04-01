<template>
  <div>
    <div class="plaid-link-wrapper">
    </div>
    <v-btn class="link-opener" @click="openLink">Link An Account</v-btn>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      handler: null,
    }
  },
  async mounted() {
    const token = await this.generateToken();
    this.handler = this.createPlaidInstance(token);
  },
  methods: {
    // Checks if there is a valid username, and generates a Link token if so.
    async generateToken() {
      try {
        const user = this.$store.state.user;
        if (!user) {
          this.$router.push("/fake-signin");
        } else {
          const { username } = user;
          const response = await axios.post('/api/create-link-token', {}, { headers: { "userId": username }});
          const { data } = response;
          const { link_token } = data;
          return link_token;
        }
      } catch (error) {
        console.log(error);
      }
    },
    // Creates an instance of Plaid Link, using a valid link token.
    createPlaidInstance(link_token) {
      
      const vm = this; // need to bind this to a variable, otherwise it rebinds to Plaid.create

      const handler = Plaid.create({
        token: link_token,
        onLoad() {
          console.log("Plaid link loaded.");
        },
        onSuccess(public_token, metadata) {
          console.log("Plaid link succeeded.");
          vm.$store.commit("setPlaidMeta", metadata);
          vm.$router.push("/success");
        },
        onExit(err, metadata) {
          console.log("Plaid link exited.");
          if (err) {
            console.log(err);
          }
          vm.$store.commit("setPlaidMeta", metadata);
        },
        onEvent(eventName, metadata) {
          vm.$store.commit("setPlaidMeta", metadata);
        }
      });

      return handler;
    },
    openLink() {
      this.handler.open();
    }
  }
}
</script>

<style scoped>
  .link-opener {
    position: absolute;
    top: 50%;
    left: 40%;
  }
</style>
