pragma solidity >=0.4.21 <0.6.0;

contract structTestcase {

    // normal struct
    struct struct1 {
        bool var_bool;
        int8 var_int8;
        address var_address;
        structTestcase var_contract;
        myEnum var_enum;
        function (bool) external var_f1;
        mapping(uint => uint) var_mapping;
    }
    enum myEnum {e1, e2}

    struct1 s1;

    // struct has array
    struct struct2 {
        bytes2[3] var_bytes2;
        bytes8[3][3] var_bytes8;
    }
    struct2 s2;


    // struct has struct
    struct struct3 {
        inStruct2 is2;
    }

    struct3 s3;


    // struct has struct (that has array)
    struct inStruct1 {
        byte[3][1] var_byte;
    }
    struct inStruct2 {
        bytes var_bytes;
        string var_string;
        inStruct1 is1;
    }

    constructor () public {

        s1.var_bool = true;
        s1.var_int8 = 3;
        s1.var_address = 0x345CA3E014AAF5dCa488057592EE44305d9b3E11;
        s1.var_enum = myEnum.e2;

        s2.var_bytes2[0] = 0x0100;
        s2.var_bytes2[1] = 0x0010;
        s2.var_bytes2[2] = 0x1000;
        s2.var_bytes8[0][0] = 0x0000000000001000;
        s2.var_bytes8[0][1] = 0x0000000010001000;
        s2.var_bytes8[0][2] = 0x1011100010001000;
        s2.var_bytes8[1][0] = 0x1001100111011100;
        s2.var_bytes8[1][1] = 0x1000111111111100;
        s2.var_bytes8[1][2] = 0x1000101010111100;
        s2.var_bytes8[2][0] = 0x1000000000000000;
        s2.var_bytes8[2][1] = 0x1111110000001100;
        s2.var_bytes8[2][2] = 0x1000100010101100;


        s3.is2.var_bytes = "verygood";
        s3.is2.var_string = "very very great";
        s3.is2.is1.var_byte[0][0] = 0x01;
        s3.is2.is1.var_byte[0][1] = 0x10;
        s3.is2.is1.var_byte[0][2] = 0x00;

    }
}
