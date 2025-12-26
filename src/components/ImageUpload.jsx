import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X } from 'lucide-react';

const ImageUpload = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraStream]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera access denied or not supported.");
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setImagePreview(dataUrl);
    cameraStream.getTracks().forEach((track) => track.stop());
    setCameraStream(null);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  return (
    <div className="mb-8 bg-[#EFEFEF] rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-[#062b18] hover:border-[#BB4500] transition-all">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-[#BB4500] to-[#d15000] text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-lg">2</div>
        <h3 className="text-2xl sm:text-3xl font-black text-[#000000]">Upload Photo (Optional)</h3>
      </div>

      {!imagePreview ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col items-center">
            {!cameraStream ? (
              <button
                onClick={startCamera}
                className="w-full cursor-pointer border-2 border-dashed border-[#062b18] rounded-2xl p-8 sm:p-10 hover:border-[#BB4500] hover:bg-white transition-all flex flex-col items-center justify-center group bg-white"
              >
                <Camera className="w-14 h-14 mb-4 text-[#062b18] group-hover:text-[#BB4500] transition-colors group-hover:scale-110" />
                <p className="text-[#000000] font-black text-base sm:text-lg text-center">Take Photo</p>
              </button>
            ) : (
              <div className="relative w-full">
                <video
                  ref={videoRef}
                  autoPlay
                  className="rounded-2xl w-full h-80 object-cover border-4 border-[#BB4500]"
                />
                <button
                  onClick={capturePhoto}
                  className="cursor-pointer absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#BB4500] hover:bg-[#d15000] text-white px-6 py-2 rounded-full font-bold"
                >
                  Capture
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-[#062b18] rounded-2xl p-8 sm:p-10 hover:border-[#BB4500] hover:bg-white transition-all flex flex-col items-center justify-center group bg-white"
          >
            <Upload className="w-14 h-14 mb-4 text-[#062b18] group-hover:text-[#BB4500] transition-colors group-hover:scale-110" />
            <p className="text-[#000000] font-black text-base sm:text-lg text-center">Upload Image</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </button>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border-4 border-[#BB4500] shadow-2xl">
          <img src={imagePreview} alt="Preview" className="w-full h-80 object-cover" />
          <button onClick={removeImage} className="cursor-pointer absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg">
            <X className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;