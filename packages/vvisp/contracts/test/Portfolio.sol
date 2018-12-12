pragma solidity ^0.4.23;

import "../libs/Ownable.sol";
import "../libs/SafeMath.sol";


/**
 * @title Portfolio
 * @dev Data of Portfolio
 */
contract Portfolio is Ownable {
    using SafeMath for uint256;

    event UpsertPortfolio(bytes32 indexed portfolioHash, bytes32[] loanHash, uint256 registrationDate);
    event RemovePortfolio(bytes32 indexed portfolioHash, bytes32[] loanHash, uint256 registrationDate);

    /*
    * @dev public으로 선언하면, 자동으로 생성되는 getter 함수가 dynamic array를 통째로 return하지 못하고,
    *       index를 추가로 받아서 단일 인자값만 return해줌. 따라서 변수는 internal로 선언하고 따로 public getter 함수를 선언하였음.
    */
    mapping(bytes32 => bytes32[]) internal _loanHashs;       // 포트폴리오 해시 => 대출 해시
    mapping(bytes32 => uint256) public registrationDates;    // 포트폴리오 해시 => 등록 일시

    bool internal _initialized;

    function initialize(address owner) public {
        require(!_initialized);
        setOwner(owner);
        _initialized = true;
    }

    function loanHash(bytes32 _portfolioHash) view public returns (bytes32[] _loanHash) {
        return _loanHashs[_portfolioHash];
    }

    function upsertPortfolio(bytes32 _portfolioHash, bytes32[] _loanHash, uint256 _registrationDate) public onlyOwner {
        require(_portfolioHash != 0);

        upsertLoanHash(_portfolioHash, _loanHash);
        upsertRegistrationDate(_portfolioHash, _registrationDate);

        emit UpsertPortfolio(_portfolioHash, _loanHash, _registrationDate);
    }

    function removePortfolio(bytes32 _portfolioHash) public onlyOwner {
        require(_portfolioHash != 0);

        bytes32[] memory beforeLoanHash = removeLoanHash(_portfolioHash);
        uint256 beforeRegistrationDate = removeRegistrationDate(_portfolioHash);

        emit RemovePortfolio(_portfolioHash, beforeLoanHash, beforeRegistrationDate);
    }

    function upsertLoanHash(bytes32 _portfolioHash, bytes32[] _loanHash) internal {
        _loanHashs[_portfolioHash] = _loanHash;
    }

    function removeLoanHash(bytes32 _portfolioHash) internal returns (bytes32[] _before) {
        _before = _loanHashs[_portfolioHash];
        delete _loanHashs[_portfolioHash];
    }

    function upsertRegistrationDate(bytes32 _portfolioHash, uint256 _registrationDate) internal {
        registrationDates[_portfolioHash] = _registrationDate;
    }

    function removeRegistrationDate(bytes32 _portfolioHash) internal returns (uint256 _before) {
        _before = registrationDates[_portfolioHash];
        delete registrationDates[_portfolioHash];
    }
}
