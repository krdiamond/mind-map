// onAnyUserGesture.js
export function onAnyUserGesture(handler, opts = {}) {
  const target = opts.target || window;

  // Broad but safe set of activation-style events (covers iOS/Android/desktop)
  const events = opts.events || [
    'pointerdown',  // touch/pen/mouse
    'pointerup',
    'click',
    'mouseup',
    'touchend',
    'keydown',      // hardware keyboard
    'submit',
    'reset',
    'dblclick',
    'contextmenu',
    'change',
  ];

  let fired = false;

  const listenerOptions = { capture: true, passive: false };

  const invoke = (e) => {
    if (fired) return;
    fired = true;
    remove();
    // Call synchronously inside the event handler
    try { handler(e); } catch (err) { console.error(err); }
  };

  const remove = () => {
    events.forEach(evt => target.removeEventListener(evt, invoke, listenerOptions));
  };

  events.forEach(evt => target.addEventListener(evt, invoke, listenerOptions));

  // return a cancel function in case you want to stop listening manually
  return remove;
}
