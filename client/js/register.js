App = {
  contracts: {},

  init: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
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

      $("#pictureInput1").prop("disabled", true);
      $("#firstNameInput").prop("disabled", true);
      $("#lastNameInput").prop("disabled", true);
      $("#birthDayInput").prop("disabled", true);
      $("#personalIdInput").prop("disabled", true);
      $("#passwordInput").prop("disabled", true);

      $("#profileForm button").prop("disabled", true);
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

      const res2 = await fetch("IdentityContract.json");
      const IdentityContractJSON = await res2.json();
      App.contracts.IdentityContract = TruffleContract(IdentityContractJSON);
      App.contracts.IdentityContract.setProvider(App.web3Provider);
      App.IdentityContract = await App.contracts.IdentityContract.deployed();
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

  createProfile: async (
    firstName,
    lastName,
    birthDay,
    personalId,
    password
  ) => {
    const identityCount = await App.IdentityContract.identityCount();
    const identityCountNumber = identityCount.toNumber();

    for (let i = 1; i <= identityCountNumber; i++) {
      const indety = await App.IdentityContract.identities(i);
      const indetyFirstName = indety[2];
      const indetyLastName = indety[3];
      const identyBirthDay = indety[5];
      const indetyPersonalId = indety[6];

      if (
        indetyFirstName === firstName &&
        indetyLastName === lastName &&
        identyBirthDay === birthDay &&
        indetyPersonalId === personalId
      ) {
        const profileCount = await App.ProfileContract.profileCount();
        const profileCountNumber = profileCount.toNumber();

        for (let i = 1; i <= profileCountNumber; i++) {
          const indetyProfile = await App.ProfileContract.profiles(i);
          const indetyFirstNameProfile = indetyProfile[2];
          const indetyLastNameProfile = indetyProfile[3];
          const identyBirthDayProfile = indetyProfile[4];
          const indetyPersonalIdProfile = indetyProfile[5];
          if (
            indetyFirstNameProfile === firstName &&
            indetyLastNameProfile === lastName &&
            identyBirthDayProfile === birthDay &&
            indetyPersonalIdProfile === personalId
          ) {
            Swal.fire({
              icon: "error",
              title:
                '<h1 style="font-family: Poppins; font-weight: 700;">Already registered user</h1>',
              html: '<p style="font-family: Poppins">The user has already been registered.</p>',
              confirmButtonText: '<a style="font-family: Poppins">Accept</a>',
              confirmButtonColor: "#01bbcc",
            });
          } else {
            const result = await App.ProfileContract.createProfile(
              firstName,
              lastName,
              birthDay,
              personalId,
              App.account,
              password,
              "0x528464D05eF8b26c81672A598c9F5883Ab9364d7",
              { from: App.account }
            );
            window.location.href = "./login.html";
          }
        }
      }
    }
  },

  isLoggedIn: async () => {
    const isLogin = await App.ProfileContract.isLoggedIn(App.account);

    if (isLogin) {
      window.location.href = "./my_profile.html";
    }
  },
};
