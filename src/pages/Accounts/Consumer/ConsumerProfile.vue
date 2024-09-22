<template>
  <div class="q-ma-md main-container">
    <div class="text-subtitle1 text-uppercase text-weight-bold q-mb-md">
      Consumer Info
    </div>
    <q-banner dense class="bg-primary text-white">
      <div>
        <div class="text-h6">{{ consumerInfo.fullName }}</div>
        <div class="text-body-1">
          {{ consumerInfo.fullAddress }}
        </div>
        <div class="text-body-1">{{ consumerInfo.contactNo }}</div>
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
                List off consumer billing records
              </div>
            </div>

            <div class="q-mt-md">
              <q-table
                :data="consumers"
                :columns="columns"
                row-key="_id"
                :filter="filter"
              >
                <template v-slot:body-cell-status="props">
                  <q-td>
                    <q-badge
                      :color="props.row.status === 'Paid' ? 'green' : 'red'"
                    >
                      {{ props.row.status }}
                    </q-badge>
                  </q-td>
                </template>

                <template v-slot:top>
                  <q-input
                    dense
                    debounce="300"
                    v-model="filter"
                    placeholder="Search"
                    outlined
                  >
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                  <q-space />
                  <q-btn color="primary" @click="onShowDialog"
                    >Create Billing</q-btn
                  >
                </template>
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
            <div class="fit row">
              <div>
                <div class="text-h6">Payment History</div>
                List off consumer payment records
              </div>
            </div>
            <div class="q-mt-md">
              <q-table
                :data="collections"
                :columns="collectionColumns"
                row-key="_id"
                :filter="collectionFilter"
              >
                <template v-slot:top>
                  <q-input
                    dense
                    debounce="300"
                    v-model="collectionFilter"
                    placeholder="Search"
                    outlined
                  >
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                  <q-space />
                </template>
                <!-- <template v-slot:body-cell-actions="props">
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
            </template> -->
              </q-table>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
      <ConsumerBillingDialog
        ref="billing"
        v-model="showDialog"
        @getItems="fetch"
        :billingData="item"
        :update="update"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ConsumerBillingDialog from "../../../components/ConsumerBillingDialog.vue";
import moment from "moment";

export default {
  components: {
    ConsumerBillingDialog,
  },
  data() {
    return {
      consumers: [],
      collections: [],
      columns: [
        // {
        //   name: "name",
        //   label: "Consumer  ",
        //   align: "left",
        //   field: "name",
        // },
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

      collectionColumns: [
        {
          name: "paymentDate",
          label: "Payment Date",
          align: "left",
          field: "paymentDate",
        },
        {
          name: "totalBill",
          label: "Total Bill",
          align: "left",
          field: "totalBill",
        },
        {
          name: "amountPaid",
          label: "Amount Paid",
          align: "left",
          field: "amountPaid",
        },
        {
          name: "paymentMethod",
          label: "Payment Method",
          align: "left",
          field: "paymentMethod",
        },
        {
          name: "collectionType",
          label: "Collection Type",
          align: "left",
          field: "collectionType",
        },
        // { name: "actions", label: "Actions", align: "right" },
      ],
      collectionFilter: "",

      tab: "mails",
      showDialog: false,
      filter: "",
      item: {},
      update: false
    };
  },
  computed: {
    ...mapGetters("consumers", ["consumer"]),
    consumerInfo() {
      const fullName =
        `${this.consumer.firstName} ${this.consumer.middleName} ${this.consumer.lastName}`.toUpperCase();
      const fullAddress = `${this.consumer.purok} ${this.consumer.address}`;
      return {
        ...this.consumer,
        fullName,
        fullAddress,
      };
    },
  },
  methods: {
    ...mapActions({
      getConsumerItemsById: "billings/getConsumerItemsById",
      getConsumer: "consumers/getItemById",
      getCollections: "collections/getItemByConsumerId",
    }),
    async fetch() {
      const consumerId = this.$route.params.id;
      const response = await this.getConsumerItemsById(consumerId);
      const collectionData = await this.getCollections(consumerId);
      await this.getConsumer(consumerId);
      this.consumers = response.result.map((item) => ({
        ...item,
        name: `${item.consumerId.firstName} ${item.consumerId.middleName} ${item.consumerId.lastName}`,
        billingDate: moment(item.billingDate).format("YYYY-MM-DD"),
      }));

      this.collections = collectionData.data.result.map((item) => ({
        ...item,
        paymentDate: moment(item.paymentDate).format("YYYY-MM-DD hh:mm A"),
      }));

      console.log(this.collections);
    },
    onViewItem(item) {
      this.item = item
      this.showDialog = true;
      this.update = true
    },
    onShowDialog() {
      this.$refs.billing.getItem();
      this.showDialog = true;
      this.update = false
    },
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
