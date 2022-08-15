import {get_owner, get_questions, delete_question, get_credit, deposit, minus_credit} from '../assets/js/near/utils'
import React from 'react'
import Notification from './notification'
// class ShowQuestions extends React.Component {
export default function ShowQuestions () {
    const [amount, setAmount] = React.useState('');
    const [credit, setCredit] = React.useState('');
    const [questions, setQuestions] = React.useState([]);
    const [owner, setOwner] = React.useState('');
    const [showNotification, setShowNotification] = React.useState(false)
    const [result, setResult] = React.useState('')
    React.useEffect(() => {
      document.getElementById('addHyperLink').className = "";
      document.getElementById('homeHyperlink').className = "active";
      get_owner().then(function (response) {
        setOwner(response);
      })
      get_questions().then(function (response) {
        setQuestions(response);
      })
      get_credit(window.accountId).then(function (response) {
        setCredit(response);
      }).catch(function (error) {
        console.log(error)
      });
    }, []);

    const answer = (id) => {
      window.location.assign('/answer/'+id);
    }

    const handleDeposit = () => {
      deposit(amount).then(function () {
        get_credit(window.accountId).then(function (response) {
          console.log(response)
          setCredit(response);
        }).catch(function (error) {
          console.log(error)
        });
      }).catch(function (error) {
        console.log(error)
      });
    };

    const deleteQuestion = (id) => {
      if(window.confirm('Delete the item?')) {
        delete_question(id);
        window.location.reload();
      }
    }
    
    return(

        <div> 
          { questions.length > 0 ?
              <table class="table">
              <thead><tr>
                <th scope="col">Title</th>
                <th scope="col">Quesion</th>
                <th scope="col">Answer</th>
                <th scope="col">Author</th>
                <th scope="col">Result</th>
                <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
              {
                questions.map((question, index) => {
                  return <><tr key={index}>
                        <td>{question.title}</td>
                        <td>{question.body}</td>
                        <td></td>
                        <td>{question.author}</td>
                        <td>{ question.open & question.author !== window.contract.account.accountId ? <button class="btn btn-primary" onClick={() => answer(question.id)}>Answer</button> : ''}</td>
                        <td>{ owner === window.accountId ? <button class="btn btn-primary" onClick={() => deleteQuestion(question.id)}>Delete</button> : '' }</td>
                    </tr>
                    { question.reply.map((reply, index) => {
                      return <tr><td> - </td><td></td><td>{reply.body}</td>
                        <td>{reply.author}</td>
                        <td>{reply.correct ? 'Correct' : 'Incorrect'}</td>
                        <td></td>
                      </tr> 
                    })
                    }
                    </>
                })
              }
              </tbody></table>
              : <h1>Have no post</h1> 
              }
              <p>Current Credits: { credit ? credit : 0}</p>
              <input placeholder="Credits (N)" value={amount} onChange={(e) => setAmount(e.target.value)} />
              <br />
              <button onClick={() => handleDeposit()}>Buy Credits</button>
              {<Notification mesage={"result"}/>}
          </div>
    )
}