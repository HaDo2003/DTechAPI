import { useState } from "react";

interface ColorPickerPanelProps {
    backgroundColor: string;
    productColor: string;
    onBackgroundColorChange: (color: string) => void;
    onProductColorChange: (color: string) => void;
}

const ColorPickerPanel: React.FC<ColorPickerPanelProps> = ({
    backgroundColor,
    productColor,
    onBackgroundColorChange,
    onProductColorChange
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const backgroundPresets = [
        { name: 'White', value: '#ffffff' },
        { name: 'Light Gray', value: '#e8e8e8' },
        { name: 'Soft Blue', value: '#b3d9ff' },
        { name: 'Lavender', value: '#c9c3e6' },
        { name: 'Mint', value: '#b8e6d5' },
        { name: 'Peach', value: '#ffd4b3' },
        { name: 'Steel Gray', value: '#8b9bb3' },
        { name: 'Slate', value: '#6b7b8c' },
        { name: 'Teal', value: '#3a5f6f' },
        { name: 'Dark Green', value: '#1a3a2e' },
        { name: 'Navy', value: '#0f3460' },
        { name: 'Dark Blue', value: '#16213e' },
        { name: 'Purple', value: '#2d1b69' },
        { name: 'Charcoal', value: '#2c2c2c' },
        { name: 'Black', value: '#000000' },
    ];

    const productColorPresets = [
        { name: 'Silver', value: '#c0c0c0' },
        { name: 'Space Gray', value: '#8b8b8b' },
        { name: 'Gold', value: '#ffd700' },
        { name: 'Rose Gold', value: '#b76e79' },
        { name: 'Black', value: '#1a1a1a' },
        { name: 'White', value: '#ffffff' },
        { name: 'Blue', value: '#4a90e2' },
        { name: 'Red', value: '#e74c3c' },
    ];

    return (
        <div
            className="position-absolute bottom-0 start-0 m-3 bg-dark bg-opacity-90 rounded-3 shadow-lg border border-secondary"
            style={{ zIndex: 10, maxWidth: '280px' }}
        >
            {/* Header */}
            <div
                className="d-flex justify-content-between align-items-center p-2 border-bottom border-secondary cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ cursor: 'pointer' }}
            >
                <div className="d-flex align-items-center">
                    <i className="fas fa-palette text-light me-2"></i>
                    <small className="text-light fw-bold">Customization</small>
                </div>
                <i className={`fas fa-chevron-${isExpanded ? 'down' : 'up'} text-light`}></i>
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="p-3">
                    {/* Background Color Section */}
                    <div className="mb-3">
                        <label className="text-light small fw-bold mb-2 d-block">
                            <i className="fas fa-image me-1"></i>
                            Background Color
                        </label>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                            {backgroundPresets.map((preset) => (
                                <button
                                    key={preset.value}
                                    className={`color-preset-btn ${backgroundColor === preset.value ? 'active' : ''}`}
                                    style={{
                                        backgroundColor: preset.value,
                                        width: '36px',
                                        height: '36px',
                                        border: backgroundColor === preset.value ? '3px solid #3498db' : '2px solid #666',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => onBackgroundColorChange(preset.value)}
                                    title={preset.name}
                                />
                            ))}
                        </div>
                        {/* Custom color picker */}
                        <div className="d-flex align-items-center gap-2">
                            <input
                                type="color"
                                className="form-control form-control-sm"
                                value={backgroundColor}
                                onChange={(e) => onBackgroundColorChange(e.target.value)}
                                style={{ width: '60px', height: '36px' }}
                            />
                            <small className="text-muted">Custom</small>
                        </div>
                    </div>

                    {/* Product Color Section */}
                    <div>
                        <label className="text-light small fw-bold mb-2 d-block">
                            <i className="fas fa-fill-drip me-1"></i>
                            Product Color
                        </label>
                        <div className="d-flex flex-wrap gap-2 mb-2">
                            {productColorPresets.map((preset) => (
                                <button
                                    key={preset.value}
                                    className={`color-preset-btn ${productColor === preset.value ? 'active' : ''}`}
                                    style={{
                                        backgroundColor: preset.value,
                                        width: '36px',
                                        height: '36px',
                                        border: productColor === preset.value ? '3px solid #3498db' : '2px solid #666',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: preset.value === '#ffffff' ? 'inset 0 0 0 1px #999' : 'none'
                                    }}
                                    onClick={() => onProductColorChange(preset.value)}
                                    title={preset.name}
                                />
                            ))}
                        </div>
                        {/* Custom color picker */}
                        <div className="d-flex align-items-center gap-2">
                            <input
                                type="color"
                                className="form-control form-control-sm"
                                value={productColor}
                                onChange={(e) => onProductColorChange(e.target.value)}
                                style={{ width: '60px', height: '36px' }}
                            />
                            <small className="text-muted">Custom</small>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorPickerPanel;