import { useState } from "react";

export function BrandAssets() {
  const [selectedColor, setSelectedColor] = useState("#0c2788");
  const [iconSize, setIconSize] = useState(400);

  // NYC Subway MTA Color Palette
  const colorOptions = [
    { name: "Brand Blue", color: "#0c2788" },
    { name: "MTA Red", color: "#EE352E" },
    { name: "MTA Blue", color: "#0039A6" },
    { name: "MTA Green", color: "#00933C" },
    { name: "MTA Orange", color: "#FF6319" },
    { name: "MTA Yellow", color: "#FCCC0A" },
    { name: "MTA Purple", color: "#B933AD" },
    { name: "MTA Gray", color: "#A7A9AC" },
    { name: "White", color: "#FFFFFF" },
    { name: "Black", color: "#000000" }
  ];

  const downloadSVG = () => {
    const svg = document.getElementById('social-icon-svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `mamdani-tracker-icon-${iconSize}x${iconSize}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-5 lg:px-6 py-5">
      <div className="mb-5">
        <div className="border-t-4 border-[#0C2788] pt-4 mb-3">
          <h1 className="font-bold text-black tracking-tight" style={{ fontSize: '40px' }}>
            Brand Assets & Social Media Icon
          </h1>
        </div>
        <p className="text-base max-w-3xl" style={{ color: '#374151' }}>
          MamdaniTracker.nyc social media icon designs following the NYC subway aesthetic
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Icon Preview Section */}
        <div className="lg:col-span-8">
          <div className="bg-white border-2 border-black p-5">
            <h2 className="font-bold text-black mb-4" style={{ fontSize: '24px' }}>Icon Preview</h2>
            
            {/* Main Icon Display */}
            <div className="flex justify-center items-center p-5" style={{ backgroundColor: '#f8f9fa', minHeight: '500px' }}>
              <svg 
                id="social-icon-svg"
                width={iconSize} 
                height={iconSize} 
                viewBox="0 0 400 400" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background */}
                <rect width="400" height="400" fill={selectedColor} />
                
                {/* White border frame (subway tile style) */}
                <rect x="20" y="20" width="360" height="360" fill="none" stroke="white" strokeWidth="8" />
                
                {/* Subway circle badge - larger and centered */}
                <circle cx="200" cy="160" r="90" fill="white" stroke="white" strokeWidth="4" />
                <text 
                  x="200" 
                  y="160" 
                  textAnchor="middle" 
                  dominantBaseline="central" 
                  fill={selectedColor}
                  style={{
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontSize: '100px',
                    fontWeight: 'bold'
                  }}
                >
                  M
                </text>
                
                {/* Text - "TRACKER" */}
                <text 
                  x="200" 
                  y="290" 
                  textAnchor="middle" 
                  fill="white"
                  style={{
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontSize: '42px',
                    fontWeight: 'bold',
                    letterSpacing: '0.15em'
                  }}
                >
                  TRACKER
                </text>
                
                {/* Bottom indicator line */}
                <rect x="80" y="340" width="240" height="6" fill="white" />
              </svg>
            </div>

            {/* Size Variants */}
            <div className="mt-4">
              <h3 className="font-bold text-black mb-3" style={{ fontSize: '18px' }}>Size Variants</h3>
              <div className="flex gap-4 items-end flex-wrap">
                {[64, 128, 256, 400, 512].map(size => (
                  <div key={size} className="text-center">
                    <svg width={size} height={size} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                      <rect width="400" height="400" fill={selectedColor} />
                      <rect x="20" y="20" width="360" height="360" fill="none" stroke="white" strokeWidth="8" />
                      <circle cx="200" cy="160" r="90" fill="white" stroke="white" strokeWidth="4" />
                      <text 
                        x="200" 
                        y="160" 
                        textAnchor="middle" 
                        dominantBaseline="central" 
                        fill={selectedColor}
                        style={{
                          fontFamily: 'Helvetica, Arial, sans-serif',
                          fontSize: '100px',
                          fontWeight: 'bold'
                        }}
                      >
                        M
                      </text>
                      <text 
                        x="200" 
                        y="290" 
                        textAnchor="middle" 
                        fill="white"
                        style={{
                          fontFamily: 'Helvetica, Arial, sans-serif',
                          fontSize: '42px',
                          fontWeight: 'bold',
                          letterSpacing: '0.15em'
                        }}
                      >
                        TRACKER
                      </text>
                      <rect x="80" y="340" width="240" height="6" fill="white" />
                    </svg>
                    <p className="text-xs mt-2 mb-0 font-bold" style={{ color: '#374151' }}>{size}×{size}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="lg:col-span-4">
          <div className="bg-white border-2 border-black p-4 mb-4">
            <h2 className="font-bold text-black mb-4" style={{ fontSize: '20px' }}>Customization</h2>
            
            {/* Color Picker */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-black uppercase mb-3" style={{ letterSpacing: '0.1em' }}>
                Background Color
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(option => (
                  <button
                    key={option.color}
                    onClick={() => setSelectedColor(option.color)}
                    className={`p-0 border-0 relative ${
                      selectedColor === option.color ? 'border-4 border-black' : ''
                    }`}
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: option.color,
                      cursor: 'pointer',
                      border: option.color === '#FFFFFF' ? '2px solid #E5E7EB' : 'none'
                    }}
                    title={option.name}
                  >
                    {selectedColor === option.color && (
                      <span 
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold"
                        style={{ 
                          color: option.color === '#FFFFFF' || option.color === '#FCCC0A' ? '#000000' : '#FFFFFF',
                          fontSize: '20px'
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Slider */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-black uppercase mb-2" style={{ letterSpacing: '0.1em' }}>
                Preview Size: {iconSize}px
              </label>
              <input 
                type="range" 
                className="w-full" 
                min="200" 
                max="600" 
                step="50"
                value={iconSize}
                onChange={(e) => setIconSize(Number(e.target.value))}
              />
            </div>

            {/* Download Button */}
            <button
              onClick={downloadSVG}
              className="w-full px-4 py-3 bg-[#0C2788] text-white font-bold uppercase tracking-wide hover:bg-[#1436B3] border-0 cursor-pointer"
              style={{ letterSpacing: '0.15em' }}
            >
              Download SVG
            </button>
          </div>

          {/* Alternative Design 2 - Square Badge */}
          <div className="bg-white border-2 border-black p-4">
            <h3 className="font-bold text-black mb-3" style={{ fontSize: '18px' }}>Alternative: Square Badge</h3>
            <div className="flex justify-center p-3" style={{ backgroundColor: '#f8f9fa' }}>
              <svg width="200" height="200" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="400" fill={selectedColor} />
                <rect x="40" y="40" width="320" height="320" fill="white" stroke="white" strokeWidth="4" />
                <text 
                  x="200" 
                  y="200" 
                  textAnchor="middle" 
                  dominantBaseline="central" 
                  fill={selectedColor}
                  style={{
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontSize: '180px',
                    fontWeight: 'bold'
                  }}
                >
                  M
                </text>
              </svg>
            </div>
            <p className="text-xs mt-3 mb-0" style={{ color: '#374151' }}>
              Simplified subway letter badge design for profile pictures
            </p>
          </div>
        </div>
      </div>

      {/* Usage Guidelines */}
      <div className="bg-white border-2 border-black p-5 mt-5">
        <h2 className="font-bold text-black mb-4" style={{ fontSize: '24px' }}>Usage Guidelines</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-black mb-2" style={{ fontSize: '18px' }}>Social Media Platforms</h3>
            <ul className="list-none" style={{ color: '#374151' }}>
              <li className="mb-2">• <strong>Twitter/X:</strong> 400×400px (minimum)</li>
              <li className="mb-2">• <strong>Facebook:</strong> 512×512px</li>
              <li className="mb-2">• <strong>Instagram:</strong> 400×400px</li>
              <li className="mb-2">• <strong>LinkedIn:</strong> 400×400px</li>
              <li className="mb-2">• <strong>Favicon:</strong> 64×64px</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-black mb-2" style={{ fontSize: '18px' }}>Design Notes</h3>
            <ul className="list-none" style={{ color: '#374151' }}>
              <li className="mb-2">• Based on NYC subway tile and badge aesthetic</li>
              <li className="mb-2">• Helvetica font matches MTA typography</li>
              <li className="mb-2">• High contrast for maximum visibility</li>
              <li className="mb-2">• Square format works across all platforms</li>
              <li className="mb-2">• SVG format ensures crisp display at any size</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}