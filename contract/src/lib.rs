/*
 * Example smart contract written in RUST
 *
 * Learn more about writing NEAR smart contracts with Rust:
 * https://near-docs.io/develop/Contract
 *
 */

use near_sdk::collections::{LookupMap, UnorderedMap};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{env, near_bindgen, AccountId, Promise};

// 1 Ⓝ in yoctoNEAR
const PRIZE_AMOUNT: u128 = 1_000_000_000_000_000_000_000_000;

// Define the contract structure
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Blog {
    id: usize,
    answers: LookupMap<usize,String>,
    questions: UnorderedMap<usize, Question>,
    owner: AccountId,
}

// Define the default, which automatically initializes the contract
impl Default for Blog{
    fn default() -> Self{
        Self{id: 0,
            answers: LookupMap::new(b"answers".to_vec()),
            questions: UnorderedMap::new(b"questions".to_vec()),
            owner: env::signer_account_id(),
        }
        
    }
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Question {
    pub title: String,
    pub body: String,
    pub author: AccountId,
    pub reply: Vec<Reply>,
    pub open: bool,
    pub id: usize,
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Reply {
    pub body: String,
    pub author: AccountId,
    pub correct: bool,
}

// Implement the contract structure
#[near_bindgen]
impl Blog {

    pub fn create_question(&mut self, title: String, body: String, solution: String) -> usize {
        let author = env::signer_account_id();
        let question = Question {
            title,
            body,
            author: author,
            reply: Vec::new(),
            open: true,
            id: self.id,
        };
        self.answers.insert(&self.id, &solution);
        self.questions.insert(&question.id, &question);
        self.id += 1;
        question.id
    }

    // delete post
    pub fn delete_question(&mut self, id: usize) {
        let user = env::predecessor_account_id();
        assert_eq!(self.owner, user, "only owner can delete post");
        self.questions.remove(&id);
        self.answers.remove(&id);
    }

    // get owner
    pub fn get_owner(&self) -> AccountId {
        self.owner.clone()
    }

    // get question
    pub fn get_question(&self, id: usize) -> Question {
        self.questions.get(&id).unwrap().clone()
    }

    // get questions
    pub fn get_questions(&self) -> Vec<Question> {
        self.questions.values().map(|post| post.clone()).collect()
    }

    // answer question
    #[payable]
    pub fn answer(&mut self, post_id: usize, answer: String) -> Question {
        let answer_id = env::predecessor_account_id();
        //assert_eq!(true, false, "{}", format!("'{}' - '{}'", env::signer_account_id().to_string(), env::predecessor_account_id().to_string()));
        let mut post = self.questions.get(&post_id).unwrap();
        assert_ne!(post.author, answer_id, "only customer can answer question");
        assert_eq!(post.open, true, "This question is closed");
        let solution = self.answers.get(&post_id);
        let correct = solution.unwrap().eq(&answer);
        let reply = Reply {
            body: answer,
            author: answer_id.clone(),
            correct: correct
        };
        
        // closed question
        post.open = !correct;
        if correct {
            self.pay_answer(answer_id);
        }
        
        post.reply.push(reply);
        self.questions.insert(&post_id, &post);
        post.clone()
    }

    fn pay_answer(&self, to: AccountId) -> Promise {
        Promise::new(to).transfer(PRIZE_AMOUNT)
    }
}

/*
 * The rest of this file holds the inline tests for the code above
 * Learn more about Rust tests: https://doc.rust-lang.org/book/ch11-01-writing-tests.html
 */
#[cfg(test)]
mod tests {
    use near_sdk::test_utils::VMContextBuilder;
    use super::*;
    use near_sdk::MockedBlockchain;
    use std::convert::TryInto;
    use near_sdk::{testing_env, VMContext};

    // Mock the context for testing
    fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContextBuilder::new()
            .signer_account_id("bob_near".parse().unwrap())
            .current_account_id("join_near".parse().unwrap())
            .account_balance(5_000_000_000_000_000_000_000_000)
            .is_view(is_view)
            .build()
    }

    #[test]
    fn test_answer() {
        let mut context = get_context(vec![],false);
        testing_env!(context);
        let mut contract = Blog::default();
        let post_id = contract.create_question("title".to_string(), "1+1=".to_string(), "2".to_string());
        contract.answer(post_id, "2".to_string());
        let post = contract.get_question(0);
        assert_eq!(post.reply.get(0).unwrap().body, "2".to_string());
        assert_eq!(post.reply.get(0).unwrap().correct, true);
    }

    #[test]
    fn test_create_question() {
        let context = get_context(vec![],false);
        testing_env!(context);
        let mut contract = Blog::default();
        let post_id = contract.create_question("title".to_string(), "body".to_string(), "right-answer".to_string());
        assert_eq!(post_id, 0);

        // create another post
        let post_id = contract.create_question("another title".to_string(), "another body".to_string(), "right-answer".to_string());
        assert_eq!(post_id, 1);

        // 20 questions from 2 (we created 2)
        for i in 2..20 {
            let post_id = contract.create_question("title".to_string(), "body".to_string(), "right-answer".to_string());
            assert_eq!(post_id, i);
        }
    }

    #[test]
    fn test_delete_question() {
        let context = get_context(vec![],false);
        testing_env!(context);
        let mut contract = Blog::default();
        contract.create_question("title".to_string(), "body".to_string(), "right-answer".to_string());

        // create another post
        let post_id_2 = contract.create_question("another title".to_string(), "another body".to_string(), "right-answer".to_string());

        contract.delete_question(post_id_2);
        let questions = contract.get_questions();
        assert_eq!(questions.len(), 1);
    }

    #[test]
    fn test_pay() {
        let context = get_context(vec![],false);
        testing_env!(context);
        let mut contract = Blog::default();
        let receiver = "join_near".parse().unwrap();
        contract.pay_answer(receiver);
        // In test context, we set "bob_near" is signer_account_id, so when get greeting from him
        // We also set "howdy" as greeting. It will result howdy
        assert_eq!(
            env::account_balance(),
            4_000_000_000_000_000_000_000_000
        );
    }
   
    #[test]
    fn test_get_questions() {
        let context = get_context(vec![],false);
        testing_env!(context);
        let mut contract = Blog::default();
        let post_id = contract.create_question("title".to_string(), "body".to_string(), "right-answer".to_string());
        assert_eq!(post_id, 0);

        // create another post
        let post_id = contract.create_question("another title".to_string(), "another body".to_string(), "right-answer".to_string());
        assert_eq!(post_id, 1);

        let questions = contract.get_questions();
        assert_eq!(questions.len(), 2);
    }
}
