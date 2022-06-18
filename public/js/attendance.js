$(document).ready(function () {
  $("#att-sem").on("change", loadSubjects);
  $("#att-branch").on("change", loadSubjects);
  $(".datepicker").on("change", loadSubjects);

  loadSubjects();

  function loadSubjects() {
    const loader = $("#att-selections .btn-loader");
    loader.show();
    var branch = $("#att-branch").val();
    var sem = $("#att-sem").val();

    $.ajax({
      type: "POST",
      url: "/loaddropdownsubjects",
      contentType: "application/json",
      data: JSON.stringify({ branch, sem }),
      success: function (res) {
        loader.hide();
        $("#dropdown-subjects").empty();
        if (res.response) {
          $("#att-table").not(":first").empty();
          // load subjects
          if (res.subjects.length > 0) {
            $("#dropdown-subjects").append(
              `<option value="null" disabled selected>No Subjects</option>`
            );
            for (const subject of res.subjects) {
              var sub = subject.split("/");
              var subName = sub[sub.length - 1];
              var subId = sub[3];
              var docId = sub[2];
              var html = `
              <option value="${docId}">${subName}</option>
              `;
              $("#dropdown-subjects").append(html);
            }
          } else {
            $("#dropdown-subjects").append(
              `<option value="null" disabled selected>No Subjects</option>`
            );
          }

          loadUsersToTable(branch, sem);

          // for (const user of res.users) {

          // }
        }
        // M.toast({
        //   html: `<span style='color: white;'>${res.message}<span>`,
        // });
      },
    });
  }

  $("#dropdown-subjects").on("change", function () {
    var branch = $("#att-branch").val();
    var sem = $("#att-sem").val();
    loadUsersToTable(branch, sem);
  });

  function loadUsersToTable(branch, sem) {
    var date = $(".datepicker").val();
    var docId = $("#dropdown-subjects").val();

    if (docId != null) {
      console.log(docId);
      $.ajax({
        type: "POST",
        url: "/loadattusers",
        contentType: "application/json",
        data: JSON.stringify({ branch, sem, docId, date }),
        success: function (res) {
          console.log(res.attendance);
        },
      });
    }
  }
});
