let currentKeyboardLayout = "qwerty";
let keyState = {};
const REPEAT_FREQUENCY = 6;

const KEYBOARD_LAYOUTS =
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

const KEYBOARD_INPUTS =
    {
        'up': function () { gPlayer.move(0, -1); },
        'left': function () { gPlayer.move(-1, 0); },
        'down': function () { gPlayer.move(0, 1); },
        'right': function () { gPlayer.move(1, 0); },
        'hit': function () { gPlayer.attack(); }
    };

function updateKeyboardLayout(e)
{
  currentKeyboardLayout = e.target.value;
}

function removeAndStopKeyboardActions()
{
  document.onkeydown = function (){};
  for (let key in keyState)
  {
    if (keyState.hasOwnProperty(key))
      clearInterval(keyState[key]);
  }
}

document.onkeydown = function (e)
{
  if (!gMusicActive)
  {
    gCoolBassLine.loop = true;
    gCoolBassLine.play();

    gMusicActive = true;
  }

  let keyboardInput = KEYBOARD_LAYOUTS[currentKeyboardLayout][e.key];

  if (!(keyboardInput in KEYBOARD_INPUTS))
    return;

  if (!keyState[e.key])
  {
    KEYBOARD_INPUTS[keyboardInput]();
    keyState[e.key] = setInterval(KEYBOARD_INPUTS[keyboardInput], 1000 / REPEAT_FREQUENCY);
  }
};

document.onkeyup = function (e)
{
  clearInterval(keyState[e.key]);
  keyState[e.key] = null;
};
