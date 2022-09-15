import React from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route, HashRouter } from "react-router-dom";
import App from './App'
import { initContract } from './assets/js/near/utils'
import AddQuestion from './app/question';
import ShowQuestions from './app/home';
import Answer from './app/answer';
const container = document.querySelector('#root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript

window.nearInitPromise = initContract()
  .then(() => {
    <App />
    root.render(
      <HashRouter>
        <Routes>
        <Route path="/" element={<App />}>
          <Route path="/question" element={<AddQuestion />} />
          <Route path="/" element={<ShowQuestions />} />
          <Route path="/answer/:id" element={<Answer />} />
        </Route>
        </Routes>
      </HashRouter>
    )
  })
  .catch(console.error)
