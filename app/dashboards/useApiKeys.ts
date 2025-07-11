import { useState, useEffect } from "react";

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: "active" | "inactive";
  createdAt: string;
  lastUsed?: string;
  usage?: number;
}

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [formData, setFormData] = useState({ name: '', status: 'active' as 'active' | 'inactive' });
  const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApiKeys = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/keys');
        const result = await response.json();
        if (result.success) {
          setApiKeys(result.data.map((k: ApiKey, i: number) => ({ ...k, usage: i === 0 ? 24 : 0 })));
        }
      } catch (error) {
        console.error('Failed to fetch API keys:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApiKeys();
  }, []);

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (result.success) {
        setApiKeys([...apiKeys, { ...result.data, usage: 0 }]);
        setFormData({ name: '', status: 'active' });
        setIsModalOpen(false);
        setNotification('API Key created');
        setTimeout(() => setNotification(null), 1500);
      }
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingKey) return;
    try {
      const response = await fetch('/api/keys', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingKey.id,
          name: formData.name,
          status: formData.status,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setApiKeys(apiKeys.map(key => key.id === editingKey.id ? { ...result.data, usage: key.usage } : key));
        setEditingKey(null);
        setFormData({ name: '', status: 'active' });
        setIsModalOpen(false);
        setNotification('API Key updated');
        setTimeout(() => setNotification(null), 1500);
      }
    } catch (error) {
      console.error('Failed to update API key:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      try {
        const response = await fetch(`/api/keys?id=${id}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        if (result.success) {
          setApiKeys(apiKeys.filter(key => key.id !== id));
          setNotification('API Key deleted');
          setTimeout(() => setNotification(null), 1500);
        }
      } catch (error) {
        console.error('Failed to delete API key:', error);
      }
    }
  };

  const openEditModal = (key: ApiKey) => {
    setEditingKey(key);
    setFormData({ name: key.name, status: key.status });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingKey(null);
    setFormData({ name: '', status: 'active' });
    setIsModalOpen(true);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setNotification('Copied API Key to clipboard');
    setTimeout(() => {
      setCopiedKeyId(null);
      setNotification(null);
    }, 1500);
  };

  return {
    apiKeys,
    loading,
    isModalOpen,
    setIsModalOpen,
    editingKey,
    setEditingKey,
    formData,
    setFormData,
    visibleKeyId,
    setVisibleKeyId,
    copiedKeyId,
    setCopiedKeyId,
    notification,
    setNotification,
    handleCreate,
    handleUpdate,
    handleDelete,
    openEditModal,
    openCreateModal,
    copyToClipboard,
  };
} 