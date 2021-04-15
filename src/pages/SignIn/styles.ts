import styled, { keyframes } from 'styled-components'
import { shade } from 'polished'

import signInBackgroundImg from '../../assets/sign-in-background_5.jpg'

export const Container = styled.div`
  height: 100vh;
  display: flex;
  align-items: stretch;
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  place-content: center;
  width: 100%;
  max-width: 700px;
  align-items: center;
`
const appearFromLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-3rem);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${appearFromLeft} 1s;
  form {
      margin: 3rem 0;
      width: 20rem;
      text-align: center;
      h1 {
        margin-bottom: 2.5rem;
      }
      a {
        color: var(--input-text);
        display: block;
        margin-top: 1.5rem;
        text-decoration: none;
        transition: color 0.2s;
        &:hover {
          color: ${shade(0.2, '#f4ede8')}
        }
      }
    }
`

export const Background = styled.div`
  flex: 1;
  background: url(${signInBackgroundImg}) no-repeat center;
  background-size: cover;
`
