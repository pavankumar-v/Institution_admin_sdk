// $(document).ready(function () {
//   $("#branch").on("change", function () {
//     $("#sem").css("display", "block");
//   });

//   $("#sem").on("change", getSubjects);
//   $("#branch").on("change", getSubjects);

//   getSubjects();
//   function getSubjects() {
//     $(".loader").css("display", "block");
//     var branch = $("#branch").val();
//     var sem = $("#sem").val();
//     if (sem == null) {
//       sem = 1;
//     }

//     if (branch != null) {
//       branch = branch.toLowerCase();
//     }
//     $.ajax({
//       type: "POST",
//       url: "/loadSubjects",
//       contentType: "application/json",
//       data: JSON.stringify({ branch, sem }),
//       success: function (res) {
//         $(".loader").toggle();
//         $("#subject-list").empty();

//         if (res.subjects.length > 0) {
//           $.each(res.subjects, function () {
//             console.log(this.id, this.name);
//             var str = this.name;
//             var matches = str.match(/\b(\w)/g);
//             var acronomy = matches.join("");
//             console.log(acronomy.toUpperCase());
//             $("#subject-list").append(
//               `
//               <div class="card elevation col subject-card">
//           <div class="subject-card-content">

//             <div class="card-content">
//               <h6 class="headline5">${acronomy.toUpperCase()}</h6>
//               <p class="subhead">${this.name}</p>
//               <i class="hint">${this.subId.toUpperCase()}</i>
//               <hr />
//               <p class="desc">
//               ${this.description}
//               </p>
//               <div class="action display-flex j-end m-t">
//                 <button class="btnn-small btnn-rounded">Action</button>
//               </div>
//             </div>
//           </div>
//         </div>
//               `
//             );
//           });
//         } else {
//           $("#subject-list").append("No Subjects Found");
//         }
//       },
//       error: function (res) {
//         console.log("error");
//       },
//     });
//   }
// });
