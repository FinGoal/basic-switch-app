<template>
  <div class="screen-container">
    <div class="information-holder">
      <section v-if="completedFlow === 'initiateMicroDeposits'">
        <p>
          We've initiated 2 small micro deposits into your bank account.
          <br />Here is your microDepositId:
        </p>
        <p class="highlight" v-html="microDepositId" />
        <p>
          After 2 business days, you can open the micro deposit verification
          link.
        </p>
        <a :href="verifyMicroDepositLink">Open</a>
      </section>
      <p v-if="completedFlow === 'verifyMicroDeposits'">
        Micro Deposits have
        {{
          isMicroDepositsFailed ? " failed." : " been successfully verified."
        }}
      </p>
    </div>
    <img class="logo" src="/images/fingoal-logo.png" draggable="false" />
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: "Micro Deposits (Success)",
    };
  },
  data() {
    return {
      completedFlow: "",
      microDepositId: "",
    };
  },
  computed: {
    verifyMicroDepositLink: {
      get() {
        const { completedFlow, microDepositId } = this;
        const basicSwitchKitBaseUrl = `http://localhost:3001`;
        if (completedFlow === "initiateMicroDeposits") {
          return `${basicSwitchKitBaseUrl}/micro-deposits?flow=verifyMicroDeposits&microDepositId=${microDepositId}`;
        }
      },
    },
    isMicroDepositsFailed: {
      get() {
        const { events } = this.$route.query;
        return (
          (events && String(events).includes("FAILED")) ||
          String(events).includes("DATA_MISMATCH")
        );
      },
    },
  },
  methods: {
    setInitialValues() {
      const { completedFlow, microDepositId } = this.$route.query;
      this.completedFlow = completedFlow;
      this.microDepositId = microDepositId;
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
.screen-container .information-holder,
.screen-container .information-holder section {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.screen-container .information-holder p {
  font-size: 18px;
  text-align: center;
  color: #6a2d91;
}
.screen-container .information-holder .highlight {
  margin: 12px 0px 24px 0px;
  padding: 9px 12px;
  font-size: 18px;
  font-weight: 800;
  text-align: center;
  color: #6a2d91;
  background: rgba(127, 17, 224, 0.1);
  border-radius: 5px;
}
.screen-container .information-holder a {
  margin: 18px 0px 0px 0px;
  padding: 12px 15px;
  font-size: 18px;
  text-decoration: none;
  color: #ffffff;
  background: #6a2d91;
  border-radius: 7px;
}
.screen-container .logo {
  margin: 0px 0px 36px 0px;
  height: 36px;
  width: auto;
}
</style>
