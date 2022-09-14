import React from 'react'
import { Link } from 'react-router-dom'
import {get_owner, logout} from '../assets/js/near/utils'
// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
  <header>
    <nav>
      <ul class="nav nav-pills pull-right">
        <li role="presentation" id="homeHyperlink"><Link to="/">Home</Link></li>
        <li role="presentation" id="addHyperLink"><Link to="/question">Add</Link></li>
        <li role="presentation"><button type="button" class="btn" onClick={logout}>
            Sign out
        </button></li>
      </ul>
    </nav>
  </header>
)

export default Header