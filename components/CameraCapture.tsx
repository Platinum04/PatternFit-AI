import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon, RefreshIcon } from './Icons';

interface CameraCaptureProps {
    onCapture: (file: File, base64: string, mimeType: string) => void;
    onClose: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user' },
                audio: false 
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access the camera. Please check your browser permissions.");
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
    }, [startCamera, stopCamera]);

    const handleCapture = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataUrl = canvas.toDataURL('image/jpeg');
                setCapturedImage(dataUrl);
                stopCamera();
            }
        }
    }, [stopCamera]);

    const handleRetake = useCallback(() => {
        setCapturedImage(null);
        setError(null);
        startCamera();
    }, [startCamera]);

    const handleUsePhoto = useCallback(() => {
        if (capturedImage) {
            const base64 = capturedImage.split(',')[1];
            fetch(capturedImage)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
                    onCapture(file, base64, 'image/jpeg');
                    onClose();
                });
        }
    }, [capturedImage, onCapture, onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50 p-4">
            <div className="relative w-full max-w-lg bg-slate-800 rounded-lg shadow-xl overflow-hidden">
                <button onClick={onClose} className="absolute top-2 right-2 z-10 text-white bg-slate-700 bg-opacity-50 rounded-full p-2 hover:bg-opacity-75">&times;</button>
                {error && (
                    <div className="p-8 text-center text-red-400">
                        <p>{error}</p>
                        <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">Close</button>
                    </div>
                )}
                {!error && (
                    <>
                        <div className="relative aspect-w-3 aspect-h-4">
                            {capturedImage ? (
                                <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
                            ) : (
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100"></video>
                            )}
                        </div>
                        <canvas ref={canvasRef} className="hidden"></canvas>
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 flex justify-center gap-4">
                            {capturedImage ? (
                                <>
                                    <button onClick={handleRetake} className="inline-flex items-center gap-2 px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-700 transition">
                                        <RefreshIcon className="w-5 h-5" />
                                        Retake
                                    </button>
                                    <button onClick={handleUsePhoto} className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition">
                                        Use Photo
                                    </button>
                                </>
                            ) : (
                                <button onClick={handleCapture} className="p-4 bg-white rounded-full text-blue-600 hover:bg-slate-200 transition transform hover:scale-110 shadow-lg">
                                    <CameraIcon className="w-8 h-8" />
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CameraCapture;
