import styled from 'styled-components'

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: var(--very-light-blue);
  text-align: center;
  margin-top: -6.5rem;
  @media(max-width: 720px) {
    font-size: 1.5rem;
    margin-top: -5.5rem;
  }
`

export const Container = styled.div`
  width: 100vw;
  max-width: 1120px;
  margin: 0 auto;
  padding: 2.5rem 1rem;
  @media(max-width: 720px) {
    padding: 2rem 0
  }
`

export const FormContainer = styled.div`
  margin-top: 3rem;
  display: flex;
  form {
    display: flex;
    align-items: center;
    @media(max-width: 720px) {
      width: 100%;
      justify-content: center
    }
    div:first-child {
      height: 2.6rem;
      border-color: var(--container-background);
      width: 15rem;
      input {
        width: 5rem;
      }
    }
    button {
      margin: 0;
      margin-left: .3rem;
      height: 2.5rem;
      width: 5.5rem;
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
      padding: 1.25rem 2rem;
      text-align: left;
      font-size: 1.25rem;
      line-height: 1.5rem;
      @media(max-width: 720px) {
        width: 33.3vw;
        font-size: 1rem;
        padding: 0 0 0 1rem;
      }
    }

    td {
      width: 11rem;
      padding: .63rem 2rem;
      border: 0;
      background: var(--white);
      font-size: 1rem;
      font-weight: normal;
      @media(max-width: 720px) {
        padding: .44rem 1rem;
        text-align: left;
        display: flex;
        align-items: center;
      }
      color: var(--light-gray);
      &.edit-button, &.delete-button {
        width: 1rem;
        margin: 0;
      }
      button {
        width: 1rem;
        margin: 0;
        height: 2.55rem;
        background: none;
        padding: 0;
     }
     input {
      border: 0;
      background-color: transparent;
      &.editable {
        color: var(--light-orange);
      }
      @media(max-width: 720px) {
        width: 5.7rem;
      }

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
