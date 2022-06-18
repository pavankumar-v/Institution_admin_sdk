$(document).ready(function () {
  $("#att-sem").on("change", loadSubjects);
  $("#att-branch").on("change", loadSubjects);

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
        $("#dropdown-subjects").not(":first").remove();
        if (res.response) {
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
        }

        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  }
});
