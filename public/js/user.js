$(document).ready(function () {
  // Add USN to database
  // takes usn str and adds to branch collection in particular document
  $("#add-usn").on("submit", function (e) {
    e.preventDefault();
    const btn = $(this).find("button");
    const loader = btn.find(".btn-loader");
    btnLoaderToggleOn(btn, loader);
    const usn = $(this).find("input[name=usn]").val();
    var validate = usn.toLowerCase().match("1bo[0-9]{2}[a-zA-Z]{2}[0-9]{3}");
    if (validate) {
      $.ajax({
        type: "POST",
        url: "/addusn",
        data: JSON.stringify({ usn }),
        contentType: "application/json",
        success: function (res) {
          loadUsnList($("#user-branch").val());
          $("#add-usn")[0].reset();
          btnLoaderToggleOff(btn, loader, "Add");
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        },
        error: function (res) {
          btnLoaderToggleOff(btn, loader, "Add");
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        },
      });
    } else {
      btnLoaderToggleOff(btn, loader, "Add");
      M.toast({
        html: `<span style='color: white;'>Badly formatted<span>`,
      });
    }
  });

  // Search users in user table
  $("input[name=searchuser]").on("input", function () {
    var value = $(this).val().toLowerCase();
    $("#user-table tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  // Whenever change in branch or dropdown menu
  // loadUser is invoked and users are loaded
  var branch = $("#user-branch").val();
  var sem = $("#user-sem").val();
  $("#user-branch").on("change", () => {
    branch = $("#user-branch").val();
    sem = $("#user-sem").val();
    loadUser(branch, sem);
    loadUsnList(branch, sem);
  });
  $("#user-sem").on("change", () => {
    branch = $("#user-branch").val();
    sem = $("#user-sem").val();
    loadUser(branch, sem);
    loadUsnList(branch);
  });

  // load whenever user enters page
  loadUser(branch, sem);
  loadUsnList(branch);

  // Load user function
  // takes branch and sem and retrives setudents
  function loadUser(branch, sem) {
    console.log(branch, sem);
    $(".table .progress").toggle();

    $.ajax({
      type: "get",
      url: `/loadusersbybranchsem/${branch}/${sem}`,
      contentType: "application/json",
      // data: JSON.stringify({ branch, sem }),
      success: function (res) {
        console.log(res);
        $(".table .progress").hide();

        if (res.response) {
          $("#user-table").empty();
          var rows = `
          <tr>
            <th>USN</th>
            <th>Name</th>
            <th>Branch</th>
            <th>Sem</th>
            <th>Section</th>
            <th>Action</th>
          </tr>
          `;
          $("#user-table").append(rows);
          if (res.users.length > 0) {
            $.each(res.users, function (indexInArray, valueOfElement) {
              var html = `
              <tr>
                          <td class="display-flex b upper" style="justify-content: start">
                            <img src="${
                              this.avatar
                            }" class="avatar" alt="avatar" />
                            <h6 class="bl m-l">
                              ${this.usn}
                            </h6>
                          </td>
                          <td>
                          ${this.fullName}
                          </td>
                          <td>
                            ${this.branch.toUpperCase()}
                          </td>
                          <td>
                          ${this.sem}
                          </td>
                          <td>
                          section ${this.section}
                          </td>
                          <td>
                          
                            <div class="display-flex pos-rel" id="blockUser">
                            
                              <input type="hidden" name="uid" id="uid" value="${
                                this.id
                              }" />
                              <input type="hidden" name="active" value="${
                                this.isActive ? "1" : "0"
                              }" />
                              <button class="btnn-small display-flex ${
                                this.isActive ? "bg-err" : ""
                              }"
                                id="blockUserBtn" style="width: 100%">
                                <div class="btn-loader" style="justify-content: center; display: none;"></div>
                                ${this.isActive ? "Disable" : "Enable"}
                              </button>
                              <div class="more-menu" id="more-menu" style=" top: 13px; left: 207px">
                              <ul>

                  <div class="btn-loader" style="display: none;"></div>
                     
                          

                           <li data-id="0" class="delete display-flex j-start" id="delete-user"><span class="material-symbols-rounded chip-icon m-r-sm">
                           delete
                           </span>Delete</li>
                     </ul>
             </div>
                              <span class="material-icons-outlined more-vert" tabindex="1" id="more-vert">more_vert</span>
                            </div>
                          </td>
                        </tr>
              `;
              $("#user-table").append(html);
            });
          } else {
            $("#user-table").empty();
            $("#user-table").append(`<tr><td><h5>No Users</h5></td></tr>`);
          }
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        }
      },
      error: function (res) {
        $(".table .progress").hide();
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  }

  // BLock User
  $(document).on(
    "click",
    "#userTable table tr td #blockUserBtn",
    function toggelUserActivity(e) {
      e.preventDefault();
      var button = $(this);
      var loader = button.find(".btn-loader");
      button.empty();
      button.append(loader);
      loader.show();
      var uid = $(this).parent().find("input[name=uid]");
      var active = $(this).parent().find("input[name=active]");
      $.ajax({
        type: "POST",
        url: "/blockuser",
        contentType: "application/json",
        data: JSON.stringify({ uid: uid.val(), active: active.val() }),
        success: function (res) {
          loader.hide();
          if (res.response == 1) {
            M.toast({
              html: ' <span class="bl" style="color: #B8F397;">User Un Blocked<span>',
              classes: "rounded",
            });
            active.val("1");
            button.removeClass("bg__success");
            button.addClass("bg-err");
            button.append("Disable");
          } else {
            M.toast({
              html: ' <span class="bl" style="color: #FFDAD4;">User blocked<span> ',
              classes: "rounded",
            });
            active.val("0");
            button.removeClass("bg-err");
            button.addClass("bg__success");
            button.append(loader);
            button.append("Enable");
          }
        },
        error: function (data) {
          loader.hide();
          M.toast({
            html: "Operation Failed",
            classes: "rounded",
          });
          if (active.val() == 1) {
            button.append("Disable");
          } else {
            button.append("Enable");
          }
        },
      });
    }
  );

  // @Delete User
  $(document).on("click", "#delete-user", function (e) {
    const loader = $(this).parent().children(".btn-loader");
    const tr = $(this).parent().parent().parent().parent().parent();
    const userId = $(this)
      .parent()
      .parent()
      .parent()
      .children("input[name=uid]")
      .val();
    console.log(userId);

    var confirmRes = confirm(
      "Once deleted All the data will be erased including user auth details. Are you sure you want to proceed ?"
    );

    if (confirmRes) {
      loader.show();
      $.ajax({
        type: "delete",
        url: "/deleteUser",
        contentType: "application/json",
        data: JSON.stringify({ docId: userId }),
        success: function (res) {
          loader.hide();
          if (res.response) {
            tr.remove();
          }
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        },
      });
    }
  });

  // Load usn list
  function loadUsnList(branch) {
    $.ajax({
      type: "GET",
      url: `/usnList/${branch}`,
      data: JSON.stringify({ branch }),
      contentType: "application/json",
      success: function (res) {
        if (res.response) {
          // checking if the list is greater than 0
          if (Object.keys(res.usnList).length > 0) {
            // empty the table
            $("#usn-table").empty();

            // add table row
            var rows = `
          <tr>
            <th>USN</th>
            <th>status</th>
            <th>Action</th>
          </tr>
          `;
            $("#usn-table").append(rows);
            $.each(res.usnList, function (key, value) {
              // if key value is TRUE it is NOT REGISTERED
              // if key value is FALSE it is REGISTERED
              var html = `
              <tr>
                          <td class="bl">
                          ${key.toUpperCase()}
                          </td>

                          <td class=${value ? "bg-pri-c" : "bg-err"}>
                          ${value ? "Not Registered" : "Registered"}
                          </td>
                        <td>
                            <div class="display-flex pos-rel" id="usn-action">
                              <input type="hidden" name="usn" id="usn" value="${key}" />
                              ${
                                value
                                  ? ""
                                  : `
                              <button class="btnn-small display-flex"
                                id="allow-register" style="width: 100%;">
                                <div class="btn-loader" style="justify-content: center; display: none;"></div>
                                Allow registration
                              </button>
                              `
                              }

                              <span class="material-symbols-rounded" id="delete-usn"> delete </span>
                          </td>
                        </tr>
              `;
              $("#usn-table").append(html);
            });
          } else {
            $("#usn-table").empty();
            $("#usn-table").append(`<tr><td><h5>Empty</h5></td></tr>`);
          }
        }
      },
    });
  }

  // update usn list in db
  $(document).on("click", "#allow-register", function () {
    const usn = $(this).parent().children("input[name=usn]").val();
    branch = $("#user-branch").val();
    const btn = $(this);
    const loader = btn.children(".btn-loader");

    var isOK = confirm(
      "Are you sure you want allow this? Allowing would lead to multiple registrations"
    );
    if (isOK) {
      btnLoaderToggleOn(btn, loader);
      $.ajax({
        type: "put",
        url: `/updateUsn/${branch}/${usn}`,
        contentType: "application/json",
        success: function (res) {
          btnLoaderToggleOff(btn, loader, "Allow to Register");
          if (res.response) {
            loadUsnList(branch);
            M.toast({
              html: `<span style='color: white;'>${res.message}<span>`,
            });
          }
        },
        error: function (res) {
          btnLoaderToggleOff(btn, loader, "Allow to Register");
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        },
      });
    }
  });

  //delete usn
  $(document).on("click", "#delete-usn", function () {
    const usn = $(this).parent().children("input[name=usn]").val();
    branch = $("#user-branch").val();

    $.ajax({
      type: "delete",
      url: `/deleteusn/${branch}/${usn}`,
      contentType: "application/json",
      success: function (res) {
        if (res.response) {
          loadUsnList(branch);
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        }
      },

      error: function (res) {
        btnLoaderToggleOff(btn, loader, "Allow to Register");
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  });
});
