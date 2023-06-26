$(document).ready(function () {
  App.init();

  $(document).on("submit", "#loginForm", async (e) => {
    e.preventDefault();
    App.login($("#usernameInput").val(), $("#passwordInput").val());
  });
});
