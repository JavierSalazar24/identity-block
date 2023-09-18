// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ProfileContract {
    constructor() {
        createProfile(
            "QmX4hQ4ETRodmPLqnVL8n3bgf5jtqrpmqb6QqbMUT9DxzE",
            "Daniel",
            "Smith",
            "2000-07-04",
            "SATJ000704HDGLRVA4",
            0x570cadE3c48bBeac8ed2Ad74C38BFa77ac8Dc65E,
            "1234"
        );
    }

    // Profile
    uint public profileCount = 0;

    event ProfileCreated(
        uint id,
        string img,
        string firstName,
        string lastName,
        string birthDate,
        string personalId,
        bytes32 uniqueId,
        address account,
        uint createdAt
    );

    event ProfileUpdated(
        uint id,
        string img,
        string firstName,
        string lastName,
        string birthDate,
        string personalId
    );

    event ProfileDeleted(uint id);

    struct Profile {
        uint id;
        string img;
        string firstName;
        string lastName;
        string birthDate;
        string personalId;
        bytes32 uniqueId;
        address account;
        uint createdAt;
    }

    mapping(uint => Profile) public profiles;

    function uniqueIdentifier(
        string memory data
    ) public pure returns (bytes32) {
        bytes32 hash = keccak256(bytes(data));
        return hash;
    }

    function createProfile(
        string memory _img,
        string memory _firstName,
        string memory _lastName,
        string memory _birthDate,
        string memory _personalId,
        address _account,
        string memory _password
    ) public {
        profileCount++;
        bytes32 uniqueId = uniqueIdentifier(_personalId);

        profiles[profileCount] = Profile(
            profileCount,
            _img,
            _firstName,
            _lastName,
            _birthDate,
            _personalId,
            uniqueId,
            _account,
            block.timestamp
        );
        emit ProfileCreated(
            profileCount,
            _img,
            _firstName,
            _lastName,
            _birthDate,
            _personalId,
            uniqueId,
            _account,
            block.timestamp
        );

        bytes32 newSessionHash = keccak256(
            abi.encodePacked(msg.sender, block.timestamp)
        );

        users[msg.sender] = User(_personalId, _password, true, newSessionHash);
    }

    function updateProfile(
        uint _id,
        string memory _img,
        string memory _firstName,
        string memory _lastName,
        string memory _birthDate,
        string memory _personalId
    ) public {
        Profile storage _profile = profiles[_id];
        _profile.img = _img;
        _profile.firstName = _firstName;
        _profile.lastName = _lastName;
        _profile.birthDate = _birthDate;
        _profile.personalId = _personalId;

        profiles[_id] = _profile;

        emit ProfileUpdated(
            _id,
            _img,
            _firstName,
            _lastName,
            _birthDate,
            _personalId
        );
    }

    function deleteProfile(uint _id) public {
        delete profiles[_id];
        profileCount--;
    }

    function searchProfile(bytes32 _data) public view returns (Profile memory) {
        for (uint i = 1; i <= profileCount; i++) {
            if (profiles[i].uniqueId == _data) {
                return profiles[i];
            }
        }
        return profiles[0];
    }

    function balanceOf(address account) public view returns (uint) {
        return address(account).balance;
    }

    struct User {
        string username;
        string password;
        bool isLoggedIn;
        bytes32 sessionHash;
    }

    mapping(address => User) public users;

    event UserRegistered(
        address userAddress,
        string username,
        bytes32 sessionHash
    );
    event UserLoggedIn(
        address userAddress,
        string username,
        bytes32 sessionHash
    );
    event UserLoggedOut(address userAddress, string username);

    function login(string memory username, string memory password) public {
        User storage user = users[msg.sender];

        require(
            keccak256(bytes(user.username)) == keccak256(bytes(username)),
            "Invalid username"
        );
        require(
            keccak256(bytes(user.password)) == keccak256(bytes(password)),
            "Invalid password"
        );
        require(!user.isLoggedIn, "User already logged in");

        bytes32 newSessionHash = keccak256(
            abi.encodePacked(msg.sender, block.timestamp)
        );
        user.isLoggedIn = true;
        user.sessionHash = newSessionHash;

        emit UserLoggedIn(msg.sender, username, newSessionHash);
    }

    function isLoggedIn(address userAddress) public view returns (bool) {
        return users[userAddress].isLoggedIn;
    }

    function getSessionHash(address userAddress) public view returns (bytes32) {
        require(users[userAddress].isLoggedIn, "User is not logged in");
        return users[userAddress].sessionHash;
    }

    function logout() public {
        User storage user = users[msg.sender];

        require(user.isLoggedIn, "User is not logged in");

        user.isLoggedIn = false;
        emit UserLoggedOut(msg.sender, user.username);
    }
}
