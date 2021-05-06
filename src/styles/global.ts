import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  :root {
    font-size: 16px;
    --background: #312E38;
    --container-background: #232129;
    --input-text: #F4EdE8;

    --light-orange: #FF9000;
    --iron-gray: #666360;
    --red: #C53030;
    --white: #FFFFFF;
    --light-blue: #5636D3;
    --orange: #FF872C;
    --very-light-blue: #EBF8FF;
    --blue-sky: #3172B7;
    --cleared-blue: #E6FFFA;

    --green-blue: #2E656A;
    --light-pink: #FDDEDE;
    --light-gray: #969CB3;
    --blue-wood: #363F5F;
    --green: #12A454;
    --pink: #E83F5B
  }
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }
  html {
    @media(max-width: 1080px){
      font-size: 93.75%;
    }
    @media(max-width: 720px){
      font-size: 87.5%;
    }
  }
  body {
    background: var(--background);
    color: var(--white);
    -webkit-font-smoothing: antialiased;
  }
  body, input, button, select, label {
    font-family: 'Roboto Slab', serif;
    font-size: 1rem;
  }
  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }
  button, select {
    cursor: pointer;
  }

  .react-modal-overlay {
    background: rgba(0,0,0,0.5);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .react-modal-content{
    width: 100%;
    max-width: 576px;
    background: var(--background);
    padding: 2rem 3rem;
    position: relative;
    border-radius: 0.5rem;
  }

  .react-modal-close {
    position: absolute;
    right: 1.5rem;
    top: 1.5rem;
    border: 0;
    background: transparent;
    transition: filter 0.2s;
    &:hover {
      filter: brightness(0.8);
    }
  }
`
