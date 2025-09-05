import React, { useState, useEffect } from 'react';
import { EntityType } from '../../types/db';
import { ClipboardIcon } from '@heroicons/react/24/outline';

const ENTITY_TYPES: EntityType[] = ['DESTINATION', 'PARK', 'ATTRACTION', 'RESTAURANT', 'SHOW'];

const IMAGE_TYPES = [
  { value: 'logo', label: 'Logo' },
  { value: 'main', label: 'Main' },
];

const AdminImageLinker: React.FC = () => {
  const [entityType, setEntityType] = useState<EntityType>('PARK');
  const [entities, setEntities] = useState<any[]>([]);
  const [allEntities, setAllEntities] = useState<any[]>([]);
  const [entityId, setEntityId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageType, setImageType] = useState('main');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showOnlyEmpty, setShowOnlyEmpty] = useState(false);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL!;
    if (!apiUrl) {
      setError("API URL is not defined");
      setLoading(false);
      return;
    }
    
    setEntities([]);
    setEntityId('');
    setLoading(true);
    fetch(`${apiUrl}/api/entities?type=${entityType}`)
      .then(async res => {
        if (!res.ok) throw new Error('Failed to fetch entities');
        const data = await res.json();
        setAllEntities(data);
        setEntities(data);
        setLoading(false);
      })
      .catch(() => {
        setEntities([]);
        setAllEntities([]);
        setLoading(false);
      });
  }, [entityType]);

  useEffect(() => {
    const filteredEntities = showOnlyEmpty ? allEntities.filter(entity => !entity.mainImageId) : allEntities;
    setEntities(filteredEntities);
  }, [showOnlyEmpty, allEntities]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const apiUrl = process.env.REACT_APP_API_URL!;
    if (!apiUrl) {
      setError("API URL is not defined");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch(`${apiUrl}/api/images/wikimedia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType,
          entityId,
          imageUrl,
          imageType,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || 'Error sending data');
      }
      setSuccess(true);
      setImageUrl('');
    } catch (err: any) {
      setError(err?.message || 'Error sending data');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full py-4">
      <h2 className="text-2xl font-bold mt-4 text-center">Link Wikimedia Image</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl w-[80%] mx-auto mt-4 p-6 bg-white rounded shadow">
        <div>
          <div className="flex justify-between items-center">
            <label className="block font-semibold mb-1">Entity Type</label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emptyFilter"
                checked={showOnlyEmpty}
                onChange={(e) => setShowOnlyEmpty(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="emptyFilter" className="text-sm text-gray-600">
                Show only entities without images
              </label>
            </div>
          </div>
          <select
            value={entityType}
            onChange={e => setEntityType(e.target.value as EntityType)}
            className="w-full border rounded px-2 py-1"
          >
            {ENTITY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Entity</label>
          <div className="relative">
            <select
              value={entityId}
              onChange={e => setEntityId(e.target.value)}
              className="w-full border rounded px-2 py-1 pr-10"
              disabled={loading || entities.length === 0}
            >
              <option value="">Select...</option>
              {entities.filter(entity => entity.name).sort((a, b) => a.name.localeCompare(b.name)).map(entity => (
                <option key={entity.id} value={entity.id}>{entity.name}</option>
              ))}
            </select>
            {entityId && (
              <button
                type="button"
                onClick={() => {
                  const entityName = entities.find(e => e.id === entityId)?.name || '';
                  navigator.clipboard.writeText(entityName);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                title="Copy entity name"
              >
                <ClipboardIcon className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-1">Wikimedia Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Image Type</label>
          <select
            value={imageType}
            onChange={e => setImageType(e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            {IMAGE_TYPES.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-bold"
          disabled={loading || !entityId || !imageUrl}
        >
          {loading ? 'Sending...' : 'Link Image'}
        </button>
        {success && <div className="text-green-600">Image linked successfully!</div>}
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  );
};

export default AdminImageLinker;
