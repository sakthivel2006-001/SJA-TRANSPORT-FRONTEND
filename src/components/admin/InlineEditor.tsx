import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'url';
  required?: boolean;
}

interface InlineEditorProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: Field[];
  initialData?: any;
  onSave: (data: any) => Promise<void>;
}

const InlineEditor: React.FC<InlineEditorProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  fields, 
  initialData, 
  onSave 
}) => {
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        const defaultData: any = {};
        fields.forEach(f => {
          defaultData[f.name] = f.type === 'number' ? 0 : '';
        });
        setFormData(defaultData);
      }
    }
  }, [isOpen, initialData, fields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving data', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10"
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-xl font-heading font-bold text-primary">{title}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200">
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-text/80 mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      required={field.required}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none min-h-[100px]"
                    />
                  ) : (
                    <input
                      type={field.type}
                      required={field.required}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        [field.name]: field.type === 'number' ? Number(e.target.value) : e.target.value 
                      })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent outline-none"
                    />
                  )}
                </div>
              ))}
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-gray-600 bg-gray-100 hover:bg-gray-200 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InlineEditor;
