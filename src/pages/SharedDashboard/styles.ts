import styled from 'styled-components'

interface CardProps {
  total?: boolean;
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
      @media(max-width: 720px) {
        display: flex;
        width: 100vw;
      }
    }
    tr {
      @media(max-width: 720px) {
        display: flex;
        padding: .5rem 0 0 0;
        width: 100vw;
      }
    }
    th {
      width: 11rem;
      color: var(--light-gray);
      font-weight: normal;
      padding: 1.25rem 1.5rem;
      text-align: left;
      font-size: 1.25rem;
      line-height: 1.5rem;
      @media(max-width: 720px) {
        width: 33.3vw;
        font-size: 1rem;
        padding: 0 0 0 1.5rem;
      }
    }
    td {
      width: 11rem;
      padding: 1.25rem 1.5rem;
      border: 0;
      background: var(--white);
      font-size: 1rem;
      font-weight: normal;
      color: var(--light-gray);
      @media(max-width: 720px) {
        width: 33.3vw;
        padding: 1rem 1.5rem;
        text-align: left;
        display: flex;
        align-items: center;
      }
      &.description {
        color: var(--blue-wood);
      }
      &.income {
        color: var(--green);
        padding-left: 2.75rem;
        @media(max-width: 720px) {
          display: flex;
          align-items: center;
          padding-left: 1.5rem;
        }
      }
      &.outcome {
        color: var(--pink);
      }
    }
    td:first-child {
      border-radius: .3rem 0 0 .3rem;
    }
    td:last-child {
      border-radius: 0 .3rem .3rem 0;
    }
  }
`
