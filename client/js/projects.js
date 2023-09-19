App = {
  contracts: {},

  init: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.renderProject();
    await App.isLoggedIn();
  },

  loadWeb3: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      Swal.fire({
        icon: "warning",
        title:
          '<h1 style="font-family: Poppins; font-weight: 700;">Please install MetaMask</h1>',
        html: '<p style="font-family: Poppins">In order to use the Dapp, you need to install MetaMask.</p>',
        confirmButtonText: '<a style="font-family: Poppins">Accept</a>',
        confirmButtonColor: "#01bbcc",
      });

      $("#searchInput").prop("disabled", true);
      $("#categorySearchInput").prop("disabled", true);
      $("#statusSearchInput").prop("disabled", true);
      $("#priceSearchInput").prop("disabled", true);
      $("#searchForm button").prop("disabled", true);
    }
  },

  loadAccount: async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    App.account = accounts[0];
  },

  loadContract: async () => {
    try {
      const res = await fetch("ProjectContract.json");
      const ProjectContractJSON = await res.json();
      App.contracts.ProjectContract = TruffleContract(ProjectContractJSON);
      App.contracts.ProjectContract.setProvider(App.web3Provider);
      App.ProjectContract = await App.contracts.ProjectContract.deployed();

      const res2 = await fetch("ProfileContract.json");
      const ProfileContractJSON = await res2.json();
      App.contracts.ProfileContract = TruffleContract(ProfileContractJSON);
      App.contracts.ProfileContract.setProvider(App.web3Provider);
      App.ProfileContract = await App.contracts.ProfileContract.deployed();
    } catch (error) {
      console.error(error);
    }
  },

  renderProject: async () => {
    const projectCount = await App.ProjectContract.projectCount();
    const projectCountNumber = projectCount.toNumber();

    $("#projectsList").empty();

    for (let i = 1; i <= projectCountNumber; i++) {
      const project = await App.ProjectContract.projects(i);
      const projectId = project[0];
      const projectImg = project[1];
      const projectName = project[2];
      const projectDescription = project[3];
      const projectCategory = project[4];
      const projectLink = project[5];
      const projectOwnerIdEncrypt = project[7];
      const projectStatus = project[8];
      const projectPrice = project[9];
      const projectAddress = project[10];
      const projectCreatedAt = project[12];

      let projectHTML = `
        <div class="card bg-dark mb-2 rounded text-white">
          <div class="text-center">
            <img src="https://ipfs.io/ipfs/${projectImg}" alt="Image of ${projectName}" width="100%" class="mb-2 img-fluid rounded">
          </div>
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>Project name: ${projectName}</span>
          </div>
          <div class="card-body">
            <span>Description: ${projectDescription}</span>
            <br>
            <span>Category: ${projectCategory}</span>
            <br>
            <span>Link: <a href="${projectLink}" target="_blank">${projectLink}</a></span>
            <br>
            <span>Owner ID: ${projectOwnerIdEncrypt}</span>
            <br>
            <span>Status: ${projectStatus}</span>
            <br>
            <span>Price: ${projectPrice} ETH</span>
            <p class="text-secondary">
              Identity was created ${new Date(
                projectCreatedAt * 1000
              ).toLocaleString()}
            </p>
      `;

      if (projectStatus == "Available") {
        projectHTML += `
            <div class="mt-3">
              <button data-id="${projectId}" data-price="${projectPrice}" data-address="${projectAddress}" class="buy btn btn-success">Buy</button>
            </div>
          </div>
        </div>`;
      } else {
        projectHTML += `</div></div>`;
      }

      $("#projectsList").append(projectHTML);
    }

    $(document).on("click", ".buy", async function (e) {
      e.preventDefault();
      let id = $(this).data("id");
      let price = $(this).data("price");
      let address = $(this).data("address");

      App.buyProject(id, address, price);
    });
  },

  buyProject: async (id, address, amount) => {
    const price = web3.utils.toWei(amount.toString(), "ether");

    const result = await App.ProjectContract.transfer(id, address, {
      from: App.account,
      value: price,
    });

    window.location.reload();
  },

  searchOne: async (data, searchType, data2) => {
    const result = await App.ProjectContract.searchOne(data, searchType, data2);
    $("#projectsList").empty();

    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        const projectImg = result[i][1];
        const projectName = result[i][2];
        const projectDescription = result[i][3];
        const projectCategory = result[i][4];
        const projectLink = result[i][5];
        const proyectOwnerIdEncrypt = result[i][7];
        const projectStatus = result[i][8];
        const projectPrice = result[i][9];
        const projectCreatedAt = result[i][12];

        $("#projectsList").append(
          `<div class="card bg-dark rounded mb-2  text-white">
          <div class="text-center">
            <img src="https://ipfs.io/ipfs/${projectImg}" alt="Image of ${projectName}" width="100%" class="mb-2 img-fluid rounded">
          </div>
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>Project name: ${projectName}</span>
          </div>
          <div class="card-body">
            <span>Description: ${projectDescription}</span>
            <br>
            <span>Category: ${projectCategory}</span>
            <br>
            <span>Link: <a href="${projectLink}" target="_blank">${projectLink}</a></span>
            <br>
            <span>Owner ID: ${proyectOwnerIdEncrypt}</span>
            <br>
            <span>Status: ${projectStatus}</span>
            <br>
            <span>Price: ${projectPrice} ETH</span>
              <p class="text-secondary">
                Identity was created ${new Date(
                  projectCreatedAt * 1000
                ).toLocaleString()}
              </p>
          </div>
        </div>`
        );
      }
    } else {
      $("#projectsList").append(
        `<div class="card bg-dark rounded mb-2  text-white">
      <div class="card-body">
        No results found...
      </div>
    </div>`
      );
    }
  },

  searchTwo: async (data, data2, searchType, data3) => {
    const result = await App.ProjectContract.searchTwo(
      data,
      data2,
      searchType,
      data3
    );
    $("#projectsList").empty();

    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        const projectId = result[i][0];
        const projectImg = result[i][1];
        const projectName = result[i][2];
        const projectDescription = result[i][3];
        const projectCategory = result[i][4];
        const projectLink = result[i][5];
        const projectOwnerId = result[i][6];
        const proyectOwnerIdEncrypt = result[i][7];
        const projectStatus = result[i][8];
        const projectPrice = result[i][9];
        const projectCreatedAt = result[i][12];

        $("#projectsList").append(
          `<div class="card bg-dark rounded mb-2  text-white">
          <div class="text-center">
            <img src="https://ipfs.io/ipfs/${projectImg}" alt="Image of ${projectName}" width="100%" class="mb-2 img-fluid rounded">
          </div>
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>Project name: ${projectName}</span>
          </div>
          <div class="card-body">
            <span>Description: ${projectDescription}</span>
            <br>
            <span>Category: ${projectCategory}</span>
            <br>
            <span>Link: <a href="${projectLink}" target="_blank">${projectLink}</a></span>
            <br>
            <span>Owner ID: ${proyectOwnerIdEncrypt}</span>
            <br>
            <span>Status: ${projectStatus}</span>
            <br>
            <span>Price: ${projectPrice} ETH</span>
              <p class="text-secondary">
                Identity was created ${new Date(
                  projectCreatedAt * 1000
                ).toLocaleString()}
              </p>
          </div>
        </div>`
        );
      }
    } else {
      $("#projectsList").append(
        `<div class="card bg-dark rounded mb-2  text-white">
      <div class="card-body">
        No results found...
      </div>
    </div>`
      );
    }
  },

  searchThree: async (data, data2, data3, searchType, data4) => {
    const result = await App.ProjectContract.searchThree(
      data,
      data2,
      data3,
      searchType,
      data4
    );
    $("#projectsList").empty();

    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        const projectId = result[i][0];
        const projectImg = result[i][1];
        const projectName = result[i][2];
        const projectDescription = result[i][3];
        const projectCategory = result[i][4];
        const projectLink = result[i][5];
        const projectOwnerId = result[i][6];
        const proyectOwnerIdEncrypt = result[i][7];
        const projectStatus = result[i][8];
        const projectPrice = result[i][9];
        const projectCreatedAt = result[i][12];

        $("#projectsList").append(
          `<div class="card bg-dark rounded mb-2  text-white">
          <div class="text-center">
            <img src="https://ipfs.io/ipfs/${projectImg}" alt="Image of ${projectName}" width="100%" class="mb-2 img-fluid rounded">
          </div>
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>Project name: ${projectName}</span>
          </div>
          <div class="card-body">
            <span>Description: ${projectDescription}</span>
            <br>
            <span>Category: ${projectCategory}</span>
            <br>
            <span>Link: <a href="${projectLink}" target="_blank">${projectLink}</a></span>
            <br>
            <span>Owner ID: ${proyectOwnerIdEncrypt}</span>
            <br>
            <span>Status: ${projectStatus}</span>
            <br>
            <span>Price: ${projectPrice} ETH</span>
              <p class="text-secondary">
                Identity was created ${new Date(
                  projectCreatedAt * 1000
                ).toLocaleString()}
              </p>
          </div>
        </div>`
        );
      }
    } else {
      $("#projectsList").append(
        `<div class="card bg-dark rounded mb-2  text-white">
          <div class="card-body">
            No results found...
          </div>
        </div>`
      );
    }
  },

  searchFour: async (data, data2, data3, data4, searchType, data5) => {
    const result = await App.ProjectContract.searchFour(
      data,
      data2,
      data3,
      data4,
      searchType,
      data5
    );
    $("#projectsList").empty();

    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        const projectId = result[i][0];
        const projectImg = result[i][1];
        const projectName = result[i][2];
        const projectDescription = result[i][3];
        const projectCategory = result[i][4];
        const projectLink = result[i][5];
        const projectOwnerId = result[i][6];
        const proyectOwnerIdEncrypt = result[i][7];
        const projectStatus = result[i][8];
        const projectPrice = result[i][9];
        const projectCreatedAt = result[i][12];

        $("#projectsList").append(
          `<div class="card bg-dark rounded mb-2  text-white">
          <div class="text-center">
            <img src="https://ipfs.io/ipfs/${projectImg}" alt="Image of ${projectName}" width="100%" class="mb-2 img-fluid rounded">
          </div>
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>Project name: ${projectName}</span>
          </div>
          <div class="card-body">
            <span>Description: ${projectDescription}</span>
            <br>
            <span>Category: ${projectCategory}</span>
            <br>
            <span>Link: <a href="${projectLink}" target="_blank">${projectLink}</a></span>
            <br>
            <span>Owner ID: ${proyectOwnerIdEncrypt}</span>
            <br>
            <span>Status: ${projectStatus}</span>
            <br>
            <span>Price: ${projectPrice} ETH</span>
              <p class="text-secondary">
                Identity was created ${new Date(
                  projectCreatedAt * 1000
                ).toLocaleString()}
              </p>
          </div>
        </div>`
        );
      }
    } else {
      $("#projectsList").append(
        `<div class="card bg-dark rounded mb-2  text-white">
          <div class="card-body">
            No results found...
          </div>
        </div>`
      );
    }
  },

  isLoggedIn: async () => {
    const isLogin = await App.ProfileContract.isLoggedIn(App.account);

    if (isLogin) {
      $("#navProfileLogout").append(`
        <a
          class="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdownProfile"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Profile
        </a>
        <ul
          class="dropdown-menu dropdown-menu-end"
          aria-labelledby="navbarDropdownProfile"
        >
          <li>
            <a class="dropdown-item" href="./my_profile.html"
              >My profile</a
            >
          </li>
          <li>
            <a class="dropdown-item" href="#" id="logout">Logout</a>
          </li>
        </ul>
      `);

      $("#navLoginAdd").append(`
        <a class="nav-link" href="./add_projects.html">Add Projects</a>
      `);

      $("#contLogin").empty();
    } else {
      $("#contLogin").append(`
        <a
          class="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Login
        </a>
        <ul
          class="dropdown-menu dropdown-menu-end"
          aria-labelledby="navbarDropdown"
        >
          <li><a class="dropdown-item" href="./login.html">Login</a></li>
          <li>
            <a class="dropdown-item" href="./register.html">Register</a>
          </li>
        </ul>
      `);

      $("#navProfileLogout").empty();
      $("#navLoginAdd").empty();
    }
  },

  logout: async () => {
    const result = await App.ProfileContract.logout(
      "0x528464D05eF8b26c81672A598c9F5883Ab9364d7",
      { from: App.account }
    );
    window.location.href = "./login.html";
  },
};
