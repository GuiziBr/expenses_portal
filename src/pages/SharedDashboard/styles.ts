import styled, { css } from 'styled-components'

interface CardProps {
  total?: boolean;
}

interface PaginationItemProps {
  isSelected?: boolean
  isDisabled?: boolean
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

export const FormContainer = styled.section`
  margin-top: 3rem;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
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
    div {
      height: 2.55rem;
      width: 15rem;
      margin-right: .3rem;
      border-color: var(--container-background);
    }
  }
`

export const TableContainer = styled.section`
  height: 26rem;
  margin-top: .6rem;
  table {
    width: 100%;
    border-spacing: 0 .5rem;
    th {
      width: 11rem;
      color: var(--light-gray);
      font-weight: normal;
      padding: 1.25rem 2rem;
      text-align: left;
      font-size: 1.25rem;
      line-height: 1.5rem;
    }
    td {
      width: 11rem;
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
export const Pagination = styled.div`
  margin-top: 1rem;
  display: flex;
  width: 100%;
  justify-content: center;
`

export const PaginationButton = styled.div`
  display: flex;
`
export const PaginationItem = styled.div`
  ${({ isDisabled }: PaginationItemProps) => isDisabled && css`
    pointer-events: none;
    opacity: .5;
  `}
  cursor: pointer;
  padding: .3rem .6rem;
  ${({ isSelected }: PaginationItemProps) => isSelected && css`
    background: var(--orange);
    border-radius: .3rem;
  `}
`
