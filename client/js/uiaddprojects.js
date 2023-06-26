function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $(".image-upload-wrap").hide();

      $(".file-upload-image").attr("src", e.target.result);
      $(".file-upload-content").show();

      $(".image-title").html(input.files[0].name);
    };

    reader.readAsDataURL(input.files[0]);
  } else {
    removeUpload();
  }
}

function removeUpload() {
  $(".file-upload-input").replaceWith($(".file-upload-input").clone());
  $(".file-upload-content").hide();
  $(".image-upload-wrap").show();
}

$(".image-upload-wrap").bind("dragover", function () {
  $(".image-upload-wrap").addClass("image-dropping");
});
$(".image-upload-wrap").bind("dragleave", function () {
  $(".image-upload-wrap").removeClass("image-dropping");
});

function readURL1(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $(".image-upload-wrap1").hide();

      $(".file-upload-image1").attr("src", e.target.result);
      $(".file-upload-content1").show();

      $(".image-title1").html(input.files[0].name);
    };

    reader.readAsDataURL(input.files[0]);
  } else {
    removeUpload1();
  }
}

function removeUpload1() {
  $(".file-upload-input1").replaceWith($(".file-upload-input1").clone());
  $(".file-upload-content1").hide();
  $(".image-upload-wrap1").show();
}

$(".image-upload-wrap1").bind("dragover", function () {
  $(".image-upload-wrap1").addClass("image-dropping1");
});
$(".image-upload-wrap1").bind("dragleave", function () {
  $(".image-upload-wrap1").removeClass("image-dropping1");
});

$(document).ready(function () {
  App.init();

  const projectId = "2RAe8b78Is3QmCuI7PPFKStT98F";
  const projectSecret = "5819c02d06ec648d807be0d2b233a7fb";
  const authorizationToken = btoa(`${projectId}:${projectSecret}`);

  $(document).on("submit", "#projectForm", async (e) => {
    e.preventDefault();

    Swal.fire({
      title: '<h2 style="font-family: Poppins;">Creating a new project...</h2>',
      allowEscapeKey: false,
      allowOutsideClick: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const fileInput = document.getElementById("pictureInput1");
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
      method: "POST",
      headers: {
        authorization: `Basic ${authorizationToken}`,
      },
      body: formData,
    });

    const data = await response.json();
    const fileHash = data.Hash;

    Swal.close();

    App.createProject(
      fileHash,
      $("#nameInput").val(),
      $("#descriptionInput").val(),
      $("#categoryInput").val(),
      $("#linkInput").val(),
      $("#ownerIdInput").val(),
      $("#statusInput").val(),
      $("#priceInput").val()
    );
  });

  $(document).on("submit", "#projectFormEdit", async (e) => {
    e.preventDefault();

    let fileHash = "";

    if ($("#pictureInput").val() == "") {
      fileHash = $(".image-title").text();
    } else {
      Swal.fire({
        title: '<h2 style="font-family: Poppins;">Saving project...</h2>',
        allowEscapeKey: false,
        allowOutsideClick: false,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const fileInput = document.getElementById("pictureInput");
      const file = fileInput.files[0];
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
        method: "POST",
        headers: {
          authorization: `Basic ${authorizationToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      fileHash = data.Hash;

      Swal.close();
    }

    App.updateProject(
      $("#idInputEdit").val(),
      fileHash,
      $("#nameInputEdit").val(),
      $("#descriptionInputEdit").val(),
      $("#categoryInputEdit").val(),
      $("#linkInputEdit").val(),
      $("#ownerIdInputEdit").val(),
      $("#statusInputEdit").val(),
      $("#priceInputEdit").val()
    );
  });

  $(document).on("change", "#categoryInput", (e) => {
    e.preventDefault();
    let categrory = $("#categoryInput").val();
    if (categrory == "Software") {
      $("#contCategory").html(`
        <input type="text" name="link" placeholder="Enter the link to demo" class="form-control bg-dark text-white inputs" required id="linkInput" />
        <label for="linkInput">Enter the link to demo</label>
      `);
    } else if (categrory == "Video games") {
      $("#contCategory").html(`
        <input type="text" name="link" placeholder="Enter the link to demo" class="form-control bg-dark text-white inputs" required id="linkInput" />
        <label for="linkInput">Enter the link to demo</label>
      `);
    } else if (categrory == "Applications") {
      $("#contCategory").html(`
        <input type="text" name="link" placeholder="Enter the link to demo" class="form-control bg-dark text-white inputs" required id="linkInput" />
        <label for="linkInput">Enter the link to demo</label>
      `);
    } else if (categrory == "Architecture") {
      $("#contCategory").html(`
        <input type="text" name="link" placeholder="Enter the link to the location" class="form-control bg-dark text-white inputs" required id="linkInput" />
        <label for="linkInput">Enter the link to the location</label>
      `);
    } else if (categrory == "Design") {
      $("#contCategory").html(`
        <input type="text" name="link" placeholder="Enter your portfolio link" class="form-control bg-dark text-white inputs" required id="linkInput" />
        <label for="linkInput">Enter your portfolio link</label>
      `);
    } else if (categrory == "Marketing") {
      $("#contCategory").html(`
        <input type="text" name="link" placeholder="Enter your portfolio link" class="form-control bg-dark text-white inputs" required id="linkInput" />
        <label for="linkInput">Enter your portfolio link</label>
      `);
    }
  });

  $(document).on("submit", "#searchForm", (e) => {
    e.preventDefault();

    let ownerID = $("#searchInput").val();
    let category = $("#categorySearchInput").val();
    let status = $("#statusSearchInput").val();
    let price = $("#priceSearchInput").val();

    if (ownerID == "" && category == "All" && status == "All" && price == "") {
      App.renderProject();
    } else if (
      ownerID != "" &&
      category == "All" &&
      status == "All" &&
      price == ""
    ) {
      App.searchOne(ownerID, "OwnerId", ownerID);
    } else if (
      ownerID == "" &&
      category != "All" &&
      status == "All" &&
      price == ""
    ) {
      App.searchOne(
        category,
        "Category",
        "0x000000000000000000000000000000000000000000000000000000000000000"
      );
    } else if (
      ownerID == "" &&
      category == "All" &&
      status != "All" &&
      price == ""
    ) {
      App.searchOne(
        status,
        "Status",
        "0x000000000000000000000000000000000000000000000000000000000000000"
      );
    } else if (
      ownerID == "" &&
      category == "All" &&
      status == "All" &&
      price != ""
    ) {
      App.searchOne(
        price,
        "Price",
        "0x000000000000000000000000000000000000000000000000000000000000000"
      );
    } else if (
      ownerID != "" &&
      category != "All" &&
      status == "All" &&
      price == ""
    ) {
      App.searchTwo(
        "0x000000000000000000000000000000000000000000000000000000000000000",
        category,
        "OwnerIdCategory",
        ownerID
      );
    } else if (
      ownerID != "" &&
      category == "All" &&
      status != "All" &&
      price == ""
    ) {
      App.searchTwo(
        "0x000000000000000000000000000000000000000000000000000000000000000",
        status,
        "OwnerIdStatus",
        ownerID
      );
    } else if (
      ownerID != "" &&
      category == "All" &&
      status == "All" &&
      price != ""
    ) {
      App.searchTwo(
        "0x000000000000000000000000000000000000000000000000000000000000000",
        price,
        "OwnerIdPrice",
        ownerID
      );
    } else if (
      ownerID == "" &&
      category != "All" &&
      status != "All" &&
      price == ""
    ) {
      App.searchTwo(
        category,
        status,
        "CategoryStatus",
        "0x000000000000000000000000000000000000000000000000000000000000000"
      );
    } else if (
      ownerID == "" &&
      category != "All" &&
      status == "All" &&
      price != ""
    ) {
      App.searchTwo(
        category,
        price,
        "CategoryPrice",
        "0x000000000000000000000000000000000000000000000000000000000000000"
      );
    } else if (
      ownerID == "" &&
      category == "All" &&
      status != "All" &&
      price != ""
    ) {
      App.searchTwo(
        status,
        price,
        "StatusPrice",
        "0x000000000000000000000000000000000000000000000000000000000000000"
      );
    } else if (
      ownerID != "" &&
      category != "All" &&
      status != "All" &&
      price == ""
    ) {
      App.searchThree(
        "0x000000000000000000000000000000000000000000000000000000000000000",
        category,
        status,
        "OwnerIdCategoryStatus",
        ownerID
      );
    } else if (
      ownerID != "" &&
      category != "All" &&
      status == "All" &&
      price != ""
    ) {
      App.searchThree(
        "0x000000000000000000000000000000000000000000000000000000000000000",
        category,
        price,
        "OwnerIdCategoryPrice",
        ownerID
      );
    } else if (
      ownerID != "" &&
      category == "All" &&
      status != "All" &&
      price != ""
    ) {
      App.searchThree(
        "0x000000000000000000000000000000000000000000000000000000000000000",
        status,
        price,
        "OwnerIdStatusPrice",
        ownerID
      );
    } else if (
      ownerID == "" &&
      category != "All" &&
      status != "All" &&
      price != ""
    ) {
      App.searchThree(
        category,
        status,
        price,
        "CategoryStatusPrice",
        "0x000000000000000000000000000000000000000000000000000000000000000"
      );
    } else if (
      ownerID != "" &&
      category != "All" &&
      status != "All" &&
      price != ""
    ) {
      App.searchFour(
        category,
        status,
        price,
        "OwnerIdCategoryStatusPrice",
        ownerID
      );
    }
  });

  $(document).on("reset", "#searchForm", () => {
    $("#categorySearchInput").val("All");
    $("#statusSearchInput").val("All");
    $("#priceSearchInput").val("All");
    $("#priceSearchInput").val("x");
    App.renderProject();
  });

  $(document).on("click", "#logout", function (e) {
    e.preventDefault();
    App.logout();
  });
});
