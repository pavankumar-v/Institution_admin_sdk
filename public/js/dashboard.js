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
              width: 3,
            },
            chart: {
              height: 350,
              type: "area",
              zoom: {
                enabled: true,
                type: "xy",
              },
            },
            xaxis: {
              type: "date",
              // tickAmount: 8,
              // min: new Date("01/01/2014").getTime(),
              // max: new Date("01/20/2014").getTime(),
              categories: dates,
            },
            tooltip: {
              x: {
                format: "dd/MM",
              },
            },
          }).render();
        }
      },
    });
  }

  var userInp = [];

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
    const uorr = $(this).find("input[name=foo]").val();
    const bh = $(this).find("input[name=foo2]").val();

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
        uorr,
        bh,
      }),
      success: function (res) {
        userInp.push([
          parseInt(hrsStudied),
          parseInt(prevSemMarks),
          parseInt(avgInternal),
          parseInt(assMarks),
          parseInt(absDays),
        ]);
        console.log(userInp);
        $("#ml-chart").empty();
        console.log(res.xs[0]);
        btnLoaderToggleOff(
          btn,
          loader,
          `<span class="material-symbols-outlined m-r-sm">
  settings
</span>
Predict`
        );
        if (res.response) {
          var options = {
            series: [
              {
                name: "SAMPLE A",
                data: [
                  [0, 0, 0, 0, 15],
                  [0, 0, 0, 0, 15],
                  [0, 25, 10, 4, 10],
                  [1, 35, 13, 6, 9],
                  [2, 42, 16, 7, 8],
                  [4, 73, 23, 10, 2],
                  [6, 96, 29, 10, 1],
                  [5, 85, 25, 10, 3],
                  [3, 66, 22, 9, 5],
                  [2, 52, 17, 7, 8],
                  [3, 69, 25, 10, 2],
                  [4, 71, 23, 9, 6],
                  [2, 51, 17, 8, 0],
                  [3, 66, 20, 10, 0],
                  [4, 80, 26, 10, 2],
                  [2, 45, 15, 10, 0],
                  [3, 63, 20, 8, 3],
                  [6, 98, 30, 10, 5],
                  [5, 89, 29, 10, 1],
                  [3, 59, 19, 9, 8],
                  [2, 49, 14, 7, 9],
                  [1, 36, 13, 5, 1],
                  [2, 56, 20, 8, 2],
                  [3, 68, 22, 10, 5],
                  [4, 85, 25, 10, 8],
                  [3, 63, 21, 10, 0],
                  [2, 49, 20, 10, 0],
                  [4, 79, 22, 5, 8],
                  [5, 88, 22, 6, 6],
                ],
              },
              {
                name: "SAMPLE B",
                data: [
                  [5, 40, 20, 0, 0],
                  [4, 65, 20, 0, 0],
                  [1, 80, 35, 10, 10],
                ],
              },
              {
                name: "user input",
                data: userInp,
              },
            ],
            chart: {
              height: 350,
              type: "scatter",
              zoom: {
                enabled: true,
                type: "xy",
              },
            },
            xaxis: {
              tickAmount: 10,
              labels: {
                formatter: function (val) {
                  return parseFloat(val).toFixed(1);
                },
              },
            },
            yaxis: {
              tickAmount: 10,
            },
          };

          var chart = new ApexCharts(
            document.querySelector("#ml-chart"),
            options
          );
          chart.render();
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

        if (res.response && res.notifications.length > 0) {
          $.each(res.notifications, function (indexInArray, valueOfElement) {
            html = `
    <div class="card" style="max-width: 350px;">
      <div class="card-centents p-lg ">

        <div class="more-menu" id="more-menu">
          <ul>
            <div class="btn-loader" style="display: none;"></div>
            <li class="delete" id="delete-post-btn">Delete</li>
          </ul>
        </div>
        <div class="display-flex j-space-between">
          <div class="display-flex">
            <div class="avatar m-r-sm">${this.fullName[0]}</div>
            <p class="captize">${this.fullName}</p>
          </div>



        </div>
        <div class="display-flex j-start hint m-t">
          <p>${this.department == "ALL" ? "" : this.department} ${
              this.designation.trim() == "staff"
                ? "professor"
                : this.designation.trim() == "hod"
                ? "HOD"
                : this.designation.trim() == "Admin"
                ? "principle"
                : "ananymous"
            }</p>
          <div class="hint m-l">${timeSince(new Date(this.createdAt))}</div>
        </div>



        <div class="title header m-b">${this.title}</div>
        <div class="desc">
          ${urlify(this.description)}
        </div>

        <div class="row j-start m-t">

          `;

            for (let tag of this.tags) {
              html =
                html +
                `<div class="chip bg-pri-c  inline-flex mx" style="height: 26px;">
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
