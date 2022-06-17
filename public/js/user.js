$(document).ready(function () {
  $("#add-usn").on("submit", function (e) {
    e.preventDefault();
    const btn = $(this).find("button");
    const loader = btn.find(".btn-loader");
    btnLoaderToggleOn(btn, loader);
    const usn = $(this).find("input[name=usn]").val();
    var validate = usn
      .toLowerCase()
      .toString()
      .match("1bo[0-9]{2}[a-zA-Z]{2}[0-9]{3}");
    if (validate) {
      $.ajax({
        type: "POST",
        url: "/addusn",
        data: JSON.stringify({ usn }),
        contentType: "application/json",
        success: function (res) {
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

  $("input[name=searchuser]").on("input", function () {
    console.log("inp");
    var value = $(this).val().toLowerCase();
    $("#user-table tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  $("#user-branch").on("change", loadUser);
  $("#user-sem").on("change", loadUser);
  loadUser();

  function loadUser() {
    $(".table .progress").toggle();
    var branch = $("#user-branch").val();
    var sem = $("#user-sem").val();

    $.ajax({
      type: "POST",
      url: "/loadusersbybranchsem",
      contentType: "application/json",
      data: JSON.stringify({ branch, sem }),
      success: function (res) {
        $(".table .progress").toggle();

        if (res.response) {
          $("table").empty();

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
          $("table").append(rows);
          console.log(res.users);
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
                            <div id="blockUser">
                              <input type="hidden" name="uid" id="uid" value="${
                                this.id
                              }" />
                              <input type="hidden" name="active" value="${
                                this.isActive ? "1" : "0"
                              }" />
                              <button class="btnn-small display-flex ${
                                this.isActive ? "bg__danger" : ""
                              }"
                                id="blockUserBtn" style="width: 100%">
                                <div class="btn-loader" style="justify-content: center; display: none;"></div>
                                ${this.isActive ? "Block" : "Un Block"}
                              </button>
                            </div>
                          </td>
                        </tr>
              `;

              $("table").append(html);
            });
          } else {
            $("table").empty();

            $("table").append(`<tr><td><h5>No Users</h5></td></tr>`);
          }
        }
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
      error: function (res) {
        // loader.toggle();
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  }

  $(document).on(
    "click",
    "#userTable table tr td #blockUser",
    toggelUserActivity
  );

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
