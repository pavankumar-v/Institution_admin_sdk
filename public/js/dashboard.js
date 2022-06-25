$(document).ready(function () {
  $("#chart-sem").on("change", loadChart);
  $("#chart-branch").on("change", loadChart);
  loadChart();

  function loadChart() {
    var branch = $("#chart-branch").val();
    var sem = $("#chart-sem").val();
    const loader = $(".chat-action").children(".btn-loader");
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
          console.log(res.attendanceData);
          var attendanceData = res.attendanceData;
          subs = Object.keys(attendanceData);

          var series = [];
          var dates = [];

          for (let sub of subs) {
            tempDates = Object.keys(attendanceData[sub]);
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
            colors: ["#386A20", "#386667", "#55624C"],
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
});
