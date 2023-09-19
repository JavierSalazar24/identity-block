App = {
  contracts: {},

  init: async () => {
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContract();
    await App.render();
    await App.renderIdentity();
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

      $("#pictureInput1").prop("disabled", true);
      $("#firstNameInput").prop("disabled", true);
      $("#lastNameInput").prop("disabled", true);
      $("#addressInput").prop("disabled", true);
      $("#birthDayInput").prop("disabled", true);
      $("#personalIdInput").prop("disabled", true);

      $("#searchInput").prop("disabled", true);

      $("#searchForm button").prop("disabled", true);
      $("#identityForm button").prop("disabled", true);
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
      const res = await fetch("IdentityContract.json");
      const IdentityContractJSON = await res.json();
      App.contracts.IdentityContract = TruffleContract(IdentityContractJSON);
      App.contracts.IdentityContract.setProvider(App.web3Provider);

      App.IdentityContract = await App.contracts.IdentityContract.deployed();
    } catch (error) {
      console.error(error);
    }
  },

  render: async () => {
    $("#account").html(App.account);
    let balance = await App.IdentityContract.balanceOf(App.account);
    balance = balance * 0.000000000000000001;
    balance = balance.toFixed(6);
    $("#balance").text(balance);
  },

  renderIdentity: async () => {
    const identityCount = await App.IdentityContract.identityCount();
    const identityCountNumber = identityCount.toNumber();

    $("#identitiesList").empty();
    for (let i = 1; i <= identityCountNumber; i++) {
      const identy = await App.IdentityContract.identities(i);
      const identyId = identy[0].toNumber();
      const identyFirstName = identy[1];
      const identyLastName = identy[2];
      const identyAdress = identy[3];
      const identyBirthDay = moment(identy[4]).format("LL");
      const identyPersonalId = identy[5];
      const identyUniqueId = identy[7];
      const identyCreatedAt = Date(identy[8] * 1000).toLocaleString();

      let identity_qr = {
        name: `${identyFirstName} ${identyLastName}`,
        adress: identyAdress,
        birthday: identyBirthDay,
        personal_id: identyPersonalId,
        unique_id: identyUniqueId,
        create_at: identyCreatedAt,
      };

      $("#identitiesList").append(
        `<div class="card bg-dark rounded-0 mb-2 text-white">
          <div id="qrCode_${identyPersonalId}" class="mt-2 mb-1 text-center"></div>
          <div class="card-header ">
            <span>Identity: ${identyFirstName} ${identyLastName}</span>
          </div>
          <div class="card-body">
            <span>Address: ${identyAdress}</span>
            <br>
            <span>Birth Day: ${identyBirthDay}</span>
            <br>
            <span>Personal ID: ${identyPersonalId}</span>
            <br>
            <span>Unique ID: ${identyUniqueId}</span>
            <p class="text-secondary">Identity was created ${identyCreatedAt}</p>
            <div class="mt-1 d-flex justify-content-around">
              <div class="buttonDownloadTXT_${identyPersonalId}"></div>
              <div class="buttonDownloadQR_${identyPersonalId}"></div>
            </div>
          </div>
        </div>`
      );

      //QR code generation on the identity information
      const qrCodeElement = document.getElementById(
        `qrCode_${identyPersonalId}`
      );
      const data = JSON.stringify(identity_qr);

      const qr = new qrcode(0, "H");
      qr.addData(data);
      qr.make();

      const qrSvg = qr.createSvgTag();
      qrCodeElement.innerHTML = qrSvg;

      $(`#qrCode_${identyPersonalId} svg`).attr("width", "300px");
      $(`#qrCode_${identyPersonalId} svg`).attr("height", "300px");
      $(`#qrCode_${identyPersonalId} svg`).attr("id", "svgElement");

      //Convert SVG QR code to PNG and be able to download it
      const svgString = document.getElementById("svgElement").outerHTML;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 800;
      canvas.height = 600;

      canvg(canvas, svgString);
      const dataURL = canvas.toDataURL("image/png");

      $(`.buttonDownloadQR_${identyPersonalId}`).html(`
        <a class="btn btn-primary btn-sm" href="${dataURL}"  download="QR-${identyFirstName}_${identyLastName}_${identyPersonalId}.png">Download QR</a>
      `);

      //Creation of text file and button to download TXT about identity information
      const identity = `Identity: ${identyFirstName} ${identyLastName}\nAddress: ${identyAdress}\nBirth Day: ${identyBirthDay}\nPersonal ID: ${identyPersonalId}\nUnique ID: ${identyUniqueId}\n`;

      const archiveBlob = new Blob([identity], {
        type: "text/plain;charset=utf-8",
      });

      $(`.buttonDownloadTXT_${identyPersonalId}`).html(`
        <a class="btn btn-primary btn-sm" href="${URL.createObjectURL(
          archiveBlob
        )}" download="TXT-${identyFirstName}_${identyLastName}_${identyPersonalId}.txt">Download information</a>
      `);
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
      $("#addressInputEdit").val($(this).data("address"));
      $("#birthDayInputEdit").val($(this).data("birth"));
      $("#personalIdInputEdit").val($(this).data("personal"));
    });

    $(document).on("click", ".deleteButton", function (e) {
      e.preventDefault();

      App.deleteIdentity($(this).data("id"));
    });
  },

  createIdentity: async (
    firstName,
    lastName,
    address,
    birthDay,
    personalId
  ) => {
    const result = await App.IdentityContract.createIdentity(
      firstName,
      lastName,
      address,
      birthDay,
      personalId,
      "0x528464D05eF8b26c81672A598c9F5883Ab9364d7",
      { from: App.account, value: web3.utils.toWei("0.0013", "ether") }
    );

    window.location.reload();
  },

  updateIdentity: async (
    id,
    img,
    firstName,
    lastName,
    address,
    birthDay,
    personalId
  ) => {
    const result = await App.IdentityContract.updateIdentity(
      id,
      img,
      firstName,
      lastName,
      address,
      birthDay,
      personalId,
      { from: App.account }
    );

    $("#editModal").modal("hide");

    window.location.reload();
  },

  searchIdentity: async (id) => {
    const result = await App.IdentityContract.searchIdentity(id);

    const identyId = result[0];
    const identyFirstName = result[1];
    const identyLastName = result[2];
    const identyAdress = result[3];
    const identyBirthDay = moment(result[4]).format("LL");
    const identyPersonalId = result[5];
    const identyUniqueId = result[7];
    const identyCreatedAt = Date(result[8] * 1000).toLocaleString();

    let identity_qr = {
      name: `${identyFirstName} ${identyLastName}`,
      adress: identyAdress,
      birthday: identyBirthDay,
      personal_id: identyPersonalId,
      unique_id: identyUniqueId,
      create_at: identyCreatedAt,
    };

    $("#identitiesList").empty();

    if (
      identyId > 0 &&
      identyFirstName != "" &&
      identyLastName != "" &&
      identyAdress != "" &&
      identyBirthDay != "" &&
      identyPersonalId != ""
    ) {
      $("#identitiesList").append(
        `<div class="card bg-dark rounded-0 mb-2  text-white">
          <div id="qrCode" class="mt-2 mb-1 text-center"></div>
          <div class="card-header">
            <span>Identity: ${identyFirstName} ${identyLastName}</span>
          </div>
          <div class="card-body">
            <span>Address: ${identyAdress}</span>
            <br>
            <span>Birth Day: ${identyBirthDay}</span>
            <br>
            <span>Personal ID: ${identyPersonalId}</span>
            <br>
            <span>Unique ID: ${identyUniqueId}</span>
            <p class="text-secondary">
              Identity was created ${identyCreatedAt}
            </p>
            <div class="mt-1 d-flex justify-content-around">
              <div id="buttonDownloadTXT"></div>
              <div id="buttonDownloadQR"></div>
            </div>
          </div>
        </div>`
      );

      //QR code generation on the identity information
      const qrCodeElement = document.getElementById("qrCode");
      const data = JSON.stringify(identity_qr);

      const qr = new qrcode(0, "H");
      qr.addData(data);
      qr.make();

      const qrSvg = qr.createSvgTag();
      qrCodeElement.innerHTML = qrSvg;

      $("#qrCode svg").attr("width", "300px");
      $("#qrCode svg").attr("height", "300px");
      $("#qrCode svg").attr("id", "svgElement");

      //Convert SVG QR code to PNG and be able to download it
      const svgString = document.getElementById("svgElement").outerHTML;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 800;
      canvas.height = 600;

      canvg(canvas, svgString);
      const dataURL = canvas.toDataURL("image/png");

      $("#buttonDownloadQR").append(`
        <a class="btn btn-primary btn-sm" 
        href="${dataURL}" 
        download="QR-${identyFirstName}_${identyLastName}_${identyPersonalId}.png">Download QR</a>
      `);

      //Creation of text file and button to download TXT about identity information
      const identity = `Identity: ${identyFirstName} ${identyLastName}\nAddress: ${identyAdress}\nBirth Day: ${identyBirthDay}\nPersonal ID: ${identyPersonalId}\nUnique ID: ${identyUniqueId}\n`;

      const archiveBlob = new Blob([identity], {
        type: "text/plain;charset=utf-8",
      });

      $("#buttonDownloadTXT").append(`
        <a class="btn btn-primary btn-sm" 
        href="${URL.createObjectURL(archiveBlob)}" 
        download="TXT-${identyFirstName}_${identyLastName}_${identyPersonalId}.txt">Download information</a>
      `);
    } else {
      $("#identitiesList").append(
        `<div class="card bg-dark rounded-0 mb-2  text-white">
          <div class="card-body">
            No results found...
          </div>
        </div>`
      );
    }
  },

  deleteIdentity: async (id) => {
    Swal.fire({
      title:
        '<h1 style="font-family: Poppins; font-weight: 700;">Delete identity</h1>',
      html: '<p style="font-family: Poppins">Are you sure to delete the identity? This option cannot be undone</p>',
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: '<a style="font-family: Poppins">Delete</a>',
      confirmButtonColor: "#01bbcc",
      cancelButtonText: '<a style="font-family: Poppins">Cancel</a>',
      cancelButtonColor: "#dc3545",
    }).then(async (result) => {
      if (result.value) {
        const result = await App.IdentityContract.deleteIdentity(id, {
          from: App.account,
        });

        window.location.reload();
      } else {
        Swal.fire({
          icon: "error",
          title:
            '<h1 style="font-family: Poppins; font-weight: 700;">Canceled</h1>',
          html: '<p style="font-family: Poppins">Identity has not been removed</p>',
          confirmButtonText: '<a style="font-family: Poppins">Accept</a>',
          confirmButtonColor: "#01bbcc",
        });
      }
    });
  },
};
