pragma solidity >=0.4.21 <0.6.0;

contract elementTestcase {
    bool var_bool = true;
    int8 var_int8 = 1;
    int256 var_int256 = 40;
    int var_int = 3;
    uint8 var_uint8 = 2;
    uint256 var_uint256 = 1000;
    uint var_uint = 23253;
    address var_address = 0x345CA3E014AAF5dCa488057592EE44305d9b3E11;
    address payable var_address_payable = 0x111113e014aaf5dCA488057592EE44305d9B3E11;
    byte var_byte = 0x01;
    bytes2 var_bytes2 = 0x0002;
    bytes32 var_bytes32 = 0x0002000200020002000200020002000200020002000200020002000200020002;
    elementTestcase var_contract;
    enum myEnum {e1, e2}
    myEnum var_enum = myEnum.e2;
    function (bool) external var_f1;
    function (bool) internal var_f2;
    function () external view returns (int8) var_f3;
    function () internal view returns (int8) var_f4;
    bytes var_bytes = "bytes";
    string var_string = "hello";
    mapping(uint => uint) var_mapping;


















    






}
