import React, { useState } from 'react';
import { MdAutoAwesome, MdContentCopy, MdCheck, MdRefresh } from 'react-icons/md';
import axios from 'axios';

const ProductDescriptionGenerator = ({ onUseDescription }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const categories = [
    'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 
    'Toys', 'Beauty', 'Health', 'Automotive', 'Food'
  ];

  const generateDescription = async () => {
    if (!title.trim() || !category.trim()) {
      alert('Please enter both title and category');
      return;
    }

    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      const response = await axios.post(`${baseUrl}/api/v1/ai/generate-description`,
        { title: title.trim(), category: category.trim() },
        { withCredentials: true }
      );
      setDescription(response.data.description);
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Failed to generate description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const useDescription = () => {
    if (onUseDescription) {
      onUseDescription(description);
    }
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--accent-gold)]/20">
      <div className="flex items-center gap-2 mb-4">
        <MdAutoAwesome className="text-[var(--accent-gold)] text-xl" />
        <h3 className="text-lg font-bold text-[var(--text-primary)]">AI Product Description Generator</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Product Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter product name"
              className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] px-4 py-2 rounded border border-[var(--accent-gold)]/20 focus:outline-none focus:border-[var(--accent-gold)]"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] px-4 py-2 rounded border border-[var(--accent-gold)]/20 focus:outline-none focus:border-[var(--accent-gold)]"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={generateDescription}
          disabled={loading || !title.trim() || !category.trim()}
          className="flex items-center gap-2 bg-[var(--accent-gold)] text-[var(--bg-primary)] px-4 py-2 rounded hover:bg-[var(--accent-gold)]/80 disabled:opacity-50 transition-all"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-[var(--bg-primary)]/30 border-t-[var(--bg-primary)] animate-spin rounded-full"></div>
              Generating...
            </>
          ) : (
            <>
              <MdAutoAwesome />
              Generate Description
            </>
          )}
        </button>

        {description && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-[var(--text-secondary)]">Generated Description</label>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 text-sm text-[var(--accent-gold)] hover:text-[var(--accent-gold)]/80"
                >
                  {copied ? <MdCheck /> : <MdContentCopy />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={() => useDescription()}
                  className="flex items-center gap-1 text-sm text-[var(--accent-gold)] hover:text-[var(--accent-gold)]/80"
                >
                  <MdCheck />
                  Use Description
                </button>
              </div>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] px-4 py-2 rounded border border-[var(--accent-gold)]/20 focus:outline-none focus:border-[var(--accent-gold)] resize-none"
            />
            <button
              onClick={generateDescription}
              className="mt-2 flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <MdRefresh />
              Regenerate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDescriptionGenerator;