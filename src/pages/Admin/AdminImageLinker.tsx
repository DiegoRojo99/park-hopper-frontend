import React, { useState, useEffect } from 'react';
import { EntityType } from '../../types/db';

const ENTITY_TYPES: EntityType[] = ['DESTINATION', 'PARK', 'ATTRACTION', 'RESTAURANT', 'SHOW'];

const IMAGE_TYPES = [
  { value: 'logo', label: 'Logo' },
  { value: 'main', label: 'Main' },
  { value: 'regular', label: 'Regular' },
];

const AdminImageLinker: React.FC = () => {
  const [entityType, setEntityType] = useState<EntityType>('PARK');
  const [entities, setEntities] = useState<any[]>([]);
  const [entityId, setEntityId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageType, setImageType] = useState('logo');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setEntities([]);
    setEntityId('');
    setLoading(true);
    fetch(`/api/entities?type=${entityType}`)
      .then(async res => {
        if (!res.ok) throw new Error('Failed to fetch entities');
        const data = await res.json();
        setEntities(data);
        setLoading(false);
      })
      .catch(() => {
        setEntities([]);
        setLoading(false);
      });
  }, [entityType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/images/wikimedia', {
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
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Link Wikimedia Image</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Entity Type</label>
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
          <select
            value={entityId}
            onChange={e => setEntityId(e.target.value)}
            className="w-full border rounded px-2 py-1"
            disabled={loading || entities.length === 0}
          >
            <option value="">Select...</option>
            {entities.map(entity => (
              <option key={entity.id} value={entity.id}>{entity.name}</option>
            ))}
          </select>
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
