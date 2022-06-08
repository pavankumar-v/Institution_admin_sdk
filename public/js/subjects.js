$(document).ready(function () {
  $("#sem").on("change", getSubjects);
  $("#branch").on("change", getSubjects);

  getSubjects();
  function getSubjects() {
    $(".loader").toggle();
    var branch = $("#branch").val();
    var sem = $("#sem").val();
    if (sem == null) {
      sem = 8;
    }

    if (branch != null) {
      branch = branch.toLowerCase();
    }
    $.ajax({
      type: "POST",
      url: "/loadSubjects",
      contentType: "application/json",
      data: JSON.stringify({ branch, sem }),
      success: function (res) {
        $(".loader").toggle();
        $("#subject-list").empty();

        if (res.subjects.length > 0) {
          $.each(res.subjects, function (index) {
            var str = this.name;
            var matches = str.match(/\b(\w)/g);
            var acronomy = matches.join("").toUpperCase();
            var subjectCards = `<div class="card elevation col subject-card">
    <div class="card-content">
      <h6 class="headline5">${acronomy}</h6>
      <p class="subhead">${this.name}</p>
      <i class="hint">${this.subId}</i>
      <hr />
      <p class="desc">
        ${this.description}
      </p>
      <div class="action display-flex j-end m-t">
        <button class="btnn btnn-icon" id="edit">
          <span class="material-symbols-rounded"> edit </span>
        </button>
      </div>
      <div class="card-expand" style="display: none;">
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
              <span class="material-symbols-rounded clr-err" id="delete-module-btn">
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
          <form class="display-flex j-start" id="upload-notes-form" style="width: 300px; display: none;">

            <label for="file-input${index}">
              <span class="btnn btnn-icon-small bg-ter ">
                <span class="material-symbols-rounded icon-small ">attach_file</span>
              </span>
              </label>
              <input type="file" name="file" enctype="multipart/form-data" id="file-input${index}" value="upload" style="display: none;"  />
            <p class="hint file-name m-l2">No file selected</p>

            <button type="submit" class="btnn btnn-small btnn-small-icon m-l" id="upload-file">
              <span class="material-symbols-rounded icon-small">
                upload_file
              </span>
              upload
            </button>
          </form>

          <div class="notes display-flex flex-c j-start m-t">
            <p class="display-flex">
              <a href="">Linke to another note</a>
              <span class="material-symbols-rounded clr-err m-l">
                delete
              </span>
            </p>
            <p class="display-flex">
              <a href="">Link to notes</a>
              <span class="material-symbols-rounded clr-err m-l">
                delete
              </span>
            </p>
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
        console.log("error");
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
    const branch = $("#branch").val();
    const sem = $("#sem").val();
    const moduleName = $(this).children("input[name=moduleName]");
    const cardExpand = $(this).parents(".card-expand");
    const uid = cardExpand.children("input[name=uid]").val();
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
          moduleName.val("");
        }
      },

      error: function (res) {
        console.log(res.message);
      },
    });
  });

  $(document).on("click", "#delete-module-btn", function () {
    const parent = $(this).parent();
    const branch = $("#branch").val();
    const sem = $("#sem").val();
    const docId = $(this)
      .parentsUntil(".card-expan")
      .children("input[name=uid]")
      .val();
    const moduleName = $(this)
      .parent()
      .children("input[name=moduleName]")
      .val();

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
        console.log(res.message);
      },
    });
  });

  $(document.body).on("click", "#add-notes", function (e) {
    $(this).parents(".card-expand").find("#upload-notes-form").toggle();
  });

  var file;
  $(document).on("change", "#upload-notes-form", function (e) {
    e.preventDefault();
    file = $(this).children("input[type=file]")[0].files[0];
    $(this).children(".hint").text(file.name);
    // console.log(fileName);
  });

  // $(document).on("submit", "#upload-notes-form", function (e) {
  //   e.preventDefault();
  //   var branch = $("#branch").val();
  //   var sem = $("#sem").val();
  //   const cardExpand = $(this).parents(".card-expand");
  //   const docId = cardExpand.children("input[name=uid]").val();
  //   const id = $(this).children("input").attr("id");
  //   var files = $("#file-input0")[0].files[0];
  //   console.log(file);
  //   console.log(file.name);
  //   var fd = new FormData();
  //   fd.append("file", file, file.name);
  //   fd.append("branch", branch);
  //   fd.append("sem", sem);
  //   fd.append("docId", docId);
  //   console.log(fd.get("branch"));
  //   $.ajax({
  //     method: "POST",
  //     url: "/addNotes",
  //     contentType: false,
  //     data: $(this).serialize(),
  //     caches: false,
  //     processData: false,
  //     success: function (res) {
  //       console.log(res.message);
  //     },
  //     error: function (res) {
  //       console.log(res.message);
  //     },
  //   });
  // });

  $("#file-upload").on("submit", function (e) {
    e.preventDefault();
    var name = $(this).children("input[name=name]").val();
    var file = $(this).children("#file")[0].files[0];
    var form = document.querySelector("form");
    // console.log(form);
    // console.log($(this).html());
    // var data = new FormData(form);
    // for (var [key, value] of data.entries()) {
    //   console.log(key, value);
    // }

    // console.log(...data);

    // // var data = $("form").serialize();
    // // console.log(data);
    // // $.post("/addNotes", data);
    $.ajax({
      method: "POST",
      type: "POST",
      url: "/addNotes",
      dataType: "json",
      data: JSON.stringify({ name: name, file: file }),
      contentType: "application/json",
      caches: false,
      processData: false,
      success: function (response) {},
    });
  });
});
