<template>
  <q-page>
    <q-card :flat="true">
      <q-card-section>
        <div class="text-h6">Billing Form</div>
      </q-card-section>
      <q-card-section>
        <q-table
          :data="[consumerData]"
          :columns="consumerColumns"
          hide-bottom
          flat
          bordered
        />
        <div class="text-body1 q-mb-sm q-mt-md text-weight-bold">
          Billing Records
        </div>
        <q-table
          :data="consumers"
          :columns="columns"
          row-key="name"
          hide-bottom
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                color="primary"
                icon="visibility"
                @click="onViewItem(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <div class="row ">
      <div class="col-9">
        <q-card :flat="true" v-if="currentBilling">
          <div class="q-pa-md">
            <q-table
              :data="[readingData]"
              :columns="readingColumns"
              hide-bottom
              flat
              bordered
              class="q-mt-md"
            />

            <q-list bordered class="q-mt-md">
              <q-item>
                <q-item-section>
                  <q-item-label>SUMMARY OF ACCOUNT CHARGES</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>PRESENT BILL:</q-item-section>
                <q-item-section side>{{
                  currentBilling.presentBill
                }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>PREVIOUS BALANCE:</q-item-section>
                <q-item-section side>{{
                  currentBilling.previousBalance
                }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>OTHER CHARGES:</q-item-section>
                <q-item-section side>{{
                  currentBilling.otherCharges
                }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-bold"
                    >TOTAL AMOUNT PAYABLES</q-item-label
                  >
                </q-item-section>
                <q-item-section side class="text-weight-bold">{{
                  totalAmountPayable
                }}</q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card>
      </div>

      <div class="col-3">
        <q-card :flat="true" v-if="currentBilling">
          <q-card-section>
            <div class="text-h6">Payment</div>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model.number="cashAmount"
              label="Cash"
              type="number"
              filled
              :rules="[(val) => val > 0 || 'Please enter a valid amount']"
            />
            <q-input
              v-model.number="changeAmount"
              label="Change"
              type="number"
              filled
              readonly
              class="q-mt-md"
            />
            <q-btn
              label="Make Payment"
              color="primary"
              class="full-width q-mt-md"
              :disable="!isPaymentValid"
              @click="processPayment"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      consumers: [],
      currentBilling: null,
      cashAmount: 0,
      consumerColumns: [
        {
          name: "consumerName",
          align: "left",
          label: "CONSUMER NAME",
          field: "consumerName",
        },
        {
          name: "billingDate",
          align: "center",
          label: "BILLING DATE",
          field: "billingDate",
        },
        {
          name: "dueDate",
          align: "center",
          label: "DUE DATE",
          field: "dueDate",
        },
      ],
      readingColumns: [
        {
          name: "previousDate",
          align: "center",
          label: "PREVIOUS DATE",
          field: "previousDate",
        },
        {
          name: "previousRead",
          align: "center",
          label: "PREVIOUS READ",
          field: "previousRead",
        },
        {
          name: "presentDate",
          align: "center",
          label: "PRESENT DATE",
          field: "presentDate",
        },
        {
          name: "presentRead",
          align: "center",
          label: "PRESENT READ",
          field: "presentRead",
        },
        {
          name: "consumption",
          align: "center",
          label: "CONSUMPTION (IN CUBIC)",
          field: "consumption",
        },
        {
          name: "readType",
          align: "center",
          label: "READ TYPE",
          field: "readType",
        },
        {
          name: "meterDescription",
          align: "center",
          label: "METER DESCRIPTION",
          field: "meterDescription",
        },
      ],
      columns: [
        {
          name: "consumerId",
          label: "Consumer ID",
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
          label: "Previous Read",
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
    };
  },
  computed: {
    consumerData() {
      if (!this.currentBilling) return {};
      return {
        consumerName: this.currentBilling.consumerId,
        billingDate: this.currentBilling.billingDate,
        dueDate: this.currentBilling.dueDate,
      };
    },
    readingData() {
      if (!this.currentBilling) return {};
      return {
        previousDate: this.currentBilling.previousDate,
        previousRead: this.currentBilling.previousRead,
        presentDate: this.currentBilling.presentDate,
        presentRead: this.currentBilling.presentRead,
        consumption: this.currentBilling.consumption,
        readType: this.currentBilling.readType,
        meterDescription: this.currentBilling.meterDescription,
      };
    },
    totalAmountPayable() {
      if (!this.currentBilling) return 0;
      return (
        (this.currentBilling.presentBill || 0) +
        (this.currentBilling.previousBalance || 0) +
        (this.currentBilling.otherCharges || 0)
      );
    },
    changeAmount() {
      return Math.max(this.cashAmount - this.totalAmountPayable, 0).toFixed(2);
    },
    isPaymentValid() {
      return this.cashAmount >= this.totalAmountPayable;
    },
  },
  methods: {
    ...mapActions({
      getConsumerItemsById: "billings/getConsumerItemsById",
    }),
    async fetch() {
      const response = await this.getConsumerItemsById(this.$route.params.id);
      this.consumers = response.result;
      if (this.consumers.length > 0) {
        this.currentBilling = this.consumers[0];
      }
      console.log(this.currentBilling);
    },
    onViewItem(item) {
      this.$router.push({
        path: `/consumer/${item._id}/view`,
      });
    },

    processPayment() {
      console.log("Processing payment...");
      console.log("Cash amount:", this.cashAmount);
      console.log("Total amount payable:", this.totalAmountPayable);
      console.log("Change:", this.changeAmount);
    },
  },
  created() {
    this.fetch();
  },
};
</script>
