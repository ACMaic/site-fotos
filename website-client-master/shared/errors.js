export const getMessageError = (err) => {
  const errorMesage = err.code === 'UserNotFoundException' || err.code === 'InvalidParameterException'
    ? 'Código não enviado'
    : err.code === 'LimitExceededException'
      ? 'Número de tentativas excedidas. Por favor, tente mais tarde.'
      : err.code === 'CodeMismatchException'
        ? 'Atualização de senha não realizada.'
        : err.mesage

  const errorChangePassword = err.code === 'NotAuthorizedException'
    ? 'Senha atual digitada está incorreta'
    : err.code === 'LimitExceededException'
      ? 'Número de tentativas excedidas. Por favor, tente mais tarde.'
      : 'Não foi possível alterar a senha'

  const errorRuleMesage = err.code === 'UserNotFoundException'
    ? 'E-mail não encontrado em nossa plataforma'
    : err.code === 'CodeMismatchException'
      ? 'Código de verificação inválido.'
      : ''

  const socialMediaError = err.code === 'InvalidParameterException'
    ? 'Você está tentando recuperar a senha de um usuário que foi criado através de login social (Google). Neste caso, a recuperação de senha deve ser realizada diretamente em uma dessas plataformas.'
    : ''

  return { errorMesage, errorRuleMesage, socialMediaError, errorChangePassword }
}
