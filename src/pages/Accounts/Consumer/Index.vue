<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">Consumers</div>
      </q-card-section>
      <q-card-section>
        <q-table
          :data="consumer"
          :columns="columns"
          row-key="name"
          :filter="filter"
          :rows-per-page-options="[15, 20, 25, 50, 0 ]"
        >
          <template v-slot:body="props">
            <q-tr
              :props="props"
              :class="props.rowIndex % 2 === 0 ? 'bg-green-1' : ''"
            >
              <q-td>
                <q-btn
                  color="primary"
                  @click="onSelectItem(props.row)"
                  size="9px"
                  label="select"
                />
              </q-td>
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
              </q-td>
              <q-td auto-width>
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
            </q-tr>
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
            <q-btn color="primary" label="Add" @click="onShowDialog" />
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
              <q-btn
                color="secondary"
                @click="onSelectItem(props.row)"
                icon="check"
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
    <consumer-dialog ref="consumer" v-model="showDialog" @getItems="fetch" :consumerData="item" :update="update"/>
  </q-page>
</template>

<script>
import axios from "axios";
import { mapActions } from "vuex";

// Components
import ConsumerDialog from "../../../components/ConsumerDialog.vue";

export default {
  components: {
    ConsumerDialog,
  },
  data() {
    return {
      consumer: [],
      columns: [
        {
          name: "",
          label: "Select",
          align: "left",
          field: "select",
          required: true,
          style: "width: 50px",
        },
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
        { name: "", label: "Actions", align: "right" },
      ],
      filter: "",
      showDialog: false,
      item: {},
      update: false
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
      this.item = item
      this.showDialog = true;
      this.update = true
    },
    onSelectItem(item) {
      this.$router.push({
        path: `/consumer/${item._id}/view`,
      });
    },
    onShowDialog() {
      this.update = false
      this.showDialog = true;
    },
  },
  created() {
    this.fetch();
  },
};
</script>
