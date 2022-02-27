pragma solidity >=0.8.7;

contract User {
    mapping (string=> string) users;
    
    function postUser(string memory s, string memory key) public {
        users[key] = s;
    }
    

    function getUser(string memory key) public view returns(string memory) {
        return users[key];
    }
}