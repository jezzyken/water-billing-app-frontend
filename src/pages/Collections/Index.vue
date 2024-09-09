<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">Collections</div>
      </q-card-section>
      <q-card-section>
        <q-table :data="consumer" :columns="columns" row-key="_id">
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
import { mapActions } from "vuex";
import moment from "moment"

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
          name: "name",
          label: "Consumer",
          align: "left",
          field: "name",
        },
        {
          name: "totalBill",
          label: "Total Bill",
          align: "left",
          field: "totalBill",
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
      this.consumer = response.result.map((item) => ({
        ...item,
        name: `${item.consumerId.firstName} ${item.consumerId.middleName} ${item.consumerId.lastName}`,
        paymentDate: moment(item.paymentDate).format('YYYY-MM-DD hh:mm a')
      }));
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
