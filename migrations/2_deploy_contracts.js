var Ballot = artifacts.require("./Ballot.sol");


module.exports = function(deployer) {  
  deployer.deploy(Ballot,['proposal-0','proposal-1','proposal-2'], {gas: 470000}); 
};
