// BUTTON TOGGLER
function btnLoaderToggleOn(btn, loader) {
  btn.attr("disabled", true);
  btn.empty();
  btn.append(loader);
  loader.toggle();
}
function btnLoaderToggleOff(btn, loader, text) {
  loader.toggle();
  btn.append(text);
  btn.attr("disabled", false);
}

$(document).ready(function () {
  // SIDEBAR TOGGLE
  $(".hamburger").click(function () {
    $(".wrapper").toggleClass("collapse");
  });

  //loader
  $(".container .loader").hide();
  $(".btn-loader").hide();

  $(".sidebar__item").click(function () {
    $(".main-data").css("display", "none");
    $(".loader").css("display", "block");
    $(".sidebar__item").removeClass("active");
    $(this).addClass("active");
  });

  // expand toggle
  $("#tab2 #expand-more").on("click", function (e) {
    const cardList = $(this).parents(".card-list");
    cardList.children(".content-expand").toggle();
  });

  $(document).on("click", "#more-vert", function (e) {
    const more_menu = $(this).parent().parent().children("#more-menu");
    more_menu.toggle();
  });

  // close alert
  $("#alert-close").on("click", function () {
    $(this).parent().remove();
  });

  $(".collapsible").collapsible();

  $(document).ready(function () {
    $(".modal").modal();
  });
});
