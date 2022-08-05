import {get_owner, get_questions, delete_question} from '../assets/js/near/utils'
import React from 'react'
class ShowQuestions extends React.Component {

    constructor(props) {
      super(props);
      this.answer = this.answer.bind(this);
      this.delete = this.delete.bind(this);
      this.state = {
        questions:[],
        owner: ''
      };
    }
    componentDidMount(){
      document.getElementById('addHyperLink').className = "";
      document.getElementById('homeHyperlink').className = "active";
      var self = this;
      get_owner().then(function (response) {
        self.setState({owner:response});
      })
      get_questions().then(function (response) {
        self.setState({questions:response});
      })
    }

    answer(id) {
      window.location.assign('/answer/'+id);
    }

    delete(id) {
      if(window.confirm('Delete the item?')) {
        delete_question(id);
        window.location.reload();
      }
    }
    
    render() {
      const { questions } = this.state;
      return ( 
        <div > 
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
                        <td>{ question.open & question.author !== window.contract.account.accountId ? <button class="btn btn-primary" onClick={() => this.answer(question.id)}>Answer</button> : ''}</td>
                        <td>{ this.state.owner === window.contract.account.accountId ? <button class="btn btn-primary" onClick={() => this.delete(question.id)}>Delete</button> : '' }</td>
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
              : <h1>Have no post</h1> }
          </div>
      )
    }
}

export default ShowQuestions;