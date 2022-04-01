<template>
  <Nuxt />
</template>

<script>
export default {
  beforeMount() {
    console.log("It begins");
    this.$store.commit("setUserFromStorage");
    this.$store.commit("setPlaidMetaFromStorage");
  }
}
</script>

