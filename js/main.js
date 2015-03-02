// Face age judgment task.

// Settings
numTrials = 100;
maxScore = 100;

console.log("Starting experiment...");

faceIndex = 1;
responses = [];

data = [];
baseUrl = "img/faces/";
//baseUrl = "http://testmybrain.org/tests/suchow_age/img/faces/";
thisImage = baseUrl + "face_" + faceIndex + ".jpg";
$("#stimulus").attr("src", thisImage);
$("#results").hide();
$("#age").focus();
time = Date.now();

$("#next-face").click(function() {
    proceedToNextTrial();
});

$("#final-score").click(function() {
    // Set and submit the form data.
    $("#score").val(score);
    $("data").val(JSON.stringify(data));
    $("#form").submit();
    console.log("Results submitted.");
});

proceedToNextTrial = function () {
    rt = Date.now() - time;

    if (faceIndex <= numTrials) {  // The experiment is ongoing...

        // Validate the input.
        age = parseInt($("#age").val());
        if (isNaN(age) || age < 0 || age > 120) {
            $("#age").focus();
            return false;
        }

        // Record the data.
        responses.push(age);
        data.push({
            "trial": faceIndex,
            "stim": thisImage,
            "age": age,
            "rt": rt,
        });
    }

    if (faceIndex < numTrials) {  // Show the next face.

        faceIndex++;
        thisImage = baseUrl + "face_" + faceIndex + ".jpg";
        $("#stimulus").attr("src", thisImage);
        time = Date.now();
        $("#age").val("");
        $("#age").focus();

        // Preload the next image.
        (new Image()).src = baseUrl + "face_" + Math.min(faceIndex + 1, numTrials) + ".jpg";


    } else {  // The experiment is over.

        $("#stage").hide();
        $("#age").hide();

        // Compute the score.
        score = numTrials;
        for (var i = 0; i <= numTrials - 1; i++) {
            $("#results").append("<div><p><img src='" + baseUrl + "face_" + (i + 1) + ".jpg' width='100px' />" + groundTruth[i] + ", you guessed " + responses[i] + ".</p></div>");
            error = (responses[i] - groundTruth[i]) / groundTruth[i];
            score = score - Math.abs(error);
        }
        score = Math.max(0, (maxScore * (score / numTrials)).toFixed(2));

        $("#results").append("<button type='submit' name='Submit' class='btn btn-success btn-lg' id='final-score' role='button'>Get your score!</button>");

        // Display the results.
        $("#score-displayed").text(score);
        $("#results").show();
    }
};

Array.prototype.average = function () {
  var sum = 0, j = 0;
  for (var i = 0; i < this.length, isFinite(this[i]); i++) {
          sum += parseFloat(this[i]); ++j;
  }
  return j ? sum / j : 0;
};

groundTruth = [
    22, 39, 63, 28, 48, 12, 23, 40, 20, 50,
    30, 13, 30, 52, 29, 31, 38, 43, 4, 40,
    21, 34, 41, 72, 9, 70, 71, 19, 52, 28,
    65, 55, 57, 32, 39, 25, 27, 37, 46, 38,
    34, 47, 78, 22, 31, 72, 19, 44, 77, 30,
    19, 23, 74, 38, 24, 6, 67, 7, 30, 30,
    12, 2, 5, 4, 62, 14, 52, 23, 76, 40,
    1, 47, 12, 16, 18, 80, 9, 1, 28, 81,
    42, 21, 19, 24, 20, 32, 10, 65, 78, 78,
    42, 81, 5, 52, 19, 30, 49, 70, 69, 70
];

if (!Date.now) {
    Date.now = function() { return new Date().getTime(); };
}

$('input').on("keypress", function(e) {
    if (e.keyCode == 13) {
        proceedToNextTrial();
    }
});
