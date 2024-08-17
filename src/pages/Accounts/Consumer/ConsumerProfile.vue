<template>
  <div class="q-ma-md main-container">
    <div class="text-subtitle1 text-uppercase text-weight-bold q-mb-md">
      Consumer Info
    </div>
    <q-banner dense class="bg-primary text-white">
      <div>
        <div class="text-h6">Jezzy Kruger</div>
        <div class="text-body-1">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem,
          fugit?
        </div>
        <div class="text-body-1">+1234567890</div>
      </div>
    </q-banner>

    <div class="q-mt-md">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="mails" label="Consumption Records" />
          <q-tab name="alarms" label="Payment History" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="mails">
            <div class="fit row">
              <div>
                <div class="text-h6">Billing</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </div>
              <div class="q-ml-auto">
                <q-btn color="primary" @click="onShowDialog"
                  >Create Billing</q-btn
                >
              </div>
            </div>

            <div class="q-mt-md">
              <q-table :data="consumer" :columns="columns" row-key="name">
                <template v-slot:body-cell-actions="props">
                  <q-td align="right">
                    <q-btn
                      color="primary"
                      @click="onViewItem(props.row)"
                      icon="visibility"
                      size="9px"
                      padding="xs"
                      class="q-mr-xs"
                    />
                    <q-btn color="negative" icon="delete" dense size="10px" />
                  </q-td>
                </template>
              </q-table>
            </div>
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <div class="text-h6">Payment History</div>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
      <ConsumerBillingDialog ref="billing" v-model="showDialog" @getItems="fetch"/>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ConsumerBillingDialog from "../../../components/ConsumerBillingDialog.vue";

export default {
  components: {
    ConsumerBillingDialog,
  },
  data() {
    return {
      consumer: [],
      columns: [
        {
          name: "consumerId",
          label: "Consumer  ",
          align: "left",
          field: "consumerId",
        },
        {
          name: "billingDate",
          label: "Billing Date",
          align: "left",
          field: "billingDate",
        },
        {
          name: "previousRead",
          label: "Previous Red",
          align: "left",
          field: "previousRead",
        },
        {
          name: "presentRead",
          label: "Present Read",
          align: "left",
          field: "presentRead",
        },
        {
          name: "consumption",
          label: "Consumption",
          align: "left",
          field: "consumption",
        },
        {
          name: "status",
          label: "Payment Status",
          align: "left",
          field: "status",
        },
        { name: "actions", label: "Actions", align: "right" },
      ],
      tab: "mails",
      showDialog: false,
    };
  },
  methods: {
    ...mapActions({
      getConsumerItemsById: "billings/getConsumerItemsById",
    }),
    async fetch() {
      const response = await this.getConsumerItemsById(this.$route.params.id);
      this.consumer = response.result;
    },
    onViewItem(item) {
      this.$router.push({
        path: `/consumer/${item._id}/view`,
      });
    },
    onShowDialog(){
      this.$refs.billing.getItem();
      this.showDialog = true
    }
  },
  created() {
    this.fetch();
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
.submit-button {
  margin-top: 20px;
  align-self: flex-start;
}
</style>

<style scoped>
/* .main-container {
  margin: 100px !important;
} */
</style>
