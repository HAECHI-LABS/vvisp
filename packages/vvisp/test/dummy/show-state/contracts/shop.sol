pragma solidity >=0.4.21 <0.6.0;

contract shop {

    uint16 max=100;
    uint16 min=1;

    uint count=0;
    uint price=2500;

    enum fruit {apple, banana, grape}

    fruit fruits;


    function (bool) external buy;
    function () internal returns (bytes4) sell;

    shop myShop;

    bytes dump;
    string name;

    mapping(uint=>uint) owner;
    mapping(string=>uint) owner2;

    inventory myInventory;

    struct inventory {
        mapping(uint=>uint) item;
        uint balance;
    }

    container myContainer;

    uint[] stockOfItems = [430,23,123,44];

    struct container {
        uint num;
        box[2] boxes;
    }

    struct box {
        uint book;
        uint16[2] magazines;
    }


    uint[][] arr;

    constructor () public {

        arr.push([3,3,3]);
        arr.push([1,1]);
        arr.push([2,2,2,2]);
        owner[3] = 234;
        owner2["3"] = 234;

    }



}
