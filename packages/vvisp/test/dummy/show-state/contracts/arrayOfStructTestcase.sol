pragma solidity >=0.4.21 <0.6.0;

contract arrayOfStructTestcase {

    // struct type array
    struct struct1 {
        inStruct2 is2;
    }

    struct1[2] s1;

    // struct has struct (that has array)
    struct inStruct1 {
        byte[3][1] var_byte;
    }
 

    // struct has struct ( whose type is array ) 
    struct inStruct2 {
        bytes var_bytes;
        string var_string;
        inStruct1[3] is1;
    }

    constructor () public {

        s1[0].is2.var_bytes = "sweet";
        s1[0].is2.var_string = "I love beer..";
        s1[0].is2.is1[0].var_byte[0][0] = 0x01;
        s1[0].is2.is1[0].var_byte[0][1] = 0x02;
        s1[0].is2.is1[0].var_byte[0][2] = 0x03;
        s1[0].is2.is1[1].var_byte[0][0] = 0x04;
        s1[0].is2.is1[1].var_byte[0][1] = 0x05;
        s1[0].is2.is1[1].var_byte[0][2] = 0x06;
        s1[0].is2.is1[2].var_byte[0][0] = 0x07;
        s1[0].is2.is1[2].var_byte[0][1] = 0x08;
        s1[0].is2.is1[2].var_byte[0][2] = 0x09;
        
        s1[1].is2.var_bytes = "spicy";
        s1[1].is2.var_string = "I hate coffee!!";
        s1[1].is2.is1[0].var_byte[0][0] = 0x0a;
        s1[1].is2.is1[0].var_byte[0][1] = 0x0b;
        s1[1].is2.is1[0].var_byte[0][2] = 0x0c;
        s1[1].is2.is1[1].var_byte[0][0] = 0x0d;
        s1[1].is2.is1[1].var_byte[0][1] = 0x0e;
        s1[1].is2.is1[1].var_byte[0][2] = 0x0f;
        s1[1].is2.is1[2].var_byte[0][0] = 0xff;
        s1[1].is2.is1[2].var_byte[0][1] = 0xef;
        s1[1].is2.is1[2].var_byte[0][2] = 0x2b;

    }

}
