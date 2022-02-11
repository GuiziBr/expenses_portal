import styled from 'styled-components'

interface ContainerProps {
  size?: 'small' | 'large'
  current: 'PersonalDashboard' | 'SharedDashboard' | 'CreateExpense'
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
    nav {
      display: flex;
      justify-content: space-between;
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
        }
        &.active {
          color: var(--orange);
          pointer-events: none;
        }
      }
    }
  }
`
