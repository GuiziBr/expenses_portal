import { useField } from '@unform/core'
import React, {
  SelectHTMLAttributes, useCallback, useEffect, useRef, useState,
} from 'react'
import { IconBaseProps } from 'react-icons'
import { FiAlertCircle } from 'react-icons/fi'

import { Container, Error } from './styles'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string
  icon: React.ComponentType<IconBaseProps>
  options: Option[]
}

interface Option {
  id: string
  description: string
}

const Select: React.FC<SelectProps> = ({
  name, icon: Icon, options, placeholder,
}) => {
  const selectRef = useRef<HTMLSelectElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const {
    fieldName, error, registerField,
  } = useField(name)

  const handleSelectFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleSelectBlur = useCallback(() => {
    setIsFocused(false)
    setIsFilled(!!selectRef.current?.value)
  }, [])

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      path: 'value',
    })
  }, [fieldName, registerField])

  return (
    <Container isErrored={!!error} isFocused={isFocused} isFilled={isFilled}>
      {Icon && <Icon size={20} />}
      <select onBlur={handleSelectBlur} onFocus={handleSelectFocus} ref={selectRef} defaultValue="">
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((option: Option) => <option key={option.id} value={option.id}>{option.description}</option>)}
      </select>
      {error && (
      <Error title={error}>
        <FiAlertCircle color="#c53030" size={20} />
      </Error>
      )}
    </Container>
  )
}
export default Select
