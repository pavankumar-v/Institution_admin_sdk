$(document).ready(function () {
  $("#password-reset").on("submit", function (e) {
    e.preventDefault();
    const button = $(this).find("button");
    const innerHtml = $(this).find("button").html();
    const loader = button.find(".btn-loader");
    button.attr("disabled", true);
    button.empty();
    button.append(loader);
    loader.css("display", "block");
    const email = $(this).find("input[type=email]");
    $.ajax({
      type: "POST",
      url: "/resetpassword",
      contentType: "application/json",
      data: JSON.stringify({ email: email.val() }),
      success: function (res) {
        loader.css("display", "none");
        button.html(innerHtml);
        button.attr("disabled", false);
        if (res.response == 1) {
          M.toast({
            html: `<span style='color: white;'>${res.data}<span>`,
            classes: "rounded",
          });
        } else {
          M.toast({
            html: `<span style='color: white;'>${res.err}<span>`,
            classes: "rounded",
          });
        }
      },
      error: function (res) {
        loader.css("display", "none");
        button.html(innerHtml);
        button.attr("disabled", false);
        M.toast({
          html: ` <span style='color: white;'>${res.err}<span>`,
          classes: "rounded",
        });
      },
    });
  });
});
