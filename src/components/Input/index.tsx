import React, {
  InputHTMLAttributes, useEffect, useRef, useState, useCallback,
} from 'react'
import { IconBaseProps } from 'react-icons'
import { FiAlertCircle } from 'react-icons/fi'
import { useField } from '@unform/core'
import { Container, Error } from './styles'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string,
  isCurrency?: boolean
  icon?: React.ComponentType<IconBaseProps>
  options?: boolean
}

const Input: React.FC<InputProps> = ({
  name, icon: Icon, isCurrency, ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const {
    fieldName, defaultValue, error, registerField,
  } = useField(name)

  const handleInputFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleInputBlur = useCallback(() => {
    setIsFocused(false)
    setIsFilled(!!inputRef.current?.value)
  }, [])

  const formatCurrency = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    let { value } = e.currentTarget
    value = value.replace(/\D/g, '')
    value = value.replace(/(\d)(\d{2})$/, '$1,$2')
    value = value.replace(/(?=(\d{3})+(\D))\B/g, '.')
    e.currentTarget.value = value
    return e
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
      {Icon && <Icon size={20} /> }
      <input
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        onKeyUp={(e) => (isCurrency ? formatCurrency(e) : false)}
        {...rest}
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
