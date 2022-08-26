<template>
  <div class="screen-container">
    <div class="option-holder">
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <a v-else-if="flow" @click="openLinkMoneyWebGateway">{{
        flow === "initiateMicroDeposits"
          ? "Initiate Micro Deposits"
          : "Verify Micro Deposits"
      }}</a>
    </div>
    <img class="logo" src="/images/fingoal-logo.png" draggable="false" />
  </div>
</template>

<script>
import axios from "axios";
export default {
  head() {
    return {
      title: "Micro Deposits",
    };
  },
  data() {
    return {
      flow: "",
      microDepositId: "",
      errorMessage: "",
    };
  },
  methods: {
    setInitialValues() {
      const { user, organization } = (() => {
        if (window) {
          const localStorageOrganization = localStorage.getItem(
            "fin-switch-organization"
          );
          const localStorageUser = localStorage.getItem("fin-switch-user");
          if (localStorageOrganization && localStorageUser) {
            return {
              organization: localStorageOrganization,
              user: JSON.parse(localStorageUser),
            };
          }
        }
        return this.$store.state;
      })();
      const { flow, microDepositId } = this.$route.query;
      if (!user || !organization) {
        this.$router.push("/micro-deposits/mock-login");
      } else {
        this.flow = !flow ? "initiateMicroDeposits" : flow;
        if (flow === "verifyMicroDeposits") {
          if (!microDepositId) {
            this.errorMessage =
              "For flow -> verifyMicroDeposits, we need the microDepositId in the query.";
          } else {
            this.microDepositId = microDepositId;
          }
        }
      }
    },
    // Checks if there is a valid username, and generates a Link token if so.
    async generateToken() {
      try {
        const { user, organization } = (() => {
          if (window) {
            const localStorageOrganization = localStorage.getItem(
              "fin-switch-organization"
            );
            const localStorageUser = localStorage.getItem("fin-switch-user");
            if (localStorageOrganization && localStorageUser) {
              return {
                organization: localStorageOrganization,
                user: JSON.parse(localStorageUser),
              };
            }
          }
          return this.$store.state;
        })();
        if (!user || !organization) {
          this.$router.push("/micro-deposits/mock-login");
        } else {
          const { userId } = user;
          // Link Money API Token Call
          const response = await axios.post("/api/user-token", {
            userId,
            organization,
          });
          const { data } = response;
          const { access_token } = data;
          return access_token;
        }
      } catch (err) {
        this.errorMessage =
          err && err.response && err.response.data
            ? JSON.stringify(err.response.data)
            : err.message;
      }
    },
    async openLinkMoneyWebGateway() {
      const { flow, microDepositId } = this;
      const access_token = await this.generateToken();
      const redirectUri = `http://localhost:3001/micro-deposits/success`; // this is our current PORT
      const linkMoneyWebGatewayBaseUrl = `https://linkmoney-gateway.fingoal.com`; // This is the Link Money Gateway in Production.
      const linkMoneyWebGatewayUrl = (() => {
        if (flow === "verifyMicroDeposits") {
          return `${linkMoneyWebGatewayBaseUrl}/api/authenticate?token=${access_token}&flow=${flow}&microDepositId=${microDepositId}&redirectUri=${redirectUri}`;
        }
        return `${linkMoneyWebGatewayBaseUrl}/api/authenticate?token=${access_token}&flow=${flow}&redirectUri=${redirectUri}`;
      })();
      window.open(linkMoneyWebGatewayUrl); // Open the window with the Link Money Gateway, instead of opening the Plaid Link.
    },
  },
  mounted() {
    this.setInitialValues();
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
