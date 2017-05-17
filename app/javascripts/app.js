// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import ballot_artifacts from '../../build/contracts/Ballot.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var Ballot = contract(ballot_artifacts);

let proposals = {"proposal-0": "proposal-0", "proposal-1": "proposal-1", "proposal-2": "proposal-2"};

window.giveVoteRights = function() {
var voterAddress = $("#voterAddress").val();
var chairmanAddress = $("#chairmanAddress").val();
var chairmanPwd = $("#chairmanPwd").val();
console.log(voterAddress);
console.log(chairmanAddress);
console.log(chairmanPwd);
  try {
    $("#votemsg").html("Voting right has been given.Once it is part of blockchain, you can Vote. Please wait.")
    $("#voterAddress").val("");
	$("#chairmanAddress").val("");
	$("#chairmanPwd").val("");
	
	// Before Voting rights transfer some funds to transact
		web3.personal.unlockAccount(chairmanAddress,chairmanPwd,10000);
		web3.eth.sendTransaction({from:chairmanAddress,to:voterAddress,value:web3.toWei(1000,"ether")},function(error,res){
		
		if(error){
		console.log(error);
		}
		else{
		console.log(res);
		Ballot.deployed().then(function(contractInstance) {
		contractInstance.giveRightToVote(voterAddress, {gas: 140000, from: chairmanAddress }).then(function(result) {
		console.log(result.receipt);
		alert("You can now Vote");
		
		 $("#votemsg").html('You can Vote Now');
       // let div_id = proposals[proposalNum];
       //return contractInstance.totalVotesFor.call(candidateName).then(function(v) {
        //  $("#" + div_id).html(v.toString());
        //  $("#msg").html("");
        //});
      });
    });
  } 
		
		});
		}
		catch (err) {
			console.log(err);
			alert('Failed');
		}
}

window.voteForProposal = function(){
var votersAddress = $("#votersaddress").val();
console.log(votersAddress);
var voteNum = $("#proposal").val();
console.log(voteNum);
var vPassword = $("#voterspassword").val();
try{
$("#votersaddress").val("");
$("#proposal").val("");
$("#voterspassword").val("");
$("#voteinit").val("Your vote is now submitted to Blockchain for processing");
// Unlock Account first
web3.personal.unlockAccount(votersAddress,vPassword);

// Now fire Call to Vote
    Ballot.deployed().then(function(contractInstance) {
	contractInstance.vote(voteNum,{gas: 140000, from: votersAddress }).then(function(v){
	console.log(v);
	$("#voteCompleted").html('You have Voted for '+voteNum+'Transaction Hash --- '+v.tx);
	     let div_id = proposals[voteNum];
        return contractInstance.totalVotesFor.call(voteNum).then(function(v) {
          $("#" + div_id).html(v.toString());
          //$("#msg").html("");
        });
	},function(error){
	console.log(error);
	$("#votecompleted").html('An error occurred please re-try');
	$("#voteinit").val("");
	});
	});
}
catch(err){
console.log(err);
}	
}

window.winningProposal = function(){
 Ballot.deployed().then(function(contractInstance) {
 contractInstance.winningProposal().then(function(result){
	console.log(result);
	console.log(web3.toAscii(result));
	
	$("#msg").html(web3.toAscii(result));
 })
 });
}

$(document).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }
  Ballot.setProvider(web3.currentProvider);
  let proposalNames = Object.keys(proposals);
  for (var i = 0; i < proposalNames.length; i++) {
    let name = proposalNames[i];
    Ballot.deployed().then(function(contractInstance) {
      contractInstance.totalVotesFor.call(name).then(function(v) {
        $("#" + proposals[name]).html(v.toString());
      });
    })
  }
   });
   
   
