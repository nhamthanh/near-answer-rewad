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

// Define the default message
const DEFAULT_MESSAGE: &str = "Hello";
// 1 Ⓝ in yoctoNEAR
const PRIZE_AMOUNT: u128 = 1_000_000_000_000_000_000_000_000;

// Define the contract structure
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Blog {
    message: String,
    records: LookupMap<String,String>,
    posts: UnorderedMap<usize, Post>,
    owner: AccountId,
}

// Define the default, which automatically initializes the contract
impl Default for Blog{
    fn default() -> Self{
        Self{message: DEFAULT_MESSAGE.to_string(),
            records: LookupMap::new(b"records".to_vec()),
            posts: UnorderedMap::new(b"posts".to_vec()),
            owner: env::signer_account_id(),
        }
        
    }
}

#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Post {
    pub title: String,
    pub body: String,
    pub right: String,
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
    pub right: bool,
}

// Implement the contract structure
#[near_bindgen]
impl Blog {
    // Public method - returns the greeting saved, defaulting to DEFAULT_MESSAGE
    pub fn get_greeting(&self, account_id: String) -> String {
        match self.records.get(&account_id) {
            Some(greeting) => greeting,
            None => "Hello word".to_string(),
        }
    }

    pub fn set_greeting(&mut self, message: String) {
        // Use env::log to record logs permanently to the blockchain!
        let account_id = env::signer_account_id().to_string();
        //format!("saving greeting '{}' for account_id", message);
        env::log_str(&format!("saving greeting '{}' for account_id '{}'", message, account_id));
        self.records.insert( &account_id, &message);
    }

    pub fn create_post(&mut self, title: String, body: String, right: String) -> usize {
        let author = env::signer_account_id();
        let post = Post {
            title,
            body,
            author: author,
            reply: Vec::new(),
            open: true,
            id: self.posts.len() as usize,
            right: right,
        };
        self.posts.insert(&post.id, &post);
        post.id
    }

    // delete post
    pub fn delete_post(&mut self, id: usize) {
        let user = env::signer_account_id();
        assert_eq!(self.owner, user, "only owner can delete post");
        self.posts.remove(&id);
    }

    // get post
    pub fn get_post(&self, id: usize) -> Post {
        let mut post = self.posts.get(&id).unwrap().clone();
        post.right = "".to_string();
        post
    }

    // get posts
    pub fn get_posts(&self) -> Vec<Post> {
        self.posts.values().map(|post| post.clone()).collect()
    }

    // answer question
    #[payable]
    pub fn answer(&mut self, post_id: usize, answer: String) -> Post {
        let answer_id = env::predecessor_account_id();
        //assert_eq!(true, false, "{}", format!("'{}' - '{}'", env::signer_account_id().to_string(), env::predecessor_account_id().to_string()));
        let mut post = self.posts.get(&post_id).unwrap();
        assert_ne!(post.author, answer_id, "only customer can answer question");
        assert_eq!(post.open, true, "This question is closed");
        let right = post.right.eq(&answer);
        let reply = Reply {
            body: answer,
            author: answer_id.clone(),
            right: right
        };
        
        // closed question
        post.open = !right;
        if right {
            self.pay_answer(answer_id);
        }
        
        post.reply.push(reply);
        self.posts.insert(&post_id, &post);
        post.clone()
    }

    // answer question
    // pub fn question_close(&self, post_id: usize, answer_id: AccountId) -> Post {
    //     let user = env::signer_account_id();
    //     assert_eq!(self.owner, user, "only owner can close post");
    //     let mut post = self.posts.get(&post_id).unwrap();
    //     post.open = false;
    //     self.pay_answer(answer_id);
    //     self.posts.get(&post_id).unwrap().clone()
    // }

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
    fn test_answer_2() {
        let mut context = get_context(vec![],false);
        testing_env!(context);
        let mut contract = Blog::default();
        let post_id = contract.create_post("title".to_string(), "1+1=".to_string(), "2".to_string());
        contract.answer(post_id, "2".to_string());
        let post = contract.get_post(0);
        assert_eq!(post.reply.get(0).unwrap().body, "2".to_string());
    }

    #[test]
    fn get_default_greeting() {
        let contract = Blog::default();
        // this test did not call set_greeting so should return the default "Hello" greeting
        assert_eq!(
            contract.get_greeting("thanhnham.testnet".to_string()),
            "Hello".to_string()
        );
    }

    #[test]
    fn set_then_get_greeting() {
        let context = get_context(vec![],false);
        testing_env!(context);
        let mut contract = Blog::default();
        contract.set_greeting("howdy".to_string());
        // In test context, we set "bob_near" is signer_account_id, so when get greeting from him
        // We also set "howdy" as greeting. It will result howdy
        assert_eq!(
            contract.get_greeting("bob_near".to_string()),
            "howdy".to_string()
        );
    }

    #[test]
    fn test_create_post() {
        let context = get_context(vec![],false);
        testing_env!(context);
        let mut contract = Blog::default();
        let post_id = contract.create_post("title".to_string(), "body".to_string(), "right-answer".to_string());
        assert_eq!(post_id, 0);

        // create another post
        let post_id = contract.create_post("another title".to_string(), "another body".to_string(), "right-answer".to_string());
        assert_eq!(post_id, 1);

        // 20 posts from 2 (we created 2)
        for i in 2..20 {
            let post_id = contract.create_post("title".to_string(), "body".to_string(), "right-answer".to_string());
            assert_eq!(post_id, i);
        }
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
            550_000_000
        );
    }

    #[test]
    fn test_answer() {
        let mut context = get_context(vec![],false);
        testing_env!(context);
        let mut contract = Blog::default();
        let post_id = contract.create_post("title".to_string(), "1+1=".to_string(), "right-answer".to_string());
        let post = contract.answer(post_id, "2".to_string());
        assert_eq!(post.reply.get(0).unwrap().body, "2".to_string());
    }

   
    #[test]
    fn test_get_posts() {
        let context = get_context(vec![],false);
        testing_env!(context);
        let mut contract = Blog::default();
        let post_id = contract.create_post("title".to_string(), "body".to_string(), "right-answer".to_string());
        assert_eq!(post_id, 0);

        // create another post
        let post_id = contract.create_post("another title".to_string(), "another body".to_string(), "right-answer".to_string());
        assert_eq!(post_id, 1);

        let posts = contract.get_posts();
        assert_eq!(posts.len(), 2);
    }
}
