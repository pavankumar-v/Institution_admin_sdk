$(document).ready(function () {
  // SIDEBAR TOGGLE
  $(".hamburger").click(function () {
    $(".wrapper").toggleClass("collapse");
  });

  //loader
  $(".loader").css("display", "none");
  $(".btn-loader").css("display", "none");

  $(".sidebar__item").click(function () {
    $(".main-data").css("display", "none");
    $(".loader").css("display", "block");
    $(".sidebar__item").removeClass("active");
    $(this).addClass("active");
  });

  // Login and reset password toggle
  $("#forgot-password-btn").on("click", function () {
    $("#form-title").text("Reset Password");
    $("#login").css("display", "none");
    $("#password-reset").css("display", "block");
  });

  $("#back-login-btn").on("click", function (e) {
    // e.preventDefault();
    $("#form-title").text("Login");
    $("#password-reset").css("display", "none");
    $("#login").css("display", "block");
  });
});
