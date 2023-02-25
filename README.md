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
#### Scenario 2 - 6 voters (5 votes)  - 7 proposals - 2 winner (only 1st winner is kept)

