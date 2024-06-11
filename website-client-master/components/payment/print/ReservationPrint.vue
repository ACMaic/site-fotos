<template>
  <div>
    <div v-if="printDialog" class="blur" />
    <v-dialog v-model="printDialog" max-width="595" hide-overlay persistent style="z-index: 200">
      <v-card>
        <v-row no-gutters class="justify-end pt-6 pa-4">
          <v-btn
            color="secondary"
            depressed
            text
            class="black--text"
            type="submit"
            @click="$refs.html2Pdf.generatePdf()"
          >
            <v-icon>fa-sharp fa-solid fa-print</v-icon>
          </v-btn>
          <v-btn
            color="secondary"
            depressed
            text
            class="black--text"
            type="submit"
            @click="closePrintDialog"
          >
            <v-icon color="primary">
              fa-regular fa-xmark
            </v-icon>
          </v-btn>
        </v-row>
        <vue-html2pdf
          ref="html2Pdf"
          :show-layout="true"
          :float-layout="false"
          :enable-download="false"
          :preview-modal="true"
          :paginate-elements-by-height="1400"
          filename="recibo-reserva"
          :pdf-quality="2"
          :manual-pagination="false"
          pdf-format="a4"
          pdf-orientation="portrait"
          pdf-content-width="600px"
          :html-to-pdf-options="htmlOptions"
        >
          <section slot="pdf-content">
            <print-content />
          </section>
        </vue-html2pdf>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import PrintContent from '@/components/payment/print/PrintContent.vue'
export default {
  name: 'ReservationPrintDialog',
  components: { PrintContent },
  data () {
    return {
      printDialog: false,
      room: JSON.parse(localStorage.getItem('room')) || {},
      htmlOptions: {
        html2canvas: {
          scale: 2,
          useCORS: true
        }
      }
    }
  },
  methods: {
    openPrintDialog () {
      this.printDialog = true
    },
    closePrintDialog () {
      this.printDialog = false
    }
  }
}
</script>
<style lang="scss" scoped>
.modal-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
