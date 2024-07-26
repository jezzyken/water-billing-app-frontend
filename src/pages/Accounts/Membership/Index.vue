<template>
  <q-card class="q-ma-md main-container">
    <q-card-section>
      <div class="text-h6">Membership</div>
    </q-card-section>
    <!-- <q-card-section>
        <q-btn color="primary" @click="addBill">Add Bill</q-btn>
      </q-card-section> -->
    <q-stepper v-model="step" header-nav ref="stepper" color="primary" animated>
      <q-step
        :name="1"
        title="Consumer Information"
        icon="settings"
        :done="step > 1"
        :header-nav="step > 1"
      >
        <q-form>
          <div class="row q-col-gutter-lg">
            <div class="col-3">
              <q-input filled v-model="consumer.lastName" label="Last Name" />
            </div>
            <div class="col-3">
              <q-input filled v-model="consumer.firstName" label="First Name" />
            </div>
            <div class="col-3">
              <q-input
                filled
                v-model="consumer.middleName"
                label="Middle Name"
              />
            </div>
            <div class="col-3">
              <q-select
                filled
                v-model="consumer.extension"
                :options="consumer.extensions"
                label="Name Extension"
              />
            </div>
            <div class="col-6">
              <q-input
                filled
                v-model="consumer.address"
                label="Complete Address"
              />
            </div>

            <div class="col-3">
              <q-select
                filled
                v-model="consumer.purok"
                :options="consumer.puroks"
                label="Purok"
                required
              />
            </div>

            <div class="col-3">
              <q-input filled v-model="consumer.contactNo" label="Contact No" />
            </div>
          </div>
        </q-form>

        <q-stepper-navigation>
          <q-btn
            @click="
              () => {
                done1 = true;
                step = 2;
              }
            "
            color="primary"
            label="Continue"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Payment"
        icon="create_new_folder"
        :done="step > 2"
        :header-nav="step > 2"
      >
        <div class="text-h6">Consumer Information Overview</div>
        <hr />
        <div class="text-body2">
          {{ capitalizedConsumer.lastName }},
          {{ capitalizedConsumer.firstName }}
          {{ capitalizedConsumer.middleName }} {{ consumer.extension }}
        </div>
        <div class="text-body2">
          {{ consumer.purok }} {{ consumer.address }}
        </div>
        <div class="text-body2">
          {{ consumer.contactNo }}
        </div>
        <hr class="bottom-line" />

        <div class="text-h6">Membership Fee</div>
        <q-banner class="bg-primary text-white">
          <template v-slot:avatar>
            <q-icon name="info" color="white" />
          </template>
          Membership Fee of P200.00
        </q-banner>

        <div class="row q-col-gutter-lg q-mt-xs">
          <div class="col-3">
            <q-input filled v-model="payment.amountPaid" label="Amount Paid" />
          </div>
          <div class="col-3">
            <q-input filled v-model="computedChange" label="Change" readonly />
          </div>
        </div>
        <q-stepper-navigation>
          <q-btn color="primary" label="Submit" @click="onAddItem" />
          <q-btn
            flat
            @click="step = 1"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="3"
        title="Complete"
        icon="add_comment"
        :header-nav="step > 3"
      >
        <div class="fit column justify-center items-center content-center">
          <div>
            <q-icon
              name="check_circle"
              color="positive"
              style="font-size: 6em"
            />
          </div>
          <div class="text-h4">Success! New Consumer has been registered</div>
        </div>
        <q-stepper-navigation>
          <q-btn
            color="primary"
            @click="done3 = true"
            label="Finish"
            :to="{ path: '/consumers' }"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </q-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      bills: [],
      columns: [
        {
          name: "billingDate",
          required: true,
          label: "Billing Date",
          align: "left",
          field: (row) => row.billingDate,
        },
        {
          name: "dueDate",
          required: true,
          label: "Due Date",
          align: "left",
          field: (row) => row.dueDate,
        },
        {
          name: "presentRead",
          required: true,
          label: "Present Read",
          align: "left",
          field: (row) => row.presentRead,
        },
        {
          name: "cubicConsumption",
          required: true,
          label: "Cubic Consumption",
          align: "left",
          field: (row) => row.cubicConsumption,
        },
        {
          name: "presentBill",
          required: true,
          label: "Present Bill",
          align: "left",
          field: (row) => row.presentBill,
        },
        {
          name: "status",
          required: true,
          label: "Status",
          align: "left",
          field: (row) => row.status,
        },
        { name: "actions", required: true, label: "Actions", align: "right" },
      ],
      step: 1,
      consumer: {
        lastName: "",
        firstName: "",
        middleName: "",
        address: "Sitio Basak Brgy. Malandag",
        puroks: [
          "Purok 1",
          "Purok 2",
          "Purok 3",
          "Purok 4",
          "Purok 5",
          "Purok 6",
        ],
        extensions: ["Jr", "Sr"],
        purok: "",
        extension: "",
        contactNumber: "",
        isMember: false,
      },

      payment: {
        amountPaid: 0,
        change: 0,
        paymentDescription: "Membership Fee",
      },
      membershipFee: 200,
    };
  },
  computed: {
    computedChange() {
      return this.payment.amountPaid >= this.membershipFee
        ? this.payment.amountPaid - this.membershipFee
        : 0;
    },

    capitalizedConsumer() {
      return this.capitalizeObject(this.consumer);
    },
  },
  watch: {
    computedChange(newVal) {
      this.payment.change = newVal;
    },
  },
  methods: {
    ...mapActions({
      addItem: "consumers/addItem",
    }),
    capitalize(value) {
      if (!value) return "";
      return value
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },

    capitalizeObject(obj) {
      let capitalizedObj = {};
      for (const key in obj) {
        if (typeof obj[key] === "string") {
          capitalizedObj[key] = this.capitalize(obj[key]);
        } else {
          capitalizedObj[key] = obj[key];
        }
      }
      return capitalizedObj;
    },

    async onAddItem() {
      const data = {
        consumer: this.consumer,
        payment: { ...this.payment, totalBill: this.membershipFee },
      };

      await this.addItem(data);
      this.step = 3;
    },
  },
};
</script>

<style scoped>
.main-container {
  margin: 100px !important;
}

.bottom-line {
  border: none;
  border-top: 2px dashed #c4c4c4;
  margin: 20px 0;
}
</style>
