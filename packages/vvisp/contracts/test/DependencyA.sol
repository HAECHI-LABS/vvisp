pragma solidity >=0.5.0 <0.6.0;


contract DependencyA {
    address addressB;
    address addressC;
    address owner;
    bool initialized;

    constructor(address _addressB, address _addressC, address _owner) public {
        addressB = _addressB;
        addressC = _addressC;
        owner = _owner;
    }

    function initialize() public {
        require(!initialized);
        // something
        initialized = true;
    }
}

contract DependencyA2 {
    bool initialized;

    function initializeA2() public {
        require(!initialized);
        // something
        initialized = true;
    }
}
