import { useField } from '@unform/core'
import React, { InputHTMLAttributes, useEffect, useRef } from 'react'
import { IconBaseProps } from 'react-icons/lib'
import { Container } from './styles'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  icon?: React.ComponentType<IconBaseProps>
  options: {
    id: string
    value: string
    label: string
  }[],
  defaultOnChange?: (optionId: string) => void
}

const CheckboxInput: React.FC<CheckboxProps> = ({ name, options, icon: Icon, defaultOnChange, ...rest }) => {
  const inputRefs = useRef<HTMLInputElement[]>([])
  const { fieldName, registerField, defaultValue = [] } = useField(name)

  const changeCheckbox = (optionId: string) => {
    inputRefs.current.forEach((input) => {
      if (input.value !== optionId) input.disabled = !input.disabled
    })
  }

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRefs.current,
      getValue: (refs: HTMLInputElement[]) => refs.filter((ref) => ref.checked).map((ref) => ref.value),
      clearValue: (refs: HTMLInputElement[]) => {
        refs.forEach((ref) => {
          ref.checked = false
        })
      },
      setValue: (refs: HTMLInputElement[], values: string[]) => {
        refs.forEach((ref) => {
          if (values.includes(ref.id)) {
            ref.checked = true
          }
        })
      },
    })
  }, [defaultValue, fieldName, registerField])

  return (
    <Container>
      {Icon && <Icon size={20} />}
      {options.map((option, index) => (
        <label htmlFor={option.id} key={option.id}>
          <input
            defaultChecked={defaultValue.find((dv: string) => dv === option.id)}
            ref={(ref) => { inputRefs.current[index] = ref as HTMLInputElement }}
            value={option.value}
            type="checkbox"
            id={option.id}
            onChange={() => (defaultOnChange ? defaultOnChange(option.id) : changeCheckbox(option.id))}
            {...rest}
          />
          {option.label}
        </label>
      ))}
    </Container>
  )
}

export default CheckboxInput
