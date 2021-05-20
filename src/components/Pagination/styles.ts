import styled, { css } from 'styled-components'

interface PaginationItemProps {
  isSelected?: boolean
  isDisabled?: boolean
}

export const Container = styled.div`
  margin-top: 1.8rem;
  display: flex;
  width: 100%;
  justify-content: center;
`

export const PaginationButton = styled.div`
  display: flex;
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
