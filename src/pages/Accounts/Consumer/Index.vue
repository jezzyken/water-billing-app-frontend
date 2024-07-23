<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">Consumers</div>
      </q-card-section>
      <q-card-section>
        <q-btn
          color="primary"
          @click="
            $router.push({ name: 'Customer Form', params: { action: 'add' } })
          "
          >Add Consumer</q-btn
        >
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
          name: "accountNo",
          label: "Account No",
          align: "left",
          field: "accountNo",
        },
        {
          name: "lastName",
          label: "Last Name",
          align: "left",
          field: "lastName",
        },
        {
          name: "firstName",
          label: "First Name",
          align: "left",
          field: "firstName",
        },
        {
          name: "middleName",
          label: "Middle Name",
          align: "left",
          field: "middleName",
        },
        {
          name: "address",
          label: "Address",
          align: "left",
          field: "address",
        },
        {
          name: "purok",
          label: "Purok",
          align: "left",
          field: "purok",
        },
        {
          name: "contactNo",
          label: "Contact No",
          align: "left",
          field: "contactNo",
        },
        { name: "actions", label: "Actions", align: "right" },
      ],
    };
  },
  methods: {
    ...mapActions({
      getItems: "consumers/getItem",
    }),
    async fetch() {
      const response = await this.getItems();
      this.consumer = response.result;
    },
    onViewItem(item) {
      this.$router.push({
        path: `/consumer/${item._id}/view`,
      });

    },
  },
  created() {
    this.fetch();
  },
};
</script>
