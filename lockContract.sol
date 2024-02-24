// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Import the ERC20 interface
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LockContract {
    // Address of the token contract (set to address(0) for native ETH)
    address public tokenAddress;

    // Event emitted when native ETH is locked
    event LockETHEvent(address indexed sender, uint256 amount, string targetChain, address targetAddress);

    // Event emitted when ERC20 tokens are locked
    event LockERC20Event(address indexed sender, address indexed token, uint256 amount, string targetChain, address targetAddress);

    // Constructor to set the token address
    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }

    // Lock native ETH
    function lockETH(string memory targetChain, address targetAddress) external payable {
        require(msg.value > 0, "Amount must be greater than 0");
        
        // Emit LockETHEvent
        emit LockETHEvent(msg.sender, msg.value, targetChain, targetAddress);
    }

    // Lock ERC20 Tokens
    function lockTokens(uint256 amount, string memory targetChain, address targetAddress) external {
        require(amount > 0, "Amount must be greater than 0");
        require(tokenAddress != address(0), "Token address not set"); // Ensure token address is set for ERC20 locks

        // Transfer tokens from sender to this contract
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);

        // Emit LockERC20Event
        emit LockERC20Event(msg.sender, tokenAddress, amount, targetChain, targetAddress);
    }

    // Function to set the token address (for ERC20 locks)
    function setTokenAddress(address _tokenAddress) external {
        require(tokenAddress == address(0), "Token address already set"); // Ensure token address is set only once
        tokenAddress = _tokenAddress;
    }
}
