import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AddQuestion from './question';
import ShowQuestions from './home';
import Answer from './answer';
// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main className='content'>
    <Routes>
      {/* <Route exact path='/' component={Home}/>
      <Route path='/roster' component={Roster}/>
      <Route path='/schedule' component={Schedule}/> */}
      <Route path="/" element={<ShowQuestions />} />
      <Route path="/question" element={<AddQuestion />} />
        <Route path="/answer/:id" element={<Answer />} />
    </Routes>
  </main>
)

export default Main