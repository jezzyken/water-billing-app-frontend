<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="width: 700px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6">Create New Billing</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 40vh; min-height: 50vh" class="scroll">
        <div v-if="!isLoading">
          <div class="row q-col-gutter-lg">
            <div class="col-6">
              <q-select
                filled
                v-model="items.month"
                :options="months"
                label="Present Date"
                required
              />
            </div>
            <div class="col-3">
              <q-select
                filled
                v-model="items.year"
                :options="years"
                label="Year"
                required
              />
            </div>
          </div>

          <div>
            <div class="row q-col-gutter-lg q-mt-sm">
              <div class="col-3">
                <!-- <q-input v-model="items.billingDate" filled label="Billing Date" /> -->

                <q-input
                  filled
                  v-model="items.billingDate"
                  mask="date"
                  :rules="['date']"
                  label="Billing Date"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="items.billingDate" minimal>
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-3">
                <q-input
                  v-model="items.previousRead"
                  filled
                  label="Previous Read"
                />
              </div>
              <div class="col-3">
                <q-input
                  v-model="items.presentRead"
                  filled
                  label="Present Read"
                />
              </div>
              <div class="col-3">
                <q-input
                  filled
                  label="Consumption "
                  v-model.number="consumption"
                />
              </div>
              <div class="col-6">
                <q-select
                  filled
                  v-model="items.readType"
                  :options="readTypes"
                  label="Read Type "
                />
              </div>
              <div class="col-6">
                <q-select
                  filled
                  v-model="items.meterDescription"
                  :options="meterDescriptions"
                  label="Meter Description "
                />
              </div>
              <div class="col-12">
                <q-input v-model="items.notes" filled label="Notes" />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="close" color="primary" v-close-popup />
        <q-btn @click="onAddItem" flat label="save" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions } from "vuex";
import moment from "moment";

export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      dialog: this.value,
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      readTypes: ["Actual"],
      meterDescriptions: ["Water"],
      years: [],
      items: {
        readType: "Actual",
        meterDescription: "Water",
        billingDate: null,
        previousRead: 0,
        presentRead: 0,
      },
      showBillingForm: false,
      billing: {},
      isLoading: false,
    };
  },
  created() {
    const currentYear = new Date().getFullYear();
    const startYear = 2000;

    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
  },

  computed: {
    consumption: {
      get() {
        const consumptionValue =
          this.items.presentRead - this.items.previousRead;
        return consumptionValue >= 0 ? consumptionValue : 0;
      },
      set(value) {
        const validValue = value >= 0 ? value : 0;
        this.items.previousRead = this.items.presentRead - validValue;
      },
    },
  },
  methods: {
    ...mapActions({
      addItem: "billings/addItem",
      getConsumerItemById: "billings/getConsumerItemById",
    }),

    async onAddItem() {
      const presentDate = moment(
        `${this.items.month} ${this.items.year}`,
        "MMMM YYYY"
      ).toDate();
      const previousDate = this.getPreviousMonthAndYear(
        this.items.month,
        this.items.year
      );

      const data = {
        ...this.items,
        consumerId: this.$route.params.id,
        previousDate,
        presentDate,
        billingDate: new Date(this.items.billingDate),
      };

      await this.addItem(data);
      this.dialog = false;
      this.$emit("getItems");
    },

    async getItem() {
      this.isLoading = true;
      const response = await this.getConsumerItemById(this.$route.params.id);
      if (response.status === 404) {
        this.isLoading = false;
      }

      this.billing = response.result;
      this.items.previousRead = this.billing.presentRead;
      this.isLoading = false;
    },

    getPreviousMonthAndYear(month, year) {
      const date = moment(`${month} ${year}`, "MMMM YYYY");

      date.subtract(1, "month");
      const previousDate = date.toDate();

      return previousDate;
    },
  },
  watch: {
    value(val) {
      this.dialog = val;
    },
    dialog(val) {
      this.$emit("input", val);
    },
  },
};
</script>

<style scoped>
.banner-border {
  border: solid 1px #c4c4c4 !important;
}
</style>
