import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Download, Trash2, Sparkles, RefreshCw, Smartphone, Film, Frame, Moon, Clock, Monitor, Wind, Ghost, Zap, Cloud, Image as ImageIcon } from 'lucide-react';
import { Smile, Clapperboard } from 'lucide-react';

const App = () => {
  const [captures, setCaptures] = useState([]);
  const [colorFilter, setColorFilter] = useState('special90s'); 
  const [activeFrame, setActiveFrame] = useState('none'); 
  const [isCapturing, setIsCapturing] = useState(false);
  const [timerDelay, setTimerDelay] = useState(0); 
  const [countdown, setCountdown] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const saveFinal = useCallback((dataUrl) => {
    const newCapture = {
      id: Date.now(),
      url: dataUrl
    };
    setCaptures([newCapture, ...captures]);
    setTimeout(() => setIsCapturing(false), 500);
  }, [captures]);

  const executeCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsCapturing(true);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    // Define Polaroid dimensions (Image is square, card is rectangular)
    const imgSize = Math.min(video.videoWidth, video.videoHeight);
    const padding = imgSize * 0.05; // 5% border
    const bottomPadding = imgSize * 0.20; // Thicker bottom for text
    
    canvas.width = imgSize + (padding * 2);
    canvas.height = imgSize + padding + bottomPadding;

    // 1. Draw White Polaroid Background
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Video Frame (The actual photo)
    context.save();
    // Mirror the capture
    context.translate(canvas.width - padding, padding);
    context.scale(-1, 1);
    
    const startX = (video.videoWidth - imgSize) / 2;
    const startY = (video.videoHeight - imgSize) / 2;

    if (colorFilter === 'special90s') {
      // --- THE SPECIAL 90s CANVAS PIPELINE ---
      
      // 1️⃣ Base Film Color
      context.filter = 'contrast(0.9) brightness(1.05) saturate(0.85) sepia(0.12)';
      context.drawImage(video, startX, startY, imgSize, imgSize, 0, 0, imgSize, imgSize);

      // 2️⃣ Flash Overlay (Simulate center flash highlights)
      context.globalCompositeOperation = 'overlay';
      const flashGrad = context.createRadialGradient(imgSize/2, imgSize/2, 0, imgSize/2, imgSize/2, imgSize/2);
      flashGrad.addColorStop(0, 'rgba(255,255,255,0.25)');
      flashGrad.addColorStop(1, 'rgba(255,255,255,0)');
      context.fillStyle = flashGrad;
      context.fillRect(0, 0, imgSize, imgSize);
      context.globalCompositeOperation = 'source-over';

      // 3️⃣ Grain + Dust
      for (let i = 0; i < imgSize * imgSize * 0.015; i++) {
        const x = Math.random() * imgSize;
        const y = Math.random() * imgSize;
        const alpha = Math.random() * 0.15;
        context.fillStyle = `rgba(255,255,255,${alpha})`;
        context.fillRect(x, y, 1, 1);
      }

      // 4️⃣ Color Cast (Slight blue/green shift)
      // Using a temporary canvas to apply hue-rotate to the already graded image
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = imgSize; tempCanvas.height = imgSize;
      tempCanvas.getContext('2d').drawImage(canvas, padding, padding, imgSize, imgSize, 0, 0, imgSize, imgSize);
      context.filter = 'hue-rotate(-6deg)';
      context.drawImage(tempCanvas, 0, 0);

      // 5️⃣ Vignette (Atmospheric dark edges)
      const vignette = context.createRadialGradient(imgSize/2, imgSize/2, imgSize * 0.35, imgSize/2, imgSize/2, imgSize * 0.75);
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.45)');
      context.fillStyle = vignette;
      context.fillRect(0, 0, imgSize, imgSize);

      // 6️⃣ Subtle Blur (Cheap lens softness)
      context.filter = 'blur(0.6px)';
      context.drawImage(canvas, padding, padding, imgSize, imgSize, 0, 0, imgSize, imgSize);

      // 7️⃣ Film Edge Fade (Internal glow)
      context.filter = 'none';
      context.strokeStyle = 'rgba(255,255,255,0.12)';
      context.lineWidth = 10;
      context.strokeRect(0, 0, imgSize, imgSize);

    } else {
      // Apply standard filters
      const filterDefinitions = {
        vintage: 'sepia(0.8) contrast(1.2) brightness(0.9)',
        bw: 'grayscale(1) contrast(1.2) brightness(1.1)',
        warm: 'sepia(0.3) saturate(1.6) hue-rotate(-10deg)',
        '90s': 'sepia(0.2) saturate(0.8) contrast(0.9) brightness(1.1) blur(0.5px)',
        night: 'brightness(0.6) contrast(1.4) saturate(0.7)',
        screen: 'brightness(1.2) contrast(0.85) saturate(0.9)',
        faded: 'sepia(0.15) contrast(0.85) brightness(1.1)',
        polaroid: 'sepia(0.25) contrast(1.1) saturate(1.2) brightness(1.05)',
        dreamy: 'brightness(1.1) saturate(1.1) blur(1px)',
        cold: 'hue-rotate(15deg) saturate(0.9) contrast(1.1)',
        vhs: 'contrast(1.3) saturate(0.7) brightness(1.05)'
      };

      if (colorFilter !== 'normal') {
        context.filter = filterDefinitions[colorFilter] || 'none';
      }
      context.drawImage(video, startX, startY, imgSize, imgSize, 0, 0, imgSize, imgSize);
    }
    context.restore();
    context.filter = 'none';

    // 3. Overlay Frames (Absolute Cinema / Chill)
    if (activeFrame === 'cinema') {
      context.fillStyle = "white";
      context.shadowColor = "rgba(0,0,0,0.9)";
      context.shadowBlur = 20;
      context.textAlign = "center";
      
      const smallFontSize = imgSize * 0.05;
      context.font = `bold ${smallFontSize}px serif`;
      context.fillText("ABSOLUTE", padding + imgSize / 2, padding + imgSize * 0.84);
      
      const bigFontSize = imgSize * 0.14;
      context.font = `bold ${bigFontSize}px serif`;
      context.fillText("CINEMA", padding + imgSize / 2, padding + imgSize * 0.95);
      
      context.shadowBlur = 0;
    }

    if (activeFrame === 'chill') {
      context.fillStyle = "white";
      context.shadowColor = "rgba(0,0,0,0.5)";
      context.shadowBlur = 10;
      context.font = `italic ${imgSize * 0.07}px "Homemade Apple", cursive`;
      context.textAlign = "right";
      context.fillText("chill homie!", padding + imgSize - 20, padding + imgSize - 20);
      context.shadowBlur = 0;
    }

    // 4. Add Date to the Bottom Margin
    context.fillStyle = "#94a3b8"; // slate-400
    context.font = `${imgSize * 0.045}px "Homemade Apple", cursive`;
    context.textAlign = "left";
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    context.fillText(dateStr, padding + 15, canvas.height - (bottomPadding / 3));

    saveFinal(canvas.toDataURL('image/jpeg', 0.95));
  }, [colorFilter, activeFrame, saveFinal]);

  // Initialize Camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1080 }, 
            height: { ideal: 1080 },
            aspectRatio: { exact: 1 } 
          } 
        });
        streamRef.current = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };
    startCamera();
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  const handleCaptureClick = () => {
    if (timerDelay === 0) {
      executeCapture();
    } else {
      setCountdown(timerDelay);
    }
  };

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCountdown(null);
      executeCapture();
    }
  }, [countdown, executeCapture]);

  const downloadImage = (url, id) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `polaroid-${id}.jpg`;
    link.click();
  };

  const removeImage = (id) => {
    setCaptures(captures.filter(c => c.id !== id));
  };

  // Preview CSS Filters
  const colorFilterClasses = {
    normal: '',
    vintage: 'sepia-[0.8] contrast-[1.2] brightness-[0.9]',
    bw: 'grayscale contrast-[1.2] brightness-[1.1]',
    warm: 'sepia-[0.3] saturate-[1.6] hue-rotate-[-10deg]',
    '90s': 'sepia-[0.2] saturate-[0.8] contrast-[0.9] brightness-[1.1] blur-[0.5px]',
    special90s: 'contrast-[1.05] brightness-[1.1] saturate-[0.85] sepia-[0.12] hue-rotate-[-6deg]',
    night: 'brightness-[0.6] contrast-[1.4] saturate-[0.7]',
    screen: 'brightness-[1.2] contrast-[0.85] saturate-[0.9]',
    faded: 'sepia-[0.15] contrast-[0.85] brightness-[1.1]',
    polaroid: 'sepia-[0.25] contrast-[1.1] saturate-[1.2] brightness-[1.05]',
    dreamy: 'brightness-[1.1] saturate-[1.1] blur-[1px]',
    cold: 'hue-rotate-[15deg] saturate-[0.9] contrast-[1.1]',
    vhs: 'contrast-[1.3] saturate-[0.7] brightness-[1.05]'
  };

  return (
    <div className="min-h-screen bg-[#f3f0e9] font-serif text-slate-800 flex flex-col md:flex-row overflow-hidden">
      
      {/* LEFT SIDE: BOOTH GALLERY */}
      <div className="w-full md:w-1/3 h-full md:h-screen bg-[#e8e4d9] border-r-4 border-[#dcd7c9] p-6 overflow-y-auto custom-scrollbar shadow-inner">
        <div className="flex items-center gap-3 mb-8 border-b-2 border-slate-300 pb-4">
          <Smartphone className="text-slate-500" />
          <h1 className="text-2xl font-bold tracking-tight uppercase italic text-slate-700">Booth Gallery</h1>
        </div>

        {captures.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 opacity-60">
            <Camera size={48} strokeWidth={1} />
            <p className="mt-4 text-center">Your captures will appear here...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12 pb-10">
            {captures.map((cap) => (
              <div key={cap.id} className="group relative shadow-2xl transform rotate-1 hover:rotate-0 transition-all duration-300">
                <img src={cap.url} alt="Polaroid" className="w-full h-auto" />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => downloadImage(cap.url, cap.id)} className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600">
                    <Download size={18} />
                  </button>
                  <button onClick={() => removeImage(cap.id)} className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT SIDE: LIVE CAMERA & CONTROLS */}
      <div className="flex-1 h-screen flex flex-col p-4 md:p-8 items-center justify-center relative bg-[#f9f7f2]">
        
        {/* PHYSICAL POLAROID VIEWFINDER */}
        <div className="relative w-full max-w-sm md:max-w-md bg-white p-3 pb-20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200">
          
          <div className="relative aspect-square bg-black overflow-hidden flex items-center justify-center">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted
              className={`w-full h-full object-cover scale-x-[-1] transition-all duration-300 ${colorFilterClasses[colorFilter]}`}
            />
            
            {activeFrame === 'cinema' && (
              <div className="absolute inset-0 flex flex-col justify-end items-center pb-[5%] pointer-events-none leading-none">
                <span className="text-white font-serif font-bold text-lg tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">ABSOLUTE</span>
                <span className="text-white font-serif font-bold text-5xl md:text-7xl tracking-widest uppercase drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">CINEMA</span>
              </div>
            )}
            {activeFrame === 'chill' && (
              <div className="absolute bottom-6 right-6 pointer-events-none drop-shadow-lg text-white text-3xl italic opacity-90 font-handwriting">chill homie!</div>
            )}

            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-40">
                <span className="text-white text-9xl font-bold drop-shadow-[0_4px_12px_rgba(0,0,0,1)] animate-pulse">{countdown > 0 ? countdown : '📸'}</span>
              </div>
            )}

            {isCapturing && <div className="absolute inset-0 bg-white animate-ping z-50" />}
          </div>

          <div className="absolute bottom-4 left-6 flex flex-col text-slate-400">
            <span className="font-handwriting text-lg">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <div className="mt-1 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Live Viewfinder</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="w-full max-w-lg mt-8 space-y-6">
          
          <div className="space-y-3">
            <p className="text-center text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">Aesthetic Styles</p>
            <div className="flex flex-wrap justify-center gap-2 max-h-32 overflow-y-auto p-2 custom-scrollbar">
              {[
                { id: 'normal', label: 'Raw', icon: RefreshCw },
                { id: 'vintage', label: 'Vintage', icon: Film },
                { id: 'special90s', label: 'Special 90s', icon: Sparkles },
                { id: '90s', label: "Soft 90s", icon: Moon },
                { id: 'bw', label: 'B&W', icon: Film },
                { id: 'night', label: "Night", icon: Moon },
                { id: 'screen', label: "Screen", icon: Monitor },
                { id: 'faded', label: "Faded", icon: Wind },
                { id: 'polaroid', label: "Pola", icon: ImageIcon },
                { id: 'dreamy', label: "Dreamy", icon: Cloud },
                { id: 'vhs', label: "VHS", icon: Zap },
              ].map(f => (
                <button 
                  key={f.id} onClick={() => setColorFilter(f.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-[10px] font-bold border-2 transition-all uppercase tracking-widest
                    ${colorFilter === f.id ? 'bg-slate-800 text-white border-slate-800 shadow-md' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}
                  `}
                >
                  <f.icon size={12} /> {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <div className="flex bg-white rounded-full p-1 border-2 border-slate-200">
                {[0, 3, 5].map((t) => (
                  <button key={t} onClick={() => setTimerDelay(t)} className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${timerDelay === t ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}>
                    {t === 0 ? <Clock size={14} /> : `${t}s`}
                  </button>
                ))}
              </div>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Timer</span>
            </div>

            <button onClick={handleCaptureClick} disabled={isCapturing || countdown !== null} className="group relative flex items-center justify-center w-20 h-20 bg-red-500 rounded-full border-8 border-white shadow-2xl hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50">
              <div className="absolute inset-0 rounded-full border-4 border-slate-800 opacity-20" />
              <Camera className="text-white group-hover:rotate-12 transition-transform" size={28} />
            </button>
            
            <div className="flex flex-col items-center gap-1">
              <div className="flex bg-white rounded-full p-1 border-2 border-slate-200">
                <button onClick={() => setActiveFrame(activeFrame === 'cinema' ? 'none' : 'cinema')} className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold ${activeFrame === 'cinema' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}><Clapperboard /></button>
                <button onClick={() => setActiveFrame(activeFrame === 'chill' ? 'none' : 'chill')} className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold ${activeFrame === 'chill' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}><Smile /></button>
              </div>
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Frames</span>
            </div>
          </div>

        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Homemade+Apple&family=Inter:wght@400;700&display=swap');
        .font-handwriting { font-family: 'Homemade Apple', cursive; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #c1baa3; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;