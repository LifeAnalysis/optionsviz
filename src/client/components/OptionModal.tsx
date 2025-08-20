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
    size: 1000000, // Default to 1M FET
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Quick preset options
  const strikePresets = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 2.5, 3.0];
  const sizePresets = [
    { label: '1M', value: 1000000 },
    { label: '2M', value: 2000000 },
    { label: '5M', value: 5000000 },
    { label: '10M', value: 10000000 },
    { label: '25M', value: 25000000 },
    { label: '50M', value: 50000000 },
  ];
  const expiryPresets = [
    { label: '1 Month', months: 1 },
    { label: '3 Months', months: 3 },
    { label: '6 Months', months: 6 },
    { label: '1 Year', months: 12 },
  ];

  const getPresetDate = (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  };

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
      today.setHours(0, 0, 0, 0); // Set to start of day for fair comparison
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

  const handleInputChange = (field: string, value: string | number) => {
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

        <form onSubmit={handleSubmit} className="option-form">
          {/* Option Type - Toggle Buttons */}
          <div className="form-section">
            <label className="section-label">Option Type</label>
            <div className="toggle-group">
              <button
                type="button"
                className={`toggle-btn ${formData.option_type === 'call' ? 'active call' : ''}`}
                onClick={() => handleInputChange('option_type', 'call')}
              >
                📈 Call
              </button>
              <button
                type="button"
                className={`toggle-btn ${formData.option_type === 'put' ? 'active put' : ''}`}
                onClick={() => handleInputChange('option_type', 'put')}
              >
                📉 Put
              </button>
            </div>
            {errors.option_type && (
              <div className="error-message">{errors.option_type}</div>
            )}
          </div>

          {/* Strike Price - Preset Buttons + Custom Input */}
          <div className="form-section">
            <label className="section-label">Strike Price (USDT)</label>
            <div className="preset-grid">
              {strikePresets.map(price => (
                <button
                  key={price}
                  type="button"
                  className={`preset-btn ${formData.strike_price === price.toString() ? 'active' : ''}`}
                  onClick={() => handleInputChange('strike_price', price.toString())}
                >
                  ${price}
                </button>
              ))}
            </div>
            <input
              type="number"
              step="0.01"
              className="custom-input"
              value={formData.strike_price}
              onChange={(e) => handleInputChange('strike_price', e.target.value)}
              placeholder="Custom price"
            />
            {errors.strike_price && (
              <div className="error-message">{errors.strike_price}</div>
            )}
          </div>

          {/* Position Size - Million Scale Presets */}
          <div className="form-section">
            <label className="section-label">Position Size</label>
            <div className="preset-grid size-grid">
              {sizePresets.map(({ label, value }) => (
                <button
                  key={value}
                  type="button"
                  className={`preset-btn size-btn ${formData.size === value ? 'active' : ''}`}
                  onClick={() => handleInputChange('size', value)}
                >
                  {label} FET
                </button>
              ))}
            </div>
            <div className="custom-size-input">
              <input
                type="number"
                className="custom-input"
                value={formData.size}
                onChange={(e) => handleInputChange('size', Number(e.target.value))}
                placeholder="Custom size"
              />
              <span className="input-suffix">FET ({(Number(formData.size) / 1000000).toFixed(1)}M)</span>
            </div>
            {errors.size && (
              <div className="error-message">{errors.size}</div>
            )}
          </div>

          {/* Expiry Date - Quick Presets + Date Picker */}
          <div className="form-section">
            <label className="section-label">Expiry Date</label>
            <div className="preset-grid">
              {expiryPresets.map(({ label, months }) => (
                <button
                  key={months}
                  type="button"
                  className={`preset-btn ${formData.expiry_date === getPresetDate(months) ? 'active' : ''}`}
                  onClick={() => handleInputChange('expiry_date', getPresetDate(months))}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              type="date"
              className="custom-input"
              value={formData.expiry_date}
              onChange={(e) => handleInputChange('expiry_date', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.expiry_date && (
              <div className="error-message">{errors.expiry_date}</div>
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