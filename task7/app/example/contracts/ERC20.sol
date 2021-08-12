pragma solidity ^0.8.1;

contract ERC20 {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 totalSupply;
    mapping(address => uint256) balances;

    constructor(string memory _name, string memory _symbol, uint256 _supply) public {
        name = _name;
        symbol = _symbol;
        totalSupply = _supply;
        balances[msg.sender] = _supply;
    }

    function transfer(address recipient, uint256 value) public {
        require(balances[msg.sender] > value);
        balances[msg.sender] -= value;
        balances[recipient] += value;
    }

    function balanceOf(address account) public returns (uint256) {
        return balances[account];
    }

}