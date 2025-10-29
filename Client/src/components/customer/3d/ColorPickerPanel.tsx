import { useState } from "react";
import type { ProductColor } from "../../../types/ProductColor";

interface ColorPickerPanelProps {
    backgroundColor: string;
    productColors: ProductColor[];
    selectedColorId: number | null;
    onBackgroundColorChange: (color: string) => void;
    onColorSelect: (colorId: number) => void;
    productModels?: { colorId: number; modelUrl: string }[];
}

const ColorPickerPanel: React.FC<ColorPickerPanelProps> = ({
    backgroundColor,
    productColors,
    selectedColorId,
    onBackgroundColorChange,
    onColorSelect,
    productModels = []
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const hasModel = (colorId: number) => {
        return productModels.some(model => model.colorId === colorId && model.modelUrl);
    };

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
                    {productColors.length > 0 && (
                        <div>
                            <label className="text-light small fw-bold mb-2 d-block">
                                <i className="fas fa-fill-drip me-1"></i>
                                Product Color
                            </label>
                            <div className="d-flex flex-wrap gap-2">
                                {productColors.map((color) => {
                                    const modelAvailable = hasModel(color.colorId);
                                    return (
                                        <button
                                            key={color.colorId}
                                            className={`color-preset-btn ${selectedColorId === color.colorId ? 'active' : ''}`}
                                            style={{
                                                backgroundColor: color.colorCode,
                                                width: '40px',
                                                height: '40px',
                                                border: selectedColorId === color.colorId ? '3px solid #3498db' : '2px solid #666',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                boxShadow: color.colorCode === '#ffffff' ? 'inset 0 0 0 1px #999' : 'none',
                                                position: 'relative',
                                                opacity: modelAvailable ? 1 : 0.5
                                            }}
                                            onClick={() => onColorSelect(color.colorId)}
                                            title={`${color.colorName}${!modelAvailable ? ' (No 3D Model)' : ''}`}
                                        >
                                            {selectedColorId === color.colorId && (
                                                <i
                                                    className="fas fa-check"
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        color: color.colorCode === '#ffffff' || color.colorCode === '#000000'
                                                            ? (color.colorCode === '#ffffff' ? '#000' : '#fff')
                                                            : '#fff',
                                                        fontSize: '14px',
                                                        textShadow: '0 0 2px rgba(0,0,0,0.5)'
                                                    }}
                                                />
                                            )}
                                            {!modelAvailable && (
                                                <i
                                                    className="fas fa-ban"
                                                    style={{
                                                        position: 'absolute',
                                                        bottom: '-2px',
                                                        right: '-2px',
                                                        fontSize: '10px',
                                                        color: '#dc3545',
                                                        backgroundColor: '#fff',
                                                        borderRadius: '50%',
                                                        padding: '2px',
                                                        border: '1px solid #666'
                                                    }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-2">
                                <small className="text-light d-block">
                                    Selected: <span className="fw-bold">{productColors.find(c => c.colorId === selectedColorId)?.colorName || 'None'}</span>
                                </small>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ColorPickerPanel;