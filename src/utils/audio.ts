export const createAudio = async (url: string, fftSize=64) => {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const context = new (window.AudioContext || (window as any).webkitAudioContext)();
  const source = context.createBufferSource();
  source.buffer = await new Promise((res) => context.decodeAudioData(buffer, res));
  source.loop = true;
  source.start(0);
  const gain = context.createGain();
  const analyzer = context.createAnalyser();
  analyzer.fftSize = fftSize;
  source.connect(analyzer);
  analyzer.connect(gain);
  const data = new Uint8Array(analyzer.frequencyBinCount);
  return { 
    context,
    source,
    gain,
    data,
    update: () => {
      analyzer.getByteFrequencyData(data);
      // Calculate a frequency average
      // avg is a custom property
      return ((data as any).avg = data.reduce((prev, cur) => prev + cur / data.length, 0));
    }
   };
}