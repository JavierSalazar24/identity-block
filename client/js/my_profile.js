App = {
  contracts: {},

  init: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
    await App.renderProfile();
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

      $("#searchInput").prop("disabled", true);
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
      const res = await fetch("ProfileContract.json");
      const ProfileContractJSON = await res.json();
      App.contracts.ProfileContract = TruffleContract(ProfileContractJSON);
      App.contracts.ProfileContract.setProvider(App.web3Provider);
      App.ProfileContract = await App.contracts.ProfileContract.deployed();

      const res2 = await fetch("ProjectContract.json");
      const ProjectContractJSON = await res2.json();
      App.contracts.ProjectContract = TruffleContract(ProjectContractJSON);
      App.contracts.ProjectContract.setProvider(App.web3Provider);
      App.ProjectContract = await App.contracts.ProjectContract.deployed();
    } catch (error) {
      console.error(error);
    }
  },

  render: async () => {
    $("#account").html(App.account);
    let balance = await App.ProfileContract.balanceOf(App.account);
    balance = balance * 0.000000000000000001;
    balance = balance.toFixed(6);
    $("#balance").text(balance);
  },

  renderProfile: async () => {
    const profileCount = await App.ProfileContract.profileCount();
    const profileCountNumber = profileCount.toNumber();

    $("#profilesList").empty();

    for (let i = 1; i <= profileCountNumber; i++) {
      const indety = await App.ProfileContract.profiles(i);
      const indetyId = indety[0].toNumber();
      const indetyImg = indety[1];
      const indetyFirstName = indety[2];
      const indetyLastName = indety[3];
      const identyBirthDay = moment(indety[4]).format("LL");
      const indetyPersonalId = indety[5];
      const indetyUniqueId = indety[6];
      const indetytAccount = indety[7];
      const indetyCreatedAt = indety[8];

      let account = App.account;
      if (indetytAccount.toUpperCase() == account.toUpperCase()) {
        $("#profilesList").append(
          `<div class="card bg-dark rounded mb-2 text-white">
         
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>Profile: ${indetyFirstName} ${indetyLastName}</span>
          
          </div>
          <div class="card-body">
            <span>Birth Day: ${identyBirthDay}</span>
            <br>
            <span>Personal ID: ${indetyPersonalId}</span>
            <br>
            <span>Unique ID: ${indetyUniqueId}</span>
            <p class="text-secondary">Profile was created ${new Date(
              indetyCreatedAt * 1000
            ).toLocaleString()}</p>
          </div>
        </div>`
        );
      }
    }

    $(document).on("click", ".editButton", function (e) {
      e.preventDefault();

      $(".file-upload-image1").attr(
        "src",
        `https://ipfs.io/ipfs/${$(this).data("img")}`
      );
      $(".file-upload-content1").show();
      $(".image-upload-wrap1").hide();
      $(".image-title1").html($(this).data("img"));

      $("#idInputEdit").val($(this).data("id"));
      $("#firstNameInputEdit").val($(this).data("fisrt"));
      $("#lastNameInputEdit").val($(this).data("last"));
      $("#birthDayInputEdit").val($(this).data("birth"));
      $("#personalIdInputEdit").val($(this).data("personal"));
    });

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
          `<div class="card bg-dark rounded mb-2 text-white">
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

    $(document).on("click", ".editButton_project", function (e) {
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
  },

  updateProfile: async (id, img, firstName, lastName, birthDay, personalId) => {
    const result = await App.ProfileContract.updateProfile(
      id,
      img,
      firstName,
      lastName,
      birthDay,
      personalId,
      { from: App.account }
    );

    $("#editModalProfile").modal("hide");

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

  searchProject: async (data) => {
    const result = await App.ProjectContract.searchProject(data);
    $("#projectsList").empty();

    const projectId = result[1];
    const projectImg = result[1];
    const projectName = result[2];
    const projectDescription = result[3];
    const projectCategory = result[4];
    const projectLink = result[5];
    const proyectOwnerIdEncrypt = result[6];
    const projectStatus = result[7];
    const projectPrice = result[8];
    const projectAccount = result[9];
    const projectCreatedAt = result[10];

    if (projectAccount == App.account) {
      if (
        projectId > 0 &&
        projectImg != "" &&
        projectDescription != "" &&
        projectCategory != "" &&
        projectLink != "" &&
        proyectOwnerIdEncrypt != "" &&
        projectStatus != "" &&
        projectPrice != ""
      ) {
        $("#projectsList").append(
          `<div class="card bg-dark rounded mb-2 text-white">
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
      } else {
        $("#projectsList").append(
          `<div class="card bg-dark rounded mb-2  text-white">
          <div class="card-body">
            No results found...
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

    if (!isLogin) {
      window.location.href = "./login.html";
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
