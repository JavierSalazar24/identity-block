App = {
  contracts: {},

  init: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
    await App.renderProject();
    await App.isLoggedIn();
  },

  loadWeb3: async () => {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: "eth_requestAccounts" });
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

      $("#nameInput").prop("disabled", true);
      $("#descriptionInput").prop("disabled", true);
      $("#categoryInput").prop("disabled", true);
      $("#linkInput").prop("disabled", true);
      $("#ownerIdInput").prop("disabled", true);
      $("#statusInput").prop("disabled", true);
      $("#priceInput").prop("disabled", true);
      $("#pictureInput1").prop("disabled", true);
      $("#searchInput").prop("disabled", true);

      $("#categorySearchInput").prop("disabled", true);
      $("#statusSearchInput").prop("disabled", true);
      $("#priceSearchInput").prop("disabled", true);

      $("#searchForm button").prop("disabled", true);
      $("#projectForm button").prop("disabled", true);
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

  render: async () => {
    $("#account").html(App.account);
    let balance = await App.ProjectContract.balanceOf(App.account);
    balance = balance * 0.000000000000000001;
    balance = balance.toFixed(6);
    $("#balance").text(balance);
  },

  renderProject: async () => {
    const projectCount = await App.ProjectContract.projectCount();
    const projectCountNumber = projectCount.toNumber();

    $("#projectsList").empty();

    for (let i = 1; i <= projectCountNumber; i++) {
      const project = await App.ProjectContract.projects(i);
      const projectId = project[0].toNumber();
      const projectImg = project[1];
      const projectName = project[2];
      const projectDescription = project[3];
      const projectCategory = project[4];
      const projectLink = project[5];
      const projectOwnerId = project[6];
      const projectOwnerIdEncrypt = project[7];
      const projectStatus = project[8];
      const projectPrice = project[9];
      const projectAccount = project[10];
      const projectCreatedAt = project[12];

      let account = App.account;

      if (projectAccount.toUpperCase() == account.toUpperCase()) {
        $("#projectsList").append(
          `<div class="card bg-dark rounded mb-2  text-white">
          <div class="text-center">
            <img src="https://ipfs.io/ipfs/${projectImg}" alt="Image of ${projectName}" width="100%" height="300px" class="rounded mb-1">
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
          </div>
        </div>`
        );
      }
    }

    $(document).on("click", ".editButton", function (e) {
      e.preventDefault();

      $(".file-upload-image").attr(
        "src",
        `https://ipfs.io/ipfs/${$(this).data("img")}`
      );
      $(".file-upload-content").show();
      $(".image-upload-wrap").hide();
      $(".image-title").html($(this).data("img"));

      $("#editModalLabel").text(`Edit project: ${$(this).data("name")}`);
      $("#idInputEdit").val($(this).data("id"));
      $("#nameInputEdit").val($(this).data("name"));
      $("#descriptionInputEdit").val($(this).data("description"));
      $("#categoryInputEdit").val($(this).data("category"));
      $("#linkInputEdit").val($(this).data("link"));
      $("#ownerIdInputEdit").val($(this).data("owner"));
      $("#statusInputEdit").val($(this).data("status"));
      $("#priceInputEdit").val($(this).data("price"));
    });

    $(document).on("click", ".deleteButton", function (e) {
      e.preventDefault();

      App.deleteProject($(this).data("id"));
    });
  },

  createProject: async (
    img,
    name,
    description,
    category,
    link,
    ownerId,
    status,
    price
  ) => {
    const result = await App.ProjectContract.createProject(
      img,
      name,
      description,
      category,
      link,
      ownerId,
      status,
      price,
      App.account,
      { from: App.account }
    );

    window.location.reload();
  },

  updateProject: async (
    id,
    img,
    name,
    description,
    category,
    link,
    ownerId,
    status,
    price
  ) => {
    const result = await App.ProjectContract.updateProject(
      id,
      img,
      name,
      description,
      category,
      link,
      ownerId,
      status,
      price,
      { from: App.account }
    );

    $("#editModal").modal("hide");

    window.location.reload();
  },

  searchOne: async (data, searchType, data2) => {
    const result = await App.ProjectContract.searchOne(data, searchType, data2);
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
        const projectOwnerIdEncrypt = result[i][7];
        const projectStatus = result[i][8];
        const projectPrice = result[i][9];
        const projectAccount = result[i][10];
        const projectCreatedAt = result[i][12];

        let account = App.account;

        if (projectAccount.toUpperCase() == account.toUpperCase()) {
          $("#projectsList").append(
            `<div class="card bg-dark rounded mb-2  text-white">
          <div class="text-center">
            <img src="https://ipfs.io/ipfs/${projectImg}" alt="Image of ${projectName}" width="100%" height="300px" class="rounded mb-1">
          </div>
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>Project name: ${projectName}</span>
            <div>
              <button class="btn btn-success btn-sm editButton" data-id="${projectId}" data-img="${projectImg}" data-name="${projectName}" data-description="${projectDescription}" data-category="${projectCategory}" data-link="${projectLink}" data-owner="${projectOwnerId}" data-status="${projectStatus}" data-price="${projectPrice}" data-bs-toggle="modal" data-bs-target="#editModal">
                <i class="bi bi-pencil-fill"></i>
              </button>
            </div>
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
          </div>
        </div>`
          );
        }
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
        const projectOwnerIdEncrypt = result[i][7];
        const projectStatus = result[i][8];
        const projectPrice = result[i][9];
        const projectAccount = result[i][10];
        const projectCreatedAt = result[i][12];

        let account = App.account;

        if (projectAccount.toUpperCase() == account.toUpperCase()) {
          $("#projectsList").append(
            `<div class="card bg-dark rounded mb-2  text-white">
          <div class="text-center">
            <img src="https://ipfs.io/ipfs/${projectImg}" alt="Image of ${projectName}" width="100%" height="300px" class="rounded mb-1">
          </div>
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>Project name: ${projectName}</span>
            <div>
              <button class="btn btn-success btn-sm editButton" data-id="${projectId}" data-img="${projectImg}" data-name="${projectName}" data-description="${projectDescription}" data-category="${projectCategory}" data-link="${projectLink}" data-owner="${projectOwnerId}" data-status="${projectStatus}" data-price="${projectPrice}" data-bs-toggle="modal" data-bs-target="#editModal">
                <i class="bi bi-pencil-fill"></i>
              </button>
            </div>
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
          </div>
        </div>`
          );
        }
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
        const projectOwnerIdEncrypt = result[i][7];
        const projectStatus = result[i][8];
        const projectPrice = result[i][9];
        const projectAccount = result[i][10];
        const projectCreatedAt = result[i][12];

        let account = App.account;

        if (projectAccount.toUpperCase() == account.toUpperCase()) {
          $("#projectsList").append(
            `<div class="card bg-dark rounded mb-2  text-white">
          <div class="text-center">
            <img src="https://ipfs.io/ipfs/${projectImg}" alt="Image of ${projectName}" width="100%" height="300px" class="rounded mb-1">
          </div>
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>Project name: ${projectName}</span>
            <div>
              <button class="btn btn-success btn-sm editButton" data-id="${projectId}" data-img="${projectImg}" data-name="${projectName}" data-description="${projectDescription}" data-category="${projectCategory}" data-link="${projectLink}" data-owner="${projectOwnerId}" data-status="${projectStatus}" data-price="${projectPrice}" data-bs-toggle="modal" data-bs-target="#editModal">
                <i class="bi bi-pencil-fill"></i>
              </button>
            </div>
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
          </div>
        </div>`
          );
        }
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
        const projectOwnerIdEncrypt = result[i][7];
        const projectStatus = result[i][8];
        const projectPrice = result[i][9];
        const projectAccount = result[i][10];
        const projectCreatedAt = result[i][12];

        let account = App.account;

        if (projectAccount.toUpperCase() == account.toUpperCase()) {
          $("#projectsList").append(
            `<div class="card bg-dark rounded mb-2  text-white">
          <div class="text-center">
            <img src="https://ipfs.io/ipfs/${projectImg}" alt="Image of ${projectName}" width="100%" height="300px" class="rounded mb-1">
          </div>
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>Project name: ${projectName}</span>
            <div>
              <button class="btn btn-success btn-sm editButton" data-id="${projectId}" data-img="${projectImg}" data-name="${projectName}" data-description="${projectDescription}" data-category="${projectCategory}" data-link="${projectLink}" data-owner="${projectOwnerId}" data-status="${projectStatus}" data-price="${projectPrice}" data-bs-toggle="modal" data-bs-target="#editModal">
                <i class="bi bi-pencil-fill"></i>
              </button>
            </div>
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
          </div>
        </div>`
          );
        }
      }
    } else {
      $("#projectsList").append(
        `<div class="card bg-dark rounded mb-2 text-white">
          <div class="card-body">
            No results found...
          </div>
        </div>`
      );
    }
  },

  deleteProject: async (id) => {
    Swal.fire({
      title:
        '<h1 style="font-family: Poppins; font-weight: 700;">Delete project</h1>',
      html: '<p style="font-family: Poppins">Are you sure to delete the project? This option cannot be undone</p>',
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: '<a style="font-family: Poppins">Delete</a>',
      confirmButtonColor: "#01bbcc",
      cancelButtonText: '<a style="font-family: Poppins">Cancel</a>',
      cancelButtonColor: "#dc3545",
    }).then(async (result) => {
      if (result.value) {
        const result = await App.ProjectContract.deleteProject(id, {
          from: App.account,
        });

        window.location.reload();
      } else {
        Swal.fire({
          icon: "error",
          title:
            '<h1 style="font-family: Poppins; font-weight: 700;">Canceled</h1>',
          html: '<p style="font-family: Poppins">Project has not been removed</p>',
          confirmButtonText: '<a style="font-family: Poppins">Accept</a>',
          confirmButtonColor: "#01bbcc",
        });
      }
    });
  },

  isLoggedIn: async () => {
    const isLogin = await App.ProfileContract.isLoggedIn(App.account);

    if (!isLogin) {
      window.location.href = "./login.html";
    }
  },

  logout: async () => {
    const result = await App.ProfileContract.logout({ from: App.account });
    window.location.href = "./login.html";
  },
};
