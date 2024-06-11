import { Auth } from 'aws-amplify'
import { ref, watch } from '@nuxtjs/composition-api'

export function useCheckUser (context) {
  const userName = ref('')
  const email = ref('')

  const checkUser = () => {
    Auth.currentAuthenticatedUser()
      .then((user) => {
        userName.value = `${user.attributes.given_name} ${user.attributes.family_name}`
        email.value = user.attributes.email
      })
      .catch((err) => {
        Auth.signOut({ global: true })
        userName.value = ''
        email.value = ''
        // eslint-disable-next-line no-console
        console.error(err)
      })
  }

  const useRouteWatcher = () => {
    watch(
      () => context.route,
      () => {
        checkUser()
      }
    )
  }

  return { userName, email, checkUser, useRouteWatcher }
}
