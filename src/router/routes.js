const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'consumers', name: 'consumers', component: () => import('pages/Accounts/Consumer') },
      { path: 'consumer/:action(add|edit)', name: 'Consumer Form', component: () => import('src/pages/Accounts/Consumer/ConsumerForm') },
      { path: 'consumer/:id/:action(add|edit|view)', name: 'Consumer Profile', component: () => import('src/pages/Accounts/Consumer/ConsumerProfile') },
      { path: 'membership', name: 'membership', component: () => import('pages/Accounts/Membership') },
      { path: 'collections', name: 'collections', component: () => import('pages/Collections') },
      { path: 'billings', name: 'billings', component: () => import('pages/Billings') },
      { path: 'billings/:id/:action(add|edit|view)', name: 'Billing Form', component: () => import('pages/Billings/BillingForm.vue') },
      { path: 'bills', name: 'bills', component: () => import('pages/Bill.vue') },
      { path: 'billing-rates', name: 'billing-rates', component: () => import('pages/BillingRate.vue') },
      { path: 'expenses', name: 'Expenses', component: () => import('pages/Expenses') },
      // reports
      { path: 'reports/collections', name: 'Collections Reports', component: () => import('pages/Reports/Collections') },
      { path: 'reports/consumers', name: 'Consumers Reports', component: () => import('pages/Reports/Consumers') },
      { path: 'reports/expenses', name: 'Expenses Reports', component: () => import('pages/Reports/Expenses') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
