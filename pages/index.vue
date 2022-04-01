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
    console.log(this.$config);
    const token = await this.generateToken();
    this.handler = this.createPlaidInstance(token);
  },
  methods: {
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
    createPlaidInstance(link_token) {
      const vm = this;
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
