import styled, { css } from 'styled-components'

import Tooltip from '../Tooltip'

interface ContainerProps {
  isFocused: boolean
  isFilled: boolean
  isErrored: boolean
  isCurrency?: boolean
}

export const Container = styled.div<ContainerProps>`
  background: var(--container-background);
  border-radius: .5rem;
  border: 2px solid var(--container-background);
  padding: 1rem;
  width: 100%;
  display: flex;
  align-items: center;
  color: var(--iron-gray);

  ${(props) => props.isErrored && css`
    border-color: var(--red);
  `}

  ${(props) => props.isFocused && css`
    color: var(--light-orange);
    border-color: var(--light-orange);
  `}

  ${(props) => props.isFilled && css`
    color: var(--light-orange);
  `}

  & + div {
      margin-top: .5rem;
    }

  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: var(--input-text);
    &::placeholder {
      color: var(--iron-gray);
    }
  }
  svg {
      margin-right: 1rem;
    }
`
export const Error = styled(Tooltip)`
  height: 1.25rem;
  margin-left: 1rem;
  display: flex;
  svg {
      margin: 0;
    }
  span {
    background: var(--red);
    color: var(--white);
    &::before {
      border-color: var(--red) transparent;
    }
  }
`
