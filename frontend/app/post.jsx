import {create_post} from '../assets/js/near/utils'
import React from 'react'

export default function AddQuestion () {
  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false)
  // when the user submit, disable the button to avoid double click
  const [buttonDisabled, setButtonDisabled] = React.useState(false)
  const [result, setResult] = React.useState('')

  React.useEffect(
    () => {
      document.getElementById('addHyperLink').className = "active";
      document.getElementById('homeHyperlink').className = "";
    },
    []
  )
 
    const addPost=(event)=>{
      event.preventDefault()
      setButtonDisabled(true)
      create_post({
        title: event.target.title.value,
        body: event.target.body.value,
        right: event.target.right.value
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
        console.log(error);
        setButtonDisabled(false)
      });
      
    }

    return (
      <>
      <div class="form-group">
        <div class="form-area">  
            <form role="form" onSubmit={addPost}>
              <br styles="clear:both" />
              <div className="form-group">
                <input type="text" className="form-control" id="title" name="title" placeholder="Title" required />
              </div>
              
              <div className="form-group">
                <textarea className="form-control" type="textarea" id="body" name="body" placeholder="Question" maxlength="140" rows="7"></textarea>
              </div>
              <div className="form-group">
                <textarea className="form-control" type="textarea" id="right" name="right" placeholder="Right Answer" maxlength="140" rows="7"></textarea>
              </div>
                
              <button disabled={buttonDisabled} type="submit" id="submit" name="submit" className="btn btn-primary pull-right">Submit</button>
            </form>
        </div>
      </div>
       {showNotification && <Notification mesage={result}/>}
       </>
    )
}

// this component gets rendered by App after the form is submitted
function Notification({mesage}) {
  return (
    <aside>
      <h4>{mesage}</h4>
    </aside>
  )
}