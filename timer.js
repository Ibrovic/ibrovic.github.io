var Clock = {
totalSeconds: 0,

start: function () {
    var self = this;
    function pad(val) { return val > 9 ? val : "0" + val; }
    this.interval = setInterval(function () {
    self.totalSeconds += 1;


    $("#min").text(pad(Math.floor(self.totalSeconds / 60 % 60)));
    $("#sec").text(pad(parseInt(self.totalSeconds % 60)));
  }, 1000);
},

reset: function () {
Clock.totalSeconds = null; 
clearInterval(this.interval);
$("#min").text("00");
$("#sec").text("00");
},

pause: function () {
clearInterval(this.interval);
delete this.interval;
},

resume: function () {
if (!this.interval) this.start();
},

restart: function () {
 this.reset();
 Clock.start();
}
};


// $('#startButton').click(function () { Clock.start(); });
// $('#pauseButton').click(function () { Clock.pause(); });
// $('#resumeButton').click(function () { Clock.resume(); });
// $('#resetButton').click(function () { Clock.reset(); });
$('#select').click(function () { Clock.restart(); });