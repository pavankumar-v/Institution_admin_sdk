$(document).ready(function () {
  // Login and reset password toggle
  $("#forgot-password-btn").on("click", function () {
    $("#form-title").text("Reset Password");
    $("#login-form").css("display", "none");
    $("#password-reset").css("display", "block");
  });

  $("#back-login-btn").on("click", function (e) {
    $("#form-title").text("Login");
    $("#password-reset").css("display", "none");
    $("#login-form").css("display", "block");
  });

  $("#login-form").on("submit", function (e) {
    e.preventDefault();
    const btn = $(this).find("button");
    const loader = btn.children(".btn-loader");
    btnLoaderToggleOn(btn, loader);

    const email = $(this).find("input[name=email]").val();
    const password = $(this).find("input[name=password]").val();

    $.ajax({
      type: "POST",
      url: "/login",
      contentType: "application/json",
      data: JSON.stringify({ email, password }),
      success: function (res) {
        if (res.response == 1) {
          btnLoaderToggleOff(btn, loader, "Logging In..");
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
          location.href = "/";
        } else {
          btnLoaderToggleOff(btn, loader, "Login");
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        }
      },
      error: function (res) {
        btnLoaderToggleOff(btn, loader, "Loggin");
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  });

  $("#password-reset").on("submit", function (e) {
    e.preventDefault();
    const btn = $(this).find("button");
    const innerHtml = $(this).find("button").html();
    const loader = btn.find(".btn-loader");
    btnLoaderToggleOn(btn, loader);

    const email = $(this).find("input[type=email]");
    $.ajax({
      type: "POST",
      url: "/resetpassword",
      contentType: "application/json",
      data: JSON.stringify({ email: email.val() }),
      success: function (res) {
        btnLoaderToggleOff(btn, loader, innerHtml);
        if (res.response == 1) {
          M.toast({
            html: `<span style='color: white;'>${res.data}<span>`,
          });
        } else {
          M.toast({
            html: `<span style='color: white;'>${res.err}<span>`,
          });
        }
      },
      error: function (res) {
        btnLoaderToggleOff(btn, loader, innerHtml);
        M.toast({
          html: ` <span style='color: white;'>${res.err}<span>`,
        });
      },
    });
  });
});
