# Project Alyra 2
This document describes the second Project we have to do for the Alyra for the Blockchain Develloper training.
## Overview
In this this project we have to implement automatic tests based on the contract Voting.sol done during the first project. For this, we will use:
* Truffle suite
    * Truffle
    * Ganache
    * HDWallet
* Mocha test framework
* Chai assertion library
* Openzeppelin test helpers assertion library
* Solc compiler
## Voting.sol
This contract was given by Alyra and can not be modified. It implements a vote session for authorized used. During the vote session, authorized users can submit proposals and then vote for the one they prefer. At the end the administrator close the session and voters can check results.
## Tests
In this section we will detail the differents tests done to validate the contract. Tests will be divided in :
* Basic Tests
* Scenario Tests
### Basic Tests
In this section we will review the basics tests done to validate the different functions and simple expected behaviors.
#### Intial state variables tests
We tests in this part the expected variable values just after the contract creation. This includes:
* has started winningProposalID to 0 : at creation the winning proposal ID must be set to 0.
* has started workflowStatus to RegisteringVoters(0) : at creation the vote session should start with the first workflowstatus "RegisteringVoters(0)".
#### Getters function test
We verify that getters access are working correctly.
* only voters can request voter informations : only users registered as voters can request voter informations.
* only voters can request proposal informations: only users registered as voters can request proposal informations.
#### States function tests
##### Change from RegisteringVoters to other tests
##### Change from ProposalsRegistrationStarted to other tests
##### Change from ProposalsRegistrationEnded to other tests
##### Change from VotingSessionStarted to other tests
##### Change from VotingSessionEnded to other tests
##### Change from VotesTallied to other tests
#### Registration function tests
Validate with the following tests the whitelist registration function.
* owner can add voter : the contract owner can add a voter.
* non-owner can't add voter :  non-owner users can't add a voter.
* can not add voter when state is not RegisteringVoters : owner can't add voter if the state is not RegisteringVoters (we test only one other state).
* voter isRegistered is set true when a voter is added : verify when the voter is added that the structure attribute isRegistered is set to true.
* voter can be added only one time : verify that a voter can not be added twice to the whitelist.
* event is correctly emmited when added voter : check that the VoterRegistered event is correcly emit with appropriates values when the owner register a voter.
#### Proposal function tests
Validate with the following tests the proposal submission function.
* voter can add proposal : verify that voters can submit proposal.
* voter can add several proposals : verify that a voter can submit .several proposals.
* non-voter can't add proposal : validate that non-voter can't submit proposals.
* can not add a proposal when state is not ProposalsRegistrationStarted : voter can't add a proposal if the state is not ProposalsRegistrationStarted (we test only one other state).
* proposal can not be empty : verify that the proposal description can't be empty.
* proposals descriptions are correctly stored : verify that a dummy proposal with ID O and description "GENESIS" is automatically created. Then create 2 voter proposals and verify they are correctly stored.
* event is correctly emmited when proposal is submitted : check that the ProposalRegistered event is correcly emit with appropriates values when a voter register a proposal.
#### Vote function tests
Validate with the following tests the vote submission function.
* voter can vote : validate that voters can vote.
* non-voter can't vote : verify that non-voter can't vote.
* can not vote when state is not VotingSessionStarted : voter can't vote if the state is not VotingSessionStarted (we test only one other state).
* voter can vote only 1 time : validate that voter can vote only one time.
* voter can only vote for existing proposal : verify that voters can not vote for a proposal that doesn't exist.
* voter votedProposalId is set to proposal ID when he has voted : verify that the voter votedProposalId is correctly updated after a vote.
* voter hasVoted is set true when he has voted : verify that the voter hasVoted is correctly updated after a vote.
* proposal voteCount is incremented  when a voter has voted it : verify that the proposal voteCount is correctly updated after a vote.
* event is correctly emmited when proposal is submitted : check that the Voted event is correcly emit with appropriates values when a voter votes.
### Voting scenarios tests
In this section we will review complete scenarios from voters add to votes results. 
#### Scenario 1 - 4 voters  - 3 proposals - 1 winner
In this Scenario we will have 4 voters. Voter 1 submits 2 proposals and voter 2 the third proposals. Voters 1,2 and 3 vote for proposal 2 and voter 4 votes for proposal 3. We validates that proposal 2 is the winner and that all voters data and proposals data are correctly updated.
#### Scenario 2 - 6 voters (5 votes)  - 7 proposals - 2 winners
In this Scenario we will have 6 voters. Voter 1 submits 4 proposals. Voter 2,5,6 submit each one a proposal. Voters 1 and 2 vote for proposal 1. Voter 3 vote for proposal 2.  Voter 4 and 6 vote for proposal 6. Voter 5 doesn't votes. We validates that proposal 1 is the winner even if proposal 6 as the same vote count. The tallyVotes function keep only the first winner in case equality. Then we will check that all voters data and proposals data are correctly updated.

