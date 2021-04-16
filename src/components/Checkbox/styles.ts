import styled from 'styled-components'

export const Container = styled.div`
  background: var(--container-background);
  border-radius: .3rem;
  border: 2px solid var(--container-background);
  padding: 1rem;
  width: 100%;
  display: flex;
  color: var(--iron-gray);

  & + div {
      margin-top: .5rem;
  }
  label {
    font-size: 1rem;
    margin-right: 1rem;
  }
  input {
    margin-right: .5rem;
    transform: scale(1.1);
  }
  svg {
      margin-right: 1rem;
    }
`
