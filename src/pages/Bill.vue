<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">Bills</div>
      </q-card-section>
      <q-card-section>
        <q-btn color="primary" @click="addBill">Add Bill</q-btn>
      </q-card-section>
      <q-card-section>
        <q-table :rows="bills" :columns="columns" row-key="id">
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat icon="edit" @click="editBill(props.row)"></q-btn>
              <q-btn flat icon="delete" @click="deleteBill(props.row)"></q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      bills: [],
      columns: [
        { name: 'billingDate', required: true, label: 'Billing Date', align: 'left', field: row => row.billingDate },
        { name: 'dueDate', required: true, label: 'Due Date', align: 'left', field: row => row.dueDate },
        { name: 'presentRead', required: true, label: 'Present Read', align: 'left', field: row => row.presentRead },
        { name: 'cubicConsumption', required: true, label: 'Cubic Consumption', align: 'left', field: row => row.cubicConsumption },
        { name: 'presentBill', required: true, label: 'Present Bill', align: 'left', field: row => row.presentBill },
        { name: 'status', required: true, label: 'Status', align: 'left', field: row => row.status },
        { name: 'actions', required: true, label: 'Actions', align: 'right' }
      ]
    };
  },
  methods: {
    async fetchBills() {
      const response = await axios.get('/api/bills');
      this.bills = response.data;
    },
    addBill() {
      // Logic to add a bill
    },
    editBill(bill) {
      // Logic to edit a bill
    },
    deleteBill(bill) {
      // Logic to delete a bill
    }
  },
  mounted() {
    this.fetchBills();
  }
}
</script>
