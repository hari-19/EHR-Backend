pragma solidity >=0.8.7;

contract Record {
    mapping (string=> string[]) id;
    
    function postRecord(string memory s, string memory key) public {
        // require(keccak256(bytes(records[key])) == keccak256(bytes("")), "Duplicate key");
        // records[key] = s;
        id[key].push(s);
    }
    
    function getRecord(string memory key) public view returns(string[] memory) {
        return id[key];
    }
}