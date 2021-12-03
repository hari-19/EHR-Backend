pragma solidity >=0.8.7;

contract Record {
    mapping (string=> string) records;
    mapping (string=> string[]) id;
    
    function postRecord(string memory user, string memory s, string memory key) public {
        require(keccak256(bytes(records[key])) == keccak256(bytes("")), "Duplicate key");
        records[key] = s;
        id[user].push(key);
    }
    
    function getRecord(string memory key) public view returns(string memory) {
        return records[key];
    }

    function getKeys(string memory user) public view returns(string[] memory) {
        return id[user];
    }
}