// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

library Strings {
    function concatenate(
        string memory _a,
        string memory _b
    ) internal pure returns (string memory) {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        string memory ab = new string(_ba.length + _bb.length);
        bytes memory bab = bytes(ab);

        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) {
            bab[k++] = _ba[i];
        }

        for (uint i = 0; i < _bb.length; i++) {
            bab[k++] = _bb[i];
        }

        return string(bab);
    }
}

contract ProjectContract {
    using Strings for *;

    constructor() {
        createProject(
            "QmRcnWy3suBkHFxq2sQcpXwe3cNiGkduE8QN95QkVwqEqk",
            "Up Trading Experts",
            "Sitio web de la empresa Up Trading Experts",
            "Software",
            "https://uptradingexperts.com/",
            "SATJ000704HDGLRVA4",
            "Available",
            "5",
            0xd89F7A34e8291FBaCd15572201b46d408E5D1DBB,
            payable(0x083C1ae5Dd668EcEc2eEee69152Ee5E8BDE1CcA6)
        );
    }

    //100.001

    uint public projectCount = 0;

    struct Project {
        uint id;
        string img;
        string name;
        string description;
        string category;
        string link;
        string ownerId;
        bytes32 ownerIdEncrypt;
        string projectStatus;
        string price;
        address account;
        bytes32 projectId;
        uint createdAt;
    }

    mapping(uint => Project) public projects;

    function uniqueProject(string memory data) public pure returns (bytes32) {
        bytes32 hash = keccak256(bytes(data));
        return hash;
    }

    function createProject(
        string memory _img,
        string memory _name,
        string memory _description,
        string memory _category,
        string memory _link,
        string memory _ownerId,
        string memory _projectStatus,
        string memory _price,
        address _account,
        address payable recipient
    ) public payable {
        projectCount++;
        bytes32 projectId = uniqueProject(_ownerId.concatenate(_name));
        bytes32 ownerIdEncrypt = uniqueProject(_ownerId);

        projects[projectCount] = Project(
            projectCount,
            _img,
            _name,
            _description,
            _category,
            _link,
            _ownerId,
            ownerIdEncrypt,
            _projectStatus,
            _price,
            _account,
            projectId,
            block.timestamp
        );

        recipient.transfer(msg.value);
    }

    // function updateProject(
    //     uint _id,
    //     string memory _img,
    //     string memory _name,
    //     string memory _description,
    //     string memory _category,
    //     string memory _link,
    //     string memory _ownerId,
    //     string memory _projectStatus,
    //     string memory _price
    // ) public {
    //     bytes32 projectId = uniqueProject(_ownerId.concatenate(_name));
    //     bytes32 ownerIdEncrypt = uniqueProject(_ownerId);

    //     Project storage _project = projects[_id];
    //     _project.img = _img;
    //     _project.name = _name;
    //     _project.description = _description;
    //     _project.category = _category;
    //     _project.link = _link;
    //     _project.ownerId = _ownerId;
    //     _project.ownerIdEncrypt = ownerIdEncrypt;
    //     _project.projectStatus = _projectStatus;
    //     _project.price = _price;
    //     _project.projectId = projectId;

    //     projects[_id] = _project;
    // }

    // function deleteProject(uint _id) public {
    //     delete projects[_id];
    //     projectCount--;
    // }

    function stringToBytes32(
        string memory _string
    ) public pure returns (bytes32) {
        require(bytes(_string).length <= 32, "String too long");

        bytes32 result;
        assembly {
            result := mload(add(_string, 32))
        }
        return result;
    }

    function searchOne(
        string memory _data,
        string memory _searchType,
        bytes32 _data2
    ) public view returns (Project[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= projectCount; i++) {
            if (keccak256(bytes("OwnerId")) == keccak256(bytes(_searchType))) {
                if (projects[i].ownerIdEncrypt == _data2) {
                    count++;
                }
            } else if (
                keccak256(bytes("Category")) == keccak256(bytes(_searchType))
            ) {
                if (
                    keccak256(bytes(projects[i].category)) ==
                    keccak256(bytes(_data))
                ) {
                    count++;
                }
            } else if (
                keccak256(bytes("Status")) == keccak256(bytes(_searchType))
            ) {
                if (
                    keccak256(bytes(projects[i].projectStatus)) ==
                    keccak256(bytes(_data))
                ) {
                    count++;
                }
            } else if (
                keccak256(bytes("Price")) == keccak256(bytes(_searchType))
            ) {
                if (
                    keccak256(bytes(projects[i].price)) ==
                    keccak256(bytes(_data))
                ) {
                    count++;
                }
            }
        }

        Project[] memory matchingProjects = new Project[](count);
        uint256 index = 0;

        for (uint256 i = 1; i <= projectCount; i++) {
            if (keccak256(bytes("OwnerId")) == keccak256(bytes(_searchType))) {
                if (projects[i].ownerIdEncrypt == _data2) {
                    matchingProjects[index] = projects[i];
                    index++;
                }
            } else if (
                keccak256(bytes("Category")) == keccak256(bytes(_searchType))
            ) {
                if (
                    keccak256(bytes(projects[i].category)) ==
                    keccak256(bytes(_data))
                ) {
                    matchingProjects[index] = projects[i];
                    index++;
                }
            } else if (
                keccak256(bytes("Status")) == keccak256(bytes(_searchType))
            ) {
                if (
                    keccak256(bytes(projects[i].projectStatus)) ==
                    keccak256(bytes(_data))
                ) {
                    matchingProjects[index] = projects[i];
                    index++;
                }
            } else if (
                keccak256(bytes("Price")) == keccak256(bytes(_searchType))
            ) {
                if (
                    keccak256(bytes(projects[i].price)) ==
                    keccak256(bytes(_data))
                ) {
                    matchingProjects[index] = projects[i];
                    index++;
                }
            }
        }

        return matchingProjects;
    }

    function searchTwo(
        string memory _data,
        string memory _data2,
        string memory _searchType,
        bytes32 _data3
    ) public view returns (Project[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= projectCount; i++) {
            if (
                keccak256(bytes("OwnerIdCategory")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    projects[i].ownerIdEncrypt == _data3 &&
                    keccak256(bytes(projects[i].category)) ==
                    keccak256(bytes(_data2))
                ) {
                    count++;
                }
            } else if (
                keccak256(bytes("OwnerIdStatus")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    projects[i].ownerIdEncrypt == _data3 &&
                    keccak256(bytes(projects[i].projectStatus)) ==
                    keccak256(bytes(_data2))
                ) {
                    count++;
                }
            } else if (
                keccak256(bytes("OwnerIdPrice")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    projects[i].ownerIdEncrypt == _data3 &&
                    keccak256(bytes(projects[i].price)) ==
                    keccak256(bytes(_data2))
                ) {
                    count++;
                }
            } else if (
                keccak256(bytes("CategoryStatus")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    keccak256(bytes(projects[i].category)) ==
                    keccak256(bytes(_data)) &&
                    keccak256(bytes(projects[i].projectStatus)) ==
                    keccak256(bytes(_data2))
                ) {
                    count++;
                }
            } else if (
                keccak256(bytes("CategoryPrice")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    keccak256(bytes(projects[i].category)) ==
                    keccak256(bytes(_data)) &&
                    keccak256(bytes(projects[i].price)) ==
                    keccak256(bytes(_data2))
                ) {
                    count++;
                }
            } else if (
                keccak256(bytes("StatusPrice")) == keccak256(bytes(_searchType))
            ) {
                if (
                    keccak256(bytes(projects[i].projectStatus)) ==
                    keccak256(bytes(_data)) &&
                    keccak256(bytes(projects[i].price)) ==
                    keccak256(bytes(_data2))
                ) {
                    count++;
                }
            }
        }

        Project[] memory matchingProjects = new Project[](count);
        uint256 index = 0;

        for (uint256 i = 1; i <= projectCount; i++) {
            if (
                keccak256(bytes("OwnerIdCategory")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    projects[i].ownerIdEncrypt == _data3 &&
                    keccak256(bytes(projects[i].category)) ==
                    keccak256(bytes(_data2))
                ) {
                    matchingProjects[index] = projects[i];
                    index++;
                }
            } else if (
                keccak256(bytes("OwnerIdStatus")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    projects[i].ownerIdEncrypt == _data3 &&
                    keccak256(bytes(projects[i].projectStatus)) ==
                    keccak256(bytes(_data2))
                ) {
                    matchingProjects[index] = projects[i];
                    index++;
                }
            } else if (
                keccak256(bytes("OwnerIdPrice")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    projects[i].ownerIdEncrypt == _data3 &&
                    keccak256(bytes(projects[i].price)) ==
                    keccak256(bytes(_data2))
                ) {
                    matchingProjects[index] = projects[i];
                    index++;
                }
            } else if (
                keccak256(bytes("CategoryStatus")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    keccak256(bytes(projects[i].category)) ==
                    keccak256(bytes(_data)) &&
                    keccak256(bytes(projects[i].projectStatus)) ==
                    keccak256(bytes(_data2))
                ) {
                    matchingProjects[index] = projects[i];
                    index++;
                }
            } else if (
                keccak256(bytes("CategoryPrice")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    keccak256(bytes(projects[i].category)) ==
                    keccak256(bytes(_data)) &&
                    keccak256(bytes(projects[i].price)) ==
                    keccak256(bytes(_data2))
                ) {
                    matchingProjects[index] = projects[i];
                    index++;
                }
            } else if (
                keccak256(bytes("StatusPrice")) == keccak256(bytes(_searchType))
            ) {
                if (
                    keccak256(bytes(projects[i].projectStatus)) ==
                    keccak256(bytes(_data)) &&
                    keccak256(bytes(projects[i].price)) ==
                    keccak256(bytes(_data2))
                ) {
                    matchingProjects[index] = projects[i];
                    index++;
                }
            }
        }

        return matchingProjects;
    }

    function searchThree(
        string memory _data,
        string memory _data2,
        string memory _data3,
        string memory _searchType,
        bytes32 _data4
    ) public view returns (Project[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= projectCount; i++) {
            if (
                keccak256(bytes("OwnerIdCategoryStatus")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    projects[i].ownerIdEncrypt == _data4 &&
                    keccak256(bytes(projects[i].category)) ==
                    keccak256(bytes(_data2)) &&
                    keccak256(bytes(projects[i].projectStatus)) ==
                    keccak256(bytes(_data3))
                ) {
                    count++;
                }
            } else if (
                keccak256(bytes("OwnerIdCategoryPrice")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    projects[i].ownerIdEncrypt == _data4 &&
                    keccak256(bytes(projects[i].category)) ==
                    keccak256(bytes(_data2)) &&
                    keccak256(bytes(projects[i].price)) ==
                    keccak256(bytes(_data3))
                ) {
                    count++;
                }
            } else if (
                keccak256(bytes("OwnerIdStatusPrice")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    projects[i].ownerIdEncrypt == _data4 &&
                    keccak256(bytes(projects[i].projectStatus)) ==
                    keccak256(bytes(_data2)) &&
                    keccak256(bytes(projects[i].price)) ==
                    keccak256(bytes(_data3))
                ) {
                    count++;
                }
            } else if (
                keccak256(bytes("CategoryStatusPrice")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    keccak256(bytes(projects[i].category)) ==
                    keccak256(bytes(_data)) &&
                    keccak256(bytes(projects[i].projectStatus)) ==
                    keccak256(bytes(_data2)) &&
                    keccak256(bytes(projects[i].price)) ==
                    keccak256(bytes(_data3))
                ) {
                    count++;
                }
            }
        }

        Project[] memory matchingProjects = new Project[](count);
        uint256 index = 0;

        for (uint256 i = 1; i <= projectCount; i++) {
            if (
                keccak256(bytes("OwnerIdCategoryStatus")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    projects[i].ownerIdEncrypt == _data4 &&
                    keccak256(bytes(projects[i].category)) ==
                    keccak256(bytes(_data2)) &&
                    keccak256(bytes(projects[i].projectStatus)) ==
                    keccak256(bytes(_data3))
                ) {
                    matchingProjects[index] = projects[i];
                    index++;
                }
            } else if (
                keccak256(bytes("OwnerIdCategoryPrice")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    projects[i].ownerIdEncrypt == _data4 &&
                    keccak256(bytes(projects[i].category)) ==
                    keccak256(bytes(_data2)) &&
                    keccak256(bytes(projects[i].price)) ==
                    keccak256(bytes(_data3))
                ) {
                    matchingProjects[index] = projects[i];
                    index++;
                }
            } else if (
                keccak256(bytes("OwnerIdStatusPrice")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    projects[i].ownerIdEncrypt == _data4 &&
                    keccak256(bytes(projects[i].projectStatus)) ==
                    keccak256(bytes(_data2)) &&
                    keccak256(bytes(projects[i].price)) ==
                    keccak256(bytes(_data3))
                ) {
                    matchingProjects[index] = projects[i];
                    index++;
                }
            } else if (
                keccak256(bytes("CategoryStatusPrice")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    keccak256(bytes(projects[i].category)) ==
                    keccak256(bytes(_data)) &&
                    keccak256(bytes(projects[i].projectStatus)) ==
                    keccak256(bytes(_data2)) &&
                    keccak256(bytes(projects[i].price)) ==
                    keccak256(bytes(_data3))
                ) {
                    matchingProjects[index] = projects[i];
                    index++;
                }
            }
        }

        return matchingProjects;
    }

    function searchFour(
        string memory _data2,
        string memory _data3,
        string memory _data4,
        string memory _searchType,
        bytes32 _data5
    ) public view returns (Project[] memory) {
        uint256 count = 0;
        for (uint256 i = 1; i <= projectCount; i++) {
            if (
                keccak256(bytes("OwnerIdCategoryStatusPrice")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    projects[i].ownerIdEncrypt == _data5 &&
                    keccak256(bytes(projects[i].category)) ==
                    keccak256(bytes(_data2)) &&
                    keccak256(bytes(projects[i].projectStatus)) ==
                    keccak256(bytes(_data3)) &&
                    keccak256(bytes(projects[i].price)) ==
                    keccak256(bytes(_data4))
                ) {
                    count++;
                }
            }
        }

        Project[] memory matchingProjects = new Project[](count);
        uint256 index = 0;

        for (uint256 i = 1; i <= projectCount; i++) {
            if (
                keccak256(bytes("OwnerIdCategoryStatusPrice")) ==
                keccak256(bytes(_searchType))
            ) {
                if (
                    projects[i].ownerIdEncrypt == _data5 &&
                    keccak256(bytes(projects[i].category)) ==
                    keccak256(bytes(_data2)) &&
                    keccak256(bytes(projects[i].projectStatus)) ==
                    keccak256(bytes(_data3)) &&
                    keccak256(bytes(projects[i].price)) ==
                    keccak256(bytes(_data4))
                ) {
                    matchingProjects[index] = projects[i];
                    index++;
                }
            }
        }

        return matchingProjects;
    }

    function searchProject(
        string memory _data
    ) public view returns (Project memory) {
        for (uint i = 1; i <= projectCount; i++) {
            if (keccak256(bytes(projects[i].name)) == keccak256(bytes(_data))) {
                return projects[i];
            }
        }
        return projects[0];
    }

    function balanceOf(address account) public view returns (uint) {
        return address(account).balance;
    }

    function transfer(uint _id, address payable recipient) public payable {
        Project storage _project = projects[_id];

        // Verifica que la cantidad enviada sea mayor a cero
        require(msg.value > 0, "Please send ETH with the transaction");

        // Cambia el estado del proyecto a "Vendido"
        _project.projectStatus = "Sold";

        // Transfiere el ETH al destinatario
        recipient.transfer(msg.value);

        // Actualiza el estado del proyecto en el contrato
        projects[_id] = _project;
    }
}
