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

    <div class="row">
      <div class="col-9">
        <q-card :flat="true" v-if="currentBilling">
          <div class="q-pa-md">
            <div class="text-body1 q-mb-sm q-mt-md text-weight-bold">
              Billing Statement
            </div>
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
                  statement.presentBill
                }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>PREVIOUS BALANCE:</q-item-section>
                <q-item-section side>{{
                  statement.previousBalance
                }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>OTHER CHARGES:</q-item-section>
                <q-item-section side>{{
                  statement.otherCharges
                }}</q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label class="text-weight-bold"
                    >TOTAL AMOUNT PAYABLES</q-item-label
                  >
                </q-item-section>
                <q-item-section side class="text-weight-bold">{{
                  statement.totalBill
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
import moment from "moment";

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
        // {
        //   name: "consumerId",
        //   label: "Consumer ID",
        //   align: "left",
        //   field: "consumerId",
        // },
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
        // { name: "actions", label: "Actions", align: "right" },
      ],
      statement: {},
    };
  },
  computed: {
    consumerData() {
      if (!this.currentBilling) return {};
      return {
        consumerName: this.currentBilling.name,
        billingDate: moment(this.currentBilling.billingDate).format(
          "YYYY-MM-DD"
        ),
        dueDate: moment(this.currentBilling.dueDate).format("YYYY-MM-DD"),
      };
    },
    readingData() {
      if (!this.currentBilling) return {};
      return {
        previousDate: moment(this.currentBilling.previousDate).format(
          "YYYY-MM-DD"
        ),
        previousRead: this.currentBilling.previousRead,
        presentDate: moment(this.currentBilling.presentDate).format(
          "YYYY-MM-DD"
        ),
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
      addCollectionItem: "collections/addItem",
    }),
    async fetch() {
      const response = await this.getConsumerItemsById(this.$route.params.id);
      this.consumers = response.result.map((item) => ({
        ...item,
        billingDate: moment(item.billingDate).format("YYYY-MM-DD"),
      }));

      this.statement = this.generateBillingStatement(response.result);

      if (this.consumers.length > 0) {
        this.currentBilling = this.consumers[0];
        this.currentBilling.name = `${this.currentBilling.consumerId.firstName} ${this.currentBilling.consumerId.middleName} ${this.currentBilling.consumerId.lastName}`;
      }
    },

    onViewItem(item) {
      this.$router.push({
        path: `/consumer/${item._id}/view`,
      });
    },
    generateBillingStatement(records) {
      records.sort((a, b) => new Date(b.billingDate) - new Date(a.billingDate));

      const recentRecord = records[0];

      let totalBill = 0;
      let previousBalance = 0;
      let hasUnpaidRecords = false;

      records.forEach((record) => {
        if (record.status === "Unpaid") {
          hasUnpaidRecords = true;
          totalBill += record.presentBill;

          if (record._id.toString() !== recentRecord._id.toString()) {
            previousBalance += record.presentBill;
            console.log(previousBalance);
          }
        }
      });

      const presentBill = hasUnpaidRecords ? recentRecord.presentBill : 0;

      const billingStatement = {
        previousDate: recentRecord.previousDate,
        previousRead: recentRecord.previousRead,
        presentDate: recentRecord.presentDate,
        presentRead: recentRecord.presentRead,
        consumption: recentRecord.consumption,
        readType: recentRecord.readType,
        meterDescription: recentRecord.meterDescription,
        presentBill: presentBill,
        totalBill: totalBill,
        previousBalance: previousBalance,
      };

      return billingStatement;
    },

    async processPayment() {
      const unpaidBillId = this.consumers
        .filter((item) => item.status != "Paid")
        .map((item) => item._id);

        const data = {
          billId: unpaidBillId,
          consumerId: this.$route.params.id,
          totalBill: this.totalAmountPayable,
          amountPaid: this.cashAmount,
          change: this.changeAmount,
          paymentMethod: 'Cash',
          collectionType: 'Water Bill'
        }

        const response = await this.addCollectionItem(data)

    },
  },
  created() {
    this.fetch();
  },
};
</script>
