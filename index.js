var turns = [];
var colors = ["green", "red", "blue", "yellow"];
var recording = [];
var speed = 200;
var strictMode = false;
var running;

//Audio files for button sounds
var green = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3');
var red = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3');
var yellow = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3');
var blue = new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3');

var obj = {
  "green": green,
  "red": red,
  "yellow": yellow,
  "blue": blue
};

function setSoundSpeed(x) {
  for (var k in obj) {
    obj[k].playbackRate = x;
    obj[k].preload = "auto";
  }
}

setSoundSpeed(2);

function addRandomColor() {
  turns.push(colors[Math.floor(Math.random() * colors.length)]);
  var level = turns.length;
  $('.level').text(level);
}


addRandomColor();

$('button.play').on('click', function() {
  nextItemActivate(turns);
});

// Animation callback to start next fade-in
function nextItemActivate(items) {
  // Fade in the first element in the collection

  $('.' + items[0]).addClass('active', speed, function() {

    obj[items[0]].play();
  }).removeClass('active', speed, function() {

    // Recurse, but without the first element
    nextItemActivate(items.slice(1));
  });
  if (items.length === 0) {
    $('.green, .red, .yellow, .blue').addClass('enabled');
  }
}

$('body').on('click', '.enabled', function() {
  if (running){
    return false;
  }
  running = true;
  $(this).addClass('active', speed, function() {
    obj[$(this).attr('class').split(' ')[0]].play();
  }).removeClass('active', speed, function() {

    recording.push($(this).attr('class').split(' ')[0]);
    var currentMoves = recording.length
    var currentLevel = turns.length
    if (recording[currentMoves - 1] === turns[currentMoves - 1]) {
      if (currentMoves === currentLevel) {
        if (currentMoves !== 20) { 
          recording = [];
          $('.green, .red, .yellow, .blue').removeClass('enabled');
          $('.correct').fadeIn(500, function() {
            $('.correct').fadeOut(500, function() {

              addRandomColor();
              setTimeout(
                function() {
                  nextItemActivate(turns);
                }, 200);
            });
          });
        } else {
          $('.trophy').fadeIn(1000, function() {
            green.play();
            red.play();
            yellow.play();
            blue.play();
            $('.trophy').fadeOut(1000, function() {
              reset();
            })
          });
        }

      }

    } else {
      recording = [];
      $('.green, .red, .yellow, .blue').removeClass('enabled');
      $('.wrong').fadeIn(500, function() {
        $('.wrong').fadeOut(500, function() {
          setTimeout(
            function() {
              nextItemActivate(turns);
            }, 200);
        });
      });

    }
    running = false;
  });

})

function reset() {
  if ($('.green, .red, .yellow, .blue').hasClass('enabled')) {
    turns = [];
    recording = [];
    speed = 200;
    setSoundSpeed(1.5);
    addRandomColor();
    nextItemActivate(turns);
  }

}

$('button.reset').on('click', function() {
  reset();
})