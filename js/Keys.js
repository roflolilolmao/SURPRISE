var gKeyboardLayout = "qwerty";

function updateKeyboardLayout(e)
{
    gKeyboardLayout = e.target.value;
}

let keyboardLayouts =
    {
      'qwerty':
          {
            'w': 'up',
            'a': 'left',
            's': 'down',
            'd': 'right',
            'p': 'hit',
            'q': 'hit'
          },
      'dvorak':
          {
            ',': 'up',
            'a': 'left',
            'o': 'down',
            'e': 'right',
            'l': 'hit',
            '\'': 'hit'
          }
    };

let keyboardInputs =
    {
      'up': function () { gPlayer.move(0, -1); },
      'left': function () { gPlayer.move(-1, 0); },
      'down': function () { gPlayer.move(0, 1); },
      'right': function () { gPlayer.move(1, 0); },
      'hit': function () { gPlayer.attack(); }
    }

document.onkeydown = function (e)
{
  if (!gMusicActive)
  {
    gCoolBassLine.loop = true;
    gCoolBassLine.play();
    
    gMusicActive = true;
  }

  let keyboardInput = keyboardLayouts[gKeyboardLayout][e.key];
  if (!(keyboardInput in keyboardInputs))
    return;

  keyboardInputs[keyboardInput]();
};

document.onkeyup = function (e)
{
};
