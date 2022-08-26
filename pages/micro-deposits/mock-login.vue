<template>
  <div>
    <div class="screen-container">
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title> Mock Login </v-card-title>
            <v-card-text>
              <v-text-field
                label="Organization"
                v-model="organization"
              ></v-text-field>
            </v-card-text>
            <v-card-text>
              <v-text-field label="User Id" v-model="userId"></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="submitLogin"> Sign In </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: "Mock Login",
    };
  },
  data() {
    return {
      organization: null,
      userId: null,
    };
  },
  methods: {
    submitLogin() {
      const { organization, userId } = this;
      this.$store.commit("setOrganization", organization);
      this.$store.commit("setUser", { userId });
      this.$router.push("/micro-deposits");
    },
  },
};
</script>

<style>
.screen-container {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  padding: 48px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-family: "Lato", sans-serif !important;
}
</style>