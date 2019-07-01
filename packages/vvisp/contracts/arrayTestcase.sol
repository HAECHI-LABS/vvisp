pragma solidity >=0.4.21 <0.6.0;

contract arrayTestcase {


    bool[5] array_bool = [true, false, true, true, false];
    int8[4][4] array_int8;
    uint[4][2][3] array_uint;

    address[3] array_address;
    bytes2[4] array_bytes2;
    arrayTestcase[3] array_contract;

    enum myEnum {e1, e2}
    myEnum[3] array_enum;

    function () external view returns (int8)[3] array_function;

    
    bytes[3] array_bytes;
    string[3] array_string = ["apple", "banana", "kiwi"];
    mapping(uint => uint)[3] array_mapping;

    constructor () public {

        array_int8[0][0] = -1;
        array_int8[0][1] = -2;
        array_int8[0][2] = -3;
        array_int8[0][3] = -4;
        array_int8[1][0] = -5;
        array_int8[1][1] = -6;
        array_int8[1][2] = -7;
        array_int8[1][3] = -8;
        array_int8[2][0] = -9;
        array_int8[2][1] = -10;
        array_int8[2][2] = -11;
        array_int8[2][3] = -12;
        array_int8[3][0] = -13;
        array_int8[3][1] = -14;
        array_int8[3][2] = -15;
        array_int8[3][3] = -16;

        array_uint[0][0][0] = 1;
        array_uint[0][0][1] = 2;
        array_uint[0][0][2] = 3;
        array_uint[0][0][3] = 4;
        array_uint[0][1][0] = 5;
        array_uint[0][1][1] = 6;
        array_uint[0][1][2] = 7;
        array_uint[0][1][3] = 8;
        array_uint[1][0][0] = 9;
        array_uint[1][0][1] = 10;
        array_uint[1][0][2] = 11;
        array_uint[1][0][3] = 12;
        array_uint[1][1][0] = 13;
        array_uint[1][1][1] = 14;
        array_uint[1][1][2] = 15;
        array_uint[1][1][3] = 16;
        array_uint[2][0][0] = 17;
        array_uint[2][0][1] = 18;
        array_uint[2][0][2] = 19;
        array_uint[2][0][3] = 20;
        array_uint[2][1][0] = 21;
        array_uint[2][1][1] = 22;
        array_uint[2][1][2] = 23;
        array_uint[2][1][3] = 24;

        array_bytes2[0] = 0x0001;
        array_bytes2[1] = 0x0011;
        array_bytes2[2] = 0x0111;
        array_bytes2[3] = 0x1111;

    }

}
