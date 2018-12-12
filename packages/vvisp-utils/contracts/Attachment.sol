pragma solidity ^0.4.23;

import "../libs/Ownable.sol";
import "../libs/SafeMath.sol";


/**
 * @title Attachment
 * @dev Data of Attachment
 */
contract Attachment is Ownable {
    using SafeMath for uint256;

    event UpsertAttachment(bytes32 fileHash, string fileTypes, string fileNames, uint256 registrationDate);
    event RemoveAttachment(bytes32 fileHash, string fileTypes, string fileNames, uint256 registrationDate);

    /*
    * @dev fileTypes, fileNames are comma separated string.
    * ex) fileTypes: hash => "photo, photo, photo"
    */
    mapping(bytes32 => string) public fileTypes;
    mapping(bytes32 => string) public fileNames;
    mapping(bytes32 => uint256) public registrationDates;

    bool private _initialized;

    function initialize(address owner) public {
        require(!_initialized);
        setOwner(owner);
        _initialized = true;
    }

    function upsertAttachment(
        bytes32 _fileHash,
        string _fileType,
        string _fileName,
        uint256 _registrationDate) public onlyOwner
    {
        require(_fileHash != 0);

        upsertFileType(_fileHash, _fileType);
        upsertFileName(_fileHash, _fileName);
        upsertRegistrationDate(_fileHash, _registrationDate);

        emit UpsertAttachment(_fileHash, _fileType, _fileName, _registrationDate);
    }

    function removeAttachment(bytes32 _fileHash) public onlyOwner {
        require(_fileHash != 0);

        string memory beforeFileTypes = removeFileType(_fileHash);
        string memory beforeFileNames = removeFileName(_fileHash);
        uint256 beforeRegistrationDate = removeRegistrationDate(_fileHash);

        emit RemoveAttachment(_fileHash, beforeFileTypes, beforeFileNames, beforeRegistrationDate);
    }

    function upsertFileType(bytes32 _fileHash, string _fileType) internal {
        fileTypes[_fileHash] = _fileType;
    }

    function removeFileType(bytes32 _fileHash) internal returns (string before) {
        before = fileTypes[_fileHash];
        delete fileTypes[_fileHash];
    }

    function upsertFileName(bytes32 _fileHash, string _fileName) internal {
        fileNames[_fileHash] = _fileName;
    }

    function removeFileName(bytes32 _fileHash) internal returns (string before) {
        before = fileNames[_fileHash];
        delete fileNames[_fileHash];
    }

    function upsertRegistrationDate(bytes32 _fileHash, uint256 _registrationDate) internal {
        registrationDates[_fileHash] = _registrationDate;
    }

    function removeRegistrationDate(bytes32 _fileHash) internal returns (uint256 before) {
        before = registrationDates[_fileHash];
        delete registrationDates[_fileHash];
    }
}
