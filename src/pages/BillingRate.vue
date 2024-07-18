<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">Billing Rates</div>
      </q-card-section>
      <q-card-section>
        <q-btn color="primary" @click="editBillingRates">Edit Billing Rates</q-btn>
      </q-card-section>
      <q-card-section>
        <q-table :rows="[billingRates]" :columns="columns" row-key="id">
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
      billingRates: {},
      columns: [
        { name: 'ratePerCubicMeter', required: true, label: 'Rate Per Cubic Meter', align: 'left', field: row => row.ratePerCubicMeter },
        { name: 'minimumCharge', required: true, label: 'Minimum Charge', align: 'left', field: row => row.minimumCharge },
        { name: 'minimumCubicMeters', required: true, label: 'Minimum Cubic Meters', align: 'left', field: row => row.minimumCubicMeters },
        { name: 'reconnectionFee', required: true, label: 'Reconnection Fee', align: 'left', field: row => row.reconnectionFee },
        { name: 'membershipFee', required: true, label: 'Membership Fee', align: 'left', field: row => row.membershipFee },
        { name: 'disconnectionPeriodMonths', required: true, label: 'Disconnection Period (Months)', align: 'left', field: row => row.disconnectionPeriodMonths },
        { name: 'dueDateOffsetDays', required: true, label: 'Due Date Offset (Days)', align: 'left', field: row => row.dueDateOffsetDays }
      ]
    };
  },
  methods: {
    async fetchBillingRates() {
      const response = await axios.get('/api/billing-rates');
      this.billingRates = response.data[0]; // Assuming there's only one set of rates
    },
    editBillingRates() {
      // Logic to edit billing rates
    }
  },
  mounted() {
    this.fetchBillingRates();
  }
}
</script>
