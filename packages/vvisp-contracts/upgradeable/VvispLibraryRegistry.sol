pragma solidity >=0.5.0 <0.6.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../libs/BytesLib.sol";
import "./VvispProxy.sol";


contract VvispLibraryRegistry is Ownable {
    using SafeMath for uint256;
    using BytesLib for bytes;

    event ProxyCreated(address _proxy, string _name);
    event UpgradeAll(address payable[] _proxies, address[] _implementations);
    event UpgradeToAndCallData(bytes _data, uint256 _index, uint256 _length);
    event SetNonUpgradeable(address _address, string _name, string _fileName);
    event SetFileName(address _address, string _fileName);

    struct UpgradeableSet {
        address business;
        string fileName;
        string name;
    }

    struct NonUpgradeableSet {
        string fileName;
        string name;
    }

    // Key addresses for restoring state.vvisp.json
    address[] public upgradeableKeyAddresses;
    address[] public nonUpgradeableKeyAddresses;

    mapping(address => UpgradeableSet) public upgradeableSets;
    mapping(address => NonUpgradeableSet) public nonUpgradeableSets;

    function setNonUpgradeables(
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
            nonUpgradeableKeyAddresses.push(_addresses[i]);
            nonUpgradeableSets[_addresses[i]].name = string(nameSlice);
            nonUpgradeableSets[_addresses[i]].fileName = string(fileSlice);
            emit SetNonUpgradeable(_addresses[i], string(nameSlice), string(fileSlice));
            nameIndex = nameIndex.add(_nameLength[i]);
            fileIndex = fileIndex.add(_fileNameLength[i]);
        }
    }

    function updateFileNames(address[] memory _keyAddresses, string memory _fileNames, uint256[] memory _fileNameLength) public onlyOwner {
        require(_keyAddresses.length != 0);
        require(_keyAddresses.length == _fileNameLength.length);

        uint256 fileIndex = 0;

        for (uint8 i = 0; i < _keyAddresses.length; i++) {
            bytes memory fileNames = bytes(_fileNames);
            bytes memory fileSlice = fileNames.slice(fileIndex, _fileNameLength[i]);
            if (bytes(upgradeableSets[_keyAddresses[i]].name).length > 0) {
                upgradeableSets[_keyAddresses[i]].fileName = string(fileSlice);
            } else {
                revert();
            }
            emit SetFileName(_keyAddresses[i], string(fileSlice));
            fileIndex = fileIndex.add(_fileNameLength[i]);
        }
    }

    function createProxy(string memory name) public onlyOwner {
        VvispProxy proxy = new VvispProxy();
        upgradeableKeyAddresses.push(address(proxy));
        upgradeableSets[address(proxy)].name = name;
        emit ProxyCreated(address(proxy), name);
    }

    function upgradeToAndCalls(
        address payable[] memory _proxies,
        address[] memory _business,
        bytes memory _data,
        uint256[] memory _length
    )
        public onlyOwner
    {
        require(_proxies.length != 0);
        require(_proxies.length == _business.length);
        require(_proxies.length == _length.length);

        uint256 index = 0;

        for (uint8 i = 0; i < _proxies.length; i++) {
            VvispProxy proxy = VvispProxy(_proxies[i]);

            if (_length[i] == 0) {
                proxy.upgradeTo(_business[i]);
            } else {
                bytes memory slice = _data.slice(index, _length[i]);
                proxy.upgradeToAndCall(_business[i], slice);
                emit UpgradeToAndCallData(slice, index, _length[i]);
                index = index.add(_length[i]);
            }

            upgradeableSets[_proxies[i]].business = _business[i];
        }
        emit UpgradeAll(_proxies, _business);
    }
}
