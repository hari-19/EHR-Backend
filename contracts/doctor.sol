pragma solidity >=0.8.7;

contract Doctor {
    mapping (string=> string) doctors;
    mapping (string=> string) hospitals;
    
    function postRecord(string memory s, string memory h, string memory key) public {
        require(keccak256(bytes(doctors[key])) == keccak256(bytes("")), "Duplicate key");
        doctors[key] = s;
        hospitals[key] = h;
    }
    
    function updateHospital(string memory h, string memory key) public {
        hospitals[key] = h;
    }

    function getDoctor(string memory key) public view returns(string memory) {
        return doctors[key];
    }

    function getHospital(string memory key) public view returns(string memory) {
        return hospitals[key];
    }
}