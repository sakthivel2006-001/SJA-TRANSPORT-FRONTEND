import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Edit, Trash2, Plus } from 'lucide-react';

interface EditOverlayProps {
  children: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  onAdd?: () => void;
  className?: string;
  position?: 'top-right' | 'center' | 'bottom-right';
}

const EditOverlay: React.FC<EditOverlayProps> = ({ 
  children, 
  onEdit, 
  onDelete, 
  onAdd,
  className = '',
  position = 'top-right'
}) => {
  const auth = useContext(AuthContext);

  if (!auth?.editMode) {
    return <>{children}</>;
  }

  const positionClasses = {
    'top-right': 'top-2 right-2',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'bottom-right': 'bottom-2 right-2'
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Dim the content slightly on hover in edit mode to make buttons pop */}
      <div className="transition-all duration-300 group-hover:opacity-80">
        {children}
      </div>
      
      {/* Outline */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/50 rounded pointer-events-none transition-colors z-30"></div>

      {/* Action Buttons */}
      <div className={`absolute flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-40 ${positionClasses[position]}`}>
        {onAdd && (
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAdd(); }}
            className="p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors"
            title="Add New"
          >
            <Plus size={16} />
          </button>
        )}
        {onEdit && (
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }}
            className="p-2 bg-accent text-white rounded-full shadow-lg hover:bg-accent/90 transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
        )}
        {onDelete && (
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }}
            className="p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default EditOverlay;
