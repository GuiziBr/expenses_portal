import styled from 'styled-components'

interface CardProps {
  total?: boolean;
}

export const Container = styled.div`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 20px;
`

export const CardContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 32px;
  margin-top: -150px;
`

export const Card = styled.div`
  background: ${({ total }: CardProps): string => (total ? '#FF872C' : '#fff')};
  padding: 22px 32px;
  border-radius: 5px;
  color: ${({ total }: CardProps): string => (total ? '#fff' : '#363F5F')};

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    p {
      font-size: 18px;
    }
  }

  h1 {
    margin-top: 14px;
    font-size: 36px;
    font-weight: normal;
    line-height: 54px;
  }
`

export const FormContainer = styled.div`
  display: flex;
  align-items: stretch;
  place-content: center;
  margin-top: 50px;
  form {
    margin: 20px 0;
    width: 600px;
    text-align: center;
    font-size: 50px;

    h1 {
      font-size: 50px;
      margin-bottom: 40px;
    }
    button {
      width: 600px;
      font-size: 20px;
    }

  }
`
