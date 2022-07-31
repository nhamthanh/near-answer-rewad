import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App'
import { initContract } from './assets/js/near/utils'
import AddQuestion from './app/post';
import ShowPost from './app/home';
import Answer from './app/answer';
const container = document.querySelector('#root')
const root = createRoot(container) // createRoot(container!) if you use TypeScript

window.nearInitPromise = initContract()
  .then(() => {
    <App />
    root.render(
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<App />}>
          <Route path="/addpost" element={<AddQuestion />} />
          <Route path="/" element={<ShowPost />} />
          <Route path="/answer/:id" element={<Answer />} />
        </Route>
        </Routes>
      </BrowserRouter>
    )
  })
  .catch(console.error)
