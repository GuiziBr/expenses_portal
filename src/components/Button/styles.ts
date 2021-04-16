import styled from 'styled-components'
import { shade } from 'polished'

export const Container = styled.button`
  background: var(--light-orange);
  height: 3.5rem;
  border-radius: .3rem;
  border: 0;
  padding: 0 1rem;
  color: var(--background);
  width: 100%;
  font-weight: 500;
  margin-top: 1rem;
  transition: background-color 0.2s;
  &:hover {
    background: ${shade(0.2, '#ff9000')}
  }
`
