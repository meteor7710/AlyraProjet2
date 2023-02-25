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
#### Getters function test
#### States function tests
##### Change from RegisteringVoters to other tests
##### Change from ProposalsRegistrationStarted to other tests
##### Change from ProposalsRegistrationEnded to other tests
##### Change from VotingSessionStarted to other tests
##### Change from VotingSessionEnded to other tests
##### Change from VotesTallied to other tests
#### Registration function tests
#### Proposal function tests
#### Vote function tests
### Voting scenarios tests
#### Scenario 1 - 4 voters  - 3 proposals - 1 winner
In this Scenario we will have 4 voters. Voter 1 submits 2 proposals and voter 2 the third proposals. Voters 1,2 and 3 vote for proposal 2 and voter 4 votes for proposal 3. We validates that proposal 2 is the winner and that all voters data and proposals data are correctly updated.
#### Scenario 2 - 6 voters (5 votes)  - 7 proposals - 2 winners
In this Scenario we will have 6 voters. Voter 1 submits 4 proposals. Voter 2,5,6 submit each one a proposal. Voters 1 and 2 vote for proposal 1. Voter 3 vote for proposal 2.  Voter 4 and 6 vote for proposal 6. Voter 5 doesn't votes. We validates that proposal 1 is the winner even if proposal 6 as the same vote count. The tallyVotes function keep only the first winner in case equality. The we will check that all voters data and proposals data are correctly updated.

