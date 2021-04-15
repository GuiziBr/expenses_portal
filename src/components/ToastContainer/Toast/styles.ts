import styled, { css } from 'styled-components'
import { animated } from 'react-spring'

interface ContainerProps {
  type?: 'success' | 'error' | 'info'
  hasDescription: boolean
}

const toastTypeVariations = {
  info: css`
    background: var(--very-light-blue);
    color: var(--blue-sky);
  `,
  success: css`
    background: var(--cleared-blue);
    color: var(--green-blue);
  `,
  error: css`
    background: var(--light-ping);
    color: var(--red);
  `,
}

export const Container = styled(animated.div)<ContainerProps>`
  width: 22.5rem;
  position: relative;
  padding: 1rem 2rem 1rem 1rem;
  border-radius: .5rem;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;

  & + div {
    margin-top: .5rem;
  }

  ${(props) => toastTypeVariations[props.type || 'info']}

  > svg {
    margin: .25rem .75rem 0 0;
  }
  div {
    flex: 1;
    p {
      margin-top: .25rem;
      font-size: 1rem;
      opacity: 0.8px;
      line-height: 1.25rem;
    }
  }
  button {
    position: absolute;
    right: 1rem;
    top: 1.25rem;
    opacity: 0.6;
    border: 0;
    background: transparent;
    color: inherit;
  }
  ${(props) => !props.hasDescription && css`
    align-items: center;
    svg {
      margin-top: 0;
    }
  `}
`
