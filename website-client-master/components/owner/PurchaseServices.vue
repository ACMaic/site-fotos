<template>
  <v-container id="purchase" fluid :style="$vuetify.breakpoint.lgAndUp ? 'padding-left: 6%' : ''" class="mt-12 scroll-margin-owners">
    <title-component :ltr="true" title-normal="Quero fechar, e agora?" subtitle="Confira o passo a passo para começar a rentabilizar o seu imóvel" />
    <v-row class="border py-2 px-8 pt-15" :class="$vuetify.breakpoint.smAndDown ? 'px-6 flex-nowrap overflow-auto pt-16' : 'mr-0'" :style="$vuetify.breakpoint.smAndDown ? 'margin-top: 80px; background: linear-gradient(0deg, #E1E1E1 80%, transparent 20%);' : 'margin-top: 70px;'">
      <v-col cols="12" md="3">
        <img src="https://assets.360suites.com.br/website/proprietarios-analise.webp" class="img-invest">
        <h2 class="text-regular-xs ">
          Análise
        </h2>
        <v-sheet
          class="mx-auto my-1 ml-0 d-sm-flex rounded-pill"
          height="8"
          width="69"
          color="secondary"
        />
        <p class="text-left pt-4 text-services">
          <a href="#faleconosco" class="primary--text pointer">Clique aqui</a> para enviar o formulário com as informações do seu apartamento!<br><br>

          Entraremos em contato para apresentar nosso modelo  de negócio e esclarecer dúvidas.
        </p>
      </v-col>
      <v-col cols="12" md="3">
        <img src="https://assets.360suites.com.br/website/proprietarios-contrato.webp" class="img-invest">
        <h2 class="text-regular-xs ">
          Contrato
        </h2>
        <v-sheet
          class="mx-auto my-1 ml-0 d-sm-flex rounded-pill"
          height="8"
          width="69"
          color="secondary"
        />
        <p class="text-left pt-4 text-services">
          Oferecemos o melhor modelo de negócio segmentado para cada perfil de investidor.<br><br>

          Trabalhos com contratos de repasse que podem fomentar a sua rentabilidade até 37% acima dos valores de aluguel tradicionais.
        </p>
      </v-col>
      <v-col cols="12" md="3">
        <img src="https://assets.360suites.com.br/website/decoracao-proprietarios.webp" class="img-invest">
        <h2 class="text-regular-xs ">
          Decoração
        </h2>
        <v-sheet
          class="mx-auto my-1 ml-0 d-sm-flex rounded-pill"
          height="8"
          width="69"
          color="secondary"
        />
        <p class="text-left pt-4 text-services">
          Selecione as melhores opções de decoração e mobília para deixar o seu apartamento de acordo com nosso padrão de qualidade.
        </p>
      </v-col>
      <v-col cols="12" md="3">
        <img src="https://assets.360suites.com.br/website/proprietarios-assinatura.webp" class="img-invest">
        <h2 class="text-regular-xs ">
          Assinatura
        </h2>
        <v-sheet
          class="mx-auto my-1 ml-0 d-sm-flex rounded-pill"
          height="8"
          width="69"
          color="secondary"
        />
        <p class="text-left pt-4 text-services">
          Assine o nosso contrato digital, faça o seu imóvel render acima da média e se junte a centenas de investidores da 360 Suítes!
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TitleComponent from '@/components/shared/Title.vue'

export default {
  name: 'PurchaseService',
  components: {
    TitleComponent
  }
}

</script>

<style lang="scss" scoped>
@import '~/assets/mixins.scss';

  .img-invest{
    width: 284px;
    height: 150px;
    border-radius: 20px;
    margin-top: -150px;
    padding: 5px;
    max-width: 100%;
  }

  .border{
    background: #E1E1E1;
    border-radius: 10px;
    left: calc(50% - 1280px/2);
    top: 56px;
    margin-bottom: 50px;

    @include phone-only() {
    padding-top: 130px !important;
    }

    @media (min-width: 600px) and (max-width: 959px) {
    padding-left: 210px !important;
    padding-top: 118px !important;

   }

  }

</style>
