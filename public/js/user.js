$(document).ready(function () {
  //   $("#uid").on("click", function (e) {
  //     console.log("invoked");
  //     e.preventDefault();
  //     const uid = $("#uidBlovk").find('input[name="uid"]').val();
  //     console.log(uid);
  //   });
  $("#userTable table tr td #blockUser").on("click", function (e) {
    e.preventDefault();
    var button = $(this).find("#blockUserBtn");
    var loader = button.find(".btn-loader").css("display", "block");
    console.log(loader);
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
        console.log(res.response);
        if (res.response == 1) {
          active.val("1");
          button.removeClass("bg__success");
          button.addClass("bg__danger");
          button.html("Block Temporarly");
        } else {
          active.val("0");
          button.removeClass("bg__danger");
          button.addClass("bg__success");
          button.html("Un Block");
        }
      },
      error: function (data) {
        console.log("failed" + data);
      },
    });
  });
});
