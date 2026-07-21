import React, { useState, useRef, useEffect, useContext } from 'react';
import type { ElementType } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Edit2, Check, X, Loader2 } from 'lucide-react';

interface EditableTextProps {
  value: string;
  onSave: (val: string) => Promise<void>;
  multiline?: boolean;
  className?: string;
  as?: ElementType;
  renderValue?: (val: string) => React.ReactNode;
}

const EditableText: React.FC<EditableTextProps> = ({ 
  value, 
  onSave, 
  multiline = false, 
  className = '', 
  as: Component = 'span',
  renderValue
}) => {
  const auth = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Sync value if prop changes
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (tempValue === value) {
      setIsEditing(false);
      return;
    }
    setLoading(true);
    try {
      await onSave(tempValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save', error);
      setTempValue(value);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') handleCancel();
    if (e.key === 'Enter' && !multiline) handleSave();
  };

  if (!auth?.editMode) {
    return <Component className={className}>{renderValue ? renderValue(value) : value}</Component>;
  }

  if (isEditing) {
    return (
      <div className="relative inline-block w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full bg-white text-gray-800 border-2 border-accent rounded-lg p-2 outline-none shadow-lg z-50 relative ${className}`}
            rows={4}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`w-full bg-white text-gray-800 border-2 border-accent rounded-lg px-2 py-1 outline-none shadow-lg z-50 relative ${className}`}
          />
        )}
        <div className="absolute right-2 top-2 flex gap-1 z-50">
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="p-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          </button>
          <button 
            onClick={handleCancel}
            disabled={loading}
            className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group inline-block w-full">
      <Component className={`${className} outline-none group-hover:ring-2 group-hover:ring-accent group-hover:ring-offset-2 rounded transition-all cursor-text`} onClick={() => setIsEditing(true)}>
        {renderValue ? renderValue(value) : value}
      </Component>
      <div 
        className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-accent text-white p-1 rounded-full shadow-md cursor-pointer z-40 pointer-events-none"
      >
        <Edit2 size={12} />
      </div>
    </div>
  );
};

export default EditableText;
