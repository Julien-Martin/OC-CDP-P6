<template>
    <div>
        <DocPage type="Invoice"></DocPage>
    </div>
</template>

<script>
  import List from "../components/List";
  import InvoiceDoc from "../components/InvoiceDoc";
  import DocPage from "../components/DocPage";

  export default {
    name: "Invoices",
    components: {DocPage, InvoiceDoc, List},
  }
</script>

<style scoped>

</style>