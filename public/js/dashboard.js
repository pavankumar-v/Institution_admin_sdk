$(document).ready(function () {
  $("#chart-sem").on("change", loadChart);
  $("#chart-branch").on("change", loadChart);
  loadChart();

  function loadChart() {
    var branch = $("#chart-branch").val();
    var sem = $("#chart-sem").val();
    const loader = $(".chart-action").find(".btn-loader");
    loader.show();

    $.ajax({
      type: "post",
      url: "/loadattendancechart",
      contentType: "application/json",
      data: JSON.stringify({ branch, sem }),
      success: function (res) {
        loader.hide();
        $("#reportsChart").empty();
        if (res.response) {
          var attendanceData = res.attendanceData;
          var subs = Object.keys(attendanceData);

          var series = [];
          var dates = [];

          for (let sub of subs) {
            const orderedDates = Object.keys(attendanceData[sub])
              .sort()
              .reduce((obj, key) => {
                obj[key] = attendanceData[sub][key];
                return obj;
              }, {});
            var tempDates = Object.keys(orderedDates);
            if (tempDates.length > dates.length) {
              dates = tempDates;
            }

            const countData = getAttendanceCount(tempDates, sub);
            const obj = { name: sub, data: countData };
            series.push(obj);
          }

          function getAttendanceCount(dates, sub) {
            var arr = [];
            var count;
            for (let date of dates) {
              count = 0;
              for (let data of attendanceData[sub][date]) {
                if (data[data.length - 1] == "1") {
                  count = count + 1;
                }
              }
              arr.push(count);
            }
            return arr;
          }

          new ApexCharts(document.querySelector("#reportsChart"), {
            series: series,
            chart: {
              height: 350,
              type: "area",
              toolbar: {
                show: false,
              },
            },
            markers: {
              size: 4,
            },
            colors: ["#c158dc", "#6abf69", "#c158dc"],
            fill: {
              type: "gradient",
              gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.4,
                stops: [0, 90, 100],
              },
            },
            dataLabels: {
              enabled: true,
            },
            stroke: {
              curve: "smooth",
              width: 2,
            },
            xaxis: {
              type: "date",
              categories: dates,
            },
            tooltip: {
              x: {
                format: "dd/MM/yy HH:mm",
              },
            },
          }).render();
        }
      },
    });
  }

  $("#ml-form").on("submit", function (e) {
    e.preventDefault();
    const btn = $(this).find("button");
    const loader = btn.find(".btn-loader");
    btnLoaderToggleOn(btn, loader);
    const hrsStudied = $(this).find("input[name=studiedhours]").val();
    const prevSemMarks = $(this).find("input[name=prevsemper]").val();
    const avgInternal = $(this).find("input[name=avgia]").val();
    const assMarks = $(this).find("input[name=assignmark]").val();
    const absDays = $(this).find("input[name=absent]").val();

    $.ajax({
      type: "post",
      url: "/machineLearning",
      contentType: "application/json",
      data: JSON.stringify({
        hrsStudied,
        prevSemMarks,
        avgInternal,
        assMarks,
        absDays,
      }),
      success: function (res) {
        btnLoaderToggleOff(btn, loader, "Submit");
        if (res.response) {
          $(".output").empty();
          $(".output").append(`Predicted marks: ${res.op[0]}`);
        }

        M.toast({
          html: `<span style='color: white;'>${res.message}<span>`,
        });
      },
    });
  });

  $(".md-chips .radio-chip").each(function (i) {
    if ($(this).is(":checked")) {
      const tag = $(this).val();
      loadNotificationByTags(tag);
    }
  });

  $(document).on("click", ".md-chips .radio-chip", function (e) {
    loadNotificationByTags($(this).val());
  });

  function loadNotificationByTags(tag) {
    const loader = $(".recent-notifications").children(".progress");
    console.log(tag);
    loader.show();

    $.ajax({
      type: "post",
      url: "/loadNotificationbytags",
      contentType: "application/json",
      data: JSON.stringify({
        tag,
      }),

      success: function (res) {
        $(".recent-notifications").children(".card-body").empty();

        console.log(res.notifications);
        if (res.response && res.notifications.length > 0) {
          $.each(res.notifications, function (indexInArray, valueOfElement) {
            console.log(this);
            html = `
            <div class="card" style="max-width: 350px;" >
                                      <div class="card-centents p-lg ">
                                          
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
  
                                          
  
                                      </div>
  
                                  </div>
            `;

            $(".recent-notifications").find(".card-body").append(html);
          });
        } else {
          $(".recent-notifications").find(".card-body").append(`Nothing Found`);
        }

        loader.hide();
      },
    });
  }
});
