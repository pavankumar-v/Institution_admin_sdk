$(document).ready(function () {
  // $(".datepicker").datepicker({ format: "mmm-dd-yyyy" });
  var d = new Date();
  var month = d.getMonth() + 1;
  var day = d.getDate();
  var curDate =
    d.getFullYear() +
    "-" +
    (("" + month).length < 2 ? "0" : "") +
    month +
    "-" +
    (("" + day).length < 2 ? "0" : "") +
    day;
  $(".datepicker").val(curDate);
  $(".datepicker").datepicker({
    format: "yyyy-mm-dd",
    defaultDate: curDate,
    maxDate: new Date(),
  });
});
