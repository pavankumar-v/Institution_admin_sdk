$(document).ready(function () {
  function semSeletected() {
    var arr = $.map($(".semCheckbox:checked"), function (e, i) {
      return +e.value;
    });
    $(".assignedSem").text("Checked sem: " + arr.join(","));
    return arr;
  }

  semSeletected();

  $("#checkbox").delegate(".semCheckboc", "click", semSeletected);

  function subSelected() {
    var sub = $.map($(".subCheckbox:checked"), function (e, i) {
      return e.value;
    });

    return sub;
  }

  subSelected();
  $(document).delegate("#subject-checkbox .subCheckbox", "click", subSelected);

  $(document).on("click", "#assign-subject-btn", function (e) {
    const docId = $("#staff-view").children("input[name=docId]").val();
    const subjectsAssigned = subSelected();
    const semAssigned = semSeletected();

    if (subjectsAssigned.length > 0) {
      var res = confirm("are you sure ?");
      if (res) {
        console.log(docId);
        const btn = $(this);
        const loader = btn.children(".btn-loader");
        btnLoaderToggleOn(btn, loader);
        $("#subjects-list").children(".icon-loader").show();

        $.ajax({
          type: "post",
          url: "/assignSubjects",
          contentType: "application/json",
          data: JSON.stringify({ docId, subjectsAssigned, semAssigned }),
          dataType: "json",
          success: function (res) {
            btnLoaderToggleOff(btn, loader, "Assign");
            if (res.response) {
              $(document).find("#subjects-ul").empty();

              var html;
              for (let i = 0; i < subjectsAssigned.length; i++) {
                var subject = subjectsAssigned[i];
                var sub = subjectsAssigned[i].split("/");
                html = `
                <li class="m-b p-sm bg-pri-c rounded">
                  <input type="hidden" name="subjectValue" value="${subject}">
                  <p class="display-flex j-start j-space-between captize">
                        <b>
                          ${sub[4]},
                          <i class="hint">
                          ${sub[3].toUpperCase()}
                          </i>
                        </b>
                        <span class="material-symbols-rounded clr-err m-l del-icon rounded-sm p"
                        id="subject-delete-btn">
                            link_off
                            </span>



                  </p>
              </li>
                `;

                $(document).find("#subjects-ul").append(html);
              }
            }

            M.toast({
              html: `<span style='color: white;'>${res.message}<span>`,
            });
            $("#subjects-list").children(".icon-loader").hide();
          },

          error: function (res) {
            btnLoaderToggleOn(btn, loader);
            M.toast({
              html: `<span style='color: white;'>${res.message}<span>`,
            });
          },
        });
      }
    }
  });

  $("#staff-view #checkbox").delegate(
    "input[type=checkbox]",
    "click",
    function (param) {
      $(".progress").show();
      var sem = semSeletected();
      const branch = $("#department").val();
      const docId = $("#staff-view").children("input[name=docId]").val();

      console.log(branch);

      $.ajax({
        type: "POST",
        url: "/renderSubjects",
        contentType: "application/json",
        data: JSON.stringify({
          sem,
          branch,
          docId,
        }),
        success: function (res) {
          $(".progress").hide();
          if (res.response) {
            $("#load-subjects .card-content").empty();
            M.toast({
              html: `<span style='color: white;'>${res.message}<span>`,
            });

            for (var i = 0; i < res.subjects.length; i++) {
              var html = `
              <div class="subjectCheckBox display-flex flex-c j-start m-r col s3 m-b" id="subject-checkbox">
              <h5 class="title">sem ${sem[i]}</h5>
                            
              `;
              if (res.subjects[i].length > 0) {
                $.each(res.subjects[i], function () {
                  var val =
                    branch.toLowerCase() +
                    "/" +
                    sem[i] +
                    "/" +
                    this.id +
                    "/" +
                    this.subId +
                    "/" +
                    this.name;

                  var foo = res.existingSub.includes(val);

                  html =
                    html +
                    `
                    <label>
                    <input type="checkbox"  class="filled-in subCheckbox" value="${val}" ${
                      foo ? "checked" : ""
                    }
                     />
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

            $("#load-subjects .card-content").append(
              '<button class="btnn flat-btnn" id="assign-subject-btn"><div class="btn-loader" style="display: none;"></div>Assign</button>'
            );
          } else {
            $(".progress").hide();

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

  // crate staff
  $("#staffAuth").on("submit", function (e) {
    e.preventDefault();
    const btn = $(this).find("#createStaffAuth");
    const loader = btn.find(".btn-loader");

    btnLoaderToggleOn(btn, loader);

    const email = $("#email-verify-form").find("input[name=email]").val();
    const fullName = $(this).find("input[name=fullName]").val();
    const department = $(this).find("#department").find(":selected").val();
    const designation = $(this).find("#designation").find(":selected").val();
    var semAssigned = semSeletected();

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
        btnLoaderToggleOff(btn, loader, "Create");
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  });

  // filter user
  $("#filter").on("input", function (e) {
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

  // enable loader
  $("#view-staff").on("click", function () {
    $("#preloader-wrapper").addClass(" active");
  });

  // update name
  $(document).on("focusout", "#edit-name", function () {
    const docId = $("#staff-view").children("input[name=docId]").val();
    const newName = $(this).text().trim();

    $.ajax({
      type: "POST",
      url: "/updatename",
      contentType: "application/json",
      data: JSON.stringify({
        docId,
        newName,
      }),
      success: function (res) {
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },

      error: function (res) {
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  });

  // delete subject
  $(document).on("click", "#subject-delete-btn", function () {
    const parentLi = $(this).parent().parent();
    const docId = $("#staff-view").children("input[name=docId]").val();
    const subValue = parentLi.find("input[name=subjectValue]").val();

    $("#subjects-list").children(".icon-loader").toggle();

    $.ajax({
      type: "POST",
      url: "/unassignsub",
      contentType: "application/json",
      data: JSON.stringify({
        docId,
        subValue,
      }),
      success: function (res) {
        $("#subjects-list").children(".icon-loader").hide();
        if (res.response) {
          parentLi.remove();
        }
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
      error: function (res) {
        $("#subjects-list").children(".icon-loader").hide();

        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  });

  $("#back").on("click", function () {
    $("#staff-view").children(".progress").show();
  });

  // delete staff user
  $("#delete-staff").on("click", function () {
    const btn = $(this);
    const loader = btn.children(".btn-loader");

    const docId = $("#staff-view").children("input[name=docId]").val();
    const isConfirm = confirm(
      "Are you sure you want to delete the staff?, If you procees, all data regarding the staff will be deleted forever!"
    );

    if (isConfirm) {
      btnLoaderToggleOn(btn, loader);
      $("#staff-view").children(".progress").show();
      $.ajax({
        type: "POST",
        url: "/deleteStaffUser",
        contentType: "application/json",
        data: JSON.stringify({
          docId,
        }),
        success: function (res) {
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
          if (res.response) {
            location.href = "/staffcontrol";
          }
        },
        error: function (res) {
          btnLoaderToggleOff(btn, loader, "Delete");
          $("#staff-view").children(".progress").hide();
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        },
      });
    }
  });

  // more vert
  // $("#more-vert").on("click", function () {
  //   $(".action .more-menu").toggle();
  // });

  $(document).on("click", "#userClaimToggle", function () {
    const btnText = $(this);
    const docId = $("#staff-view").children("input[name=docId]").val();
    const claimName = $("#staff-view").children("input[name=desg]").val();
    const claim = $("#staff-view").children("input[name=claim]");

    const state = claim.val() === "true";
    const loader = $("#more-menu ul .btn-loader");
    loader.show();

    const chip = $(".chip");
    const html = `
            <span
                class="material-icons-outlined chip-icon ${
                  state ? "clr-err-c" : "clr-pri-c"
                }  m-r-sm">
                ${state ? "close" : "done"}
            </span>
            ${state ? "privilege revoked" : "privileged"}
    `;

    $.ajax({
      type: "POST",
      url: "/toggleclaim",
      contentType: "application/json",
      data: JSON.stringify({
        docId,
        claim: state,
        claimName,
      }),
      success: function (res) {
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
        loader.hide();
        if (res.response) {
          $(".more-menu").hide();
          claim.val(state ? "false" : "true");
          btnText.text(state ? "Give Privilege" : "Revoke");
          chip.empty();
          chip.removeClass(state ? "bg-pri-c" : "bg-err-c");
          chip.addClass(!state ? "bg-pri-c" : "bg-err-c");
          chip.append(html);
        }
      },
      error: function (res) {
        loader.toggle();
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  });
});
