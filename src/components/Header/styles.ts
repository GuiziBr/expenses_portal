import styled from 'styled-components'

interface ContainerProps {
  size?: 'small' | 'large'
}

export const Container = styled.div<ContainerProps>`
  background: var(--light-blue);
  padding: 2rem 0;
  @media(max-width: 720px) {
    padding-bottom: 0;
  }
  header {
    max-width: 1120px;
    margin: 0 auto;
    padding: ${({ size }) => (size === 'small' ? '0 1.25rem ' : '0 1.25rem 10rem')};
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media(max-width: 720px) {
      padding: 0 .5rem 10rem;
    }
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      a {
        color: var(--white);
        text-decoration: none;
        font-size: 1rem;
        transition: opacity 0.2s;
        & + a {
          margin-left: 2rem;
        }
        &:hover {
          opacity: 0.6;
          color: var(--orange);
        }
        &.active {
          color: var(--orange);
        }
        @media(max-width: 720px) {
          & + a {
            margin-left: 1rem;
          }
        }
      }

      div {
        margin-right: 2rem;
        @media(max-width: 720px) {
          margin-right: 1rem;
        }
        &:hover {
          color: var(--orange);
        }
        button {
          background: none;
          border: none;
          outline: none;
          color: inherit;
          padding-left: .7rem;
          &.active {
            color: var(--orange);
          }
          @media(max-width: 720px) {
             padding-left: 0;
          }
        }
        svg {
          cursor: pointer;
          margin-left: .1rem;
          padding-top: .5rem;
          &:hover {
            color: var(--orange);
          }
        }
        ul {
          height: 0;
          position: fixed;
          list-style: none;
          background-color: var(--light-blue);
          padding: 0 .7rem 0 .7rem;
          border-radius: .3rem;
          transition: all 0.5s ease;
          overflow: hidden;
          transition: height 0.3s ease;
          .nav-item {
            text-align: center;
            margin-top: .5rem;
          }
          .nav-item:first-of-type {
            margin-top: .3rem;
          }
        }
        .management-menu {
          height: 8rem;
         }
      }
    }

  }
`
