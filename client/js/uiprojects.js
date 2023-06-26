$(document).ready(function () {
  App.init();

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
        "0x000000000000000000000000000000000000000000000000000000000000000",
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
    $("#priceSearchInput").val("");
    App.renderProject();
  });

  $(document).on("click", "#logout", function (e) {
    e.preventDefault();
    App.logout();
  });
});
