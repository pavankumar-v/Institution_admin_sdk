$(document).ready(function () {
  // SIDEBAR TOGGLE
  $(".hamburger").click(function () {
    $(".wrapper").toggleClass("collapse");
  });

  //loader
  $(".loader").css("display", "none");

  $(".sidebar__item").click(function () {
    $(".main-data").css("display", "none");
    $(".loader").css("display", "block");
    $(".sidebar__item").removeClass("active");
    $(this).addClass("active");
  });

  // AJAX REQUEST
  // $("#submit").click(function () {
  //   $.ajax({
  //     url: "/attendance",
  //     method: "POST",
  //     contentType: "application/json",
  //     //    data: JSON.stringify()
  //     success: function (res) {
  //       console.log(res.response);
  //       // $('h1').html(res.response);
  //     },
  //   });
  // });

  // $.get("dashboard", (data, status) => {
  //   $(".main-data").remove();
  //   $(".main-content").append(data);
  //   // if (window.history && window.history.pushState) {
  //   //   history.pushState({}, null, "/dashboard");
  //   // }
  // });

  // $(".sidebar__item").click(function () {
  //   $(".main-data").remove();
  //   const id = $(this).attr("id");
  //   $.get(id.toString(), (data, status) => {
  //     $(".main-content").append(data);
  //     // if (window.history && window.history.pushState) {
  //     //   history.pushState({}, null, id.toString());
  //     // }
  //   });
  // });
});
