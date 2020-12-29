import React from 'react'
import { FiAlertCircle, FiXCircle } from 'react-icons/fi'
import { Container, Toast } from './styles'

const ToastContainer: React.FC = () => (
  <Container>
    <Toast hasDescription>
      <FiAlertCircle size={20} />
      <div>Aconteceu um erro</div>
      <p>Não foi possível fazer login na aplicação</p>
      <button type="button">
        <FiXCircle size={18} />
      </button>
    </Toast>
    <Toast type="success" hasDescription={false}>
      <FiAlertCircle size={20} />
      <div>Aconteceu um erro</div>
      <button type="button">
        <FiXCircle size={18} />
      </button>
    </Toast>
    <Toast type="error" hasDescription={false}>
      <FiAlertCircle size={20} />
      <div>Aconteceu um erro</div>
      <p>Não foi possível fazer login na aplicação</p>
      <button type="button">
        <FiXCircle size={18} />
      </button>
    </Toast>
  </Container>

)

export default ToastContainer
