// GovernanceToken.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "./GovernanceToken.sol";

// interface IPUSHCommInterface {
//     function sendNotification(address _channel, address _recipient, bytes calldata _identity) external;
// }

contract UserSide {
    address public userSideAdmin;
    uint256 public totalUsers = 0;
    uint256 public totalProposals = 0;
    uint256 public totalDaos = 0;

    //for push notifications
    // address EPNS_COMM_ADDRESS= 0xb3971BCef2D791bc4027BbfedFb47319A4AAaaAa; //address for sepolia

    constructor() {
        userSideAdmin = msg.sender;
    }

    struct proposal {
        uint256 proposalId;
        string proposalTitle;
        string proposalDesription;
        uint256 proposer;
        uint256 votingThreshold;
        uint256 proposalStage;
        // stage 0: Voting not started
        // stage 1: Voting in progress
        // stage 2: Voting closed (Results are out)
        uint256 daoId;
        address governanceTokenAddress; // address of the token to be used for governance
    }

    struct user {
        uint256 userId;
        string userName;
        string userEmail;
        string description;
        string profileImage;
        address userWallet;
    }

    struct dao {
        uint256 daoId;
        uint256 creator;
        string daoName;
        string daoDescription;
        //uint256[] daoMembers;
        //uint256[] proposalArray;
        uint256 joiningThreshold;
        address joiningTokenAddress;
        bool isPrivate;
    }

    mapping(uint256 => user) public userIdtoUser;
    mapping(uint256 => dao) public daoIdtoDao;
    mapping(uint256 => proposal) public proposalIdtoproposal;
    mapping(address => uint256) public userWallettoUser;

    mapping(uint256 => uint256[]) public daoIdtoMembers; // members of a dao
    mapping(uint256 => uint256[]) public daoIdtoProposals; //proposals in a dao

    mapping(uint256 => uint256[]) public proposalIdtoSupporters; //supporters for a proposal
    mapping(uint256 => uint256[]) public proposalIdtoOpposers; //opposers for a proposal

    mapping(uint256 => uint256[]) public userIdtoDaoId; // all daos in which, the user is involved
    mapping(uint256 => mapping(uint256 => uint256)) public userIdtoDaoIdtorole;

    // role 1: Admin
    // role 2: has right to propose
    // role 3: has right to vote only

    function createUser(
        string memory _userName,
        string memory _userEmail,
        string memory _description,
        string memory _profileImage,
        address _userWalletAddress
    ) public {
        totalUsers++;
        user memory u1 = user(
            totalUsers,
            _userName,
            _userEmail,
            _description,
            _profileImage,
            _userWalletAddress
        );
        userIdtoUser[totalUsers] = u1;
        userWallettoUser[_userWalletAddress] = totalUsers;
        // IPUSHCommInterface(EPNS_COMM_ADDRESS).sendNotification(
        //     0xaE93A422CB100d43f0F6bc5F0a8322119FD74385, // from channel - recommended to set channel via dApp and put it's value -> then once contract is deployed, go back and add the contract address as delegate for your channel
        //     _userWalletAddress, // to recipient, put address(this) in case you want Broadcast or Subset. For targeted put the address to which you want to send
        //     bytes(
        //         string(
        //             // We are passing identity here: https://push.org/docs/notifications/notification-standards/notification-standards-advance/#notification-identity
        //             abi.encodePacked(
        //                 "0", // this represents minimal identity, learn more: https://push.org/docs/notifications/notification-standards/notification-standards-advance/#notification-identity
        //                 "+", // segregator
        //                 "3", // define notification type:  https://push.org/docs/notifications/build/types-of-notification (1, 3 or 4) = (Broadcast, targeted or subset)
        //                 "+", // segregator
        //                 "Your account was created", // this is notification title
        //                 "+", // segregator
        //                 "You are now part of the system" // notification body
        //             )
        //         )
        //     )
        // );
    }

    function updateUser(
        uint256 _userId,
        string memory _userName,
        string memory _userEmail,
        string memory _description,
        string memory _profileImage,
        address _userWallet
    ) public {
        user memory u1 = user(
            _userId,
            _userName,
            _userEmail,
            _description,
            _profileImage,
            _userWallet
        );
        userIdtoUser[_userId] = u1;
        userWallettoUser[_userWallet] = totalUsers;
    }

    function createDao(
        string memory _daoName,
        string memory _daoDescription,
        uint256 _joiningThreshold,
        address _joiningTokenAddress,
        bool _isPrivate,
        address _userWalletAddress
    ) public {
        totalDaos++;
        uint256 creatorId = userWallettoUser[_userWalletAddress];
        require(creatorId != 0, "User is not registered into the system");
        dao memory d1 = dao(
            totalDaos,
            creatorId,
            _daoName,
            _daoDescription,
            _joiningThreshold,
            _joiningTokenAddress,
            _isPrivate
        );
        daoIdtoDao[totalDaos] = d1;
        userIdtoDaoIdtorole[creatorId][totalDaos] = 1; // admin role
        daoIdtoMembers[totalDaos].push(creatorId);
        userIdtoDaoId[creatorId].push(totalDaos);
    }

    function updateDao(
        uint256 _daoId,
        string memory _daoName,
        string memory _daoDescription,
        uint256 _joiningThreshold,
        address _joiningTokenAddress,
        bool _isPrivate,
        address _userWalletAddress
    ) public {
        uint256 tempCreatorId = userWallettoUser[_userWalletAddress];
        require(
            tempCreatorId == daoIdtoDao[_daoId].creator,
            "Only owner of the dao can change the dao Information"
        );
        dao memory d1 = dao(
            _daoId,
            tempCreatorId,
            _daoName,
            _daoDescription,
            _joiningThreshold,
            _joiningTokenAddress,
            _isPrivate
        );
        daoIdtoDao[_daoId] = d1;
    }

    function createProposal(
        string memory _proposalTitle,
        string memory _proposalDescription,
        uint256 _votingThreshold,
        uint256 _daoId,
        address _governanceTokenAddress,
        address _userWalletAddress
    ) public {
        totalProposals++;
        uint256 tempProposerId = userWallettoUser[_userWalletAddress];
        uint256 tempProposerRole = userIdtoDaoIdtorole[tempProposerId][_daoId];
        require(tempProposerRole != 3, "Voters cannot propose");
        proposal memory p1 = proposal(
            totalProposals,
            _proposalTitle,
            _proposalDescription,
            tempProposerId,
            _votingThreshold,
            0,
            _daoId,
            _governanceTokenAddress
        );
        proposalIdtoproposal[totalProposals] = p1;
        daoIdtoProposals[_daoId].push(totalProposals);
    }

    function promoteUser(
        uint256 _userId,
        uint256 _daoId,
        address _userWalletAddress
    ) public {
        uint256 callerUserId = userWallettoUser[_userWalletAddress];
        uint256 callerRole = userIdtoDaoIdtorole[callerUserId][_daoId];
        require(callerRole == 1, "Only admin can promote users");
        userIdtoDaoIdtorole[_userId][_daoId] = 2; // giving right to propose
    }

    function addMembertoDao(
        uint256 _daoId,
        address _userWalletAddress,
        address _adminWalletAddress
    ) public {
        uint256 tempUserId = userWallettoUser[_adminWalletAddress];
        uint256 tempUserRole = userIdtoDaoIdtorole[tempUserId][_daoId];
        require(tempUserRole == 1, "Only admin can add users to the dao");
        uint256 newUserId = userWallettoUser[_userWalletAddress];
        require(newUserId > 0, "User is not registered into the system");
        daoIdtoMembers[_daoId].push(newUserId);
        userIdtoDaoIdtorole[newUserId][_daoId] = 3; // give voting rights only
        userIdtoDaoId[newUserId].push(_daoId);
    }

    function joinDao(uint256 _daoId, address _callerWalletAddress) public {
        require(daoIdtoDao[_daoId].isPrivate == false, "Dao is Private");
        //require(balanceOf(msg.sender) >= daoIdtoDao[_daoId].joiningThreshold,"Not enough tokens");
        address tempTokenAddress = daoIdtoDao[_daoId].joiningTokenAddress;
        GovernanceToken govtToken = GovernanceToken(tempTokenAddress);
        uint256 userBalance = govtToken.balanceOf(_callerWalletAddress);
        require(
            userBalance >= daoIdtoDao[_daoId].joiningThreshold,
            "Not enough Tokens"
        );
        uint256 newUserId = userWallettoUser[_callerWalletAddress];
        require(newUserId > 0, "User is not registered into the system");
        daoIdtoMembers[_daoId].push(newUserId);
        userIdtoDaoIdtorole[newUserId][_daoId] = 3; // give voting rights only
        userIdtoDaoId[newUserId].push(_daoId);
    }

    function openVoting(
        uint256 _proposalId,
        address _callerWalletAddress
    ) public {
        //require(msg.sender == tokenOwner,"Only admin can start voting process");
        uint256 proposalDao = proposalIdtoproposal[_proposalId].daoId;
        uint256 tempUserId = userWallettoUser[_callerWalletAddress];
        uint256 tempUserRole = userIdtoDaoIdtorole[tempUserId][proposalDao];
        require(tempUserRole == 1, "Only admin start the voting process");
        proposalIdtoproposal[_proposalId].proposalStage = 1;
    }

    function closeVoting(
        uint256 _proposalId,
        address _callerWalletAddress
    ) public {
        //require(msg.sender == tokenOwner,"Only admin can stop voting process");
        uint256 proposalDao = proposalIdtoproposal[_proposalId].daoId;
        uint256 tempUserId = userWallettoUser[_callerWalletAddress];
        uint256 tempUserRole = userIdtoDaoIdtorole[tempUserId][proposalDao];
        require(tempUserRole == 1, "Only admin start the voting process");
        proposalIdtoproposal[_proposalId].proposalStage = 2;
    }

    function checkMembership(
        uint256 _daoId,
        address _callerWalletAddress
    ) public view returns (bool) {
        uint256 tempUserId = userWallettoUser[_callerWalletAddress];
        uint256 totalMembers = daoIdtoMembers[_daoId].length;
        for (uint256 i = 0; i < totalMembers; i++) {
            if (tempUserId == daoIdtoMembers[_daoId][i]) {
                return true;
            }
        }
        return false;
    }

    function voteForProposal(
        uint256 _proposalId,
        bool _voteFor,
        address _callerWalletAddress
    ) public {
        address funcCaller = _callerWalletAddress;
        uint256 tempDaoId = proposalIdtoproposal[_proposalId].daoId;
        require(
            checkMembership(tempDaoId, _callerWalletAddress),
            "Only members of the can vote"
        );
        uint256 tempProposalStage = proposalIdtoproposal[_proposalId]
            .proposalStage;
        require(
            tempProposalStage == 1,
            "Voting is either not started or its already over"
        );
        //uint256 tempVotingthreshold = proposalIdtoproposal[_proposalId].votingThreshold;
        address votingTokenAddress = proposalIdtoproposal[_proposalId]
            .governanceTokenAddress;
        GovernanceToken govtToken = GovernanceToken(votingTokenAddress);
        uint256 userBalance = govtToken.balanceOf(msg.sender);
        require(
            userBalance >= proposalIdtoproposal[_proposalId].votingThreshold,
            "Not enough Tokens"
        );
        //require(balanceOf(msg.sender) >= tempVotingthreshold,"Not enough tokens");
        uint256 tempUserId = userWallettoUser[msg.sender];
        //govtToken.approve(address(this), proposalIdtoproposal[_proposalId].votingThreshold);
        govtToken.transferFrom(
            funcCaller,
            address(this),
            proposalIdtoproposal[_proposalId].votingThreshold
        );
        if (_voteFor) {
            proposalIdtoSupporters[_proposalId].push(tempUserId);
        } else {
            proposalIdtoOpposers[_proposalId].push(tempUserId);
        }
    }

    function buyTokens(uint256 _transferrableTokens) public payable {
        // price of one token = 50 rupees = 0.00027 ETH
        // uint256 transferredValue = msg.value;
        // uint256 conversionFactor = 270000000000000;
        // uint256 neededTokens = transferredValue / conversionFactor;
        //transfer(msg.sender,_transferrableTokens);
    }

    // function getBalanceVotes(uint256 _proposalId) public view returns(uint256) {
    //     uint256 tempVotingthreshold = proposalIdtoproposal[_proposalId].votingThreshold;
    //     return balanceOf(msg.sender) / tempVotingthreshold;
    // }

    function getTotalDaoMembers(uint256 _daoId) public view returns (uint256) {
        return daoIdtoMembers[_daoId].length;
    }

    function getTotalProposals(uint256 _daoId) public view returns (uint256) {
        return daoIdtoProposals[_daoId].length;
    }

    function getDaoMemberId(
        uint256 _daoId,
        uint256 _index
    ) public view returns (uint256) {
        return daoIdtoMembers[_daoId][_index];
    }

    function getDaoProposalId(
        uint256 _daoId,
        uint256 _index
    ) public view returns (uint256) {
        return daoIdtoProposals[_daoId][_index];
    }

    function getTotalSupportVotes(
        uint256 _proposalId
    ) public view returns (uint256) {
        return proposalIdtoSupporters[_proposalId].length;
    }

    function getTotalOppositionVotes(
        uint256 _proposalId
    ) public view returns (uint256) {
        return proposalIdtoOpposers[_proposalId].length;
    }

    function getTotalVotes(uint256 _proposalId) public view returns (uint256) {
        return
            getTotalSupportVotes(_proposalId) +
            getTotalOppositionVotes(_proposalId);
    }

    function getSupporterId(
        uint256 _proposalId,
        uint256 _index
    ) public view returns (uint256) {
        return proposalIdtoSupporters[_proposalId][_index];
    }

    function getOpposerId(
        uint256 _proposalId,
        uint256 _index
    ) public view returns (uint256) {
        return proposalIdtoOpposers[_proposalId][_index];
    }
}
