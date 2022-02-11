import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import React, { useCallback, useRef } from 'react'
import { FiLock, FiMail } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import logoImg from '../../assets/logo.svg'
import Button from '../../components/Button'
import Input from '../../components/Input'
import errors from '../../constants/errors'
import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'
import { signInSchema } from '../../schemas'
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
      await signInSchema.validate(data, { abortEarly: false })
      await signIn({ email: data.email, password: data.password })
      history.push('/sharedDashboard')
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const error = getValidationErrors(err)
        formRef.current?.setErrors(error)
        return
      }
      addToast({
        type: 'error',
        title: errors.toastErrors.title.authentication,
        description: errors.toastErrors.description.login,
      })
    }
  }, [signIn, addToast, history])

  return (
    <Container className="container">
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
