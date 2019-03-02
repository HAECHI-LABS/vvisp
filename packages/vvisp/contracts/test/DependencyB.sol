pragma solidity >=0.5.0 <0.6.0;


contract DependencyB {
    uint tmp;
    address addressD;
    address owner;
    bool initialized;

    constructor(uint _tmp, address _addressD, address _owner) public {
        tmp = _tmp;
        addressD = _addressD;
        owner = _owner;
    }

    function initialize() public {
        require(!initialized);
        // something
        initialized = true;
    }
}
