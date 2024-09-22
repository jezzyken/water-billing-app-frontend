<template>
  <q-page>
    <q-card>
      <q-card-section>
        <div class="text-h6">Billings</div>
      </q-card-section>
      <!-- <q-card-section>
        <q-btn color="primary" @click="addBill">Add Bill</q-btn>
      </q-card-section> -->
      <q-card-section>
        <q-table
          :data="consumers"
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
                  @click="onViewItem(props.row)"
                  size="9px"
                  label="select"
                />
              </q-td>

              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.value }}
              </q-td>
              <q-td auto-width>
                <q-btn
                  color="green"
                  icon="print"
                  dense
                  size="10px"
                  padding="xs"
                  class="q-mr-xs"
                  @click="onPrintItem(props.row)"
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
          </template>
        </q-table>

        <div v-html="compiledTemplate"></div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions } from "vuex";
import Handlebars from "handlebars";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      consumers: [],
      columns: [
        {
          name: "",
          label: "Select",
          align: "left",
          field: "select",
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
      compiledTemplate: "",
      statement: "",
    };
  },
  methods: {
    ...mapActions({
      getItem: "consumers/getItem",
      getConsumerItemsById: "billings/getConsumerItemsById",
      getTemplates: "billings/getTemplates",
    }),

    async fetch() {
      const response = await this.getItem();
      this.consumers = response.result;
    },

    onViewItem(item) {
      this.$router.push({
        path: `/billings/${item._id}/view`,
      });
    },

    async onPrintItem(item) {
      const response = await this.getConsumerItemsById(item._id);

      if (response.result.length === 0) {
        Swal.fire({
          title: 'No Results',
          text: 'No billing records found to print.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }

      this.statement = this.generateBillingStatement(response.result);

      const templateData = {
        name: `${item.lastName}, ${item.firstName}`.toUpperCase(),
        billingDate: moment(response.result[0].billingDate).format(
          "YYYY-MM-DD"
        ),
        dueDate: moment(response.result[0].dueDate).format("YYYY-MM-DD"),
        ...this.statement,
        previousDate: moment(this.statement.previousDate).format("YYYY-MM-DD"),
        presentDate: moment(this.statement.presentDate).format("YYYY-MM-DD"),
      };

      try {
        const templateResponse = await this.getTemplates()
        const template = Handlebars.compile(templateResponse.data);
        const compiledHtml = template(templateData);

        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "none";
        iframe.srcdoc = compiledHtml;

        document.body.appendChild(iframe);

        iframe.contentWindow.focus();
        iframe.contentWindow.print();

        iframe.onload = () => {
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        };
      } catch (error) {
        console.error("Error fetching HTML template:", error);
      }
    },

    generateBillingStatement(records) {
      records.sort((a, b) => new Date(b.billingDate) - new Date(a.billingDate));

      const recentRecord = records[0];

      let totalBill = 0;
      let previousBalance = 0;
      let hasUnpaidRecords = false;

      records.forEach((record) => {
        if (record.status === "Unpaid") {
          hasUnpaidRecords = true;
          totalBill += record.presentBill;

          if (record._id.toString() !== recentRecord._id.toString()) {
            previousBalance += record.presentBill;
            console.log(previousBalance);
          }
        }
      });

      const presentBill = hasUnpaidRecords ? recentRecord.presentBill : 0;

      const billingStatement = {
        previousDate: recentRecord.previousDate,
        previousRead: recentRecord.previousRead,
        presentDate: recentRecord.presentDate,
        presentRead: recentRecord.presentRead,
        consumption: recentRecord.consumption,
        readType: recentRecord.readType,
        meterDescription: recentRecord.meterDescription,
        presentBill: presentBill,
        totalBill: totalBill,
        previousBalance: previousBalance,
      };

      return billingStatement;
    },
  },
  created() {
    this.fetch();
  },
};
</script>
