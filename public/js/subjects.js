$(document).ready(function () {
  $("#sub-sem").on("change", getSubjects);
  $("#sub-branch").on("change", getSubjects);
  getSubjects();

  $("#new-subject-form").on("submit", function (e) {
    e.preventDefault();
    var branch = $("#sub-branch").val();

    var sem = $("#sub-sem").val();
    const btn = $(this).find("button");
    const loader = btn.find(".btn-loader");
    btnLoaderToggleOn(btn, loader);
    const name = $(this).find("input[name=subjectName]").val();
    const id = $(this).find("input[name=subId]").val();
    const description = $(this).find("textarea").val();
    const modal = document.querySelector("#modal1");

    $.ajax({
      type: "POST",
      url: "/addnewsubject",
      contentType: "application/json",
      data: JSON.stringify({ name, id, description, branch, sem }),
      success: function (res) {
        if (res.response) {
          getSubjects();
        }
        $("#new-subject-form")[0].reset();
        btnLoaderToggleOff(btn, loader, "Submit");
        M.Modal.getInstance(modal).close();
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },

      error: function (res) {
        $(".loader").hide();
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  });

  $(document).on("click", "#delete-subject", function (e) {
    const card = $(this).parent().parent().parent().parent();
    const loader = $(this).parent().find(".btn-loader");
    console.log(loader);
    loader.show();
    var branch = $("#sub-branch").val();
    var sem = $("#sub-sem").val();
    const docId = card.find(".card-expand").find("input[name=uid]").val();

    $.ajax({
      type: "POST",
      url: "/deletesubject",
      contentType: "application/json",
      data: JSON.stringify({ branch, sem, docId }),
      success: function (res) {
        loader.hide();
        if (res.response) {
          card.remove();
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

  function getSubjects() {
    $(".loader").show();
    var branch = $("#sub-branch").val();
    var sem = $("#sub-sem").val();

    $.ajax({
      type: "POST",
      url: "/loadSubjects",
      contentType: "application/json",
      data: JSON.stringify({ branch, sem }),
      success: function (res) {
        $(".loader").hide();
        $("#subject-list").empty();

        if (res.subjects && res.subjects.length > 0) {
          $.each(res.subjects, function (index) {
            var str = this.name;
            var matches = str.match(/\b(\w)/g);
            var acronomy = matches.join("").toUpperCase();
            var subjectCards = `<div class="card elevation col subject-card m-r">
    <div class="card-content">
    <div class="more-menu" id="more-menu">
            <ul>
            
                <div class="btn-loader" style="display: none;"></div>
                
      <li class="delete" id="delete-subject">Delete</li>
            </ul>
        </div>
    <div class="display-flex j-space-between a-start">
    <div>
      <h6 class="headline5">${acronomy}</h6>
      <p class="subhead" contenteditable="true" >${this.name}</p>
      <i class="hint" contenteditable="true" >${this.subId}</i>

      </div>
      <span class="material-icons-outlined more-vert" tabindex="1"
      id="more-vert">
      more_vert
  </span>
      </div>
      <hr />
      <p class="desc" >
        ${this.description}
      </p>
      <div class="action display-flex j-end m-t">
      
        <button class="btnn btnn-icon" id="edit">
          <span class="material-symbols-rounded"> edit </span>
        </button>
      </div>
      <div class="card-expand" style="display: none;">
      <div class="icon-loader" style="display: none;"></div>
        <input type="hidden" name="uid" value="${this.id}" />
        <div class="display-flex flex-c">
          <h5 class="display-flex m-b">
            Modules
            <span class="material-symbols-rounded bg-ter clr-ter m-l" id="add">
              add
            </span>
          </h5>
          <form class="display-flex f-space-between j-start m-t m-b" style="display: none" id="add-module-form">
            <input type="text" class="input-small" name="moduleName" id="module" placeholder="module name" required />

            <button type="submit" class="btnn btnn-icon-small m-l " id="add-module-btn">
            <span class="material-symbols-rounded icon-small">done</span>

            </button>
          </form>
          <div class="modules display-flex flex-c f j-start">
            `;

            for (module in this.modules) {
              var subjectCards =
                subjectCards +
                `
            <p class="display-flex">
              <input type="hidden" name="moduleName" value="${this.modules[module]}" />
              ${this.modules[module]}
              <span class="material-symbols-rounded clr-err " id="delete-module-btn">
                delete
              </span>
              `;
            }

            var subjectCards =
              subjectCards +
              `
          </div>
        </div>
        <br />
        <div class="display-flex flex-c">
          <h5 class="display-flex m-b">
            Notes
            <span class="material-symbols-rounded bg-ter clr-ter m-l" id="add-notes">
              note_add
            </span>
          </h5>
          <form class="display-flex flex-c j-start" id="upload-notes-form" enctype="multipart/form-data" style="width: 300px; display: none;">
          <input type="text" class="input-small m-b" name="fileName" id="fileName" placeholder="file name (optional)" />
          <div class="display-flex j-start">
            <label for="file-input${index}">
              <span class="btnn btnn-icon-small bg-ter ">
                <span class="material-symbols-rounded icon-small ">attach_file</span>
              </span>
              </label>
            
              <input type="file" name="file" enctype="multipart/form-data" id="file-input${index}" value="upload" style="display: none;"  />
            <p class="hint file-name m-l2">No file selected</p>

            <button type="submit" class="btnn btnn-small btnn-small-icon m-l" id="upload-file">
            <div class="btn-loader" style="justify-content: center; display : none;"></div>
           
            upload
            </button>
            </div>
          </form>

          <div class="notes-section display-flex flex-c j-start m-t">
          `;

            for (note in this.notes) {
              var myRegexp = /.+(\/|%2F)(.+)\?.+/g;
              var match = myRegexp.exec(this.notes[note]);
              var fileName = match[2].replace(/%20/g, " ");
              var subjectCards =
                subjectCards +
                `
            <p class="display-flex">
              <a class="file-name-exp1" href="${this.notes[note]}">${fileName}</a>
              <span class="material-symbols-rounded clr-err m-l" id="notes-delete-btn">
                delete
              </span>
            </p>
            `;
            }

            var subjectCards =
              subjectCards +
              `
            
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
            $("#subject-list").append(subjectCards);
          });
        } else {
          $("#subject-list").append("No Subjects Found");
        }
      },
      error: function (res) {
        $(".loader").hide();
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  }

  $(document).on("click", "#edit", function () {
    const cardExpand = $(this)
      .parents(".action")
      .parents(".card-content")
      .find(".card-expand");
    cardExpand.toggle();
  });

  $(document).on("click", "#add", function (e) {
    e.preventDefault();
    const cardExpand = $(this).parentsUntil(".card-expand");
    const addModuleForm = cardExpand.children("#add-module-form");
    addModuleForm.toggle();
  });

  $(document).on("submit", "#add-module-form", function (e) {
    e.preventDefault();
    const branch = $("#sub-branch").val();
    const sem = $("#sub-sem").val();
    const moduleName = $(this).children("input[name=moduleName]");
    const cardExpand = $(this).parents(".card-expand");
    const uid = cardExpand.children("input[name=uid]").val();

    const loader = cardExpand.children(".icon-loader");
    loader.show();

    // console.log()
    $.ajax({
      type: "POST",
      url: "/addModule",
      contentType: "application/json",
      data: JSON.stringify({
        branch: branch,
        sem: sem,
        uid: uid,
        moduleName: moduleName.val(),
      }),
      success: function (res) {
        loader.hide();
        if (res.response == 1) {
          cardExpand.find(".modules").append(`
<p class="display-flex">
  <input type="hidden" name="moduleName" value="${moduleName.val()}" />
  ${moduleName.val()}
  <span class="material-symbols-rounded clr-err" id="delete-module-btn">
    delete
  </span>
</p>
`);
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
          moduleName.val("");
        }
      },

      error: function (res) {
        loader.hide();
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  });

  $(document).on("click", "#delete-module-btn", function () {
    const parent = $(this).parent();
    const branch = $("#sub-branch").val();
    const sem = $("#sub-sem").val();
    const docId = $(this)
      .parentsUntil(".card-expan")
      .children("input[name=uid]")
      .val();
    const moduleName = $(this)
      .parent()
      .children("input[name=moduleName]")
      .val();
    const loader = $(this)
      .parent()
      .parent()
      .parent()
      .parent()
      .children(".icon-loader");
    loader.show();

    $.ajax({
      type: "POST",
      url: "/deleteModule",
      contentType: "application/json",
      data: JSON.stringify({
        branch: branch,
        sem: sem,
        uid: docId,
        moduleName: moduleName,
      }),
      success: function (res) {
        loader.hide();

        if (res.response == 1) {
          parent.remove();

          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        } else {
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        }
      },

      error: function (res) {
        loader.hide();

        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  });

  $(document).on("click", "#notes-delete-btn", function () {
    const parent = $(this).parent();
    const branch = $("#sub-branch").val();
    const sem = $("#sub-sem").val();
    const docId = $(this)
      .parentsUntil(".card-expan")
      .children("input[name=uid]")
      .val();
    const fileUrl = parent.children("a").attr("href");
    const loader = $(this)
      .parent()
      .parent()
      .parent()
      .parent()
      .children(".icon-loader");
    loader.show();

    $.ajax({
      type: "POST",
      url: "/deletenotes",
      contentType: "application/json",
      data: JSON.stringify({
        branch: branch,
        sem: sem,
        docId: docId,
        notesUrl: fileUrl,
      }),
      success: function (res) {
        loader.hide();

        if (res.response == 1) {
          parent.remove();
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

  $(document.body).on("click", "#add-notes", function (e) {
    $(this).parents(".card-expand").find("#upload-notes-form").toggle();
  });

  var file;
  $(document).on("change", "#upload-notes-form", function (e) {
    e.preventDefault();
    file = $(this).find("div input[type=file]")[0].files[0];
    if (file != undefined) {
      $(this).find("div .hint").text(file.name);
    }
  });

  $(document).on("submit", "#upload-notes-form", function (e) {
    e.preventDefault();
    const btn = $(this).find("div button");
    const loader = btn.children(".btn-loader");
    btn.empty();
    btn.append(loader);
    btn.attr("disabled", true);
    loader.toggle();
    var branch = $("#sub-branch").val();
    var sem = $("#sub-sem").val();
    const cardExpand = $(this).parents(".card-expand");
    const docId = cardExpand.children("input[name=uid]").val();
    const newName = $(this).children("input[name=fileName]").val();

    var fd = new FormData();
    fd.append("file", file, file.name);
    fd.append("branch", branch);
    fd.append("sem", sem);
    fd.append("newName", newName);
    fd.append("docId", docId);
    $.ajax({
      method: "POST",
      url: "/addNotes",
      contentType: false,
      data: fd,
      caches: false,
      processData: false,
      success: function (res) {
        if (res.response == 1) {
          cardExpand.find(".notes-section").append(
            `
            <p class="display-flex">
              <a class="file-name-exp1" href="${res.url}">${res.fileName}</a>
              <span class="material-symbols-rounded clr-err m-l" id="notes-delete-btn">
                delete
              </span>
            </p>
            `
          );
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
          loader.toggle();
          btn.append("upload");
          $(this).trigger("reset");
          btn.attr("disabled", false);
        } else {
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
          loader.toggle();
          btn.append("upload");
          $(this).trigger("reset");
          btn.attr("disabled", false);
        }
      },
      error: function (res) {
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
        loader.toggle();
        btn.append("upload");
        $(this).trigger("reset");
        btn.attr("disabled", false);
      },
    });
  });
});
