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

  $("#full-screen-trigger").on("click", function () {
    $(".full-screen-overlay").css("top", "0");
  });

  $("#overlay-screen-close").on("click", function () {
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
              console.log(this);
              html = `
              <div class="card p0 col m-r" style="max-width: 350px;" >
                                        <div class="card-centents p-lg ">
                                            <input type="hidden" name="docId" value="${
                                              this.id
                                            }">
                                            <div class="more-menu" id="more-menu">
                                                <ul>
                                                    <div class="btn-loader" style="display: none;"></div>
                                                        <li class="delete" id="delete-post-btn">Delete</li>
                                                </ul>
                                            </div>
                                            <div class="display-flex j-space-between">
                                                <div class="display-flex">
                                                    <div class="avatar m-r-sm">${
                                                      this.fullName[0]
                                                    }</div>
                                                    <p class="captize">${
                                                      this.fullName
                                                    }</p>
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
                                                <p>${
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
                                                <div class="hint m-l">${timeSince(
                                                  new Date(this.createdAt)
                                                )}</div>
                                            </div>
    
    
    
                                            <div class="title header m-b">${
                                              this.title
                                            }</div>
                                            <div class="desc">
                                              ${urlify(this.description)}
                                            </div>
    
                                            <div class="row j-start m-t">

                                            `;

              for (let tag of this.tags) {
                html =
                  html +
                  `
                                                  <div class="chip bg-pri-c  inline-flex mx" style="height: 26px;">
                                                      
                                                      #${tag}
                                                  </div>`;
              }

              html =
                html +
                `

                                                
                                            </div>
    
                                            <hr>
    
                                            <div class="display-flex j-end">
                                                <button class="btnn btnn-rounded">Edit</button>
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
});
