$(document).ready(function () {
  $("#att-sem").on("change", loadSubjects);
  $("#att-branch").on("change", loadSubjects);
  $(".datepicker").on("change", function () {
    var branch = $("#att-branch").val();
    var sem = $("#att-sem").val();
    loadUsersToTable(branch, sem);
  });

  loadSubjects();

  function loadSubjects() {
    const loader = $("#att-selections .btn-loader");
    loader.show();
    var branch = $("#att-branch").val();
    var sem = $("#att-sem").val();

    // AJAX
    $.ajax({
      type: "POST",
      url: "/loaddropdownsubjects",
      contentType: "application/json",
      data: JSON.stringify({ branch, sem }),
      success: function (res) {
        // ON SUCCESS
        $("#att-table").empty();
        loader.hide();
        $("#dropdown-subjects").empty();
        if (res.response) {
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

  // LOAD USER
  function loadUsersToTable(branch, sem) {
    var date = $(".datepicker").val();
    var docId = $("#dropdown-subjects").val();

    if (docId != null) {
      $("#attTable .progress").show();

      // AJAX
      $.ajax({
        type: "POST",
        url: "/loadattusers",
        contentType: "application/json",
        data: JSON.stringify({ branch, sem, docId, date }),
        success: function (res) {
          $("#attTable .progress").hide();
          $("#att-table").empty();

          if (res.users.length > 0) {
            var rows = `
          <tr>
            <th>USN</th>
            <th>Name</th>
            <th>Branch</th>

            <th>Action</th>
          </tr>
          `;
            $("#att-table").append(rows);
            for (var user of res.users) {
              var usn = user.usn.toUpperCase();
              var att = res.attendance;
              var attendanceFilter = att.filter((ele) =>
                String(ele).startsWith(usn)
              );
              var html = `
              <tr>
                <td class="display-flex b upper" style="justify-content: start">
                  <img src="${user.avatar}" class="avatar" alt="avatar" />
                  <h6 class="bl m-l">
                    ${user.usn}
                  </h6>
                </td>
                <td>
                ${user.fullName}
                </td>
                
                <td>
                section ${user.section}
                </td>
                <td>
                  <div class="display-flex j-start pos-rel" id="mark-attendance">
                    <input type="hidden" name="uid" id="uid" value="${
                      user.id
                    }"/>
                    <input type="hidden" name="usn" id="usn" value="${user.usn.toUpperCase()}"/>

                    `;

              if (attendanceFilter.length > 0) {
                for (const arrEle of attendanceFilter) {
                  var foo = arrEle.split("-");
                  html =
                    html +
                    `
                    <div class="more-menu" id="more-menu" style=" top: 6px; left: 90px">
                <ul>

                   <div class="btn-loader"></div>
                      
                            <li data-id="1" id="markAtt">Present</li>

                            <li data-id="0" class="delete" id="markAtt">Absent</li>
                      </ul>
              </div>
                    <div class="fo pos-rel">
                            <div class="more-menu-sm hint pos-abs p bg-w elevation m0" id="more-menu-sm" style="top: 25px; left: 20px; width: 130px; border-radius: 3px; display: none; cursor:pointer;">
                            <input type="hidden" name="usnStr" value="${arrEle}">
                            <ul>
                            
                            ${
                              foo[2] == 1
                                ? '<li data-id="0" usn-str= class="more-btn" id="re-mark">mark this absent</li>'
                                : '<li data-id="1" class="more-btn" id="re-mark">mark this present</li>'
                            }
                            </ul>
                        </div>
                          <div class="chip ${
                            foo[2] == 1 ? "bg-pri-c " : " bg-err-c "
                          } inline-flex mx"
                          style="height: 26px;">
                          <span
                              class="material-icons-outlined chip-icon m-r-sm">
                              ${foo[2] == 1 ? "done" : "close"}
                          </span>
                          <span class="m-r-sm">
                          ${
                            foo[2] == 1
                              ? "present " + foo[1]
                              : "absent " + foo[1]
                          }
                          </span>
                          <span
                          class="material-icons-outlined chip-icon more-icon" id="more-ver-chip">
                          more_vert
                          </span>
                          
                            </div>   
                    </div>
                    
                    `;
                }

                html =
                  html +
                  `
                <span class="material-icons-outlined more-vert" tabindex="1"
                                                        id="more-vert">
                            more_vert
                        </span>
                `;
              } else {
                html =
                  html +
                  `  
                          <div style="display-flex">
                            <button class="btnn btnn-small elevation-0 display-flex" data-id="1" id="mark-att"><div class="btn-loader"></div>present</button>
                            <button class="btnn btnn-small bg-err elevation-0 display-flex" data-id="0" id="mark-att"><div class="btn-loader"></div>absent</button>
                          </div>
                        </div>
                      </td>
                `;
              }

              html =
                html +
                `
              </tr>
              `;

              $("#att-table").append(html);
              $(".btn-loader").hide();
            }
          } else {
            $("#att-table").append(`<tr><td><h5>No Users</h5></td></tr>`);
          }
        },
      });
    }
  }

  // mark present or absent
  $(document).on("click", "#mark-att", function () {
    const markAttId = $(this).parent().parent();
    const parent = $(this).parent();
    const state = parseInt($(this).attr("data-id"));
    const usn = markAttId.children("input[name=usn]").val();
    const subId = $("#dropdown-subjects").val();
    var branch = $("#att-branch").val();
    var sem = $("#att-sem").val();
    var date = $(".datepicker").val();

    var time = $(".time-stamp-checkbox").is(":checked")
      ? $("#customTime").val()
      : $("#timestamp").find("input:checked").val();
    const btn = $(this);
    const loader = btn.children(".btn-loader");
    btnLoaderToggleOn(btn, loader);

    $.ajax({
      type: "POST",
      url: "/markattendance",
      contentType: "application/json",
      data: JSON.stringify({ branch, sem, usn, date, state, subId, time }),
      success: function (res) {
        if (res.response) {
          parent.remove();
          html = `
          <div class="more-menu" id="more-menu" style=" top: 6px; left: 90px">
          <ul>

             <div class="btn-loader" style="display: none;"></div>
                
                      <li data-id="1" id="markAtt">Present</li>

                      <li data-id="0" class="delete" id="markAtt">Absent</li>
                      </ul>
              </div>
          
                        <div class="fo pos-rel">
                            <div class="more-menu-sm hint pos-abs p bg-w elevation m0" id="more-menu-sm" style="top: 25px; left: 20px; width: 130px; border-radius: 3px; display: none; cursor:pointer;">
                            <input type="hidden" name="usnStr" value="${
                              res.usnStr
                            }">
                            <ul>
                            
                            ${
                              state == 1
                                ? '<li data-id="0" usn-str= class="more-btn" id="re-mark">mark this absent</li>'
                                : '<li data-id="1" class="more-btn" id="re-mark">mark this present</li>'
                            }
                            </ul>
                        </div>
                          <div class="chip ${
                            state == 1 ? "bg-pri-c " : " bg-err-c "
                          } inline-flex mx"
                          style="height: 26px;">
                          <span
                              class="material-icons-outlined chip-icon m-r-sm">
                              ${state == 1 ? "done" : "close"}
                          </span>
                          <span class="m-r-sm">
                          ${state == 1 ? "present " + time : "absent " + time}
                          </span>
                          <span
                          class="material-icons-outlined chip-icon more-icon" id="more-ver-chip">
                          more_vert
                          </span>
                          
                            </div>   
                    </div>
          `;

          markAttId.append(html);
          markAttId.append(`<span class="material-icons-outlined more-vert" tabindex="1"
          id="more-vert">
                                            more_vert
                                            </span>`);
        } else {
          M.toast({
            html: `<span style='color: white;'>${res.message}<span>`,
          });
        }
      },
    });
  });

  // additional mark
  $(document).on("click", "#markAtt", function () {
    const markAttId = $(this).parent().parent().parent();
    const parent1 = $(this).parent();
    const state = parseInt($(this).attr("data-id"));
    const usn = markAttId.children("input[name=usn]").val();
    const subId = $("#dropdown-subjects").val();
    var branch = $("#att-branch").val();
    var sem = $("#att-sem").val();
    var date = $(".datepicker").val();

    var time = $(".time-stamp-checkbox").is(":checked")
      ? $("#customTime").val()
      : $("#timestamp").find("input:checked").val();
    const loader = parent1.children(".btn-loader");
    loader.show();

    $.ajax({
      type: "POST",
      url: "/markattendance",
      contentType: "application/json",
      data: JSON.stringify({ branch, sem, usn, date, state, subId, time }),
      success: function (res) {
        loader.hide();
        if (res.response) {
          var html = `
          <div class="fo pos-rel">
                            <div class="more-menu-sm hint pos-abs p bg-w elevation m0" id="more-menu-sm" style="top: 25px; left: 20px; width: 130px; border-radius: 3px; display: none; cursor:pointer;">
                            <input type="hidden" name="usnStr" value="${
                              res.usnStr
                            }">
                            <ul>
                            
                            ${
                              state == 1
                                ? '<li data-id="0" usn-str= class="more-btn" id="re-mark">mark this absent</li>'
                                : '<li data-id="1" class="more-btn" id="re-mark">mark this present</li>'
                            }
                            </ul>
                        </div>
                          <div class="chip ${
                            state == 1 ? "bg-pri-c " : " bg-err-c "
                          } inline-flex mx"
                          style="height: 26px;">
                          <span
                              class="material-icons-outlined chip-icon m-r-sm">
                              ${state == 1 ? "done" : "close"}
                          </span>
                          <span class="m-r-sm">
                          ${state == 1 ? "present " + time : "absent " + time}
                          </span>
                          <span
                          class="material-icons-outlined chip-icon more-icon" id="more-ver-chip">
                          more_vert
                          </span>
                          
                            </div>
          `;
          parent1.parent().hide();
          $(html).insertBefore(markAttId.children(".more-vert"));
        }
      },
    });
  });

  // RE-MARK
  $(document).on("click", "#re-mark", function () {
    const li = $(this);
    const state = parseInt($(this).attr("data-id"));
    const parentFoo = $(this).parent().parent().parent();
    const ul = $(this).parent().parent();
    const usnStr = $(this)
      .parent()
      .parent()
      .children("input[type=hidden]")
      .val();
    const usn = $(this).children("input[name=usn]").val();
    var branch = $("#att-branch").val();
    const subId = $("#dropdown-subjects").val();

    var sem = $("#att-sem").val();
    var date = $(".datepicker").val();

    $.ajax({
      type: "POST",
      url: "/remarkatt",
      contentType: "application/json",
      data: JSON.stringify({ branch, sem, usnStr, date, state, subId }),
      success: function (res) {
        if (res.response) {
          const tim = res.addUsnStr.split("-");
          const chip = parentFoo.children(".chip");
          chip.removeClass(state ? "bg-err-c" : "bg-pri-c");
          chip.addClass(state ? "bg-pri-c" : "bg-err-c");
          chip
            .children("span")
            .eq(0)
            .text(state ? "done" : "close");
          chip
            .children("span")
            .eq(1)
            .text(state ? "present " + tim[1] : "absent " + tim[1]);
          li.text(state ? "mark this absent" : "mark this present");
          li.attr("data-id", state ? "0" : "1");
          ul.children("input[name=usnStr]").val(res.addUsnStr);
          ul.hide();
        }
      },
    });
  });

  // more menu
  $(document).on("click", "#more-ver-chip", function () {
    const parent = $(this).parent().parent();
    parent.children(".more-menu-sm").toggle();
  });

  $(document).on("click", "#more-vert", function () {
    $(this).parent().children(".more-menu").toggle();
  });

  function formatAMPMFloor(date) {
    var hours = date.getHours();
    var minutes = 00;
    if (hours >= 11) {
      minutes = 15;
    }
    if (hours > 13) {
      minutes = "00";
    }
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var strTime = hours + ":" + minutes + ampm.toUpperCase();
    return strTime;
  }
  function formatAMPMCeal(date) {
    var hours = date.getHours() + 1;
    var minutes = 00;
    if (hours >= 11) {
      minutes = 15;
    }
    if (hours > 13) {
      minutes = "00";
    }
    var ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    var strTime = hours + ":" + minutes + ampm.toUpperCase();
    return strTime;
  }

  // TIMESTAMP
  const floorValue = formatAMPMFloor(new Date());
  const cealValue = formatAMPMCeal(new Date());
  $("#floor-inp").val(floorValue);
  $("#ceal-inp").val(cealValue);
  $("#floor").text(floorValue);
  $("#ceal").text(cealValue);

  $(".time-stamp-checkbox").on("click", function () {
    if ($(this).is(":checked")) {
      $("#timestamp").hide();
      $("#customTime").show();
    } else {
      $("#customTime").hide();
      $("#timestamp").show();
    }
  });

  // CUSTOM TIME STAMP
  var hrs = 8;
  var mins = "00";
  var ampm = "AM";
  var time = [];
  var n = 9;
  var i = 0;
  var flag = false;
  for (i; i < n; i++) {
    if (hrs >= 11) {
      mins = 15;
    }
    if (hrs >= 12) {
      ampm = "PM";
    }

    if (hrs > 12) {
      flag = true;
    }
    if (hrs > 2 && flag === true) {
      mins = "00";
    }

    if (hrs > 12) {
      hrs = 2;
      ampm = "PM";
    }

    const timeStr = hrs.toString() + ":" + mins.toString() + ampm;
    time.push(timeStr);
    $("#customTime").append(`<option value="${timeStr}">${timeStr}</option>`);
    hrs = parseInt(hrs) + 1;
  }
});
