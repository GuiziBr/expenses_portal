import styled from 'styled-components'

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
  transition: filter 0.2s;
  &:hover {
    filter: brightness(0.7);
  }
`
