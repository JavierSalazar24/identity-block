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

  login: async (username, password) => {
    try {
      const result = await App.ProfileContract.login(username, password, {
        from: App.account,
      });

      window.location.href = "my_profile.html";
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: '<h1 style="font-family: Poppins; font-weight: 700;">Error</h1>',
        html: `<p style="font-family: Poppins">User already logged in or incorrect credentials</p>`,
        confirmButtonText: '<a style="font-family: Poppins">Accept</a>',
        confirmButtonColor: "#01bbcc",
      });
    }
  },

  isLoggedIn: async () => {
    const isLogin = await App.ProfileContract.isLoggedIn(App.account);

    if (isLogin) {
      window.location.href = "./my_profile.html";
    }
  },
};
