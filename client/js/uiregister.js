$(document).ready(function () {
  App.init();

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

    Swal.close();

    App.createProfile(
      $("#firstNameInput").val(),
      $("#lastNameInput").val(),
      $("#birthDayInput").val(),
      $("#personalIdInput").val(),
      $("#passwordInput").val()
    );
  });
});
