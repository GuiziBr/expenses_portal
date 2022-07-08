import styled from 'styled-components'

interface CardProps {
  total?: boolean
}

export const Container = styled.div`
  width: 100%;
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
  grid-column: 2;
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
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  @media(max-width: 720px){
    margin-top: 2rem;
    flex-direction: column;
    align-items: center;
  }

  button:nth-child(1) {
    width: 9.5rem;
    margin: 0;
  }

  button {
    width: 5.5rem;
    height: 2.5rem;
    margin: 0 0 0 .3rem;
  }

  form {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    @media(max-width: 720px) {
      margin-top: 1rem;
    }

    div {
      height: 2.6rem;
      width: 15rem;
      margin-right: .3rem;
      border-color: var(--container-background);
    }
  }
`

export const TableContainer = styled.section`
  height: 26rem;
  margin-top: .6rem;
  @media(max-width: 720px){
    height: 45rem;
  }

  table {
    width: 100%;
    border-spacing: 0 .5rem;
    @media(max-width: 720px) {
      width: 100vw;
    }

    thead {

      tr {
        @media(max-width: 720px) {
          display: flex;
          padding: .5rem 0 0 0;
        }

        th {
          color: var(--light-gray);
          font-weight: normal;
          padding: 1rem .5rem;
          text-align: left;
          font-size: 1.25rem;
          line-height: 1.5rem;
          @media(max-width: 720px) {
            font-size: 1rem;
            padding: 0 0 0 .5rem;
          }
        }

        th:first-child {
          padding-left: 1rem;
        }

        th:nth-child(2) {
          @media(max-width: 720px) {
            width: 23%;
          }
        }

        th:nth-child(3) {
          @media(max-width: 720px) {
            width: 21%;
          }
        }

        th:last-child {
          padding-right: 1rem;
          @media(max-width: 720px) {
            width: 21%;
          }
        }
      }
    }

    tbody {
      width: 100%;

      tr {
        width: 100%;
        @media(max-width: 720px) {
          display: flex;
          padding: .5rem 0 0 0;
        }

        td {
          padding: 1.25rem .5rem;
          border: 0;
          background: var(--white);
          font-size: 1rem;
          font-weight: normal;
          text-align: left;
          color: var(--light-gray);
          @media(max-width: 720px) {
            text-align: left;
            display: flex;
            align-items: center;
            padding-right: 0;
          }

          &.description {
            color: var(--blue-wood);
          }

          &.income {
            color: var(--green);
          }
        }

        td:first-child {
          width: 17%;
          border-radius: .5rem 0 0 .5rem;
          padding-left: 1rem;
          @media(max-width: 720px) {
            width: 35%;
          }
        }

        td:nth-child(2) {
          width: 13%;
          @media(max-width: 720px) {
            width: 23%;
          }
        }

        td:nth-child(3) {
          width: 11%;
          @media(max-width: 720px) {
            width: 21%;
          }
        }

        td:nth-child(4) {
          width: 12%;
        }

        td:nth-child(5) {
          width: 11%;
        }

        td:nth-child(6) {
          width: 11%;
        }

        td:nth-child(7) {
          width: 12.5%;
        }

        td:last-child {
          width: 12.5%;
          border-radius: 0 .5rem .5rem 0;
          padding-right: 1rem;
          @media(max-width: 720px) {
            width: 21%;
          }
        }
      }


    }
  }
`
