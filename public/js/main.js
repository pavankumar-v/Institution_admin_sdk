// BUTTON TOGGLER
function btnLoaderToggleOn(btn, loader) {
  btn.attr("disabled", true);
  btn.empty();
  btn.append(loader);
  loader.toggle();
}
function btnLoaderToggleOff(btn, loader, text) {
  loader.toggle();
  btn.append(text);
  btn.attr("disabled", false);
}

// timstring to relative agos
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

var aStyle = 'style="color: #1b62db; text-decoration: underline;"';
// linkify
function urlify(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function (url) {
    return `<a href="${url}" ${aStyle} target="_blank">` + url + "</a>";
  });
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}

$(document).ready(function () {
  // SIDEBAR TOGGLE
  $(".hamburger").click(function () {
    $(".wrapper").toggleClass("collapse");
  });

  //loader
  $(".container .loader").hide();
  $(".btn-loader").hide();

  $(".sidebar__item").click(function () {
    $(".main-data").css("display", "none");
    $(".loader").css("display", "block");
    $(".sidebar__item").removeClass("active");
    $(this).addClass("active");
  });

  // expand toggle
  $("#tab2 #expand-more").on("click", function (e) {
    const cardList = $(this).parents(".card-list");
    cardList.children(".content-expand").toggle();
  });

  $(document).on("click", ".more-vert", function (e) {
    console.log("min");
    const more_menu = $(this).parent().parent().find("#more-menu");
    more_menu.toggle();
  });
  $(document).on("click", ".more-vert", function (e) {
    const more_menu = $(this).parent().find(".more-menu");
    more_menu.toggle();
  });

  // close alert
  $(".alert-close").on("click", function () {
    $(this).parent().remove();
  });

  // copy to clipboard
  $("#copy-clipboard").on("click", function (e) {
    /* Get the text field */
    var copyText = $(".copy-able p");
    console.log(copyText.html());

    /* Select the text field */
    copyText.select();
    // copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.text());

    M.toast({
      html: `<span style='color: white;'>copied to clipboard<span>`,
    });
  });

  $(".collapsible").collapsible();

  $(document).ready(function () {
    $(".modal").modal();
  });
});
