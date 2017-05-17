pragma solidity ^0.4.0;
contract Ballot {

    struct Voter {
        uint weight;
        bool voted;
        bytes32 vote;
        address delegate;
    }
    // struct Proposal {
    //     uint voteCount;
    // }

    address chairperson;
    mapping(address => Voter) voters;

    bytes32[] public proposals;
    mapping (bytes32 => uint) public votesReceived;
    // Proposal[] proposals;

    

    /// Create a new ballot with $(_numProposals) different proposals.
    function Ballot(bytes32[] _proposalNames) {
        chairperson = msg.sender;
        voters[chairperson].weight = 1;
        proposals = _proposalNames ;
    }

    /// Give $(voter) the right to vote on this ballot.
    /// May only be called by $(chairperson).
    function giveRightToVote(address voter) {
        if (msg.sender != chairperson || voters[voter].voted) return;
        voters[voter].weight = 1;
    }

    /// Delegate your vote to the voter $(to).
    function delegate(address to) {
        Voter sender = voters[msg.sender]; // assigns reference
        if (sender.voted) return;
        while (voters[to].delegate != address(0) && voters[to].delegate != msg.sender)
            to = voters[to].delegate;
        if (to == msg.sender) return;
        sender.voted = true;
        sender.delegate = to;
        Voter delegate = voters[to];
        if (delegate.voted){
            // proposals[delegate.vote].voteCount += sender.weight;
            votesReceived[delegate.vote] += votesReceived[delegate.vote]+sender.weight; 
        }
        else
            delegate.weight += sender.weight;
    }

    /// Give a single vote to proposal $(proposal).
    function vote(bytes32 proposal) {
        Voter sender = voters[msg.sender];
        if (sender.voted) return;
        sender.voted = true;
        sender.vote = proposal;
        // proposals[proposal].voteCount += sender.weight;
		votesReceived[proposal] = votesReceived[proposal]+sender.weight; 
    }
    
     // This function returns the total votes a candidate has received so far
  function totalVotesFor(bytes32 proposal) returns (uint) {
  //  if (validCandidate(candidate) == false) throw;
    return votesReceived[proposal];
  }
    

    function winningProposal() constant returns (bytes32 winningProposal) {
        uint256 winningVoteCount = 0;
        for (uint8 proposal = 0; proposal < proposals.length; proposal++)
            if (votesReceived[proposals[proposal]] > winningVoteCount) {
                winningVoteCount = votesReceived[proposals[proposal]];
                winningProposal = proposals[proposal];
            }
    }
}