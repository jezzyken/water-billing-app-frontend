<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="width: 900px; max-width: 90vw">
      <q-card-section>
        <div class="text-h6">Consumerx</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 30vh; min-height: 30vh" class="scroll">
        <q-form>
          <div class="row q-col-gutter-lg">
            <div class="col-4">
              <q-input filled v-model="consumer.lastName" label="Last Name" />
            </div>
            <div class="col-4">
              <q-input filled v-model="consumer.firstName" label="First Name" />
            </div>
            <div class="col-4">
              <q-input
                filled
                v-model="consumer.middleName"
                label="Middle Name"
              />
            </div>
            <div class="col-4">
              <q-select
                filled
                v-model="consumer.extension"
                :options="consumer.extensions"
                label="Name Extension"
              />
            </div>
            <div class="col-8">
              <q-input filled v-model="consumer.contactNo" label="Contact No" />
            </div>
            <div class="col-9">
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
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn flat label="close" color="primary" v-close-popup />
        <q-btn @click="onAddItem" flat :label="buttonLabel" color="primary" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    value: Boolean,
    update: Boolean,
    consumerData: Object,
  },
  data() {
    return {
      dialog: this.value,
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
        contactNo: "",
        isMember: true,
      },
    };
  },

  computed: {
    buttonLabel() {
      return this.update ? "Update" : "Save";
    },
  },

  methods: {
    ...mapActions({
      addItem: "consumers/addItem",
    }),

    async onAddItem() {
      this.dialog = false;
      const data = {
        consumer: { ...this.consumer },
      };

      if (this.update) {
        console.log("update");
      } else {
        await this.addItem(data);
      }

      this.$emit("getItems");
    },

    onViewItem(item) {
      this.consumer.firstName = "fuck";
    },

    clearForm() {
      this.consumer = {
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
        contactNo: "",
        isMember: true,
      };
    },
  },
  watch: {
    value(val) {
      this.dialog = val;
    },
    dialog(val) {
      this.$emit("input", val);
      if (!val) {
        this.clearForm();
      }
    },
    consumerData: {
      handler(newVal) {
        this.consumer = { ...newVal };
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.banner-border {
  border: solid 1px #c4c4c4 !important;
}
</style>
