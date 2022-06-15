$(document).ready(function () {
  function semSeletected() {
    var arr = $.map($("input:checkbox:checked"), function (e, i) {
      return +e.value;
    });
    $(".assignedSem").text("Checked sem: " + arr.join(","));
    return arr;
  }

  semSeletected();
  function subjectSeleted() {
    var sub = $.map($("input:checkbox:checked"), function (e, i) {
      return +e.value;
    });
    // $(".assignedSem").text("Checked sem: " + arr.join(","));
    console.log(sub);
    return sub;
  }

  subjectSeleted();
  $("#subjectCheckBox").delegate(
    "input[type=checkbox]",
    "click",
    subjectSeleted
  );
  $("#checkbox").delegate("input[type=checkbox]", "click", semSeletected);
  $("#staff-view #checkbox").delegate(
    "input[type=checkbox]",
    "click",
    function (param) {
      $(".progress").show();
      var sem = semSeletected();
      const branch = $("#department").find(":selected").val();

      $.ajax({
        type: "POST",
        url: "/renderSubjects",
        contentType: "application/json",
        data: JSON.stringify({
          sem,
          branch,
        }),
        success: function (res) {
          if (res.response) {
            $(".progress").hide();

            $("#load-subjects .card-content").empty();
            M.toast({
              html: `<span style='color: white;'>${res.message}<span>`,
            });

            console.log(res.subjects);
            for (var i = 0; i < res.subjects.length; i++) {
              var html = `
              <div class="subjectCheckBox display-flex flex-c j-start m-r col s3 m-b">
              <h5 class="title">sem ${sem[i]}</h5>
                            
              `;
              if (res.subjects[i].length > 0) {
                $.each(res.subjects[i], function () {
                  console.log(this);
                  var val = branch.toLowerCase() + "/" + sem[i] + "/" + this.id;

                  html =
                    html +
                    `
                    <label>
                    <input type="checkbox" class="filled-in" value="${val}"
                    " />
                    <span>${this.subId.toUpperCase()}</span>
                </label>`;
                });
              } else {
                html = html + ` No subjects found! `;
              }

              html =
                html +
                `
              </div>
              `;

              $("#load-subjects .card-content").append(html);
            }
          } else {
            M.toast({
              html: `<span style='color: white;'>${res.message}<span>`,
            });
          }
        },
      });
    }
  );

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

  var code;
  $("#email-verify-form #send-code").on("click", function (e) {
    e.preventDefault();
    const btn = $(this);
    const loader = btn.children(".btn-loader");
    btnLoaderToggleOn(btn, loader);
    const emailVerDiv = $("#email-ver");
    const email = $(this).parent().find("input[type=email]");
    email.attr("readonly", true);

    $.ajax({
      type: "POST",
      url: "/sendverificationcode",
      contentType: "application/json",
      data: JSON.stringify({
        email: email.val(),
      }),
      success: function (res) {
        console.log(res);
        if (res.response) {
          btnLoaderToggleOff(
            btn,
            loader,
            '<span class="material-icons-outlined">done</span>Verificatoin code sent'
          );
          emailVerDiv.show();
          btn.attr("disabled", true);
          code = res.code;
        } else {
          email.attr("readonly", false);
          btnLoaderToggleOff(btn, loader, "Resend Code");
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        }
      },
      error: function (res) {
        email.attr("readonly", false);
        btnLoaderToggleOff(btn, loader, "Resend Code");
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  });

  $("input[name=verificationCode]").on("input", function () {
    console.log($(this).val());
    const msg = $(".msg");
    const loader = msg.children(".btn-loader").toggle();
    if ($(this).val() == code) {
      loader.remove();
      msg.css("color", "green");
      msg.text("Email Verified");
      $("#staffAuth").show();
      $("#email-ver").remove();
    }
  });

  $("#staffAuth").on("submit", function (e) {
    e.preventDefault();
    const btn = $(this).find("#createStaffAuth");
    const loader = btn.find(".btn-loader");

    btnLoaderToggleOn(btn, loader);

    const email = $("#email-verify-form").find("input[name=email]").val();
    const fullName = $(this).find("input[name=fullName]").val();
    const department = $(this).find("#department").find(":selected").val();
    const designation = $(this).find("#designation").find(":selected").val();
    var semAssigned = calculate();

    if (designation == "hod") {
      $("#checkbox").find("input[type=checkbox]").attr("checked", true);
      $("#checkbox").find("input[type=checkbox]").attr("disabled", true);
      semAssigned = [1, 2, 3, 4, 5, 6, 7, 8];
    }

    console.log(semAssigned);

    $.ajax({
      type: "POST",
      url: "/createStaffAuth",
      contentType: "application/json",
      data: JSON.stringify({
        email: email,
        fullName: fullName,
        department: department,
        designation: designation,
        semAssigned: semAssigned,
      }),
      success: function (res) {
        btnLoaderToggleOff(btn, loader, "Create");
        if (res.response == 1) {
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
          $("#staffAuth")[0].reset();
          $("#tab1").children("#email-verify-form").remove();
          $("#tab1").prepend(`
              <form class="display-grid" id="email-verify-form">
                <div class="form-input">
                  <label for="">Email</label>
                  <input type="email" name="email" id="" required />
                </div>
                <div class="form-input" id="email-ver" style="display: none;">
                  <label for="">enter code</label>
                  <input type="number" name="verificationCode" maxlength="6" value="" />
                </div>
                <button class="btnn btnn-small m-t" id="send-code">
                  <div class="btn-loader" style="display: none;"></div>
                    send email verification code
                </button>
                <div></div>
                <div class="msg">
                <div class="btn-loader" style="display: none;"></div>
                </div>

              </form>
          `);
          $("#staffAuth").toggle();
        } else {
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        }
      },
      error: function (res) {
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  });

  $("#filter").on("input", function (e) {
    console.log("invok");
    // Retrieve the input field text and reset the count to zero
    var filter = $(this).val(),
      count = 0;

    // Loop through the comment list
    $(".collapsible li").each(function () {
      // If the list item does not contain the text phrase fade it out
      if ($(this).text().search(new RegExp(filter, "i")) < 0) {
        $(this).hide(); // MY CHANGE

        // Show the list item if the phrase matches and increase the count by 1
      } else {
        $(this).show(); // MY CHANGE
        count++;
      }
    });
  });

  $("#view-staff").on("click", function () {
    console.log("dhgth");
    $("#preloader-wrapper").addClass(" active");
  });

  $(document).on("focusout", "#edit-name", function () {
    const docId = $("#staff-view").children("input[name=docId]").val();
    const name = $(this).text();

    console.log(name.trim());
  });
});
