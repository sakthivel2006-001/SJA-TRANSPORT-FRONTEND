import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Camera, Loader2 } from 'lucide-react';

interface EditableImageProps {
  src: string;
  alt: string;
  className?: string;
  onSave: (url: string) => Promise<void>;
}

const EditableImage: React.FC<EditableImageProps> = ({ src, alt, className = '', onSave }) => {
  const auth = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(src);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (tempUrl === src) {
      setIsEditing(false);
      return;
    }
    setLoading(true);
    try {
      await onSave(tempUrl);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save image', error);
      setTempUrl(src);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempUrl(src);
    setIsEditing(false);
  };

  if (!auth?.editMode) {
    return <img src={src} alt={alt} className={className} />;
  }

  return (
    <div className="relative group inline-block w-full h-full">
      <img src={src} alt={alt} className={`${className} transition-all ${isEditing ? 'opacity-50' : 'group-hover:opacity-75'}`} />
      
      {!isEditing && (
        <div 
          onClick={() => setIsEditing(true)}
          className="absolute inset-0 m-auto w-12 h-12 bg-accent text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg z-40"
        >
          <Camera size={24} />
        </div>
      )}

      {isEditing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50 p-4">
          <div className="bg-white p-4 rounded-xl shadow-2xl w-full max-w-sm">
            <h4 className="font-bold text-gray-800 mb-2">Replace Image URL</h4>
            <input 
              type="text" 
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 outline-none focus:border-accent"
              placeholder="https://example.com/image.jpg"
            />
            <div className="flex justify-end gap-2">
              <button 
                onClick={handleCancel}
                disabled={loading}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={loading}
                className="px-3 py-1 bg-accent text-white rounded hover:bg-accent/90 flex items-center gap-1"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditableImage;
