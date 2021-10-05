pragma solidity >=0.8.7;

contract Record {
    mapping (string=> string) records;
    
    function postRecord(string memory s, string memory key) public {
        require(keccak256(bytes(records[key])) == keccak256(bytes("")), "Duplicate key");
        records[key] = s;
    }
    
    function getRecord(string memory key) public view returns(string memory) {
        return records[key];
    }
}