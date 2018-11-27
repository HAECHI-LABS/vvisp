pragma solidity ^0.4.23;

import '../libs/Ownable.sol';
import '../libs/SafeMath.sol';


/**
 * @title Loan
 * @dev Data of Loan
 */
contract Loan is Ownable {
    using SafeMath for uint256;

    event UpsertLoan(
        bytes32 indexed loanHash,
        string loanName,
        uint256 loanTypeCode,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 overdueInterestRate,
        uint256 investmentFeeRate,
        uint256 repaymentMethodCode,
        uint256 investmentStartTime); // solium-disable-line indentation

    event UpsertLoan2(
        bytes32 indexed loanHash,
        uint256 fundCompleteTime,
        uint256 loanStartDate,
        uint256 loanEndDate,
        uint256 repaymentNumber,
        string loanSummary,
        string detailHTML,
        uint256 stateCode,
        uint256 registrationDate); // solium-disable-line indentation

    event RemoveLoan(
        bytes32 indexed loanHash,
        string loanName,
        uint256 loanTypeCode,
        uint256 loanAmount,
        uint256 interestRate,
        uint256 overdueInterestRate,
        uint256 investmentFeeRate,
        uint256 repaymentMethodCode,
        uint256 investmentStartTime); // solium-disable-line indentation

    event RemoveLoan2(
        bytes32 indexed loanHash,
        uint256 fundCompleteTime,
        uint256 loanStartDate,
        uint256 loanEndDate,
        uint256 repaymentNumber,
        string loanSummary,
        string detailHTML,
        uint256 stateCode,
        uint256 registrationDate); // solium-disable-line indentation

    mapping(bytes32 => string) public loanNames;            // 대출 해시 => 대출명
    mapping(bytes32 => uint256) public loanTypeCodes;         // 대출 해시 => 대출 유형 코드
    mapping(bytes32 => uint256) public loanAmounts;         // 대출 해시 => 대출 금액
    mapping(bytes32 => uint256) public interestRates;        // 대출 해시 => 대출 이율
    mapping(bytes32 => uint256) public overdueInterestRates; // 대출 해시 => 연체 이율
    mapping(bytes32 => uint256) public investmentFeeRates;   // 대출 해시 => 투자 수수료율
    mapping(bytes32 => uint256) public repaymentMethodCodes;  // 대출 해시 => 상환 방식 코드
    mapping(bytes32 => uint256) public investmentStartTimes; // 대출 해시 => 투자 시작 시간
    mapping(bytes32 => uint256) public fundCompleteTimes;    // 대출 해시 => 모집 완료 시간
    mapping(bytes32 => uint256) public loanStartDates;        // 대출 해시 => 대출 시작일
    mapping(bytes32 => uint256) public loanEndDates;          // 대출 해시 => 대출 종료일
    mapping(bytes32 => uint256) public repaymentNumbers;     // 대출 해시 => 회차 수
    mapping(bytes32 => string) public loanSummaries;         // 대출 해시 => 대출 요약
    mapping(bytes32 => string) public detailHTMLs;          // 대출 해시 => 상세 HTML
    mapping(bytes32 => uint256) public stateCodes;            // 대출 해시 => 상태 코드
    mapping(bytes32 => uint256) public registrationDates;    // 대출 해시 => 등록 일시

    bool private _initialized;

    function initialize(address owner) public {
        require(!_initialized);
        setOwner(owner);
        _initialized = true;
    }

    /*
    * @dev - solidity가 input parameter를 16개 이상 받지 못하기 때문에 같은 자료형을 배열로 처리
    */
    function upsertLoan(
        bytes32 _loanHash,
        string _loanName,
        uint256 _loanTypeCode,
        uint256 _loanAmount,
        uint256[3] _rate,
        uint256 _repaymentMethodCode,
        uint256[2] _fundStartEndTime,
        uint256[2] _loanStartEndDate,
        uint256 _repaymentNumber,
        string _loanSummary,
        string _detailHTML,
        uint256 _stateCode,
        uint256 _registrationDate)
    public onlyOwner {
        require(_loanHash != 0);

        upsertLoanName(_loanHash, _loanName);
        upsertLoanTypeCode(_loanHash, _loanTypeCode);
        upsertLoanAmount(_loanHash, _loanAmount);
        upsertInterestRate(_loanHash, _rate[0]);
        upsertOverdueInterestRate(_loanHash, _rate[1]);
        upsertInvestmentFeeRate(_loanHash, _rate[2]);
        upsertRepaymentMethodCode(_loanHash, _repaymentMethodCode);
        upsertInvestmentStartTime(_loanHash, _fundStartEndTime[0]);
        upsertFundCompleteTime(_loanHash, _fundStartEndTime[1]);
        upsertLoanStartDate(_loanHash, _loanStartEndDate[0]);
        upsertLoanEndDate(_loanHash, _loanStartEndDate[1]);
        upsertRepaymentNumber(_loanHash, _repaymentNumber);
        upsertLoanSummary(_loanHash, _loanSummary);
        upsertDetailHTML(_loanHash, _detailHTML);
        upsertStateCode(_loanHash, _stateCode);
        upsertRegistrationDate(_loanHash, _registrationDate);

        emit UpsertLoan(
            _loanHash,
            _loanName,
            _loanTypeCode,
            _loanAmount,
            _rate[0],
            _rate[1],
            _rate[2],
            _repaymentMethodCode,
            _fundStartEndTime[0]);

        emit UpsertLoan2(
            _loanHash,
            _fundStartEndTime[1],
            _loanStartEndDate[0],
            _loanStartEndDate[1],
            _repaymentNumber,
            _loanSummary,
            _detailHTML,
            _stateCode,
            _registrationDate);
    }

    function removeLoan(bytes32 _loanHash) public onlyOwner {
        require(_loanHash != 0);

        string memory beforeLoanName = removeLoanName(_loanHash);
        uint256 beforeLoanTypeCode = removeLoanTypeCode(_loanHash);
        uint256 beforeLoanAmount = removeLoanAmount(_loanHash);
        uint256[3] memory beforeRate;
        beforeRate[0] = removeInterestRate(_loanHash);
        beforeRate[1] = removeOverdueInterestRate(_loanHash);
        beforeRate[2] = removeInvestmentFeeRate(_loanHash);
        uint256 beforeRepaymentMethodCode = removeRepaymentMethodCode(_loanHash);
        uint256[2] memory beforeFundStartEndTime;
        beforeFundStartEndTime[0] = removeInvestmentStartTime(_loanHash);
        beforeFundStartEndTime[1] = removeFundCompleteTime(_loanHash);
        uint256[2] memory beforeLoanStartEndDate;
        beforeLoanStartEndDate[0] = removeLoanStartDate(_loanHash);
        beforeLoanStartEndDate[1] = removeLoanEndDate(_loanHash);
        uint256 beforeRepaymentNumber = removeRepaymentNumber(_loanHash);
        string memory beforeLoanSummary = removeLoanSummary(_loanHash);
        string memory beforeDetailHTML = removeDetailHTML(_loanHash);
        uint256 beforeStateCode = removeStateCode(_loanHash);
        uint256 beforeRegistrationDate = removeRegistrationDate(_loanHash);

        emit RemoveLoan(
            _loanHash,
            beforeLoanName,
            beforeLoanTypeCode,
            beforeLoanAmount,
            beforeRate[0],
            beforeRate[1],
            beforeRate[2],
            beforeRepaymentMethodCode,
            beforeFundStartEndTime[0]);
        emit RemoveLoan2(
            _loanHash,
            beforeFundStartEndTime[1],
            beforeLoanStartEndDate[0],
            beforeLoanStartEndDate[1],
            beforeRepaymentNumber,
            beforeLoanSummary,
            beforeDetailHTML,
            beforeStateCode,
            beforeRegistrationDate);
    }

    function upsertLoanName(bytes32 _loanHash, string _loanName) internal {
        loanNames[_loanHash] = _loanName;
    }

    function removeLoanName(bytes32 _loanHash) internal returns (string before) {
        before = loanNames[_loanHash];
        delete loanNames[_loanHash];
    }

    function upsertLoanTypeCode(bytes32 _loanHash, uint256 _loanTypeCode) internal {
        loanTypeCodes[_loanHash] = _loanTypeCode;
    }

    function removeLoanTypeCode(bytes32 _loanHash) internal returns (uint256 before) {
        before = loanTypeCodes[_loanHash];
        delete loanTypeCodes[_loanHash];
    }

    function upsertLoanAmount(bytes32 _loanHash, uint256 _loanAmount) internal {
        loanAmounts[_loanHash] = _loanAmount;
    }

    function removeLoanAmount(bytes32 _loanHash) internal returns (uint256 before) {
        before = loanAmounts[_loanHash];
        delete loanAmounts[_loanHash];
    }

    function upsertInterestRate(bytes32 _loanHash, uint256 _interestRate) internal {
        interestRates[_loanHash] = _interestRate;
    }

    function removeInterestRate(bytes32 _loanHash) internal returns (uint256 before) {
        before = interestRates[_loanHash];
        delete interestRates[_loanHash];
    }

    function upsertOverdueInterestRate(bytes32 _loanHash, uint256 _overdueInterestRate) internal {
        overdueInterestRates[_loanHash] = _overdueInterestRate;
    }

    function removeOverdueInterestRate(bytes32 _loanHash) internal returns (uint256 before) {
        before = overdueInterestRates[_loanHash];
        delete overdueInterestRates[_loanHash];
    }

    function upsertInvestmentFeeRate(bytes32 _loanHash, uint256 _investmentFeeRate) internal {
        investmentFeeRates[_loanHash] = _investmentFeeRate;
    }

    function removeInvestmentFeeRate(bytes32 _loanHash) internal returns (uint256 before) {
        before = investmentFeeRates[_loanHash];
        delete investmentFeeRates[_loanHash];
    }

    function upsertRepaymentMethodCode(bytes32 _loanHash, uint256 _repaymentMethodCode) internal {
        repaymentMethodCodes[_loanHash] = _repaymentMethodCode;
    }

    function removeRepaymentMethodCode(bytes32 _loanHash) internal returns (uint256 before) {
        before = repaymentMethodCodes[_loanHash];
        delete repaymentMethodCodes[_loanHash];
    }

    function upsertInvestmentStartTime(bytes32 _loanHash, uint256 _investmentStartTime) internal {
        investmentStartTimes[_loanHash] = _investmentStartTime;
    }

    function removeInvestmentStartTime(bytes32 _loanHash) internal returns (uint256 before) {
        before = investmentStartTimes[_loanHash];
        delete investmentStartTimes[_loanHash];
    }

    function upsertFundCompleteTime(bytes32 _loanHash, uint256 _fundCompleteTime) internal {
        fundCompleteTimes[_loanHash] = _fundCompleteTime;
    }

    function removeFundCompleteTime(bytes32 _loanHash) internal returns (uint256 before) {
        before = fundCompleteTimes[_loanHash];
        delete fundCompleteTimes[_loanHash];
    }

    function upsertLoanStartDate(bytes32 _loanHash, uint256 _loanStartDate) internal {
        loanStartDates[_loanHash] = _loanStartDate;
    }

    function removeLoanStartDate(bytes32 _loanHash) internal returns (uint256 before) {
        before = loanStartDates[_loanHash];
        delete loanStartDates[_loanHash];
    }

    function upsertLoanEndDate(bytes32 _loanHash, uint256 _loanEndDate) internal {
        loanEndDates[_loanHash] = _loanEndDate;
    }

    function removeLoanEndDate(bytes32 _loanHash) internal returns (uint256 before) {
        before = loanEndDates[_loanHash];
        delete loanEndDates[_loanHash];
    }

    function upsertRepaymentNumber(bytes32 _loanHash, uint256 _repaymentNumber) internal {
        repaymentNumbers[_loanHash] = _repaymentNumber;
    }

    function removeRepaymentNumber(bytes32 _loanHash) internal returns (uint256 before) {
        before = repaymentNumbers[_loanHash];
        delete repaymentNumbers[_loanHash];
    }

    function upsertLoanSummary(bytes32 _loanHash, string _loanSummary) internal {
        loanSummaries[_loanHash] = _loanSummary;
    }

    function removeLoanSummary(bytes32 _loanHash) internal returns (string before) {
        before = loanSummaries[_loanHash];
        delete loanSummaries[_loanHash];
    }

    function upsertDetailHTML(bytes32 _loanHash, string _detailHTML) internal {
        detailHTMLs[_loanHash] = _detailHTML;
    }

    function removeDetailHTML(bytes32 _loanHash) internal returns (string before) {
        before = detailHTMLs[_loanHash];
        delete detailHTMLs[_loanHash];
    }

    function upsertStateCode(bytes32 _loanHash, uint256 _stateCode) internal {
        stateCodes[_loanHash] = _stateCode;
    }

    function removeStateCode(bytes32 _loanHash) internal returns (uint256 before) {
        before = stateCodes[_loanHash];
        delete stateCodes[_loanHash];
    }

    function upsertRegistrationDate(bytes32 _loanHash, uint256 _registrationDate) internal {
        registrationDates[_loanHash] = _registrationDate;
    }

    function removeRegistrationDate(bytes32 _loanHash) internal returns (uint256 before) {
        before = registrationDates[_loanHash];
        delete registrationDates[_loanHash];
    }
}
