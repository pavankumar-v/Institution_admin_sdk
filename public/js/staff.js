$(document).ready(function () {
  function calculate() {
    var arr = $.map($("input:checkbox:checked"), function (e, i) {
      return +e.value;
    });

    return arr;
  }

  calculate();

  $("#checkbox").delegate("input:checkbox", "click", calculate);
  $("#tab1-btn").on("click", function (e) {
    e.preventDefault();
    $(this).addClass("active");
    $("#tab1").css("display", "block");
    $("#tab2").css("display", "none");
    $("#tab2-btn").removeClass("active");
  });
  $("#tab2-btn").on("click", function (e) {
    e.preventDefault();
    $(this).addClass("active");
    $("#tab1").css("display", "none");
    $("#tab2").css("display", "block");
    $("#tab1-btn").removeClass("active");
  });

  $("#staffAuth").on("submit", addStaff);

  addStaff();
  function addStaff(e) {
    e.preventDefault();
    const button = $(this).find("#createStaffAuth");
    const loader = button.find(".btn-loader");
    button.attr("disabled", true);
    button.empty();
    button.append(loader);
    loader.css("display", "block");
    const email = $(this).find("input[name=email]");
    const fullName = $(this).find("input[name=fullName]");
    const department = $(this).find("#department").find(":selected");
    const designation = $(this).find("#designation").find(":selected");
    const semAssigned = calculate();
    // console.log(semassigned);

    $.ajax({
      type: "POST",
      url: "/createStaffAuth",
      contentType: "application/json",
      data: JSON.stringify({
        email: email.val(),
        fullName: fullName.val(),
        department: department.val(),
        designation: designation.val(),
        semAssigned: semAssigned,
      }),
      success: function (res) {
        if (res.response == 1) {
          M.toast({
            html: " <span style='color: white;'>Staff was created successfully<span>",
            classes: "rounded",
          });
          loader.css("display", "none");
          button.append("create staff");
          button.removeAttr("disabled", false);
          email.val("");
          fullName.val("");
        } else {
          M.toast({
            html: `<span style='color: white;'>${res.data}<span>`,
            classes: "rounded",
          });
          loader.css("display", "none");
          button.append("create staff");
          button.removeAttr("disabled", false);
        }
      },
      error: function (res) {
        M.toast({
          html: `<span>${res.data}<span>`,
          classes: "rounded",
        });
      },
    });
  }
});
