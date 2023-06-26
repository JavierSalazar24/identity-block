// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract IdentityContract {
    constructor() {
        createIdentity(
            "QmX4hQ4ETRodmPLqnVL8n3bgf5jtqrpmqb6QqbMUT9DxzE",
            "Javier Alejandro",
            "Salazar Torres",
            "Valle de Suchil #221",
            "2000-07-04",
            "SATJ000704HDGLRVA4"
        );
    }

    // Identity
    uint public identityCount = 0;

    event IdentityCreated(
        uint id,
        string img,
        string firstName,
        string lastName,
        string addresss,
        string birthDate,
        string personalId,
        bytes32 uniqueId,
        uint createdAt
    );

    event IdentityUpdated(
        uint id,
        string img,
        string firstName,
        string lastName,
        string addresss,
        string birthDate,
        string personalId
    );

    event IdentityDeleted(uint id);

    struct Identity {
        uint id;
        string img;
        string firstName;
        string lastName;
        string addresss;
        string birthDate;
        string personalId;
        bytes32 uniqueId;
        uint createdAt;
    }

    mapping(uint => Identity) public identities;

    function uniqueIdentifier(
        string memory data
    ) public pure returns (bytes32) {
        bytes32 hash = keccak256(bytes(data));
        return hash;
    }

    function createIdentity(
        string memory _img,
        string memory _firstName,
        string memory _lastName,
        string memory _addresss,
        string memory _birthDate,
        string memory _personalId
    ) public {
        identityCount++;
        bytes32 uniqueId = uniqueIdentifier(_personalId);

        identities[identityCount] = Identity(
            identityCount,
            _img,
            _firstName,
            _lastName,
            _addresss,
            _birthDate,
            _personalId,
            uniqueId,
            block.timestamp
        );
        emit IdentityCreated(
            identityCount,
            _img,
            _firstName,
            _lastName,
            _addresss,
            _birthDate,
            _personalId,
            uniqueId,
            block.timestamp
        );
    }

    function updateIdentity(
        uint _id,
        string memory _img,
        string memory _firstName,
        string memory _lastName,
        string memory _addresss,
        string memory _birthDate,
        string memory _personalId
    ) public {
        Identity storage _identity = identities[_id];
        _identity.img = _img;
        _identity.firstName = _firstName;
        _identity.lastName = _lastName;
        _identity.addresss = _addresss;
        _identity.birthDate = _birthDate;
        _identity.personalId = _personalId;

        identities[_id] = _identity;

        emit IdentityUpdated(
            _id,
            _img,
            _firstName,
            _lastName,
            _addresss,
            _birthDate,
            _personalId
        );
    }

    function deleteIdentity(uint _id) public {
        delete identities[_id];
        identityCount--;
    }

    function searchIdentity(
        string memory _data
    ) public view returns (Identity memory) {
        for (uint i = 1; i <= identityCount; i++) {
            if (
                keccak256(bytes(identities[i].personalId)) ==
                keccak256(bytes(_data))
            ) {
                return identities[i];
            }
        }
        return identities[0];
    }

    function balanceOf(address account) public view returns (uint) {
        return address(account).balance;
    }
}
