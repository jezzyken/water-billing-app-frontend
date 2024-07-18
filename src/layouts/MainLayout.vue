<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="toggleLeftDrawer"
          class="q-mr-sm"
        />
        <q-toolbar-title> Water Billing System </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <!-- <q-list>
        <q-item to="/" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/consumer" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Accounts</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/billings" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Billing</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/collections" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Collections</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/reports" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Reports</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/bills" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="receipt" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Bills</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/billing-rates" clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="attach_money" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Billing Rates</q-item-label>
          </q-item-section>
        </q-item>
      </q-list> -->

      <q-list bordered class="rounded-borders">
        <q-expansion-item
          expand-separator
          icon="people"
          label="Accounts"
          default-opened
        >
          <q-item to="/membership" clickable v-ripple>
            <q-item-section avatar> </q-item-section>
            <q-item-section>
              <q-item-label>Membership</q-item-label>
            </q-item-section>
          </q-item>

          <q-item to="/consumers" clickable v-ripple>
            <q-item-section avatar> </q-item-section>
            <q-item-section>
              <q-item-label>Consumers</q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item to="/billings" clickable v-ripple>
          <q-item-section avatar>  <q-icon name="payments" /> </q-item-section>
          <q-item-section>
            <q-item-label>Billings</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/collections" clickable v-ripple>
          <q-item-section avatar> <q-icon name="receipt_long" /></q-item-section>
          <q-item-section>
            <q-item-label>Collections</q-item-label>
          </q-item-section>
        </q-item>
        <q-item to="/reports" clickable v-ripple>
          <q-item-section avatar> <q-icon name="article" /></q-item-section>
          <q-item-section>
            <q-item-label>Reports</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      leftDrawerOpen: true,
    };
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
  },
};
</script>

<style scoped>
.q-toolbar-title {
  flex: 1 1 auto;
  text-align: left;
}
</style>
