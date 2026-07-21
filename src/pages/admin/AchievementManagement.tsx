import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Plus, Edit, Trash2, Search, Award, AlertCircle, RefreshCw, ArrowUpDown, Loader2 } from 'lucide-react';
import AdminTable from '../../components/admin/AdminTable';
import AdminModal from '../../components/admin/AdminModal';
import ToastContainer, { type ToastData } from '../../components/ToastContainer';
import { adminAchievementService, type Achievement, type AchievementInput } from '../../services/adminAchievementService';

/* ── Helpers ─────────────────────────────────────────────────────────── */

const emptyForm: AchievementInput = { title: '', value: '', description: '', icon: '', image: '', displayOrder: 0 };

let toastSeq = 0;
const makeToast = (type: ToastData['type'], message: string): ToastData => ({
  id: String(++toastSeq),
  type,
  message,
});

/* ── Component ───────────────────────────────────────────────────────── */

const AchievementManagement: React.FC = () => {
  // ── Data state ──
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ── Modal state ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<AchievementInput>({ ...emptyForm });
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // ── Delete confirmation ──
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Search & sort ──
  const [searchQuery, setSearchQuery] = useState('');
  const [sortNewest, setSortNewest] = useState(true);

  // ── Toasts ──
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const addToast = useCallback((type: ToastData['type'], message: string) => {
    setToasts((prev) => [...prev, makeToast(type, message)]);
  }, []);
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Fetch ──
  const fetchAchievements = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await adminAchievementService.getAllAchievements();
      setAchievements(data);
    } catch (error: any) {
      const msg = error?.message || 'Failed to load achievements';
      setFetchError(msg);
      addToast('error', msg);
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  // ── Filtered & sorted list ──
  const displayed = useMemo(() => {
    let list = [...achievements];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.value.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortNewest) {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }

    return list;
  }, [achievements, searchQuery, sortNewest]);

  // ── Form validation ──
  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.value.trim()) errors.value = 'Value is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Handlers ──
  const openAddModal = () => {
    setEditingId(null);
    setFormData({ ...emptyForm });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (achievement: Achievement) => {
    setEditingId(achievement._id);
    setFormData({
      title: achievement.title,
      value: achievement.value,
      description: achievement.description,
      icon: achievement.icon || '',
      image: achievement.image || '',
      displayOrder: achievement.displayOrder ?? 0,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ ...emptyForm });
    setFormErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      if (editingId) {
        await adminAchievementService.updateAchievement(editingId, formData);
        addToast('success', 'Achievement updated successfully');
      } else {
        await adminAchievementService.addAchievement(formData);
        addToast('success', 'Achievement created successfully');
      }
      closeModal();
      await fetchAchievements();
    } catch (error: any) {
      addToast('error', error?.message || 'Failed to save achievement');
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = (achievement: Achievement) => {
    setDeleteTarget(achievement);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await adminAchievementService.deleteAchievement(deleteTarget._id);
      addToast('success', 'Achievement deleted successfully');
      setDeleteTarget(null);
      await fetchAchievements();
    } catch (error: any) {
      addToast('error', error?.message || 'Failed to delete achievement');
    } finally {
      setDeleting(false);
    }
  };

  const handleFieldChange = (field: keyof AchievementInput, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // ── Table columns ──
  const columns = [
    {
      key: 'icon',
      label: 'Icon',
      render: (a: Achievement) =>
        a.icon ? (
          <span className="font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md text-xs font-medium">{a.icon}</span>
        ) : (
          <span className="text-gray-300 text-xs">—</span>
        ),
    },
    { key: 'title' as const, label: 'Title' },
    {
      key: 'value',
      label: 'Value',
      render: (a: Achievement) => (
        <span className="font-bold text-blue-600">{a.value}</span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (a: Achievement) => (
        <span className="truncate block max-w-[220px]" title={a.description}>{a.description}</span>
      ),
    },
    {
      key: 'displayOrder',
      label: 'Order',
      render: (a: Achievement) => (
        <span className="text-gray-500 text-sm">{a.displayOrder ?? 0}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (a: Achievement) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEditModal(a)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => confirmDelete(a)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="space-y-6">
      {/* Toast notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-xl">
            <Award className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Achievement Management</h1>
            <p className="text-sm text-gray-500">
              {achievements.length} achievement{achievements.length !== 1 ? 's' : ''} total
            </p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm font-medium"
        >
          <Plus size={18} /> Add Achievement
        </button>
      </div>

      {/* Search & Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search achievements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white text-sm"
          />
        </div>
        <button
          onClick={() => setSortNewest((prev) => !prev)}
          className="flex items-center gap-2 px-4 py-2.5 border rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 bg-white"
        >
          <ArrowUpDown size={16} />
          {sortNewest ? 'Newest First' : 'Oldest First'}
        </button>
      </div>

      {/* Error state */}
      {fetchError && !loading && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
          <AlertCircle size={20} className="shrink-0" />
          <span className="flex-1 text-sm">{fetchError}</span>
          <button
            onClick={fetchAchievements}
            className="flex items-center gap-1.5 text-sm font-medium text-red-700 hover:text-red-900"
          >
            <RefreshCw size={14} /> Retry
          </button>
        </div>
      )}

      {/* Table */}
      <AdminTable
        columns={columns}
        data={displayed}
        loading={loading}
        emptyMessage="No achievements found. Click 'Add Achievement' to create one."
        keyExtractor={(a) => a._id}
      />

      {/* ── Add / Edit Modal ──────────────────────────────────────────── */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Achievement' : 'Add Achievement'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                formErrors.title ? 'border-red-400 ring-1 ring-red-400' : ''
              }`}
              placeholder="e.g., Successful Deliveries"
            />
            {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.value}
              onChange={(e) => handleFieldChange('value', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
                formErrors.value ? 'border-red-400 ring-1 ring-red-400' : ''
              }`}
              placeholder="e.g., 1500+, 10k, 95%"
            />
            {formErrors.value && <p className="text-xs text-red-500 mt-1">{formErrors.value}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none ${
                formErrors.description ? 'border-red-400 ring-1 ring-red-400' : ''
              }`}
              placeholder="Brief description of this achievement"
            />
            {formErrors.description && (
              <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>
            )}
          </div>

          {/* Icon (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon Name <span className="text-gray-400 text-xs font-normal">(optional, Lucide icon)</span>
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => handleFieldChange('icon', e.target.value)}
              placeholder="e.g., Trophy, Users, Truck"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Image URL (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL <span className="text-gray-400 text-xs font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={formData.image}
              onChange={(e) => handleFieldChange('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Display Order (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Display Order <span className="text-gray-400 text-xs font-normal">(optional)</span>
            </label>
            <input
              type="number"
              value={formData.displayOrder ?? 0}
              onChange={(e) => handleFieldChange('displayOrder', parseInt(e.target.value, 10) || 0)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Form actions */}
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              disabled={submitting}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {submitting && <Loader2 className="animate-spin" size={16} />}
              {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* ── Delete Confirmation Modal ─────────────────────────────────── */}
      <AdminModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Achievement"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm text-red-800 font-medium">
                Are you sure you want to delete this achievement?
              </p>
              <p className="text-sm text-red-600 mt-1">This action cannot be undone.</p>
            </div>
          </div>

          {deleteTarget && (
            <div className="bg-gray-50 rounded-xl p-4 border">
              <p className="font-semibold text-gray-800">{deleteTarget.title}</p>
              <p className="text-sm text-gray-500 mt-1">{deleteTarget.description}</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {deleting && <Loader2 className="animate-spin" size={16} />}
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </AdminModal>
    </div>
  );
};

export default AchievementManagement;
