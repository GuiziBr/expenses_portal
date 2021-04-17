import styled from 'styled-components'

interface CardProps {
  total?: boolean;
}

export const Container = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 2.5rem 1rem;

`

export const CardContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
  margin-top: -9.5rem;
`

export const Card = styled.div`
  background: ${({ total }: CardProps): string => (total ? '#FF872C' : '#fff')};
  padding: 1.5rem 2rem;
  border-radius: .3rem;
  color: ${({ total }: CardProps): string => (total ? '#fff' : '#363F5F')};
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    p {
      font-size: 1rem;
    }
  }
  h1 {
    margin-top: 1rem;
    font-size: 2.25rem;
    font-weight: normal;
    line-height: 3.5rem;
  }
`

export const FormContainer = styled.div`
  display: flex;
  align-items: stretch;
  place-content: center;
  margin-top: 3rem;
  form {
    margin: 1rem 0;
    width: 35rem;
    text-align: center;
    font-size: 3rem;
    h1 {
      font-size: 3rem;
      margin-bottom: 2.5rem;
    }
    button {
      width: 35rem;
      font-size: 1.25rem;
    }
  }
`
