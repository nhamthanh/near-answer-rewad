import {create_question} from '../assets/js/near/utils'
import { useLocation} from 'react-router-dom'
import React from 'react'
import sha256 from 'js-sha256';
import Notification from './notification'

export default function AddQuestion () {
  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false)
  // when the user submit, disable the button to avoid double click
  const [buttonDisabled, setButtonDisabled] = React.useState(false)
  const [result, setResult] = React.useState('')
  let location = useLocation();
  React.useEffect(
    () => {
      // if(location.search) {
      //   window.location.assign('/');
      // }
      document.getElementById('addHyperLink').className = "active";
      document.getElementById('homeHyperlink').className = "";
    },
    []
  )
 
    const question=(event)=>{
      event.preventDefault()
      setButtonDisabled(true)
      let title = event.target.title.value
      let body = event.target.body.value
      let solution = sha256.sha256(event.target.solution.value); 
      create_question({
        title: title,
        body: body,
        solution: solution,
      }).then(function (response) {
        // show Notification
        setShowNotification(true)
        setResult('Your question is saved')
        // remove Notification again after css animation completes
        // this allows it to be shown again next time the form is submitted
        setTimeout(() => {
          window.location.assign('/');
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
            <form role="form" onSubmit={question}>
              <div> * Every question cost you 0.4 Near </div>
              <br styles="clear:both" />
              <div className="form-group">
                <input type="text" className="form-control" id="title" name="title" placeholder="Title" required />
              </div>
              
              <div className="form-group">
                <textarea className="form-control" type="textarea" id="body" required name="body" placeholder="Question" maxlength="140" rows="7"></textarea>
              </div>
              <div className="form-group">
                <textarea className="form-control" type="textarea" id="solution" required name="solution" placeholder="Solution" maxlength="140" rows="7"></textarea>
              </div>
                
              <button disabled={buttonDisabled} type="submit" id="submit" name="submit" className="btn btn-primary pull-right">Submit</button>
            </form>
        </div>
      </div>
       {showNotification && <Notification mesage={result}/>}
       </>
    )
}

