<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">Collections</div>
      </q-card-section>
      <q-card-section>
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
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      consumer: [],
      columns: [
        {
          name: "paymentDate",
          label: "Payment Date",
          align: "left",
          field: "paymentDate",
        },
        {
          name: "consumerId",
          label: "Consumer",
          align: "left",
          field: "consumerId",
        },
        {
          name: "totalBill",
          label: "Total Bill",
          align: "left",
          field: "totalBill",
        },
        {
          name: "paymentMethod",
          label: "payment Method",
          align: "left",
          field: "paymentMethod",
        },
        {
          name: "paymentDescription",
          label: "Payment Description",
          align: "left",
          field: "paymentDescription",
        },
        { name: "actions", label: "Actions", align: "right" },
      ],
    };
  },
  methods: {
    ...mapActions({
      getItems: "collections/getItem",
    }),
    async fetch() {
      const response = await this.getItems();
      this.consumer = response.result;
    },
    onViewItem(item) {
      console.log(item);
    },
  },
  created() {
    this.fetch();
  },
};
</script>
