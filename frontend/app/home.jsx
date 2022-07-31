import {get_posts, delete_post} from '../assets/js/near/utils'
import React from 'react'
class ShowPost extends React.Component {

    constructor(props) {
      super(props);
      this.answer = this.answer.bind(this);
      this.delete = this.delete.bind(this);
      this.state = {
        posts:[]
      };
    }
    componentDidMount(){
      document.getElementById('addHyperLink').className = "";
      document.getElementById('homeHyperlink').className = "active";
      var self = this;
      get_posts().then(function (response) {
        console.log(response);
        self.setState({posts:response});
      })
    }

    answer(id) {
      window.location.assign('/answer/'+id);
    }

    delete(id) {
      delete_post(post.id);
      window.location.reload();
    }
    
    render() {
      const { posts } = this.state;
      return ( 
        <div > 
          { posts.length > 0 ?
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
                posts.map((post, index) => {
                  return <><tr key={index}>
                        <td>{post.title}</td>
                        <td>{post.body}</td>
                        <td></td>
                        <td>{post.author}</td>
                        <td>{ post.open & post.author !== window.contract.account.accountId ? <button class="btn btn-primary" onClick={() => this.answer(post.id)}>Reply</button> : ''}</td>
                        <td>{ post.author == window.contract.account.accountId ? <button class="btn btn-primary" onClick={() => this.delete(post.id)}>Delete</button> : ''}</td>
                    </tr>
                    { post.reply.map((reply, index) => {
                      return <tr><td> - </td><td></td><td>{reply.body}</td>
                        <td>{reply.author}</td>
                        <td>{reply.right ? 'Correct' : 'Incorrect'}</td>
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

export default ShowPost;