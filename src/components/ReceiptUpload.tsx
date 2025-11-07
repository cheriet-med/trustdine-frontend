// components/ReceiptUpload.tsx
'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, Eye, X, RefreshCw, Shield, Camera, StopCircle } from 'lucide-react';
import { FaFileUpload } from "react-icons/fa";
import Image from 'next/image';


interface ReceiptUploadProps {
  onFileUpload: (file: File) => void;
  uploadedFile: File | null;
  onValidate: () => void;
  isValidating: boolean;
}

const ReceiptUpload: React.FC<ReceiptUploadProps> = ({
  onFileUpload,
  uploadedFile,
  onValidate,
  isValidating
}) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captchaText, setCaptchaText] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [userInput, setUserInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [captchaType, setCaptchaType] = useState<'text' | 'math'>('text');
  const [attempts, setAttempts] = useState(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [cameraError, setCameraError] = useState('');
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement>(null);
const [previewUrl, setPreviewUrl] = useState<string >('');
  const MAX_ATTEMPTS = 3;
  const CAPTCHA_TIMEOUT = 300000; // 5 minutes
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes




useEffect(() => {
  if (uploadedFile) {
    const objectUrl = URL.createObjectURL(uploadedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  } else {
    setPreviewUrl('');
  }
}, [uploadedFile]);



  // Generate distorted text CAPTCHA
  const generateTextCaptcha = useCallback(() => {
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    drawCaptchaCanvas(result);
  }, []);

  // Generate math CAPTCHA
  const generateMathCaptcha = useCallback(() => {
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 25;
        num2 = Math.floor(Math.random() * 25) + 1;
        answer = num1 - num2;
        break;
      case '×':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      default:
        num1 = 5;
        num2 = 3;
        answer = 8;
    }

    setCaptchaQuestion(`${num1} ${operation} ${num2} = ?`);
    setCaptchaAnswer(answer.toString());
  }, []);

  // Camera functions
  const startCamera = useCallback(async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setCameraError('');
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        },
        audio: false
      });
      
      setStream(mediaStream);
      setShowCamera(true);
      
      setTimeout(() => {
        if (videoRef.current && mediaStream) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
            setCameraError('Failed to start camera preview');
          });
        }
      }, 100);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Unable to access camera. ';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera permissions and try again.';
        } else if (error.name === 'NotFoundError') {
          errorMessage += 'No camera found on this device.';
        } else if (error.name === 'NotSupportedError') {
          errorMessage += 'Camera not supported in this browser.';
        } else {
          errorMessage += error.message;
        }
      }
      
      setCameraError(errorMessage);
      setShowCamera(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCameraError('');
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !captureCanvasRef.current) {
      setCameraError('Camera not ready for capture');
      return;
    }

    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      setCameraError('Failed to capture photo');
      return;
    }

    canvas.width = video.videoWidth || video.offsetWidth;
    canvas.height = video.videoHeight || video.offsetHeight;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) {
        if (blob.size > MAX_FILE_SIZE) {
          setCameraError('Captured image is too large (max 10MB). Try reducing quality or lighting.');
          return;
        }
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const file = new File([blob], `receipt-${timestamp}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        
        onFileUpload(file);
        stopCamera();
      } else {
        setCameraError('Failed to capture photo');
      }
    }, 'image/jpeg', 0.8); // Adjust quality to reduce file size if needed
  }, [onFileUpload, stopCamera]);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const drawCaptchaCanvas = useCallback((text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f8fafc');
    gradient.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const colors = ['#1e40af', '#dc2626', '#059669', '#7c2d12', '#4338ca'];
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = (canvas.width / (text.length + 1)) * (i + 1);
      const y = canvas.height / 2 + (Math.random() - 0.5) * 20;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((Math.random() - 0.5) * 0.5);
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
  }, []);

  const generateCaptcha = useCallback(() => {
    const type = Math.random() > 0.5 ? 'text' : 'math';
    setCaptchaType(type);
    
    if (type === 'text') {
      generateTextCaptcha();
    } else {
      generateMathCaptcha();
    }
    
    setUserInput('');
    setCaptchaError('');
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    const newTimeoutId = setTimeout(() => {
      setShowCaptcha(false);
      setCaptchaError('CAPTCHA expired. Please try again.');
    }, CAPTCHA_TIMEOUT);
    
    setTimeoutId(newTimeoutId);
  }, [generateTextCaptcha, generateMathCaptcha, timeoutId]);

  useEffect(() => {
    if (showCaptcha) {
      generateCaptcha();
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showCaptcha]);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError('File size exceeds 10MB limit. Please choose a smaller file.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      setFileError('');
      setAttempts(0);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const handleValidateClick = useCallback(() => {
    if (attempts >= MAX_ATTEMPTS) {
      setCaptchaError('Too many failed attempts. Please upload a new file.');
      return;
    }
    setShowCaptcha(true);
  }, [attempts]);

  const handleCaptchaSubmit = useCallback(() => {
    const correctAnswer = captchaType === 'text' 
      ? captchaText.toUpperCase() 
      : captchaAnswer;
    
    const userAnswer = captchaType === 'text'
      ? userInput.toUpperCase().trim()
      : userInput.trim();

    if (userAnswer === correctAnswer) {
      setShowCaptcha(false);
      setAttempts(0);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      onValidate();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts >= MAX_ATTEMPTS) {
        setShowCaptcha(false);
        setCaptchaError(`Maximum attempts exceeded. Please upload a new file.`);
      } else {
        setCaptchaError(`Incorrect answer. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
        generateCaptcha();
      }
    }
  }, [userInput, captchaText, captchaAnswer, captchaType, attempts, onValidate, generateCaptcha, timeoutId]);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > MAX_FILE_SIZE) {
        setFileError('File size exceeds 10MB limit. Please choose a smaller file.');
        return;
      }
      setFileError('');
      setAttempts(0);
      onFileUpload(file);
    }
  }, [onFileUpload]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const removeFile = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setAttempts(0);
    setFileError('');
    onFileUpload(null as unknown as File);
  }, [onFileUpload]);

  const handleCaptchaClose = useCallback(() => {
    setShowCaptcha(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }, [timeoutId]);

  return (
    <div className="mb-8">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-accent'
            : 'border-gray-300 hover:border-accent'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <FaFileUpload className="h-16 w-16 text-accent mx-auto mb-4" />
        <label htmlFor="receipt-upload" className="cursor-pointer">
          <span className="font-medium text-primary uppercase font-playfair">
            {isDragActive ? 'Drop your receipt here' : 'Upload or Drop Receipt Image'}
          </span>
          <p className="text-primary text-sm mt-1">Accepted formats: PNG, JPG. Maximum file size: 10MB.</p>
          <input
            id="receipt-upload"
            ref={fileInputRef}
            type="file"
            accept="image/avif,image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        
        {/* Error message for file size */}
        {fileError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{fileError}</p>
          </div>
        )}
        
        {/* Camera and Upload buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={startCamera}
            className="flex items-center px-4 py-2 text-primary border  border-primary rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Camera className="h-6 w-6 mr-2" />
            or Take Photo
          </button>
        </div>

        {/* Camera Error Display */}
        {cameraError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{cameraError}</p>
          </div>
        )}
      </div>
      


      {uploadedFile && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">


          <div className="flex sm:flex-col  items-center flex-wrap gap-5 justify-center">

                                      <div className="relative group">
                                       {previewUrl && (
  <Image
    src={previewUrl}
    alt="Receipt preview"
    width={150}
    height={150}
    className="object-cover h-full sm:h-[500px] w-full rounded-xl shadow-lg border-2 border-gray-200"
  />
)}

                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-200 flex items-center justify-center">
                                          <button
                                            type="button"
                                            onClick={removeFile}
                                            className="w-10 h-10 bg-highlights text-white rounded-full flex items-center justify-center hover:bg-secondary transition-colors shadow-lg opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100"
                                          >
                                            <X className="w-5 h-5" />
                                          </button>
                                        </div>
                                      </div>

            <button
              onClick={handleValidateClick}
              disabled={isValidating || attempts >= MAX_ATTEMPTS}
              className="w-80 px-4 py-2 bg-accent text-white rounded-md hover:bg-highlights disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isValidating ? 'Validating...' : 'Validate Receipt'}
            </button>
          </div>



          {attempts > 0 && attempts < MAX_ATTEMPTS && (
            <p className="text-orange-600 text-sm mt-2">
              {attempts} failed verification attempt{attempts > 1 ? 's' : ''}
            </p>
          )}
          {attempts >= MAX_ATTEMPTS && (
            <p className="text-red-600 text-sm mt-2">
              Maximum attempts exceeded. Please upload a new file to try again.
            </p>
          )}
        </div>
      )}




      {/* Camera Modal */}
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg uppercase font-semibold text-primary">Take Photo</h3>
              <button
                onClick={stopCamera}
                className="text-primary hover:text-blue-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="relative bg-black rounded-lg overflow-hidden mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 sm:h-80 object-cover"
                style={{ transform: 'scaleX(-1)' }}
              />
              
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-white border-dashed rounded-lg w-3/4 h-3/4 opacity-50"></div>
              </div>
            </div>
            
            <div className="flex justify-center flex-wrap space-x-4">
              <button
                onClick={capturePhoto}
                className="flex items-center px-3 py-2 bg-accent text-white rounded-lg hover:bg-highlights transition-colors"
              >
                <Camera className="h-6 w-6 mr-2" />
                Capture Photo
              </button>
              <button
                onClick={stopCamera}
                className="flex items-center px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <StopCircle className="h-6 w-6 mr-2" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={captureCanvasRef} className="hidden" />

      {/* CAPTCHA Modal */}
      {showCaptcha && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full border border-gray-200">
            <div className="flex items-center mb-2">
              <Shield className="h-6 w-6 text-accent mr-2" />
              <h3 className="text-xl font-semibold text-primary">Security Verification</h3>
            </div>
            
            {captchaType === 'text' ? (
              <div className="mb-6">
                <p className="text-sm text-primary mb-3">Enter the characters shown below:</p>
                <div className="flex items-center justify-center mb-4">
                  <div className="border-2 border-gray-200 rounded-lg p-2 bg-gray-50">
                    <canvas
                      ref={canvasRef}
                      width={200}
                      height={60}
                      className="block"
                    />
                  </div>
                  <button 
                    onClick={generateCaptcha}
                    className="ml-3 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Generate new CAPTCHA"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <p className="text-sm text-primary mb-3">Solve this math problem:</p>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-gray-50 border-2 border-background rounded-lg  py-2 px-6 text-center">
                    <span className="text-2xl font-bold text-secondary">{captchaQuestion}</span>
                  </div>
                  <button 
                    onClick={generateCaptcha}
                    className="ml-3 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Generate new problem"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={captchaType === 'text' ? 'Enter the characters' : 'Enter your answer'}
              className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-primary focus:outline-none transition-colors"
              autoFocus
            />

            {captchaError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm">{captchaError}</p>
              </div>
            )}

            <div className="text-xs text-gray-500 mb-4">
              This verification expires in 5 minutes for security.
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCaptchaClose}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCaptchaSubmit}
                disabled={!userInput.trim()}
                className="w-full px-6 py-2 bg-accent text-white rounded-lg hover:bg-highlights disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptUpload;