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
      const indetyFirstName = indety[1];
      const indetyLastName = indety[2];
      const identyBirthDay = moment(indety[3]).format("LL");
      const indetyUniqueId = indety[5];
      const indetyCreatedAt = indety[7];

      $("#profilesList").append(
        `<div class="card bg-dark rounded mb-2 ms-2 col-md-4 col-12 text-white">
         
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>Profile: ${indetyFirstName} ${indetyLastName}</span>
          </div>
          <div class="card-body">
            <span>Birth Day: ${identyBirthDay}</span>
            <br>
            <span>Unique ID: ${indetyUniqueId}</span>
            <p class="text-secondary">Profile was created ${new Date(
              indetyCreatedAt * 1000
            ).toLocaleString()}</p>
          </div>
        </div>`
      );
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

      $("#idInputEdit").val($(this).data("id"));
      $("#firstNameInputEdit").val($(this).data("fisrt"));
      $("#lastNameInputEdit").val($(this).data("last"));
      $("#birthDayInputEdit").val($(this).data("birth"));
      $("#personalIdInputEdit").val($(this).data("personal"));
    });

    $(document).on("click", ".deleteButton", function (e) {
      e.preventDefault();

      App.deleteProfile($(this).data("id"));
    });
  },

  searchProfile: async (id) => {
    const result = await App.ProfileContract.searchProfile(id);

    const indetyId = result[0];
    const indetyFirstName = result[1];
    const indetyLastName = result[2];
    const identyBirthDay = moment(result[3]).format("LL");
    const indetyUniqueId = result[5];
    const indetyCreatedAt = result[7];

    $("#profilesList").empty();

    if (
      indetyId > 0 &&
      indetyFirstName != "" &&
      indetyLastName != "" &&
      identyBirthDay != ""
    ) {
      $("#profilesList").append(
        `<div class="card bg-dark rounded mb-2 ms-2 col-md-4 col-12 text-white">
          <div class="card-header d-flex justify-content-between align-items-center">
            <span>Profile: ${indetyFirstName} ${indetyLastName}</span>
          </div>
          <div class="card-body">
            <span>Birth Day: ${identyBirthDay}</span>
            <br>
            <span>Unique ID: ${indetyUniqueId}</span>
            <p class="text-secondary">Profile was created ${new Date(
              indetyCreatedAt * 1000
            ).toLocaleString()}</p>
          </div>
        </div>`
      );
    } else {
      $("#profilesList").append(
        `<div class="card bg-dark rounded-0 mb-2  text-white">
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
      "0x083C1ae5Dd668EcEc2eEee69152Ee5E8BDE1CcA6",
      { from: App.account }
    );
    window.location.href = "./login.html";
  },
};
