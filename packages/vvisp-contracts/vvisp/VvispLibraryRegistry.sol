pragma solidity >=0.5.0 <0.6.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../libs/BytesLib.sol";


contract VvispLibraryRegistry is Ownable {
    using SafeMath for uint256;
    using BytesLib for bytes;

    event SetContract(address _address, string _name, string _fileName);

    struct ContractSet {
        string fileName;
        string name;
    }

    // Key addresses for restoring state.vvisp.json
    address[] public contractKeyAddresses;

    mapping(address => ContractSet) public contractSets;

    function registerContractInfo(
        address[] memory _addresses,
        string memory _names,
        uint256[] memory _nameLength,
        string memory _fileNames,
        uint256[] memory _fileNameLength
    )
        public onlyOwner
    {
        require(_addresses.length != 0);
        require(_addresses.length == _nameLength.length);
        require(_addresses.length == _fileNameLength.length);

        uint256 nameIndex = 0;
        uint256 fileIndex = 0;

        for (uint8 i = 0; i < _addresses.length; i++) {
            bytes memory names = bytes(_names);
            bytes memory fileNames = bytes(_fileNames);
            bytes memory nameSlice = names.slice(nameIndex, _nameLength[i]);
            bytes memory fileSlice = fileNames.slice(fileIndex, _fileNameLength[i]);
            contractKeyAddresses.push(_addresses[i]);
            contractSets[_addresses[i]].name = string(nameSlice);
            contractSets[_addresses[i]].fileName = string(fileSlice);
            emit SetContract(_addresses[i], string(nameSlice), string(fileSlice));
            nameIndex = nameIndex.add(_nameLength[i]);
            fileIndex = fileIndex.add(_fileNameLength[i]);
        }
    }
}
