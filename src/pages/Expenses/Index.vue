<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ $route.name }}</div>
      </q-card-section>
      <q-card-section>
        <q-table
          :data="expenses"
          :columns="columns"
          row-key="_id"
          :filter="filter"
        >

        <template v-slot:body="props">
          <q-tr :props="props" :class="props.rowIndex % 2 === 0 ? 'bg-green-1' : ''">
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
            <q-btn color="primary" label="add" @click="onShowDialog" />
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
                color="negative"
                icon="delete"
                dense
                size="10px"
                @click="onDeleteItem(props.row)"
              />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <expense-dialog v-model="showDialog" @getItems="fetch" />
  </q-page>
</template>

<script>
import axios from "axios";
import ExpenseDialog from "../../components/ExpenseDialog.vue";
import { mapActions } from "vuex";
import moment from "moment";

export default {
  components: {
    ExpenseDialog,
  },
  data() {
    return {
      columns: [
        {
          name: "date",
          required: true,
          label: "Date",
          align: "left",
          field: "date",
        },
        {
          name: "expenseType",
          required: true,
          label: "Type of Expense",
          align: "left",
          field: "expenseType",
        },
        {
          name: "amount",
          required: true,
          label: "Due Date",
          align: "left",
          field: "amount",
        },
        {
          name: "description",
          required: true,
          label: "Description",
          align: "left",
          field: "description",
        },
        { name: "actions", required: true, label: "Actions", align: "right" },
      ],
      showDialog: false,
      expenses: [],
      filter: "",
    };
  },

  created() {
    this.fetch();
  },

  methods: {
    ...mapActions({
      getItems: "expenses/getItem",
    }),

    async fetch() {
      const response = await this.getItems();
      this.expenses = response.result.map((item) => ({
        ...item,
        date: moment(item.date).format("YYYY-MM-DD"),
      }));
    },

    onViewItem(item) {
      console.log("update");
    },

    onDeleteItem(item) {
      console.log("delete");
    },

    onShowDialog() {
      this.showDialog = true;
    },
  },
};
</script>
