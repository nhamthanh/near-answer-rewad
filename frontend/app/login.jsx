import React from 'react'
import {login} from '../assets/js/near/utils'

class Signin extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div>
          <h1 class="text-center">
          <label
            htmlFor="greeting"
            style={{
              color: 'var(--secondary)',
              borderBottom: '2px solid var(--secondary)'
            }}
          >
          </label>!
          Welcome to NEAR!
          </h1>
          <p class="text-center">
          Your contract is storing a greeting message in the NEAR blockchain. To
          change it you need to sign in using the NEAR Wallet. It is very simple,
          just use the button below.
          </p>
          <p class="text-center">
          Do not worry, this app runs in the test network ("testnet"). It works
          just like the main network ("mainnet"), but using NEAR Tokens that are
          only for testing!
          </p>
          <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
            <button class="btn btn-primary" onClick={login}>Sign in</button>
          </p>
        </div>

      )
    }
}

export default Signin;