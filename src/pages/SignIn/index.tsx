import React, { useCallback, useRef } from 'react'
import { FiMail, FiLock } from 'react-icons/fi'
import { FormHandles } from '@unform/core'
import { Form } from '@unform/web'
import * as Yup from 'yup'
import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'
import getValidationErrors from '../../utils/getValidationErrors'

import logoImg from '../../assets/logo.svg'

import Input from '../../components/Input'
import Button from '../../components/Button'

import {
  Container, Content, Background, AnimationContainer,
} from './styles'

interface SignInFormData {
  email: string
  password: string
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null)
  const { signIn } = useAuth()
  const { addToast } = useToast()
  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current?.setErrors({})
      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail is required').email('Invalid e-mail format'),
        password: Yup.string().required('Password is required'),
      })
      await schema.validate(data, { abortEarly: false })
      await signIn({ email: data.email, password: data.password })
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err)
        formRef.current?.setErrors(errors)
        return
      }
      addToast({
        type: 'error',
        title: 'Authentication error',
        description: 'Error on login',
      })
    }
  }, [signIn, addToast])

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
