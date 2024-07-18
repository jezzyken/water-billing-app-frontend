<template>
  <q-page class="container">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ isEditMode ? 'Edit Customer' : 'Add Customer' }}</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="submitForm">
          <q-input v-model="customer.name" label="Name" required />
          <q-input v-model="customer.address" label="Address" required />
          <q-select
            v-model="customer.selectedPurok"
            :options="customer.purok"
            label="Purok"
            required
          />
          <q-input v-model="customer.contactNumber" label="Contact Number" type="tel" required />
          <q-btn
            type="submit"
            :label="isEditMode ? 'Update Customer' : 'Add Customer'"
            color="primary"
            class="submit-button"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      customer: {
        name: '',
        address: 'Sitio Basak Brgy. Malandag',
        purok: [
          'Purok 1',
          'Purok 2',
          'Purok 3',
          'Purok 4',
          'Purok 5',
          'Purok 6',
        ],
        selectedPurok: '',
        contactNumber: ''
      },
      isEditMode: false
    };
  },
  methods: {
    async fetchCustomer() {
      const customerId = this.$route.query.id;
      if (customerId) {
        try {
          const response = await axios.get(`/api/customers/${customerId}`);
          this.customer = { ...response.data, purok: this.customer.purok }; // Retain the default purok options
          this.isEditMode = true;
        } catch (error) {
          console.error('Error fetching customer:', error);
        }
      }
    },
    async submitForm() {
      try {
        if (this.isEditMode) {
          await axios.put(`/api/customers/${this.customer._id}`, this.customer);
        } else {
          await axios.post('/api/customers', this.customer);
        }
        this.$router.push({ name: 'customers' });
      } catch (error) {
        console.error('Error saving customer:', error);
      }
    }
  },
  mounted() {
    this.fetchCustomer();
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
.submit-button {
  margin-top: 20px;
  align-self: flex-start;
}
</style>
