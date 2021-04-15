import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  span {
    width: 10rem;
    background: var(--light-orange);
    padding: .5rem;
    border-radius: .5rem;
    font-size: 1rem;
    font-weight: 500;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.4s;
    position: absolute;
    bottom: calc(100% + .75rem);
    left: 50%;
    transform: translateX(-50%);
    color: var(--background);
    &::before {
      content: '';
      border-style: solid;
      border-color: var(--light-orange) transparent;
      border-width: .4rem .4rem 0 .4rem;
      top: 100%;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  &:hover span {
    opacity: 1;
    visibility: visible;
  }
`
