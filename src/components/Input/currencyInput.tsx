import React, {
  useEffect, useRef, useState, useCallback, InputHTMLAttributes,
} from 'react'
import { useField } from '@unform/core'
import NumberFormat from 'react-number-format'
import { IconBaseProps } from 'react-icons'
import { FiAlertCircle } from 'react-icons/fi'
import { Container, Error } from './styles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  icon?: React.ComponentType<IconBaseProps>
  placeholder?: string
}

const Input: React.FC<InputProps> = ({ name, icon: Icon, placeholder }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const { fieldName, error, registerField } = useField(name)

  const handleInputFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleInputBlur = useCallback(() => {
    setIsFocused(false)
    setIsFilled(!!inputRef.current?.value)
  }, [])

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    })
  }, [fieldName, registerField])

  return (
    <Container isErrored={!!error} isFocused={isFocused} isFilled={isFilled}>
      {Icon && <Icon size={20} />}
      <NumberFormat
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        getInputRef={inputRef}
        separator=","
        prefix="R$ "
        decimalSeparator=","
        placeholder={placeholder}
        thousandSeparator="."
        decimalScale={2}
      />
      {error && (
        <Error title={error}>
          <FiAlertCircle color="#c53030" size={20} />
        </Error>
      )}
    </Container>
  )
}

export default Input
