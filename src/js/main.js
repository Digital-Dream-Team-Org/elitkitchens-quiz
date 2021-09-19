(function ($) {
  // Document ready
  $(function () {
    let circle = $(".progress-ring__circle")[0];
    let radius = circle.r.baseVal.value;
    let circumference = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;
    function setProgress(percent) {
      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    $(".quiz-card__button").on("click", function () {
      const parent = $(this).closest(".quiz-card-wrap");
      const radio = parent.find('input[type="radio"]');
      radio.prop("checked", true);
    });

    let currentTab = 1;
    let tabsAmount = $(".quiz-tab.quiz-tab--question").length;
    $(".quiz-step__current").html(currentTab);
    $(".quiz-step__total").html(tabsAmount);
    setProgress((currentTab / tabsAmount) * 100);

    $("#quizBack").on("click", function () {
      // Change tab index
      if (currentTab - 1 >= 1) {
        currentTab--;
      }

      tabsCommon();
    });
    $("#quizForward").on("click", function () {
      // Check if radio selected to continue
      const parent = $(`.quiz-tab[data-tab='${currentTab}']`);
      if (parent.hasClass("quiz-tab--radio")) {
        const radio = parent.find('input[type="radio"]:checked');
        if (radio.length === 0) {
          return;
        }
      }

      // Change tab index
      if (currentTab + 1 <= tabsAmount) {
        currentTab++;
      }

      tabsCommon();
    });

    const defaultRangeVal = $(".quiz-range").val();
    $(".quiz-range")
      .closest(".quiz-range-wrap")
      .find(".quiz-range__value-text")
      .html(qzNumberWithSpaces(defaultRangeVal));
    $(".quiz-range").on("input change", function () {
      const val = $(this).val();
      $(".quiz-range")
        .closest(".quiz-range-wrap")
        .find(".quiz-range__value-text")
        .html(qzNumberWithSpaces(val));
    });

    $("#quizForm").on("submit", function (e) {
      e.preventDefault();
      const url = $(this).attr("action");
      const method = $(this).attr("method");
      const serialized = $(this).serialize();

      // const serialized = $(this).serializeArray();

      $.ajax({
        url,
        type: method,
        data: {
          action: "quizForm",
          serialized,
        },
        success: function (data) {
          $(".quiz-form-wrap").addClass("d-none");
          $(".quiz-result").removeClass("d-none");
        },
        error: function (data) {
          alert("Ошибка, повторите позднее");
          console.error(data);
        },
      });
    });

    $("#quizRepeat").on("click", function () {
      // Reset tabs
      $(".quiz-form-wrap").removeClass("d-none");
      $(".quiz-result").addClass("d-none");
      currentTab = 1;
      tabsCommon();

      // reset inputs
      $("#quizForm").find('input[type="text"], input[type="tel"]').val("");

      // reset radios
      $("#quizForm").find('input[type="radio"]').prop("checked", false);

      // reset range
      $("#quizForm").find('input[type="range"]').val(defaultRangeVal);
      $(".quiz-range")
        .closest(".quiz-range-wrap")
        .find(".quiz-range__value-text")
        .html(qzNumberWithSpaces(defaultRangeVal));
    });

    function tabsCommon() {
      // Change submit button
      if (currentTab === tabsAmount) {
        $("#quizForward").addClass("d-none");
        $("#quizSubmit").removeClass("d-none");
      } else {
        $("#quizForward").removeClass("d-none");
        $("#quizSubmit").addClass("d-none");
      }

      // Change progress circle
      setProgress((currentTab / tabsAmount) * 100);

      // Change step value
      $(".quiz-step__current").html(currentTab);

      // Switch tab class
      $(".quiz-tab").removeClass("active");
      $(".quiz-tabs")
        .find(`.quiz-tab[data-tab='${currentTab}']`)
        .addClass("active");

      // Disable back button if first tab
      if (currentTab <= 1) {
        $("#quizBack").prop("disabled", true);
      } else {
        $("#quizBack").prop("disabled", false);
      }
    }
  });
})(jQuery);

function qzNumberWithSpaces(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}
