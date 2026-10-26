// An original, looping 8-bit tune for the Paper World. Numbers are MIDI pitches;
// nulls are rests. Eight steps make one bar at 136 beats per minute.
const melody = [
  74, null, 77, 79, 81, null, 79, 77,
  76, null, 79, 81, 84, null, 81, null,
  79, 77, 74, null, 72, 74, 77, null,
  76, 74, 72, null, 69, null, 72, null,
  74, null, 81, 79, 77, 79, 81, null,
  84, 81, 79, null, 77, 76, 74, null,
  72, 74, 77, null, 79, 77, 74, 72,
  69, null, 72, 76, 74, null, 74, null,
];
const bass = [50, 48, 43, 45, 41, 48, 43, 45];
const chords = [
  [62, 65, 69], [60, 64, 67], [55, 59, 62], [57, 61, 64],
  [53, 57, 60], [60, 64, 67], [55, 59, 62], [57, 61, 64],
];
const stepLength = 60 / 136 / 2;
const pitch = midi => 440 * 2 ** ((midi - 69) / 12);

export function createMusicPlayer(getContext) {
  let timer = null;
  let context = null;
  let master = null;
  let step = 0;
  let nextTime = 0;

  function note(midi, when, duration, volume, type = 'square') {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(pitch(midi), when);
    envelope.gain.setValueAtTime(0.0001, when);
    envelope.gain.exponentialRampToValueAtTime(volume, when + 0.008);
    envelope.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    oscillator.connect(envelope);
    envelope.connect(master);
    oscillator.start(when);
    oscillator.stop(when + duration + 0.01);
  }

  function schedule(when) {
    const bar = Math.floor(step / 8);
    const beat = step % 8;
    const lead = melody[step];
    if (lead !== null) note(lead, when, stepLength * 0.78, 0.024);
    if (beat % 2 === 0) {
      note(bass[bar] + (beat === 2 || beat === 6 ? 7 : 0), when, stepLength * 1.55, 0.018, 'triangle');
    }
    if (beat % 2 === 1) {
      note(chords[bar][beat % 3], when, stepLength * 0.55, 0.008, 'triangle');
    }
    if (beat === 0 || beat === 4) note(33, when, 0.09, 0.012, 'sine');
    if (beat === 2 || beat === 6) note(89, when, 0.045, 0.005, 'triangle');
    step = (step + 1) % melody.length;
  }

  function tick() {
    if (nextTime < context.currentTime - stepLength) nextTime = context.currentTime + 0.04;
    while (nextTime < context.currentTime + 0.18) {
      schedule(nextTime);
      nextTime += stepLength;
    }
  }

  return {
    start() {
      if (timer !== null) return;
      context = getContext();
      if (!context || context.state === 'closed') return;
      master = context.createGain();
      master.gain.value = 0.55;
      master.connect(context.destination);
      step = 0;
      nextTime = context.currentTime + 0.04;
      tick();
      timer = setInterval(tick, 50);
    },
    stop() {
      if (timer === null) return;
      clearInterval(timer);
      timer = null;
      const oldMaster = master;
      const now = context.currentTime;
      oldMaster.gain.cancelScheduledValues(now);
      oldMaster.gain.setTargetAtTime(0.0001, now, 0.02);
      setTimeout(() => oldMaster.disconnect(), 400);
      master = null;
    },
  };
}
