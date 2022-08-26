<template>
  <div class="screen-container">
    <div class="option-holder">
      <a @click="openLinkMoneyWebGateway">Link a Bank Account</a>
    </div>
    <img class="logo" src="/images/fingoal-logo.png" draggable="false" />
  </div>
</template>

<script>
import axios from "axios";
export default {
  head() {
    return {
      title: "Link",
    };
  },
  methods: {
    // Checks if there is a valid username, and generates a Link token if so.
    async generateToken() {
      try {
        const user = this.$store.state.user;
        if (!user) {
          this.$router.push("/mock-login");
        } else {
          const { username } = user;
          // Link Money API Token Call
          const response = await axios.post("/api/user-token", {
            userId: username,
          });
          const { data } = response;
          const { access_token } = data;
          return access_token;
        }
      } catch (error) {
        console.log(error);
      }
    },
    async openLinkMoneyWebGateway() {
      const access_token = await this.generateToken();
      const redirectUri = `http://localhost:3001/success`; // this is our current PORT
      const linkMoneyWebGatewayBaseUrl = `https://linkmoney-gateway.fingoal.com`; // This is the Link Money Gateway in Production.
      window.open(
        `${linkMoneyWebGatewayBaseUrl}/api/authenticate?token=${access_token}&redirectUri=${redirectUri}`
      ); // Open the window with the Link Money Gateway, instead of opening the Plaid Link.
    },
  },
};
</script>

<style scoped>
.screen-container {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-family: "Lato", sans-serif !important;
}
.screen-container .option-holder {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.screen-container .option-holder .error {
  max-width: 50%;
  font-size: 18px;
  color: #ff0000;
  text-align: center;
}
.screen-container .option-holder a {
  padding: 12px 15px;
  font-size: 18px;
  color: #ffffff;
  background: #6a2d91;
  border-radius: 7px;
}
.screen-container .option-holder a:hover {
  cursor: pointer;
  opacity: 0.7;
}
.screen-container .logo {
  margin: 0px 0px 36px 0px;
  height: 36px;
  width: auto;
}
</style>
