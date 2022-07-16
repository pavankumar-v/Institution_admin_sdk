$(document).ready(function () {
  $("input#title, textarea#textarea2").characterCounter();
  $(".tabs").tabs();
  var progress = $(".progress");
  progress.show();

  $(".tabs .tab a").each(function (i) {
    if ($(this).hasClass("active")) {
      const dataId = $(this).attr("data-id");
      loadNotification(dataId);
    }
  });

  $(document).on("click", ".tabs .tab", function () {
    const dataId = $(this).children(".active").attr("data-id");
    loadNotification(dataId);
  });

  $("#full-screen-create-trigger").on("click", function () {
    $("#create-view").css("top", "0");
  });

  $(".overlay-screen-close").on("click", function () {
    $(".full-screen-overlay").css("top", "100%");
  });

  function loadNotification(dataId) {
    progress.show();
    $.ajax({
      type: "post",
      url: "/loadnotifications",
      contentType: "application/json",
      data: JSON.stringify({ dataId }),
      success: function (res) {
        const idName = "#" + dataId;
        if (res.response) {
          var html;
          $(idName).empty();
          if (res.notifications.length > 0) {
            $.each(res.notifications, function () {
              html = `
              <div class="card p0 col m-r border" style="max-width: 350px;" >
                                        <div class="card-centents p-lg ">
                                            <input type="hidden" name="docId" value="${
                                              this.id
                                            }">
                                            <div class="more-menu" id="more-menu">
                                                <ul>
                                                    <div class="btn-loader" style="display: none;"></div>
                                                        <li class="" id="edit-post-btn">Edit</li>
                                                        <li class="delete" id="delete-post-btn">Delete</li>
                                                </ul>
                                            </div>
                                            <div class="display-flex j-space-between">
                                                <div class="display-flex">
                                                    <div class="avatar m-r-sm bg-ter-c">${
                                                      this.fullName[0]
                                                    }</div>
                                                    <div class="display-flex flex-c j-start">
                                                    <p class="captize" id="full-name">${
                                                      this.fullName
                                                    }</p>
                                                      <input type="hidden" name="createdAt" value="${
                                                        this.createdAt
                                                      } ">
                                                    
                                                    <div class="caption " id="created-at">${timeSince(
                                                      new Date(this.createdAt)
                                                    )} ago</div>
                                                    </div>
                                                </div>

                                                ${
                                                  dataId == "byId" ||
                                                  res.claim["admin"] ||
                                                  (dataId == "branch" &&
                                                    res.claim["hod"])
                                                    ? '<span class="material-icons-outlined more-vert" tabindex="1" id="more-vert">more_vert</span>'
                                                    : ""
                                                }
                                                
                                            </div>
                                            <div class="display-flex j-start hint m-t">
                                                <p id="department-designation">${
                                                  this.department == "ALL"
                                                    ? ""
                                                    : this.department
                                                } ${
                this.designation.trim() == "staff"
                  ? "professor"
                  : this.designation.trim() == "hod"
                  ? "HOD"
                  : this.designation.trim() == "Admin"
                  ? "principle"
                  : "ananymous"
              }</p>
                                                
                                            </div>
    
    
    
                                            <div class="title header m-b" id="title">${
                                              this.title
                                            }</div>
                                            <div class="desc" id="description">
                                              ${urlify(this.description)}
                                            </div>
    
                                            <div class="row j-start" id="tags">

                                            `;

              for (let tag of this.tags) {
                html =
                  html +
                  `
                                                  <p class="caption col " style="height: 26px; color: blue;" >
                                                      
                                                      #${tag}
                                                  </p>`;
              }

              html =
                html +
                `

                                                
                                            </div>
    
    
                                            <div class="display-flex j-start">
                                                <button class="btnn btnn-rounded bg-none border clr-pri" id="full-screen-view-trigger">View</button>
                                            </div>
    
                                        </div>
    
                                    </div>
              `;

              $(idName).append(html);
            });
          } else {
            html = "<h4>Found Noting</h4>";
            $(idName).append(html);
          }
        } else {
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        }
        progress.hide();
      },

      error: function (res) {
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  }

  function isoFormatDMY(d) {
    function pad(n) {
      return (n < 10 ? "0" : "") + n;
    }
    return (
      pad(d.getUTCDate()) +
      "/" +
      pad(d.getUTCMonth() + 1) +
      "/" +
      d.getUTCFullYear()
    );
  }

  function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
  }

  // View Post
  $(document).on("click", "#full-screen-view-trigger", function () {
    // CARD CONTENT
    const parentCard = $(this).parentsUntil(".card");
    const name = parentCard.children().find("#full-name");
    const created_at = parseISOString(
      parentCard.find("input[name=createdAt]").val()
    );
    const department_designation = parentCard.find("#department-designation");
    const title = parentCard.find("#title");
    const description = parentCard.find("#description");
    const tags = parentCard.find("#tags");

    console.log(tags.html());

    // VIEW CONTENT
    const viewPage = $("#post-view main div #post-data").children();
    viewPage.find("#placeholder-avatar").text(`${name.text()[0]}`);
    viewPage.find("#placeholder-name").text(name.text());
    viewPage
      .find("#placeholder-d-d")

      .text(department_designation.text());
    viewPage.find("#placeholder-date").text(isoFormatDMY(created_at));
    viewPage.find("#placeholder-title").text(title.text());
    viewPage.find("#placeholder-desc").empty().append(description.html());
    viewPage.find("#placeholder-tags").empty().append(tags.html());

    $("#post-view").css("top", "0");
  });

  $(document).on("click", "#delete-post-btn", function () {
    const ul = $(this).parent();
    const cardContent = ul.parent().parent();
    const loader = ul.children(".btn-loader");
    const docId = cardContent.children("input[name=docId]").val();

    loader.show();

    $.ajax({
      type: "post",
      url: "/deletepost",
      contentType: "application/json",
      data: JSON.stringify({ docId }),
      success: function (res) {
        loader.hide();
        if (res.response) {
          cardContent.parent().remove();
        }
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },

      error: function (res) {
        loader.hide();

        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  });

  // add tags to array
  function tagSelected() {
    var tags = $.map($(".checkbox-chip:checked"), function (e, i) {
      return e.value;
    });
    $(".card-chips").empty();
    for (let tag of tags) {
      var html = `
      <div class="chip bg-pri-c  inline-flex mx " style="height: 26px;">
          #${tag}
      </div>
      `;

      $(".card-chips").append(html);
    }
    return tags;
  }

  tagSelected();
  $(document).delegate(".md-chips .checkbox-chip", "click", tagSelected);

  // update preview
  $("#create-post")
    .find("input[name=title]")
    .on("keyup", function () {
      $(".card-centents .title").text($(this).val());
    });
  $("#create-post")
    .find("textarea")
    .on("keyup", function () {
      $(".card-centents .desc").text($(this).val());
    });
  // chips  filter
  $(document).on("keyup", "#search-chips", function (e) {
    var $this = $(this);
    var exp = new RegExp($this.val(), "i");
    $(".md-chips .checkbox label").each(function () {
      var $self = $(this);
      if (!exp.test($self.text())) {
        $self.parent().hide();
      } else {
        $self.parent().show();
      }
    });
  });

  // add new post
  $("#post-notification-btn").on("click", function (e) {
    const btn = $(this);
    const loader = btn.children(".btn-loader");
    btnLoaderToggleOn(btn, loader);
    const title = $("#create-post").find("input[name=title]").val();
    const desc = $("#create-post").find("textarea").val();
    const tags = tagSelected();

    $.ajax({
      type: "post",
      url: "/createpost",
      contentType: "application/json",
      data: JSON.stringify({ title, desc, tags }),
      success: function (res) {
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
        if (res.response) {
          btnLoaderToggleOff(btn, loader, "post");
          location.href = "/notifications";
        }
      },
    });
  });

  // view post
});
