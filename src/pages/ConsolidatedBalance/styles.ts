import styled from 'styled-components'

interface CardProps {
  total?: boolean
}

export const Container = styled.div`
  width: 100vw;
  max-width: 1120px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
  @media(max-width: 720px) {
    padding: 2.5rem 0
  }
`

export const CardContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
  margin-top: -9.5rem;
  @media(max-width: 720px) {
    display: inherit;
  }
`

export const Card = styled.div`
  background: ${({ total }: CardProps): string => (total ? '#FF872C' : '#fff')};
  padding: 1.5rem 2rem;
  border-radius: .3rem;
  color: ${({ total }: CardProps): string => (total ? '#fff' : '#363F5F')};
  @media(max-width: 720px) {
    display: flex;
    flex-direction: column;
  }
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
    @media(max-width: 720px) {
     align-self: center;
    }
  }
`

export const FormContainer = styled.section`
  margin-top: 3rem;
  display: flex;
  justify-content: flex-end;
  @media(max-width: 720px){
    margin-top: 2rem;
    flex-direction: column;
    align-items: center;
  }

  form {
    display: flex;
    align-items: center;
    @media(max-width: 720px) {
      width: 100vw;
    }

    div {
      height: 2.6rem;
    }

    button {
      margin: 0 0 0 0.3rem;
      height: 2.5rem;
      @media(max-width: 720px) {
        width: 12rem;
      }
    }
  }
`
export const TableContainer = styled.section`
  margin-top: 0.6rem;
  display: flex;
  justify-content: center;
`

export const Table = styled.div`
  table {
    border-spacing: 1rem .5rem;
    color: var(--light-gray);
    border-collapse: separate;
    border-spacing: .1rem .3rem;
    border-width: 10rem;
    thead {
      tr {
        th {
          font-weight: normal;
          padding: 1rem .5rem .5rem .5rem;
          text-align: center;
          line-height: 1.5rem;
          width: 100vw;
          font-size: 1.25rem;
        }
      }
    }

    tbody {
      tr {
        td {
          padding: 1rem .5rem;
          background: var(--white);
          font-weight: normal;
          text-align: left;
          color: var(--light-gray);
          text-align: center;
        }

        .bank-name {
          border-radius: .5rem 0 0 .5rem;
          width: 50%;
        }
        .bank-total {
          border-radius: 0 .5rem .5rem 0;
          width: 50%;
        }
      }

      tr:first-child{
        td {
          text-align: center;
        }
      }

      tr:last-child {
        border-spacing: 0;
      }

      .payment-type {
        color: var(--blue-wood);
        border-radius: .5rem .5rem .5rem .5rem;
      }

      .requester {
        color: var(--green);
        background: var(--cleared-blue);
        border-radius: .5rem .5rem .5rem .5rem;
      }

      .partner {
        color: var(--red);
        background: var(--cleared-blue);
        border-radius: .5rem .5rem .5rem .5rem;
      }
    }
  }

  .table-partner {
    margin-left: .5rem;
  }


`
