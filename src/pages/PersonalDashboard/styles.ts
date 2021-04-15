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
  grid-gap: 2rem;
  margin-top: -9.5rem;
`

export const Card = styled.div`
  grid-column: 2;
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

export const FormContainer = styled.section`
  margin-top: 3rem;
  width: 100%;
  height: 100%;
  form {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    div {
      height: 2.5rem;
      width: 15rem;
      margin-right: .3rem;
      border-color: var(--container-background);
    }
    button {
      width: 5.5rem;
      height: 2.5rem;
      margin: 0 .3rem;
    }
  }
`

export const TableContainer = styled.section`
  margin-top: .6rem;
  table {
    width: 100%;
    border-spacing: 0 .5rem;
    th {
      color: var(--light-gray);
      font-weight: normal;
      padding: 1.25rem 2rem;
      text-align: left;
      font-size: 1.25rem;
      line-height: 1.5rem;
    }

    td {
      padding: 1.25rem 2rem;
      border: 0;
      background: var(--white);
      font-size: 1rem;
      font-weight: normal;
      color: var(--light-gray);

      &.description {
        color: var(--blue-wood);
      }

      &.income {
        color: var(--green);
        padding-left: 2.75rem;
      }
    }

    td:first-child {
      border-radius: .5rem 0 0 .5rem;
    }

    td:last-child {
      border-radius: 0 .5rem .5rem 0;
    }
  }
`