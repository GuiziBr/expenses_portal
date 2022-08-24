import { useField } from '@unform/core'
import React, { SelectHTMLAttributes, useCallback, useEffect, useRef, useState } from 'react'
import { IconBaseProps } from 'react-icons'
import { FiAlertCircle } from 'react-icons/fi'
import { Container, Error } from './styles'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string
  icon: React.ComponentType<IconBaseProps>
  options: Option[]
  onChangeFunc?: (value: string, fieldName?: string) => void
  shouldDisable?: boolean
}

interface Option {
  id: string
  description?: string
  name?: string
}

const Select: React.FC<SelectProps> = ({ name, icon: Icon, options, placeholder, onChangeFunc, shouldDisable }) => {
  const selectRef = useRef<HTMLSelectElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)
  const { fieldName, error, registerField } = useField(name)

  const handleSelectFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const handleSelectBlur = useCallback(() => {
    setIsFocused(false)
    setIsFilled(!!selectRef.current?.value)
  }, [])

  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>, selectFieldName: string) => {
    if (onChangeFunc) onChangeFunc(e.currentTarget.value, selectFieldName)
  }

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
      <select
        onBlur={handleSelectBlur}
        onFocus={handleSelectFocus}
        ref={selectRef}
        defaultValue=""
        onChange={(e) => handleOnChange(e, fieldName)}
        disabled={shouldDisable}
      >
        <option value="">{placeholder}</option>
        {options.map((option: Option) => <option key={option.id} value={option.id}>{option.description || option.name}</option>)}
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
