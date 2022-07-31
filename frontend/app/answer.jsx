import {get_post, update_answer} from '../assets/js/near/utils'
import React from 'react'
import { useParams} from 'react-router-dom'


export default function Answer () {
  const [title, setTitle] = React.useState()
  const [question, setQuestion] = React.useState()
  const [answer, setAnswer] = React.useState()
  let { id } = useParams();
  React.useEffect(
    () => {
      get_post(parseInt(id))
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
    update_answer({
      id: parseInt(id),
      answer: event.target.answer.value,
    }).then(function (response) {
      window.location.assign('/');
    })
    .catch(function (error) {
      console.log(error);
    });
    
  }

  return (
      <div class="form-group">
        <div class="form-area">  
            <form role="form" onSubmit={answerQuestion} >
              <br styles="clear:both" />
              <div className="form-group">
                <input readOnly type="text" value={title} className="form-control" id="title" name="title" placeholder="Title" required />
              </div>
              
              <div className="form-group">
                <textarea readOnly className="form-control" value={question} type="textarea" id="question" name="question" placeholder="Question" maxlength="140" rows="7"></textarea>
              </div>

              <div className="form-group">
                <textarea className="form-control" type="textarea" id="answer" name="answer" placeholder="Answer" maxlength="140" rows="7"></textarea>
              </div>
                
              <button type="submit" id="submit" name="submit" className="btn btn-primary pull-right">Submit</button>
            </form>
        </div>
      </div>
    )
  }

  