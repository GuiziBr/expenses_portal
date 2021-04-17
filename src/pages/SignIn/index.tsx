import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef } from 'react'
import { FiLock, FiMail } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import logoImg from '../../assets/logo.svg'
import Button from '../../components/Button'
import Input from '../../components/Input'
import constants from '../../constants'
import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'
import getValidationErrors from '../../utils/getValidationErrors'
import { AnimationContainer, Background, Container, Content } from './styles'

interface SignInFormData {
  email: string
  password: string
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { signIn } = useAuth()
  const { addToast } = useToast()
  const history = useHistory()
  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({})
      const schema = Yup.object().shape({
        email: Yup.string().required(constants.schemaValidationError.email).email(constants.schemaValidationError.emailFormat),
        password: Yup.string().required(constants.schemaValidationError.password),
      })
      await schema.validate(data, { abortEarly: false })
      await signIn({ email: data.email, password: data.password })
      history.push('/sharedDashboard')
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)
        formRef.current?.setErrors(errors)
        return
      }
      addToast({
        type: 'error',
        title: constants.toastAuthError.title,
        description: constants.toastAuthError.description,
      })
    }
  }, [signIn, addToast, history])

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Expenses" width="231" height="134" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Expenses Portal</h1>
            <Input icon={FiMail} name="email" placeholder="E-mail" />
            <Input icon={FiLock} name="password" type="password" placeholder="Password" />
            <Button type="submit">Login</Button>
            <a href="/">Forgot password?</a>
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  )
}

export default SignIn
