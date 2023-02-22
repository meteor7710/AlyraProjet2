const Voting = artifacts.require("./Voting.sol");
const { BN, constants, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');




contract("Voting", accounts => {

    const _owner = accounts[0];
    const _voter1 = accounts[1];
    const _voter2 = accounts[2];
    const _voter3 = accounts[3];
    const _voter4 = accounts[4];
    const _voter5 = accounts[5];
    const _voter6 = accounts[6];
    const _noneVoter = accounts[9];


    let votingInstance;

    beforeEach(async function () {
        votingInstance = await Voting.new({ from: _owner });
    });


    //Initial state variables tests
    describe("State variables tests", () => {

        it("has started winningProposalID to 0", async () => {
            expect(await votingInstance.winningProposalID()).to.be.bignumber.equal("0");
        });

        it("has started workflowStatus to RegisteringVoters(0)", async () => {
            expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal("0");
        });

        /*it('test initial stage', async () => {
            expect((await this.votingInstance.workflowStatus.call()).toString()).to.equal(votingInstance.WorkflowStatus.RegisteringVoters.toString());
        });
        https://ethereum.stackexchange.com/questions/29344/truffle-testing-enum-values*/
    })



    //Getters tests
    describe("Getters tests", () => {
        it("only voters can request voter informations", async () => {
            await votingInstance.addVoter(_voter1, { from: _owner });
            let voter1;
            await expectRevert(voter1 = votingInstance.getVoter.call(_voter1, { from: _noneVoter }), "You're not a voter");
            expect(await (voter1 = votingInstance.getVoter.call(_voter1, { from: _voter1 })));
        });
        it("only voters can request proposal informations", async () => {
            await votingInstance.addVoter(_voter1, { from: _owner });
            await votingInstance.startProposalsRegistering({ from: _owner })
            let proposal;
            await expectRevert(proposal = votingInstance.getOneProposal.call(0, { from: _noneVoter }), "You're not a voter");
            expect(await (proposal = votingInstance.getOneProposal.call(0, { from: _voter1 })));
        });
    })



    //Workflow status change
    describe("STATE tests", () => {

        // RegisteringVoters status tests
        describe("Change from RegisteringVoters to other tests", () => {
            it("owner can change status from RegisteringVoters to ProposalsRegistrationStarted", async () => {
                expect(await votingInstance.startProposalsRegistering({ from: _owner }));
            });

            it("None owner can't change status from RegisteringVoters to ProposalsRegistrationStarted", async () => {
                await expectRevert(votingInstance.startProposalsRegistering({ from: _voter1 }), 'Ownable: caller is not the owner');
            });

            it("change status from RegisteringVoters to ProposalsRegistrationStarted change workflowStatus to 1", async () => {
                await votingInstance.startProposalsRegistering({ from: _owner });
                expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal("1");
            });

            it("change status from RegisteringVoters to VotingSessionStarted is not possible", async () => {
                await expectRevert(votingInstance.startVotingSession({ from: _owner }), 'Registering proposals phase is not finished');
            });

            it("event is correctly emmited when changed status to ProposalsRegistrationStarted", async () => {
                const changeStatus = await votingInstance.startProposalsRegistering({ from: _owner });
                await expectEvent(changeStatus, "WorkflowStatusChange", { previousStatus: BN(0), newStatus: BN(1) });
            });
        });

        // ProposalsRegistrationStarted status tests
        describe("Change from ProposalsRegistrationStarted to other tests", () => {

            beforeEach(async function () {
                await votingInstance.addVoter(_voter1, { from: _owner })
                await votingInstance.startProposalsRegistering({ from: _owner });
            });

            it("default GENESIS proposal with ID 0 is created", async () => {
                let proposal;
                proposal = await votingInstance.getOneProposal(0,{ from: _voter1 });
                expect(proposal.description).to.equal("GENESIS");
            });

            it("owner can change status from ProposalsRegistrationStarted to ProposalsRegistrationEnded", async () => {
                expect(await votingInstance.endProposalsRegistering({ from: _owner }));
            });

            it("None owner can't change status from ProposalsRegistrationStarted to ProposalsRegistrationEnded", async () => {
                await expectRevert(votingInstance.endProposalsRegistering({ from: _voter1 }), 'Ownable: caller is not the owner');
            });

            it("change status from ProposalsRegistrationStarted to ProposalsRegistrationEnded change workflowStatus to 2", async () => {
                await votingInstance.endProposalsRegistering({ from: _owner });
                expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal("2");
            });

            it("change status from ProposalsRegistrationStarted to VotingSessionStarted is not possible", async () => {
                await expectRevert(votingInstance.startVotingSession({ from: _owner }), 'Registering proposals phase is not finished');
            });

            it("event is correctly emmited when changed status to ProposalsRegistrationStarted", async () => {
                const changeStatus = await votingInstance.endProposalsRegistering({ from: _owner });
                await expectEvent(changeStatus, "WorkflowStatusChange", { previousStatus: BN(1), newStatus: BN(2) });
            });
        });

        // ProposalsRegistrationEnded status tests
        describe("Change from ProposalsRegistrationEnded to other tests", () => {

            beforeEach(async function () {
                await votingInstance.startProposalsRegistering({ from: _owner });
                await votingInstance.endProposalsRegistering({ from: _owner });

            });

            it("owner can change status from ProposalsRegistrationEnded to startVotingSession", async () => {
                expect(await votingInstance.startVotingSession({ from: _owner }));
            });

            it("None owner can't change status from ProposalsRegistrationEnded to startVotingSession", async () => {
                await expectRevert(votingInstance.startVotingSession({ from: _voter1 }), 'Ownable: caller is not the owner');
            });

            it("change status from ProposalsRegistrationEnded to startVotingSession change workflowStatus to 3", async () => {
                await votingInstance.startVotingSession({ from: _owner });
                expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal("3");
            });

            it("change status from ProposalsRegistrationEnded to VotingSessionEnded is not possible", async () => {
                await expectRevert(votingInstance.endVotingSession({ from: _owner }), 'Voting session havent started yet');
            });

            it("event is correctly emmited when changed status to startVotingSession", async () => {
                const changeStatus = await votingInstance.startVotingSession({ from: _owner });
                await expectEvent(changeStatus, "WorkflowStatusChange", { previousStatus: BN(2), newStatus: BN(3) });
            });
        });

        // VotingSessionStarted status tests
        describe("Change from VotingSessionStarted to other tests", () => {

            beforeEach(async function () {
                await votingInstance.startProposalsRegistering({ from: _owner });
                await votingInstance.endProposalsRegistering({ from: _owner });
                await votingInstance.startVotingSession({ from: _owner });
            });

            it("owner can change status from startVotingSession to VotingSessionEnded", async () => {
                expect(await votingInstance.endVotingSession({ from: _owner }));
            });

            it("None owner can't change status from startVotingSession to VotingSessionEnded", async () => {
                await expectRevert(votingInstance.endVotingSession({ from: _voter1 }), 'Ownable: caller is not the owner');
            });

            it("change status from startVotingSession to VotingSessionEnded change workflowStatus to 4", async () => {
                await votingInstance.endVotingSession({ from: _owner });
                expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal("4");
            });

            it("change status from startVotingSession to ProposalsRegistrationEnded is not possible", async () => {
                await expectRevert(votingInstance.endProposalsRegistering({ from: _owner }), 'Registering proposals havent started yet');
            });

            it("event is correctly emmited when changed status to VotingSessionEnded", async () => {
                const changeStatus = await votingInstance.endVotingSession({ from: _owner });
                await expectEvent(changeStatus, "WorkflowStatusChange", { previousStatus: BN(3), newStatus: BN(4) });
            });
        });

        // VotingSessionEnded status tests
        describe("Change from VotingSessionEnded to other tests", () => {

            beforeEach(async function () {
                await votingInstance.addVoter(_voter1, { from: _owner });
                await votingInstance.startProposalsRegistering({ from: _owner });
                await votingInstance.addProposal("proposal1",{ from: _voter1 })
                await votingInstance.endProposalsRegistering({ from: _owner });
                await votingInstance.startVotingSession({ from: _owner });
                await votingInstance.setVote(1,{ from: _voter1 });
                await votingInstance.endVotingSession({ from: _owner });
            });

            it("owner can change status from VotingSessionEnded to VotesTallied", async () => {
                expect(await votingInstance.tallyVotes({ from: _owner }));
            });

            it("None owner can't change status from VotingSessionEnded to VotesTallied", async () => {
                await expectRevert(votingInstance.tallyVotes({ from: _voter1 }), 'Ownable: caller is not the owner');
            });

            it("change status from VotingSessionEnded to VotesTallied change workflowStatus to 5", async () => {
                await votingInstance.tallyVotes({ from: _owner });
                expect(await votingInstance.workflowStatus.call()).to.be.bignumber.equal("5");
            });

            it("change status from VotingSessionEnded to ProposalsRegistrationEnded is not possible", async () => {
                await expectRevert(votingInstance.endProposalsRegistering({ from: _owner }), 'Registering proposals havent started yet');
            });

            it("event is correctly emmited when changed status to VotesTallied", async () => {
                const changeStatus = await votingInstance.tallyVotes({ from: _owner });
                await expectEvent(changeStatus, "WorkflowStatusChange", { previousStatus: BN(4), newStatus: BN(5) });
            });

            it("votes are correctly tallied with 1 vote 1 proposal", async () =>{
                await votingInstance.tallyVotes({ from: _owner })
                expect(await votingInstance.winningProposalID()).to.be.bignumber.equal("1");
            });
        });

        // VotesTallied status tests
        describe("Change from VotesTallied to other tests", () => {
            it("change status from VotesTallied to ProposalsRegistrationStarted is not possible", async () => {
                await votingInstance.startProposalsRegistering({ from: _owner });
                await votingInstance.endProposalsRegistering({ from: _owner });
                await votingInstance.startVotingSession({ from: _owner });
                await votingInstance.endVotingSession({ from: _owner });
                await votingInstance.tallyVotes({ from: _owner });
                await expectRevert(votingInstance.startProposalsRegistering({ from: _owner }), 'Registering proposals cant be started now');
            });

        });





    });



    //Add voter tests
    describe("Registration tests", () => {
        it("owner can add voter", async () => {
            expect(await votingInstance.addVoter(_voter1, { from: _owner }));
        });

        it("other than owner can't add voter", async () => {
            await expectRevert(votingInstance.addVoter(_voter2, { from: _voter1 }), 'Ownable: caller is not the owner');
        });

        it("can not add voter when state is not RegisteringVoters", async () => {
            await votingInstance.startProposalsRegistering({ from: _owner });
            await expectRevert(votingInstance.addVoter(_voter1, { from: _owner }), 'Voters registration is not open yet');
        });

        it("voter isRegistered is set true when a voter is added", async () => {
            await votingInstance.addVoter(_voter1, { from: _owner });
            const voter1 = await votingInstance.getVoter.call(_voter1, { from: _voter1 });
            expect(voter1.isRegistered).to.be.true;
        });

        it("voter can be added only one time", async () => {
            await votingInstance.addVoter(_voter1, { from: _owner });
            await expectRevert(votingInstance.addVoter(_voter1, { from: _owner }), 'Already registered');
        });

        it("event is correctly emmited when added voter", async () => {
            const vote = await votingInstance.addVoter(_voter1, { from: _owner });
            await expectEvent(vote, "VoterRegistered", { voterAddress: _voter1 });
        });
    });

});