pragma solidity >=0.8.7;

contract RecordKey {
    mapping (string=> string) records;
    
    function postRecordKey(string memory s, string memory key) public {
        records[key] = s;
    }
    

    function getRecordKey(string memory key) public view returns(string memory) {
        return records[key];
    }
}