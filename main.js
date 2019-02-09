var $board = $("#board");

var colums;
var rows;
var mines;
window.highScore = [];
var result = {};


function createBoard(colums, rows, mines) {
    $board.empty();
    $("#top").empty();

    $("#top")
        .append($("<div>").addClass("score").text("0"))
        .append($("<div>").addClass("smiley")
            .append($("<i>").addClass("far fa-smile-beam"))
            .append($("<i>").addClass("far fa-frown-open")))
        .append($("<p>").addClass("clock")
            .append($("<span>").attr("id", "min").text("00"))
            .append($("<span>").text(":"))
            .append($("<span>").attr("id", "sec").text("00"))
        )

    for (let i = 0; i < colums; i++) {
        var $col = $("<div>").addClass("col");
        for (let j = 0; j < rows; j++) {
            var $row = $("<div>")
                .addClass("row hidden")
                .attr("data-col", i)
                .attr("data-row", j);
            if (Math.random() < mines) {
                $row.addClass("mine");
            }

            $col.append($row);
        }
        $board.append($col);
    }
}

createBoard(colums, rows, mines);


function gameOver(isWin) {
    var icon = null;
    if (isWin) {
        icon = "fa fa-flag";
    }
    else {
        icon = "fa fa-bomb";
    }
    $(".row.mine").append(
        $("<i>").addClass(icon)
    );
    $(".row:not(.mine)")
        .html(function () {
            var $cell = $(this);
            var count = getMineCount(
                $cell.data("col"),
                $cell.data("row"),
            );
            return count === 0 ? "" : count;
        })
    $('.row.hidden').removeClass('hidden');
    setTimeout(function () {

        $("#board").addClass("hide");
        $("#start").addClass("hide");
        $("#enter-score").removeClass("hide");

        $(".top").addClass("hide");

        var min = $("#min").html();
        var sec = $("#sec").html();
        var finalScore = $(".score").html();

        $(".save-score").on("click", (event) => {
            var name = $(".input-name").val()
            if (name.length > 1) {
                result = {
                    name: name,
                    score: finalScore,
                    time: (min + ":" + sec)
                }

                var getScore = localStorage.getItem("highscore");

                if (getScore === null) {

                    window.highScore.push(result);
                    var thatScore = JSON.stringify(window.highScore);
                    localStorage.setItem("highscore", thatScore)

                } else {
                    var postScore = JSON.parse(getScore);
                    postScore.push(result);
                    var thisScore = JSON.stringify(postScore);
                    localStorage.setItem("highscore", thisScore)
                }
                scoreTable();
                $("#start").removeClass("hide");
                $("#enter-score").addClass("hide");

            } else {
                $(".input-name").attr("placeholder", "Name is required");
            }
        })

        Clock.restart();

    }, 1000);

}


function reveal(oi, oj) {
    var seen = {};

    function helper(i, j) {

        if (i >= colums || j >= rows || i < 0 || j < 0) {
            return
        };

        var key = `${i} ${j}`

        if (seen[key]) {
            return
        };

        var $cell = $(`.row.hidden[data-col=${i}][data-row=${j}]`);
        var mineCount = getMineCount(i, j)

        if (
            !$cell.hasClass("hidden") ||
            $cell.hasClass("mine")) {
            return;
        }

        $cell.removeClass("hidden");

        if (mineCount) {
            $cell.text(mineCount);
            return;
        }

        for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
                helper(i + di, j + dj);
            }
        }

    }

    helper(oi, oj)
}

function getMineCount(i, j) {
    var count = 0;
    for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
            var ni = i + di;
            var nj = j + dj;
            if (ni >= colums || nj >= rows || ni < 0 || nj < 0) {
                continue
            };

            var $cell = $(`.row.hidden[data-col=${ni}][data-row=${nj}]`);
            if ($cell.hasClass("mine")) {
                count++;
            }
        }
    }


    return count;
}


$board.on("click", ".row.hidden", function () {
    var $cell = ($(this));
    var col = $cell.data("col");
    var row = $cell.data("row");

    if ($cell.hasClass("mine")) {
        gameOver(false);
    }
    else {
        reveal(col, row);
        var isGameOver = $(".row.hidden").length === $(".row.mine").length
        var displayScore = $(".row").length - $(".hidden").length;
        $(".score").html(displayScore);

        if (isGameOver) {
            gameOver(true);
        }
    }
});










//Events

function scoreTable() {
    var getScore = localStorage.getItem("highscore");
    var score = JSON.parse(getScore);
    if (!(getScore === null)) {
        $(".remove-wrapper").remove();
        score.sort(function (a, b) { return b.score - a.score });

        for (let i = 0; i < score.length; i++) {
            var $scoreHolder = $(".highscore");
            var $scoreLine = $("<div>").addClass("h-score-wraper remove-wrapper").appendTo($scoreHolder);
            $("<div>").addClass("name").html(score[i].name).appendTo($scoreLine);
            $("<div>").addClass("h-score").html(score[i].score).appendTo($scoreLine);
            $("<div>").addClass("h-time").html(score[i].time).appendTo($scoreLine);
        }
    }
    console.log(score)
}

scoreTable();


$("#select").on("click", (event) => {
    this.colums = $("#field").val();
    this.rows = $("#field").val();
    this.mines = $("#mines").val();
    this.sec = 0;



    $("#board").removeClass("hide");
    $(".top").removeClass("hide");
    $("#start").addClass("hide");
    $("#enter-score").addClass("hide");


    createBoard(colums, rows, mines);
});



$(".hid").on("click", (event) => {
    $("#board").addClass("hide");
    $("#start").removeClass("hide");
    $("#enter-score").addClass("hide");

    $("#top").empty();
});



$board.contextmenu(function (event) {
    event.preventDefault();
    console.log(event.target);
    if ($(event.target).hasClass("hidden")) {
        if ($(event.target).hasClass("remove-flag")) {

            ($(event.target)).empty().removeClass("remove-flag")
        } else {
            $(event.target).addClass("remove-flag").append($("<i>").addClass("fa fa-flag"));
        }
    }


});

