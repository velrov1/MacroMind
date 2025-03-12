import React, { useState, useRef } from 'react';

const ImageUpload = ({ onImageCapture }) => {
  const [preview, setPreview] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageCapture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      // Check if the browser supports mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera access. Please try using a modern browser.');
      }

      // First check if we have camera permission
      let permissions;
      try {
        permissions = await navigator.permissions.query({ name: 'camera' });
      } catch (permError) {
        // Some browsers might not support permissions API
        console.warn('Permissions API not supported, proceeding with getUserMedia');
      }

      if (permissions && permissions.state === 'denied') {
        throw new Error(
          'Camera access is blocked. Please follow these steps to enable it:\n' +
          '1. Tap the lock/info icon in your browser\'s address bar\n' +
          '2. Find "Camera" in the site settings\n' +
          '3. Change the setting to "Allow"\n' +
          '4. Refresh the page and try again'
        );
      }

      const constraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      // On mobile, try to use the environment-facing camera first
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { exact: 'environment' } }
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            streamRef.current = stream;
            setIsStreaming(true);
            return;
          }
        } catch (err) {
          console.log('Could not access rear camera, falling back to default:', err);
        }
      }

      // If rear camera fails or we're not on mobile, use default constraints
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Unable to access camera.\n\n';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage += 'Please grant camera access:\n' +
          '1. Look for the camera icon in your browser\'s address bar\n' +
          '2. Click it and select "Allow"\n' +
          '3. Refresh the page\n\n' +
          'If you don\'t see the camera icon, check your browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera device was found. Please check if your device has a camera and it\'s not being used by another app.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Your camera might be in use by another application. Please close other apps that might be using the camera.';
      } else if (error.name === 'SecurityError') {
        errorMessage += 'Camera access is blocked by your browser\'s security settings. Please make sure you\'re using HTTPS and check your browser settings.';
      } else {
        errorMessage += error.message || 'Please check your camera settings and try again.';
      }
      
      alert(errorMessage);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsStreaming(false);
    }
  };

  const handleCameraCapture = () => {
    if (!isStreaming) {
      startCamera();
      return;
    }

    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

      const imageData = canvas.toDataURL('image/jpeg');
      setPreview(imageData);
      onImageCapture(imageData);
      stopCamera();
    }
  };

  // Clean up camera stream when component unmounts
  React.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="image-upload">
      <div className="buttons">
        <button onClick={() => fileInputRef.current.click()}>
          Upload Image
        </button>
        <button onClick={handleCameraCapture}>
          {isStreaming ? 'Capture Photo' : 'Take Photo'}
        </button>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      {isStreaming && (
        <div className="preview-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
          />
        </div>
      )}
      {preview && !isStreaming && (
        <div className="preview-container">
          <img src={preview} alt="Preview" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;