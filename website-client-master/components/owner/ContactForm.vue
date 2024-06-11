<template>
  <div id="faleconosco" class="contact-wrapper mt-14 scroll-margin-owners">
    <v-container fluid :style="$vuetify.breakpoint.lgAndUp ? 'padding-left: 6%' : ''">
      <title-component
        :ltr="true"
        title-normal="Entre em contato e dê adeus à burocracia"
        subtitle="Cuidamos de tudo para que você foque no que realmente importa"
      />
      <v-form
        ref="form"
        v-model="valid"
        class="pa-2"
        @submit.prevent="($event) => $event.preventDefault()"
      >
        <p class="text-medium-xxs">
          Sobre você
        </p>
        <v-row no-gutters>
          <v-col cols="12" md="4" class="pt-4 pr-md-4">
            <v-list-item-content>Nome completo*</v-list-item-content>
            <v-text-field
              v-model="investor"
              dense
              outlined
              class="radius-login-360"
              :rules="nameRules"
              placeholder="Nome completo"
              required
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="4" class="pt-4 pl-md-4">
            <v-list-item-content>E-mail*</v-list-item-content>
            <v-text-field
              v-model="email"
              dense
              outlined
              class="radius-login-360"
              :rules="ownerEmailRules"
              placeholder="E-mail"
              required
              height="45px"
              hide-details="auto"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="4" class="pt-4 pr-md-4">
            <v-list-item-content>Telefone*</v-list-item-content>
            <v-text-field
              v-model="phone"
              v-mask="['(##) #####-####', '(##) ####-####']"
              dense
              outlined
              class="radius-login-360"
              :rules="ownerPhoneRules"
              placeholder="Telefone"
              required
              height="45px"
              hide-details="auto"
            />
          </v-col>
        </v-row>

        <p class="text-medium-xxs mt-8">
          Sobre seu apartamento
        </p>

        <v-row no-gutters>
          <v-col cols="12" md="8" class="pt-4">
            <v-list-item-content>Onde fica seu empreendimento?*</v-list-item-content>
            <v-select
              v-model="business"
              placeholder="Selecione o empreendimento"
              :items="addresses"
              dense
              outlined
              class="radius-login-360"
              :rules="requiredRules"
              required
              height="45px"
              hide-details="auto"
              item-value="id"
            >
              <template #selection="{ item }">
                {{ getFullAddress(item) }}
              </template>
              <template #item="{ item }">
                <span :class="$vuetify.breakpoint.lgAndUp ? 'text-regular-rating' : ''">{{ item.name }} <span v-if="item.address" class="primaryOwner--text">{{ ` - ${item.address}` }}</span></span>
              </template>
            </v-select>
          </v-col>
        </v-row>

        <v-row v-if="checkBuilding()" no-gutters>
          <v-col cols="12" md="4" class="pt-4 pr-md-4">
            <div class="d-flex" style="width: 220px;">
              <v-list-item-content>Nome do empreendimento*</v-list-item-content>
              <v-tooltip top nudge-left max-width="250" open-on-click>
                <template #activator="{ on, attrs }">
                  <v-icon
                    size="13"
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                    fas fa-info-circle
                  </v-icon>
                </template>
                <span class="tooltip">Digite o nome do prédio ou condomínio</span>
              </v-tooltip>
            </div>
            <v-text-field
              v-model="businessName"
              dense
              outlined
              class="radius-login-360"
              :rules="requiredNotWhiteSpaceRules"
              placeholder="Nome do empreendimento"
              required
              height="45px"
              hide-details="auto"
            />
          </v-col>
          <v-col cols="12" md="4" class="pt-4 pl-md-4">
            <v-list-item-content>Endereço*</v-list-item-content>
            <v-text-field
              v-model="address"
              dense
              outlined
              class="radius-login-360"
              :rules="requiredNotWhiteSpaceRules"
              placeholder="Endereço"
              required
              height="45px"
              hide-details="auto"
            />
          </v-col>
        </v-row>
        <v-row v-if="address || business" no-gutters>
          <v-col cols="12" md="8" class="pt-4">
            <v-list-item-content>Unidade(s)*</v-list-item-content>
            <v-text-field
              v-model="unit"
              dense
              outlined
              class="radius-login-360"
              :rules="requiredNotWhiteSpaceRules"
              placeholder="Unidade(s)"
              required
              height="45px"
              hide-details="auto"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="4" class="pt-4 pr-4">
            <v-list-item-content>Tipo de apartamento*</v-list-item-content>
            <v-radio-group v-model="apartType" :rules="requiredRules" required>
              <v-radio label="Studio" value="Studio" />
              <v-radio label="1 dormitório" value="1 dormitório" />
              <v-radio label="2 dormitórios" value="2 dormitório" />
              <v-radio label="Mais de 2 dormitórios" value="Mais de 2 dormitórios" />
            </v-radio-group>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="8" class="pt-4">
            <v-list-item-content>Observações</v-list-item-content>
            <v-text-field
              v-model="observation"
              dense
              outlined
              class="radius-login-360"
              placeholder="Observações"
              height="45px"
              hide-details="auto"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" md="3" class="mt-8">
            <v-btn
              :class="{ primary: valid, background: !valid, disabled: !valid }"
              depressed
              width="100%"
              height="50px"
              class="radius-login-360 text-unset text-bold-xs secondary"
              type="submit"
              :loading="isLoading"
              label="Enviar"
              :disabled="!valid"
              @click="sendContact"
            >
              Enviar
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
    <img
      class="contact-img"
      width="430"
      height="440"
      src="https://assets.360suites.com.br/website/proprietarios-ilustração-predios.webp"
      alt="Apartamentos"
    >
    <contact-form-dialog ref="contactFormDialog" />
  </div>
</template>

<script>
import { openApi as api360 } from '@/api'
import { ownerEmailRules, nameRules, ownerPhoneRules, requiredRules, requiredNotWhiteSpaceRules } from '@/rules'
import TitleComponent from '@/components/shared/Title.vue'
import ContactFormDialog from '@/components/owner/ContactFormDialog.vue'

export default {
  name: 'ContactFormComponent',
  components: {
    TitleComponent,
    ContactFormDialog
  },
  layout: 'owners',
  data () {
    return {
      valid: false,
      showPassword: false,
      investor: '',
      email: '',
      phone: '',
      business: '',
      businessName: '',
      address: '',
      unit: '',
      apartType: '',
      size: '',
      observation: '',
      nameRules,
      ownerEmailRules,
      ownerPhoneRules,
      requiredRules,
      requiredNotWhiteSpaceRules,
      isLoading: false,
      addresses: []
    }
  },
  beforeMount () {
    this.getAdresses()
  },
  methods: {
    getAdresses () {
      this.isLoading = true
      api360
        .get('/property-api/website')
        .then(({ data }) => {
          this.addresses = [...data, { id: 9999, name: 'Outro empreendimento', address: '' }]
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    sendContact () {
      this.isLoading = true
      const [businessData] = this.addresses.filter(bs => bs.id === this.business)
      const isOther = this.business === 9999
      const payload = {
        investor: this.investor,
        email: this.email,
        phone: this.phone,
        isOther,
        ...isOther
          ? {
              business: this.businessName,
              address: this.address
            }
          : {
              propId: businessData.id
            },
        unit: this.unit,
        apartType: this.apartType,
        size: this.size,
        observation: this.observation
      }
      api360.post('/pipefy-api/create-card', payload)
        .then(() => {
          // eslint-disable-next-line vue/no-mutating-props
          this.$refs.contactFormDialog.openFormDialog()
        }).catch((error) => {
          // eslint-disable-next-line no-console
          console.error(error)
        }).finally(() => {
          this.isLoading = false
        })
    },
    getFullAddress (item) {
      return item.address && this.$vuetify.breakpoint.lgAndUp ? `${item.name} - ${item.address}` : item.name
    },
    checkBuilding () {
      return this.business === 9999
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/mixins.scss';

.contact-wrapper {
  position: relative;
  z-index: 1;
}
.contact-img {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  z-index: -1;
  max-width: 100%;
  max-height: 100%;
  @include phone-only() {
    display: none;
  }
}
</style>
