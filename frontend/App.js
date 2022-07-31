import 'regenerator-runtime/runtime'
import React from 'react'
import Signin from './app/login'
import {logout} from './assets/js/near/utils'
import { Outlet } from "react-router-dom";



export default function App() {

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
            <li role="presentation"><button type="button" class="btn" onClick={logout}>
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


