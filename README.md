<h1> Decentralized Ballot WebApp </h1>

1. I have used the Ballot contract that comes with Browser Solidity
2. Modified the Ballot contract to make it more user friendly. The Ballot Proposals are now Strings
3. This repo is loosely based on Mahesh Murty tutorial on Medium. Link - https://medium.com/@mvmurthy/full-stack-hello-world-voting-ethereum-dapp-tutorial-part-2-30b3d335aa1f
4. I have used a private Blockchain and my code takes care of fund transfer, unlocking the accounts etc.


Steps:- 

1. Before truffle migrate unlock your coinbase
>truffle console
web.personal.unlockAccount(web3.eth.coinbase,'password',15000);

Deploy the app using-
truffle migrate

2. Once the  Ballot.json is generated.  You can use 
npm run dev 

to start the App

3. Hit the App with 
http://localhost:8080

4. Initially the vote count is zero

5. Generate some accounts in geth/truffle console
personal.newAccount();
password : test
<Address>

6. Use your coinbase address as your Ballot Chairman Address, Coinbase Pwd as chairman password
and address generated in Step 5 as Voter address.Give Address the right to Voter

7. Once the address has right to Vote in Blockchain, they can vote for one of the three proposals.
Once they Vote and it becomes part of blockchain, Vote count is updated.


