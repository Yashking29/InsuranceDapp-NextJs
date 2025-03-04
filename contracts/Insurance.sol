// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DecentralizedInsurance
 * @dev A smart contract for managing insurance policies and claims in a decentralized manner
 */
contract DecentralizedInsurance {
    // Custom error declarations for gas-efficient error handling
    error NotAuthorized();
    error InvalidAmount();
    error InsufficientFunds();
    error PolicyNotFound();
    error ClaimNotFound();
    error PolicyNotActive();
    error ClaimNotActive();
    error NotPolicyOwner();
    error ClaimAlreadyProcessed();
    error ClaimExceedsCoverage();
    error PolicyLimitReached();
    error PolicyExpired();
    error InvalidPolicy();
    error PaymentFailed();

    // Constants
    uint256 public constant MAX_POLICIES_PER_USER = 5;
    uint256 public constant MAX_COVERAGE_MULTIPLIER = 10; // Coverage can be at most 10x premium
    uint256 public constant POLICY_DURATION = 365 days;
    uint256 public constant CLAIM_WINDOW = 30 days; // Time window to process claims

    // Structs
    struct Policy {
        uint256 id;
        address policyHolder;
        uint256 premium;
        uint256 coverageAmount;
        bool isActive;
        uint256 createdAt; // Timestamp when policy was created
        uint256 expiresAt; // Timestamp when policy expires
        uint256 claimCount; // Number of claims made against this policy
        PolicyType policyType; // Type of insurance policy
    }

    struct Claim {
        uint256 id;
        uint256 policyId;
        address payable claimant;
        uint256 claimAmount;
        ClaimStatus status;
        string description; // Reason for the claim
        uint256 submittedAt; // Timestamp when claim was submitted
        uint256 processedAt; // Timestamp when claim was processed
        bytes evidence; // IPFS hash or other reference to claim evidence
    }

    // Enums for more structured data
    enum PolicyType { Health, Property, Life, Vehicle, Travel }
    enum ClaimStatus { Pending, Approved, Rejected, Cancelled }

    // State variables
    address public owner;
    address public policyManager; // Additional role for policy management
    uint256 public policyCounter;
    uint256 public claimCounter;
    uint256 public totalPremiumsCollected;
    uint256 public totalClaimsPaid;
    bool public contractPaused;

    // Mappings
    mapping(uint256 => Policy) public policies;
    mapping(uint256 => Claim) public claims;
    mapping(address => uint256[]) public userPolicies;
    mapping(uint256 => uint256[]) public policyClaims; // Maps policy IDs to their claim IDs
    mapping(address => bool) public authorizedAssessors; // For multi-sig claim approval
    mapping(address => mapping(uint256 => bool)) public claimVotes; // Tracks assessor votes on claims

    // Events
    event PolicyCreated(uint256 indexed policyId, address indexed policyHolder, uint256 premium, uint256 coverage, PolicyType policyType);
    event PolicyRenewed(uint256 indexed policyId, uint256 newExpiryDate);
    event PolicyCancelled(uint256 indexed policyId, address indexed policyHolder, uint256 refundAmount);
    event ClaimSubmitted(uint256 indexed claimId, uint256 indexed policyId, address indexed claimant, uint256 claimAmount, string description);
    event ClaimStatusUpdated(uint256 indexed claimId, ClaimStatus status, string reason);
    event ClaimApproved(uint256 indexed claimId, uint256 indexed policyId, uint256 payoutAmount);
    event ClaimRejected(uint256 indexed claimId, uint256 indexed policyId, string reason);
    event AssessorAdded(address indexed assessor);
    event AssessorRemoved(address indexed assessor);
    event ContractPaused(address indexed by);
    event ContractUnpaused(address indexed by);
    event FundsWithdrawn(address indexed to, uint256 amount);
    event FundsDeposited(address indexed from, uint256 amount);

    // Modifiers
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotAuthorized();
        _;
    }

    modifier onlyAuthorized() {
        if (msg.sender != owner && msg.sender != policyManager) revert NotAuthorized();
        _;
    }

    modifier onlyAssessor() {
        if (!authorizedAssessors[msg.sender] && msg.sender != owner) revert NotAuthorized();
        _;
    }

    modifier whenNotPaused() {
        if (contractPaused) revert("Contract is paused");
        _;
    }

    modifier policyExists(uint256 _policyId) {
        if (_policyId == 0 || _policyId > policyCounter) revert PolicyNotFound();
        if (policies[_policyId].policyHolder == address(0)) revert PolicyNotFound();
        _;
    }

    modifier claimExists(uint256 _claimId) {
        if (_claimId == 0 || _claimId > claimCounter) revert ClaimNotFound();
        if (claims[_claimId].claimant == address(0)) revert ClaimNotFound();
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        policyManager = msg.sender; // Initially, owner is also the policy manager
    }

    /**
     * @notice Create a new insurance policy by paying the premium
     * @param _coverageAmount The maximum amount that can be claimed
     * @param _policyType The type of insurance policy
     * @param _duration Optional custom duration in days (0 for default)
     */
    function createPolicy(
        uint256 _coverageAmount, 
        PolicyType _policyType,
        uint256 _duration
    ) external payable whenNotPaused {
        // Input validation
        if (msg.value <= 0) revert InvalidAmount();
        if (_coverageAmount <= 0) revert InvalidAmount();
        if (_coverageAmount > msg.value * MAX_COVERAGE_MULTIPLIER) revert("Coverage too high for premium");
        if (userPolicies[msg.sender].length >= MAX_POLICIES_PER_USER) revert PolicyLimitReached();

        // Calculate expiry date
        uint256 duration = _duration > 0 ? _duration * 1 days : POLICY_DURATION;
        uint256 expiryDate = block.timestamp + duration;

        // Create the policy
        policyCounter++;
        policies[policyCounter] = Policy({
            id: policyCounter,
            policyHolder: msg.sender,
            premium: msg.value,
            coverageAmount: _coverageAmount,
            isActive: true,
            createdAt: block.timestamp,
            expiresAt: expiryDate,
            claimCount: 0,
            policyType: _policyType
        });

        // Update user's policies and total premiums
        userPolicies[msg.sender].push(policyCounter);
        totalPremiumsCollected += msg.value;

        emit PolicyCreated(policyCounter, msg.sender, msg.value, _coverageAmount, _policyType);
    }

    /**
     * @notice Submit an insurance claim with description and evidence
     * @param _policyId The ID of the policy to claim against
     * @param _claimAmount The amount being claimed
     * @param _description A description of the claim
     * @param _evidence IPFS hash or other reference to supporting evidence
     */
    function submitClaim(
        uint256 _policyId, 
        uint256 _claimAmount, 
        string calldata _description,
        bytes calldata _evidence
    ) external whenNotPaused policyExists(_policyId) {
        Policy storage policy = policies[_policyId];

        // Validate claim conditions
        if (policy.policyHolder != msg.sender) revert NotPolicyOwner();
        if (!policy.isActive) revert PolicyNotActive();
        if (block.timestamp > policy.expiresAt) revert PolicyExpired();
        if (_claimAmount > policy.coverageAmount) revert ClaimExceedsCoverage();
        if (_claimAmount <= 0) revert InvalidAmount();

        // Create the claim
        claimCounter++;
        claims[claimCounter] = Claim({
            id: claimCounter,
            policyId: _policyId,
            claimant: payable(msg.sender),
            claimAmount: _claimAmount,
            status: ClaimStatus.Pending,
            description: _description,
            submittedAt: block.timestamp,
            processedAt: 0,
            evidence: _evidence
        });

        // Update policy claim count and claim tracking
        policy.claimCount++;
        policyClaims[_policyId].push(claimCounter);

        emit ClaimSubmitted(claimCounter, _policyId, msg.sender, _claimAmount, _description);
    }

    /**
     * @notice Approve a claim and transfer the payout
     * @param _claimId The ID of the claim to approve
     * @param _reason Optional reason for the approval
     */
    function approveClaim(uint256 _claimId, string calldata _reason) 
        external 
        onlyAuthorized 
        whenNotPaused 
        claimExists(_claimId) 
    {
        Claim storage claim = claims[_claimId];
        Policy storage policy = policies[claim.policyId];

        // Validate claim status
        if (claim.status != ClaimStatus.Pending) revert ClaimNotActive();
        if (!policy.isActive) revert PolicyNotActive();
        if (address(this).balance < claim.claimAmount) revert InsufficientFunds();

        // Mark claim as approved and update timestamps
        claim.status = ClaimStatus.Approved;
        claim.processedAt = block.timestamp;

        // Update policy status and contract totals
        policy.isActive = false; // Policy becomes inactive after claim approval
        totalClaimsPaid += claim.claimAmount;

        // Execute the payout
        (bool success, ) = claim.claimant.call{value: claim.claimAmount}("");
        if (!success) revert PaymentFailed();

        emit ClaimStatusUpdated(_claimId, ClaimStatus.Approved, _reason);
        emit ClaimApproved(_claimId, claim.policyId, claim.claimAmount);
    }

    /**
     * @notice Reject a claim
     * @param _claimId The ID of the claim to reject
     * @param _reason The reason for rejection
     */
    function rejectClaim(uint256 _claimId, string calldata _reason) 
        external 
        onlyAuthorized 
        claimExists(_claimId) 
    {
        Claim storage claim = claims[_claimId];
        
        // Validate claim status
        if (claim.status != ClaimStatus.Pending) revert ClaimNotActive();
        
        // Update claim status
        claim.status = ClaimStatus.Rejected;
        claim.processedAt = block.timestamp;
        
        emit ClaimStatusUpdated(_claimId, ClaimStatus.Rejected, _reason);
        emit ClaimRejected(_claimId, claim.policyId, _reason);
    }

    /**
     * @notice Renew an existing policy
     * @param _policyId The ID of the policy to renew
     * @param _duration Optional custom duration in days (0 for default)
     */
    function renewPolicy(uint256 _policyId, uint256 _duration) 
        external 
        payable 
        whenNotPaused 
        policyExists(_policyId) 
    {
        Policy storage policy = policies[_policyId];
        
        // Validate renewal conditions
        if (policy.policyHolder != msg.sender) revert NotPolicyOwner();
        if (!policy.isActive) revert PolicyNotActive();
        if (msg.value != policy.premium) revert InvalidAmount();
        
        // Calculate new expiry date
        uint256 duration = _duration > 0 ? _duration * 1 days : POLICY_DURATION;
        uint256 newExpiryDate = block.timestamp + duration;
        policy.expiresAt = newExpiryDate;
        
        // Update contract state
        totalPremiumsCollected += msg.value;
        
        emit PolicyRenewed(_policyId, newExpiryDate);
    }

    /**
     * @notice Cancel a policy and refund a portion of the premium
     * @param _policyId The ID of the policy to cancel
     */
    function cancelPolicy(uint256 _policyId) 
        external 
        whenNotPaused 
        policyExists(_policyId) 
    {
        Policy storage policy = policies[_policyId];
        
        // Validate cancellation conditions
        if (policy.policyHolder != msg.sender && msg.sender != owner) revert NotAuthorized();
        if (!policy.isActive) revert PolicyNotActive();
        if (policy.claimCount > 0) revert("Policy has active claims");
        
        // Calculate refund amount based on remaining time
        uint256 elapsedTime = block.timestamp - policy.createdAt;
        uint256 totalDuration = policy.expiresAt - policy.createdAt;
        uint256 remainingTime = policy.expiresAt > block.timestamp ? policy.expiresAt - block.timestamp : 0;
        
        uint256 refundAmount = 0;
        if (remainingTime > 0) {
            refundAmount = (policy.premium * remainingTime) / totalDuration;
        }
        
        // Update policy status
        policy.isActive = false;
        
        // Process refund if applicable
        if (refundAmount > 0) {
            (bool success, ) = payable(policy.policyHolder).call{value: refundAmount}("");
            if (!success) revert PaymentFailed();
        }
        
        emit PolicyCancelled(_policyId, policy.policyHolder, refundAmount);
    }

    /**
     * @notice Vote on a claim (for multi-signature approval)
     * @param _claimId The ID of the claim to vote on
     * @param _approve Whether to approve or reject the claim
     */
    function voteOnClaim(uint256 _claimId, bool _approve) 
        external 
        onlyAssessor 
        claimExists(_claimId) 
    {
        Claim storage claim = claims[_claimId];
        
        // Validate voting conditions
        if (claim.status != ClaimStatus.Pending) revert ClaimNotActive();
        if (claimVotes[msg.sender][_claimId]) revert("Already voted");
        
        // Record the vote
        claimVotes[msg.sender][_claimId] = true;
        
        // Implementation for threshold-based approval would go here
        // This is a simplified version
    }

    /**
     * @notice Add a new authorized assessor
     * @param _assessor The address of the assessor to add
     */
    function addAssessor(address _assessor) external onlyOwner {
        if (_assessor == address(0)) revert("Invalid address");
        authorizedAssessors[_assessor] = true;
        emit AssessorAdded(_assessor);
    }

    /**
     * @notice Remove an authorized assessor
     * @param _assessor The address of the assessor to remove
     */
    function removeAssessor(address _assessor) external onlyOwner {
        authorizedAssessors[_assessor] = false;
        emit AssessorRemoved(_assessor);
    }

    /**
     * @notice Set a new policy manager
     * @param _newManager The address of the new policy manager
     */
    function setPolicyManager(address _newManager) external onlyOwner {
        if (_newManager == address(0)) revert("Invalid address");
        policyManager = _newManager;
    }

    /**
     * @notice Pause the contract in case of emergency
     */
    function pauseContract() external onlyOwner {
        contractPaused = true;
        emit ContractPaused(msg.sender);
    }

    /**
     * @notice Unpause the contract
     */
    function unpauseContract() external onlyOwner {
        contractPaused = false;
        emit ContractUnpaused(msg.sender);
    }

    /**
     * @notice Get contract balance
     * @return The current contract balance
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Allow the owner to withdraw contract funds
     * @param amount The amount to withdraw
     */
    function withdrawFunds(uint256 amount) external onlyOwner {
        if (amount <= 0) revert InvalidAmount();
        if (address(this).balance < amount) revert InsufficientFunds();
        
        // Calculate and ensure minimum reserve is maintained
        uint256 minimumReserve = totalPremiumsCollected / 2;
        if (address(this).balance - amount < minimumReserve) revert("Reserve too low");
        
        (bool success, ) = payable(owner).call{value: amount}("");
        if (!success) revert PaymentFailed();
        
        emit FundsWithdrawn(owner, amount);
    }

    /**
     * @notice Get all policies owned by a user
     * @param _user The address of the user
     * @return An array of policy IDs
     */
    function getUserPolicies(address _user) external view returns (uint256[] memory) {
        return userPolicies[_user];
    }

    /**
     * @notice Get all claims for a policy
     * @param _policyId The ID of the policy
     * @return An array of claim IDs
     */
    function getPolicyClaims(uint256 _policyId) external view policyExists(_policyId) returns (uint256[] memory) {
        return policyClaims[_policyId];
    }

    /**
     * @notice Check if a policy is expired
     * @param _policyId The ID of the policy to check
     * @return True if the policy is expired
     */
    function isPolicyExpired(uint256 _policyId) external view policyExists(_policyId) returns (bool) {
        return block.timestamp > policies[_policyId].expiresAt;
    }

    /*
     * @notice Get detailed policy information
     * @param _policyId The ID of the policy
     * @return All policy details in a structured format
     */
    function getPolicyDetails(uint256 _policyId) 
        external 
        view 
        policyExists(_policyId) 
        returns (
            uint256 id,
            address policyHolder,
            uint256 premium,
            uint256 coverageAmount,
            bool isActive,
            uint256 createdAt,
            uint256 expiresAt,
            uint256 claimCount,
            PolicyType policyType,
            bool isExpired
        ) 
    {
        Policy storage policy = policies[_policyId];
        return (
            policy.id,
            policy.policyHolder,
            policy.premium,
            policy.coverageAmount,
            policy.isActive,
            policy.createdAt,
            policy.expiresAt,
            policy.claimCount,
            policy.policyType,
            block.timestamp > policy.expiresAt
        );
    }

    /*
     * @notice Get detailed claim information
     * @param _claimId The ID of the claim
     * @return All claim details in a structured format
     */
    function getClaimDetails(uint256 _claimId)
        external
        view
        claimExists(_claimId)
        returns (
            uint256 id,
            uint256 policyId,
            address claimant,
            uint256 claimAmount,
            ClaimStatus status,
            string memory description,
            uint256 submittedAt,
            uint256 processedAt
        )
    {
        Claim storage claim = claims[_claimId];
        return (
            claim.id,
            claim.policyId,
            claim.claimant,
            claim.claimAmount,
            claim.status,
            claim.description,
            claim.submittedAt,
            claim.processedAt
        );
    }

    /**
     * @notice Deposit funds into the contract
     */
    function depositFunds() external payable {
        if (msg.value <= 0) revert InvalidAmount();
        emit FundsDeposited(msg.sender, msg.value);
    }

    /**
     * @notice Receive function to accept ETH deposits
     */
    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }

    /**
     * @notice Fallback function
     */
    fallback() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }
}