<template>
    <div>
        <DocPage type="Estimate"></DocPage>
    </div>
</template>

<script>
  import {Estimate} from "../graphql";
  import List from "../components/List"
  import EstimateDoc from '../components/EstimateDoc'
  import DocPage from "../components/DocPage";

  export default {
    name: "Estimate",
    components: {DocPage, List, EstimateDoc},

    methods: {
      /**
       * Call apollo to create estimate
       * @param estimate
       */
      createEstimate(estimate) {
        delete estimate.id
        this.loaderController()
        this.$apollo.mutate({
          mutation: Estimate.CREATE,
          variables: {
            ...estimate
          }
        }).then(() => {
          this.loaderController()
          this.getEstimates()
        }).catch(error => {
          this.loaderController()
          this.error = error
        })
      },

      /**
       * Call apollo to update estimate
       * @param estimate
       */
      updateEstimate(estimate) {
        this.loaderController()
        this.$apollo.mutate({
          mutation: Estimate.UPDATE,
          variables: {
            ...estimate
          }
        }).then(() => {
          this.loaderController()
          this.getEstimates()
        }).catch(error => {
          this.loaderController()
          this.error = error
        })
      },

      /**
       * Check if is a new estimate or a modified
       */
      updateOrCreateEstimate() {
        if (!this.selectedEstimate.client) {
          this.error = "Vous n'avez pas sélectionner de client."
          return
        } else if (this.selectedEstimate.products.length <= 0) {
          this.error = "Vous n'avez pas sélectionner de produit."
          return;
        }
        let estimate = this.selectedEstimate
        estimate.clientId = estimate.client.id
        delete estimate.client

        if (this.selectedEstimate.id === 1) {
          this.createEstimate(estimate)
        } else if (this.selectedEstimate.id !== 0 && this.selectedEstimate.id !== 1) {
          this.updateEstimate(estimate)
        }
      },

      /**
       * Change estimate state ("PENDING", "DONE")
       */
      changeEstimateState() {
        this.loaderController()
        let state = this.selectedEstimate.state
        if (state === "PENDING") {
          state = 1
        } else if (state === "SEND") {
          state = 2
        } else if (state === "DONE") {
          state = 3
        }
        this.$apollo.mutate({
          mutation: Estimate.CHANGE_STATE,
          variables: {
            id: this.selectedEstimate.id,
            state
          }
        }).then(() => {
          this.loaderController()
          this.getEstimates()
        }).catch(error => {
          this.loaderController()
          this.error = error
        })
      },

      /**
       * Change estimate state to "PENDING", data cannot be modified
       */
      validateEstimate() {
        this.loaderController()
        this.$apollo.mutate({
          mutation: Estimate.VALIDATE_ESTIMATE,
          variables: {
            id: this.selectedEstimate.id
          }
        }).then(() => {
          this.loaderController()
          this.getEstimates()
        }).catch(error => {
          this.loaderController()
          this.error = error
        })
      },

      /**
       * Call apollo to delete selected estimate
       */
      deleteEstimate() {
        this.modal = false
        this.loaderController()
        this.$apollo.mutate({
          mutation: Estimate.DELETE,
          variables: {
            id: this.selectedEstimate.id
          }
        }).then(() => {
          this.loaderController()
          this.getEstimates()
        }).catch(error => {
          this.loaderController()
          this.error = error
        })
      },
    },
  }
</script>

<style scoped>
    #custom-list {
        overflow-y: auto;
        max-height: calc(100vh - 88px)
    }
</style>