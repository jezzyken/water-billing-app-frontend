<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="width: 700px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6">Add Expense</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 40vh; min-height: 50vh" class="scroll">
        <div>
          <div>
            <div class="row q-col-gutter-lg q-mt-sm">
              <div class="col-6">
                <q-input filled mask="date" label="Date" v-model="items.date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="items.date" minimal>
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
            </div>  
          </div>

          <div class="row q-col-gutter-lg q-mt-sm">
            <div class="col-6">
              <q-select
                filled
                v-model="items.expenseType"
                :options="expenseType"
                label="Read Type "
              />
            </div>

            <div class="col-6">
              <q-input v-model="items.amount" filled label="Amount" />
            </div>

            <div class="col-12">
              <q-input
                v-model="items.description"
                filled
                label="Description"
                type="textarea"
              />
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

export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      dialog: this.value,
      expenseType: [
        "Receipt",
        "Bond Paper",
        "Ink",
        "Electricity Bill",
        "Salary",
        "Maintenance/Tools",
      ],
      items: {
        amount: "",
        date: null,
        description: "",
      },
      billing: {},
    };
  },

  methods: {
    ...mapActions({
      addItem: "expenses/addItem",
    }),

    async onAddItem() {
      const response = await this.addItem(this.items);
      this.dialog = false;
      this.$emit("getItems");
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
