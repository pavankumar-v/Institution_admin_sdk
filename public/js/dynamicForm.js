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
        btnLoaderToggleOff(btn, loader);
        console.log(res.response);
        if (res.response) {
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
        btnLoaderToggleOff(btn, loader);
        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  });
});
