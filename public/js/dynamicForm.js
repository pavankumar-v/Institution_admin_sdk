$(document).ready(function () {
  // INCREMENT FORM
  $("#create-form")
    .find("#form-fields div #form-increment")
    .on("click", function (params) {
      var html = `
            <div class="display-flex w100" id="column">
                <div class="form-input">
                    <label for="">Field Name</label>
                    <input type="text" name="fieldName" id="" required />
                </div>
                <div class="form-input m-l" style="float: right;">
                    <label for="type">Data type</label>
                    <select name="type" id="type" class="w100">
                        <option value="i">Integer </option>
                        <option value="s">String</option>
                    </select>
                </div>
                <div>
                    <span class="material-symbols-rounded bg-err m-l m-t2 icon-small p-sm" id="form-decrement">
                        remove
                    </span>
                </div>
            </div>
        `;
      const formFields = $(this).parent().parent().parent("#form-fields");
      formFields.append(html);
    });

  // DECREMENT FORM
  $(document).on(
    "click",
    "#create-form #form-fields div #form-decrement",
    function (params) {
      const column = $(this).parent().parent();
      column.remove();
    }
  );

  //   CREATE FORM SUBMIT EVENT
  $(document).on("submit", "#create-form", function (e) {
    e.preventDefault();
    const btn = $(this).children("button");
    const loader = btn.children(".btn-loader");
    btnLoaderToggleOn(btn, loader);

    const formName = $(this).children().children("input[name=formName]").val();
    const description = $(this).children().children("textarea").val();
    const formUrl = $(this).children().children("input[name=formUrl]").val();
    const sheetName = $(this)
      .children()
      .children("input[name=sheetName]")
      .val();

    const isChecked = $(this)
      .find("div.switch label input[type=checkbox]")
      .is(":checked");

    // get dynamic formFields Value
    var form = [];
    $(this)
      .children("#form-fields")
      .each(function () {
        var column = $(this).children("#column");
        $.each(column, function (param) {
          var fieldName = $(this)
            .children()
            .children("input[name=fieldName]")
            .val();
          var type = $(this).children().children().find(":selected").val();

          form.push({
            type: type,
            fieldName: fieldName.toLowerCase(),
          });
        });
      });
    //

    $.ajax({
      type: "POST",
      url: "/createform",
      contentType: "application/json",
      data: JSON.stringify({
        formName,
        description,
        formUrl,
        sheetName,
        isChecked,
        form,
      }),
      success: function (res) {
        btnLoaderToggleOff(btn, loader, "Create");
        console.log(res.response);
        if (res.response) {
          var html = `
          <div class="card" id="formCard">  
              <input type="hidden" name="docId" value="${res.docId}">
              <input type="hidden" name="formState" value="${isChecked}">
              <div class="display-flex p-lg flex-c bl" id="form-state">
                  <div class="more-menu" id="more-menu">
                      <ul>
                          <div class="btn-loader" style="display: none;"></div>
                          <li id="formStateToggle">${
                            isChecked ? "Disable" : "Enable"
                          }</li>
                <li class="delete" id="delete-form">Delete</li>
                      </ul>
                  </div>
                  <div class="display-flex j-space-between w100">
                      <h6 class="file-name-exp2 display-small">
                          ${formName}
                      </h6>

                      <span class="material-icons-outlined more-vert" tabindex="1"
                          id="more-vert">
                          more_vert
                      </span>
                  </div>

                  <div class="chip ${
                    isChecked ? "bg-pri-c " : " bg-err-c "
                  } inline-flex mx"
                      style="height: 26px;">
                      <span
                          class="material-icons-outlined chip-icon ${
                            isChecked ? "clr-pri-c " : "clr-err-c"
                          }    m-r-sm">
                          ${isChecked ? "done" : "close"} 
                      </span>
                      ${isChecked ? "done" : "closed"} 
                  </div>

                  <p class="desc-sm">
                      ${description}
                  </p>

                  <div class="media  display-flex m-t rounded-lg">
                      <img src="/img/bg1.jpg" alt="">
                  </div>

                  <br>
                  <div class="card-footer display-flex j-space-between w100 ">
                      <div class="inline-flex">
                          <span class="material-icons clr-tri-c">
                              description
                          </span>
                          <i class="text-sm display-flex flex-c j-start">
                              ${timeSince(new Date().toISOString())} ago
                                  <p>
                                      ${sheetName}
                                  </p>
                          </i>
                          <br>
                      </div>

                      <button class="btnn btnn-rounded">View</button>
                  </div>

              </div>

          </div>
          `;

          $("#form-list").prepend(html);
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
          $("#create-form")[0].reset();
        } else {
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        }
        // console.log(res);
      },
      error: function (res) {
        console.log(res.response);
        btnLoaderToggleOff(btn, loader, "Create");
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  });

  $(document).on("click", "#formStateToggle", function () {
    const loader = $(this).parent().children(".btn-loader");
    loader.toggle();
    const docId = $(this)
      .parent()
      .parent()
      .parent()
      .parent()
      .children("input[name=docId]")
      .val();

    const state = $(this)
      .parent()
      .parent()
      .parent()
      .parent()
      .children("input[name=formState]");
    const formState = state.val() == "true";

    const chip = $(this).parent().parent().parent().parent().find(".chip");
    const html = `
            <span
                class="material-icons-outlined chip-icon ${
                  formState ? "clr-err-c" : "clr-pri-c"
                }  m-r-sm">
                ${formState ? "close" : "done"}
            </span>
            ${formState ? "Closed" : "Open"}
    `;
    // console.log(html);

    const btnText = $(this);

    $.ajax({
      type: "POST",
      url: "/formstatetoggle",
      contentType: "application/json",
      data: JSON.stringify({
        docId,
        formState,
      }),
      success: function (res) {
        loader.toggle();
        if (res.response) {
          $(".more-menu").hide();
          state.val(formState ? "false" : "true");
          btnText.text(formState ? "Enable" : "Disable");
          chip.empty();
          chip.removeClass(formState ? "bg-pri-c" : "bg-err-c");
          chip.addClass(!formState ? "bg-pri-c" : "bg-err-c");
          chip.append(html);
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        } else {
          loader.toggle();
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
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

  $(document).on("click", "#delete-form", function () {
    const loader = $(this).parent().children(".btn-loader");
    loader.toggle();
    const card = $(this).parent().parent().parent().parent();
    const docId = $(this)
      .parent()
      .parent()
      .parent()
      .parent()
      .children("input[name=docId]")
      .val();

    $.ajax({
      type: "POST",
      url: "/deleteform",
      contentType: "application/json",
      data: JSON.stringify({
        docId,
      }),
      success: function (res) {
        loader.toggle();
        if (res.response) {
          card.remove();
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        } else {
          loader.toggle();
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
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

function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = Math.floor(seconds / 31536000);
  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " mon's";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hrs";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " mins";
  }
  return Math.floor(seconds) + " sec's";
}
