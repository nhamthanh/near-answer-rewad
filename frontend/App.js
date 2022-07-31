import 'regenerator-runtime/runtime'
import React from 'react'
import Signin from './app/login'
import {get_greeting, logout} from './assets/js/near/utils'
import getConfig from './assets/js/near/config'
import { Outlet } from "react-router-dom";



export default function App() {
  // use React Hooks to store greeting in component state
  const [greeting, setGreeting] = React.useState()

  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(true)



  // The useEffect hook can be used to fire side-effects during render
  // Learn more: https://reactjs.org/docs/hooks-intro.html
  React.useEffect(
    () => {
      // get_greeting is in near/utils.js
      get_greeting()
        .then(greetingFromContract => {
          setGreeting(greetingFromContract)
        })
    },

    // The second argument to useEffect tells React when to re-run the effect
    // Use an empty array to specify "only run on first render"
    // This works because signing into NEAR Wallet reloads the page
    []
  )

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <Signin />
    )
  }

  return (
      // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
      <>
        <nav>
          <ul class="nav nav-pills pull-right">
            <li role="presentation" id="homeHyperlink"><a href="/">Home</a></li>
            <li role="presentation" id="addHyperLink"><a href="/addpost">Add</a></li>
            <li role="presentation"><button type="button" class="btn" style={{
              color: 'var(--light-gray)',
            }} onClick={logout}>
              Sign out
            </button></li>
          </ul>
        </nav>
        <div className="content">
          <Outlet />
        </div>
      </>
    )
}


