pragma solidity >=0.4.21 <0.6.0;

contract dynamicVarTestcase {

    uint[] darray1 = [430,23,123,44];
    uint8[][] darray2;
    int32[][2][3] darray3;
    uint48[3][2][] darray4;

    mapping(string => int) map1;
    mapping(int => mapping(int=>int)) map2;

    struct1[2] s1;
    struct struct1 {
        uint[2][3][][2] darray5;
        string s;
    }

    mapping( int => mapping(string => int[2][3][]) )[2] mapdarray;
    int[2][3][] ta;

    constructor () public {

        darray2.push([31,32,33]);
        darray2.push([11,12]);
        darray2.push([21,22,23,24]);

        darray3[0][0].push(-1);
        darray3[0][0].push(-2);
        darray3[0][1].push(-3);
        darray3[1][0].push(-4);
        darray3[1][1].push(-5);
        darray3[1][1].push(-6);
        darray3[2][0].push(-7);
        darray3[2][0].push(-8);
        darray3[2][0].push(-9);
        darray3[2][1].push(10);

        darray4.push([[1,2,3],[4,5,6]]);

        map1["zero"] = 0;
        map1["one"] = 1;
        map1["two"] = 2;

        map2[2][4] = 8;
        map2[3][8] = 24;
        map2[4][7] = 28;

        s1[0].darray5[0].push([[0,1],[2,3],[4,5]]);
        s1[1].darray5[1].push([[6,7],[8,9],[10,11]]);

        ta.push([[-1,-2],[-3,-4],[-5,-6]]);

        mapdarray[0][36]["key1"] = ta;

    }
}
