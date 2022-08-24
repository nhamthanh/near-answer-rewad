import { connect, Contract, keyStores, WalletConnection, utils } from 'near-api-js'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')
// export const {
// 	utils: {
// 		format: {
// 			formatNearAmount, parseNearAmount
// 		}
// 	}
// } = nearAPI;

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, nearConfig))

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near)

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId()

  // Initializing our contract APIs by contract name and configuration
  window.contract = await new Contract(window.walletConnection.account(), nearConfig.contractName, {
    // View methods are read only. They don't modify the state, but usually return some value.
    viewMethods: ['get_question', 'get_questions', 'get_owner', 'get_credit'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['create_question', 'delete_question', 'answer', 'deposit' ,'minus_credit'],
  })
}

export function logout() {
  window.walletConnection.signOut()
  // reload page
  window.location.replace(window.location.origin + window.location.pathname)
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName)
}

export async function get_questions(){
  let questions = await window.contract.get_questions()
  return questions
}

export async function deposit(amount){
  await window.contract.deposit({}, nearConfig.GAS, utils.format.parseNearAmount(amount))
}

export async function get_credit(account){
  let balance = await window.contract.get_credit({account : account})
  return utils.format.formatNearAmount(balance, 2)
}

export async function delete_question(id){
  await window.contract.delete_question({
    id: id
  })
  return true
}

export async function get_question(id){
  let question = await window.contract.get_question({
    id: id
  })
  return question
}

export async function get_owner(){
  return await window.contract.get_owner()
}

export async function create_question(question_req){
  console.log("create_question");
  let post = await window.contract.create_question({
    title: question_req.title,
    body: question_req.body,
    solution: question_req.solution
  })
  return post
}

export async function update_answer(answer_req){
  let post = await window.contract.answer({
    post_id: answer_req.id,
    answer: answer_req.answer,
  })
  return post
}