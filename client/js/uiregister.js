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

  $(document).on("submit", "#profileForm", async (e) => {
    e.preventDefault();
    Swal.fire({
      title: '<h2 style="font-family: Poppins;">Creating a profile...</h2>',
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

    App.createProfile(
      fileHash,
      $("#firstNameInput").val(),
      $("#lastNameInput").val(),
      $("#birthDayInput").val(),
      $("#personalIdInput").val(),
      $("#passwordInput").val()
    );
  });
});
