import { connect, Contract, keyStores, WalletConnection } from 'near-api-js'
import getConfig from './config'

const nearConfig = getConfig(process.env.NODE_ENV || 'development')

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
    viewMethods: ['get_greeting', 'get_post', 'get_posts'],
    // Change methods can modify the state. But you don't receive the returned value when called.
    changeMethods: ['set_greeting', 'create_post', 'delete_post', 'answer'],
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

export async function set_greeting(message){
  let response = await window.contract.set_greeting({
    args:{message: message}
  })
  return response
}

export async function get_greeting(){
  let greeting = await window.contract.get_greeting()
  return greeting
}

export async function get_posts(){
  let posts = await window.contract.get_posts()
  return posts
}

export async function delete_post(id){
  await window.contract.delete_post({
    id: id
  })
  return true
}

export async function get_post(id){
  let post = await window.contract.get_post({
    id: id
  })
  return post
}

export async function create_post(post_req){
  let post = await window.contract.create_post({
    title: post_req.title,
    body: post_req.body,
    right: post_req.right
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