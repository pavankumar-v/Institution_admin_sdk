$(document).ready(function () {
  $("#userTable table tr td #blockUser").on("click", toggelUserActivity);

  toggelUserActivity();
  function toggelUserActivity(e) {
    e.preventDefault();
    var button = $(this).find("#blockUserBtn");
    var loader = $(this).find(".btn-loader").css("display", "block");
    button.empty();
    button.append(loader);
    var uid = $(this).find("input[name=uid]");
    var active = $(this).find("input[name=active]");
    $.ajax({
      type: "POST",
      url: "/blockuser",
      contentType: "application/json",
      data: JSON.stringify({ uid: uid.val(), active: active.val() }),
      success: function (res) {
        loader.css("display", "none");
        if (res.response == 1) {
          M.toast({
            html: ' <span class="bl" style="color: #B8F397;">User Un Blocked<span>',
            classes: "rounded",
          });
          active.val("1");
          button.removeClass("bg__success");
          button.addClass("bg__danger");
          button.append("Block");
        } else {
          M.toast({
            html: ' <span class="bl" style="color: #FFDAD4;">User blocked<span> ',
            classes: "rounded",
          });
          active.val("0");
          button.removeClass("bg__danger");
          button.addClass("bg__success");
          button.append(loader);
          button.append("Un Block");
        }
      },
      error: function (data) {
        loader.css("display", "none");
        M.toast({
          html: "Operation Failed",
          classes: "rounded",
        });
        if (active.val() == 1) {
          button.append("Block");
        } else {
          button.append("Un Block");
        }
      },
    });
  }
});
