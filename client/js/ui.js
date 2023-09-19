$(document).ready(function () {
  App.init();

  $(document).on("submit", "#identityForm", async (e) => {
    e.preventDefault();

    Swal.fire({
      title: '<h2 style="font-family: Poppins;">Creating a identity...</h2>',
      allowEscapeKey: false,
      allowOutsideClick: false,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    Swal.close();

    App.createIdentity(
      $("#firstNameInput").val(),
      $("#lastNameInput").val(),
      $("#addressInput").val(),
      $("#birthDayInput").val(),
      $("#personalIdInput").val()
    );
  });

  $(document).on("submit", "#searchForm", (e) => {
    e.preventDefault();
    App.searchIdentity($("#searchInput").val());
  });

  $(document).on("reset", "#searchForm", () => {
    App.renderIdentity();
  });
});
