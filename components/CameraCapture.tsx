import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon, RefreshIcon, TailorIcon } from './Icons';

interface CameraCaptureProps {
    onCapture: (file: File, base64: string, mimeType: string) => void;
    onClose: () => void;
    message?: string;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose, message }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    const [isCapturing, setIsCapturing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startCamera = useCallback(async () => {
        setError(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'user',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                },
                audio: false 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = () => {
                    setIsCameraReady(true);
                };
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("HARDWARE_IO_ERROR: Camera mapping failed.");
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;
        setIsCapturing(true);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (context) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const base64 = canvas.toDataURL('image/jpeg', 0.9);
            const base64Data = base64.split(',')[1];
            
            // Artificial delay for 'Studio Analysis' feel
            setTimeout(() => {
                onCapture(new File([], 'live_capture.jpg', { type: 'image/jpeg' }), base64Data, 'image/jpeg');
                setIsCapturing(false);
            }, 800);
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] bg-studio-900 flex flex-col items-center justify-center p-4 animate-fade">
            <div className="w-full max-w-4xl flex flex-col h-full max-h-[90vh]">
                <div className="flex justify-between items-center mb-6 px-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-brand p-1.5 rounded-lg">
                            <TailorIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h2 className="text-white text-[10px] font-black tracking-[0.4em] uppercase">VIEWPORT_LIVE_LENS</h2>
                            <p className="text-studio-500 text-[8px] font-mono tracking-widest mt-1 opacity-80 uppercase">STREAM_BUFFER_INIT</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-studio-400 hover:text-white transition-colors text-xs font-black tracking-[0.2em] uppercase p-2">TERMINATE_LINK</button>
                </div>

                <div className="relative grow bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-studio-800">
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className={`w-full h-full object-cover transform -scale-x-100 transition-opacity duration-1000 ${isCameraReady ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Viewport Graphics (CAD Style) */}
                    <div className="absolute inset-0 pointer-events-none p-12 flex flex-col justify-between border-[1px] border-white/10 m-8 rounded-4xl">
                        <div className="flex justify-between opacity-30">
                            <div className="w-10 h-10 border-t-2 border-l-2 border-brand" />
                            <div className="w-10 h-10 border-t-2 border-r-2 border-brand" />
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-[1px] h-32 bg-brand/20 animate-pulse" />
                            <div className="px-5 py-2.5 bg-studio-900/60 backdrop-blur rounded-full border border-brand/20">
                                <span className="text-white text-[9px] font-black tracking-[0.4em] uppercase">ALIGN_CENTER_VECTORS</span>
                            </div>
                        </div>
                        <div className="flex justify-between opacity-30">
                            <div className="w-10 h-10 border-b-2 border-l-2 border-brand" />
                            <div className="w-10 h-10 border-b-2 border-r-2 border-brand" />
                        </div>
                    </div>

                    {!isCameraReady && !error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-studio-900 gap-6">
                            <div className="w-16 h-16 border-b-2 border-brand rounded-full animate-spin"></div>
                            <span className="text-studio-500 text-[10px] font-black tracking-widest uppercase">INITIALIZING_HARDWARE...</span>
                        </div>
                    )}

                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-studio-900 text-center px-12 gap-6">
                            <p className="text-red-500 font-mono text-xs tracking-widest uppercase">{error}</p>
                            <button onClick={onClose} className="px-10 py-4 border-2 border-white text-white text-[10px] font-black rounded-full tracking-widest uppercase hover:bg-white hover:text-studio-900 transition-all">EXIT_VIEWPORT</button>
                        </div>
                    )}

                    {isCapturing && (
                        <div className="absolute inset-0 flex items-center justify-center bg-brand/20 backdrop-blur-md z-50">
                             <div className="bg-white p-12 rounded-4xl shadow-2xl flex flex-col items-center gap-6 animate-fade">
                                <div className="w-16 h-16 border-b-2 border-brand rounded-full animate-spin"></div>
                                <span className="text-[10px] font-black text-studio-900 tracking-widest uppercase">CAPTURING_DATA</span>
                             </div>
                        </div>
                    )}
                </div>

                <div className="py-12 flex flex-col items-center gap-8">
                    {message && (
                        <div className="bg-brand/10 text-brand px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest border border-brand/20 uppercase">
                            {message}
                        </div>
                    )}
                    <button 
                        onClick={capturePhoto}
                        disabled={!isCameraReady || isCapturing}
                        className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-500 group active:scale-90
                            ${isCameraReady ? 'border-brand bg-white/5 hover:bg-brand/10' : 'border-studio-800 bg-studio-900'}
                        `}
                    >
                        <div className={`w-16 h-16 rounded-full transition-all duration-300 ${isCameraReady ? 'bg-white shadow-2xl group-hover:scale-110' : 'bg-studio-800'}`} />
                    </button>
                    <span className="text-[10px] font-black text-studio-500 tracking-[0.5em] uppercase">TRIGGER_SHUTTER</span>
                </div>
            </div>
        </div>
    );
};

export default CameraCapture;
