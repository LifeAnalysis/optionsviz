import React, { useState } from 'react';

interface OptionModalProps {
  onClose: () => void;
  onSubmit: (data: {
    option_type: 'call' | 'put';
    strike_price: number;
    expiry_date: string;
    size: number;
  }) => void;
}

const OptionModal: React.FC<OptionModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    option_type: 'call' as 'call' | 'put',
    strike_price: '',
    expiry_date: '',
    size: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.option_type) {
      newErrors.option_type = 'Option type is required';
    }

    if (!formData.strike_price || isNaN(Number(formData.strike_price)) || Number(formData.strike_price) <= 0) {
      newErrors.strike_price = 'Valid strike price is required';
    }

    if (!formData.expiry_date) {
      newErrors.expiry_date = 'Expiry date is required';
    } else {
      const expiryDate = new Date(formData.expiry_date);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.expiry_date = 'Expiry date must be in the future';
      }
    }

    if (!formData.size || isNaN(Number(formData.size)) || Number(formData.size) <= 0) {
      newErrors.size = 'Valid size is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        option_type: formData.option_type,
        strike_price: Number(formData.strike_price),
        expiry_date: formData.expiry_date,
        size: Number(formData.size),
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Add New Option</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Option Type</label>
            <select
              className="form-select"
              value={formData.option_type}
              onChange={(e) => handleInputChange('option_type', e.target.value)}
            >
              <option value="call">Call</option>
              <option value="put">Put</option>
            </select>
            {errors.option_type && (
              <div className="error-message">{errors.option_type}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Strike Price (USDT)</label>
            <input
              type="number"
              step="0.01"
              className="form-input"
              value={formData.strike_price}
              onChange={(e) => handleInputChange('strike_price', e.target.value)}
              placeholder="e.g., 0.50"
            />
            {errors.strike_price && (
              <div className="error-message">{errors.strike_price}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Expiry Date</label>
            <input
              type="date"
              className="form-input"
              value={formData.expiry_date}
              onChange={(e) => handleInputChange('expiry_date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.expiry_date && (
              <div className="error-message">{errors.expiry_date}</div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Size (FET)</label>
            <input
              type="number"
              className="form-input"
              value={formData.size}
              onChange={(e) => handleInputChange('size', e.target.value)}
              placeholder="e.g., 1000000"
            />
            {errors.size && (
              <div className="error-message">{errors.size}</div>
            )}
          </div>

          <div className="button-group">
            <button type="button" className="button button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button-primary">
              Add Option
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OptionModal;
