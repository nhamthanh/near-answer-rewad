import {get_question, update_answer} from '../assets/js/near/utils'
import React from 'react'
import { useParams} from 'react-router-dom'
import Notification from './notification'
import sha256 from 'js-sha256';

export default function Answer () {
  const [title, setTitle] = React.useState()
  const [question, setQuestion] = React.useState()
  const [answer, setAnswer] = React.useState()
  // when the user submit, disable the button to avoid double click
  const [buttonDisabled, setButtonDisabled] = React.useState(false)
  const [result, setResult] = React.useState('')
  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false)
  let { id } = useParams();
  
  React.useEffect(
    () => {
      // if(location.search) {
      //   window.location.assign('/');
      // }
      console.log("aaaa");
      document.getElementById('addHyperLink').className = "";
      document.getElementById('homeHyperlink').className = "active";
      get_question(parseInt(id))
        .then(question => {
          setTitle(question.title)
          setQuestion(question.body)
        })
        .catch(error => {
          console.log(error);
        })
    },

    // The second argument to useEffect tells React when to re-run the effect
    // Use an empty array to specify "only run on first render"
    // This works because signing into NEAR Wallet reloads the page
    []
  )

  const answerQuestion=(event)=>{
    event.preventDefault()
    setButtonDisabled(true)

    update_answer({
      id: parseInt(id),
      answer: sha256.sha256(event.target.answer.value),
    }).then(function (response) {
      setShowNotification(true)
      response.open ? setResult('Sorry, your answer is incorrect') :  setResult('Your answer is correct and get rewarded') 
      setTimeout(() => {
        window.location.assign(window.location.pathname);
      }, 1000)
    })
    .catch(function (error) {
      alert(error.kind.ExecutionError)
      setButtonDisabled(false)
    });
    
  }

  return (
      <>
      <div class="form-group">
        <div class="form-area">  
            <form role="form" onSubmit={answerQuestion} >
              <div> * Every question cost you 0.4 Near </div>
              <br styles="clear:both" />
              <div className="form-group">
                <input readOnly type="text" value={title} className="form-control" id="title" name="title" placeholder="Title" required />
              </div>
              
              <div className="form-group">
                <textarea readOnly className="form-control" value={question} type="textarea" id="question" name="question" placeholder="Question" maxlength="140" rows="7"></textarea>
              </div>

              <div className="form-group">
                <textarea className="form-control" required type="textarea" id="answer" name="answer" placeholder="Answer" maxlength="140" rows="7"></textarea>
              </div>
                
              <button type="submit" disabled={buttonDisabled} id="submit" name="submit" className="btn btn-primary pull-right">Submit</button>
            </form>
        </div>
      </div>
      {showNotification && <Notification mesage={result}/>}
      </>
    )
  }