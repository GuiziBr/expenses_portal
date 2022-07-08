import styled, { css } from 'styled-components'

interface PaginationItemProps {
  isSelected?: boolean
  isDisabled?: boolean
}

export const Container = styled.div`
  margin-top: 6rem;
  display: flex;
  width: 100%;
  justify-content: center;
  @media(max-width: 720px) {
    margin-top: 0;
  }
`

export const PaginationButton = styled.div`
  display: flex;
  @media(max-width: 720px) {
    margin-top: 5rem;
  }
`
export const PaginationItem = styled.div`
  :hover {
    filter: brightness(0.7);
  }
  ${({ isDisabled }: PaginationItemProps) => isDisabled && css`
    pointer-events: none;
    opacity: .5;
  `}
  cursor: pointer;
  padding: .3rem .6rem;
  ${({ isSelected }: PaginationItemProps) => isSelected && css`
    background: var(--orange);
    border-radius: .3rem;
    pointer-events: none;
  `}
`
