#!/usr/bin/env python3
"""
Simple API server for The Spectral Haven
Handles the /api/generate-stitched endpoint
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import base64
import random
from urllib.parse import urlparse

class APIHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """Handle POST requests"""
        path = urlparse(self.path).path
        
        if path == '/api/generate-stitched':
            self.handle_generate_stitched()
        else:
            self.send_error(404, 'Endpoint not found')

    def handle_generate_stitched(self):
        """Generate stitched creature image (placeholder)"""
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            # Extract data
            species_a = data.get('a', {})
            species_b = data.get('b', {})
            quality = data.get('quality', 'med')
            seed = data.get('seed', random.randint(1000, 9999))
            
            # Get dimensions
            dimensions = {
                'low': {'width': 512, 'height': 512},
                'med': {'width': 768, 'height': 768},
                'high': {'width': 1024, 'height': 1024}
            }
            dim = dimensions.get(quality, dimensions['med'])
            
            # Generate placeholder SVG
            image_url = self.generate_placeholder_svg(species_a, species_b, dim, seed)
            
            # Send response
            response = {
                'imageUrl': image_url,
                'seed': seed,
                'quality': quality,
                'dimensions': dim
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
            print(f"✓ Generated stitched image: {species_a.get('name')} + {species_b.get('name')}")
            
        except Exception as e:
            print(f"✗ Error: {e}")
            self.send_error(500, f'Server error: {str(e)}')

    def generate_placeholder_svg(self, species_a, species_b, dimensions, seed):
        """Generate a detailed monster/creature SVG combining both species"""
        width = dimensions['width']
        height = dimensions['height']
        
        # Get colors
        color_a = species_a.get('colors', ['#9BE7FF'])[0]
        color_b = species_b.get('colors', ['#8844FF'])[0]
        
        # Get names and hints
        name_a = species_a.get('name', 'Species A')
        name_b = species_b.get('name', 'Species B')
        hints_a = species_a.get('visualHints', [])
        hints_b = species_b.get('visualHints', [])
        
        # Create portmanteau
        mid_a = len(name_a) // 2
        mid_b = len(name_b) // 2
        portmanteau = name_a[:mid_a] + name_b[mid_b:]
        
        # Determine creature features based on species
        has_wings = any('wing' in h.lower() for h in hints_a + hints_b)
        has_glow = any('glow' in h.lower() for h in hints_a + hints_b)
        has_spikes = any('spike' in h.lower() or 'thorn' in h.lower() for h in hints_a + hints_b)
        has_mist = any('mist' in h.lower() or 'shadow' in h.lower() for h in hints_a + hints_b)
        has_flames = any('flame' in h.lower() or 'fire' in h.lower() for h in hints_a + hints_b)
        has_ice = any('ice' in h.lower() or 'frost' in h.lower() or 'crystal' in h.lower() for h in hints_a + hints_b)
        
        # Generate SVG with detailed monster
        svg = f'''<svg width="{width}" height="{height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <!-- Gradients -->
                <radialGradient id="bgGrad{seed}">
                    <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#0f0f1e;stop-opacity:1" />
                </radialGradient>
                
                <linearGradient id="bodyGrad{seed}" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:{color_a};stop-opacity:1" />
                    <stop offset="100%" style="stop-color:{color_b};stop-opacity:1" />
                </linearGradient>
                
                <!-- Filters -->
                <filter id="glow{seed}">
                    <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                
                <filter id="softGlow{seed}">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            
            <!-- Dark background -->
            <rect width="{width}" height="{height}" fill="url(#bgGrad{seed})" />
            
            <!-- Atmospheric effects -->
            {'<circle cx="' + str(width*0.3) + '" cy="' + str(height*0.3) + '" r="' + str(width*0.2) + '" fill="' + color_a + '" opacity="0.15" filter="url(#glow' + str(seed) + ')"/>' if has_mist else ''}
            {'<circle cx="' + str(width*0.7) + '" cy="' + str(height*0.7) + '" r="' + str(width*0.2) + '" fill="' + color_b + '" opacity="0.15" filter="url(#glow' + str(seed) + ')"/>' if has_mist else ''}
            
            <!-- Monster Body -->
            <g transform="translate({width*0.5}, {height*0.55})">
                <!-- Main body (blob shape) -->
                <ellipse cx="0" cy="0" rx="{width*0.18}" ry="{height*0.25}" 
                         fill="url(#bodyGrad{seed})" stroke="{color_a}" stroke-width="3" 
                         filter="url(#softGlow{seed})" opacity="0.95"/>
                
                <!-- Head -->
                <ellipse cx="0" cy="{-height*0.28}" rx="{width*0.15}" ry="{height*0.15}" 
                         fill="url(#bodyGrad{seed})" stroke="{color_b}" stroke-width="3" 
                         filter="url(#softGlow{seed})"/>
                
                <!-- Eyes (large and expressive) -->
                <ellipse cx="{-width*0.06}" cy="{-height*0.3}" rx="{width*0.04}" ry="{height*0.05}" 
                         fill="white" opacity="0.95"/>
                <ellipse cx="{width*0.06}" cy="{-height*0.3}" rx="{width*0.04}" ry="{height*0.05}" 
                         fill="white" opacity="0.95"/>
                
                <!-- Pupils -->
                <circle cx="{-width*0.06}" cy="{-height*0.29}" r="{width*0.02}" fill="black"/>
                <circle cx="{width*0.06}" cy="{-height*0.29}" r="{width*0.02}" fill="black"/>
                
                <!-- Eye highlights -->
                <circle cx="{-width*0.055}" cy="{-height*0.305}" r="{width*0.008}" fill="white" opacity="0.8"/>
                <circle cx="{width*0.065}" cy="{-height*0.305}" r="{width*0.008}" fill="white" opacity="0.8"/>
                
                <!-- Mouth (cute but spooky) -->
                <path d="M {-width*0.05} {-height*0.24} Q 0 {-height*0.22} {width*0.05} {-height*0.24}" 
                      stroke="{color_b}" stroke-width="2" fill="none" opacity="0.8"/>
                
                <!-- Arms -->
                <ellipse cx="{-width*0.2}" cy="{-height*0.05}" rx="{width*0.06}" ry="{height*0.15}" 
                         fill="{color_a}" stroke="{color_b}" stroke-width="2" 
                         transform="rotate(-20 {-width*0.2} {-height*0.05})" opacity="0.9"/>
                <ellipse cx="{width*0.2}" cy="{-height*0.05}" rx="{width*0.06}" ry="{height*0.15}" 
                         fill="{color_b}" stroke="{color_a}" stroke-width="2" 
                         transform="rotate(20 {width*0.2} {-height*0.05})" opacity="0.9"/>
                
                <!-- Legs/Base -->
                <ellipse cx="{-width*0.08}" cy="{height*0.22}" rx="{width*0.07}" ry="{height*0.08}" 
                         fill="{color_a}" stroke="{color_b}" stroke-width="2" opacity="0.9"/>
                <ellipse cx="{width*0.08}" cy="{height*0.22}" rx="{width*0.07}" ry="{height*0.08}" 
                         fill="{color_b}" stroke="{color_a}" stroke-width="2" opacity="0.9"/>
                
                <!-- Wings (if applicable) -->
                {'<ellipse cx="' + str(-width*0.25) + '" cy="' + str(-height*0.15) + '" rx="' + str(width*0.12) + '" ry="' + str(height*0.2) + '" fill="' + color_a + '" opacity="0.4" transform="rotate(-30 ' + str(-width*0.25) + ' ' + str(-height*0.15) + ')"/>' if has_wings else ''}
                {'<ellipse cx="' + str(width*0.25) + '" cy="' + str(-height*0.15) + '" rx="' + str(width*0.12) + '" ry="' + str(height*0.2) + '" fill="' + color_b + '" opacity="0.4" transform="rotate(30 ' + str(width*0.25) + ' ' + str(-height*0.15) + ')"/>' if has_wings else ''}
                
                <!-- Spikes (if applicable) -->
                {'<polygon points="0,' + str(-height*0.42) + ' ' + str(-width*0.03) + ',' + str(-height*0.38) + ' ' + str(width*0.03) + ',' + str(-height*0.38) + '" fill="' + color_a + '" opacity="0.8"/>' if has_spikes else ''}
                {'<polygon points="' + str(-width*0.15) + ',' + str(-height*0.1) + ' ' + str(-width*0.18) + ',' + str(-height*0.05) + ' ' + str(-width*0.12) + ',' + str(-height*0.05) + '" fill="' + color_b + '" opacity="0.8"/>' if has_spikes else ''}
                {'<polygon points="' + str(width*0.15) + ',' + str(-height*0.1) + ' ' + str(width*0.18) + ',' + str(-height*0.05) + ' ' + str(width*0.12) + ',' + str(-height*0.05) + '" fill="' + color_a + '" opacity="0.8"/>' if has_spikes else ''}
                
                <!-- Glow aura (if applicable) -->
                {'<circle cx="0" cy="' + str(-height*0.15) + '" r="' + str(width*0.25) + '" fill="' + color_a + '" opacity="0.1" filter="url(#glow' + str(seed) + ')"/>' if has_glow else ''}
                
                <!-- Flame effects (if applicable) -->
                {'<ellipse cx="' + str(-width*0.1) + '" cy="' + str(-height*0.4) + '" rx="' + str(width*0.03) + '" ry="' + str(height*0.06) + '" fill="#FF6B35" opacity="0.7" filter="url(#softGlow' + str(seed) + ')"/>' if has_flames else ''}
                {'<ellipse cx="' + str(width*0.1) + '" cy="' + str(-height*0.4) + '" rx="' + str(width*0.03) + '" ry="' + str(height*0.06) + '" fill="#FF8C42" opacity="0.7" filter="url(#softGlow' + str(seed) + ')"/>' if has_flames else ''}
                
                <!-- Ice crystals (if applicable) -->
                {'<polygon points="' + str(-width*0.12) + ',' + str(-height*0.35) + ' ' + str(-width*0.1) + ',' + str(-height*0.32) + ' ' + str(-width*0.14) + ',' + str(-height*0.32) + '" fill="#A8E6FF" opacity="0.8"/>' if has_ice else ''}
                {'<polygon points="' + str(width*0.12) + ',' + str(-height*0.35) + ' ' + str(width*0.1) + ',' + str(-height*0.32) + ' ' + str(width*0.14) + ',' + str(-height*0.32) + '" fill="#E0F7FF" opacity="0.8"/>' if has_ice else ''}
            </g>
            
            <!-- Title -->
            <text x="50%" y="10%" text-anchor="middle" font-size="{width*0.06}" fill="white" 
                  font-family="Arial, sans-serif" font-weight="bold" filter="url(#softGlow{seed})">
                {portmanteau}
            </text>
            
            <!-- Species names -->
            <text x="50%" y="92%" text-anchor="middle" font-size="{width*0.035}" fill="rgba(255,255,255,0.8)" 
                  font-family="Arial, sans-serif">
                {name_a} + {name_b}
            </text>
            
            <!-- Seed info -->
            <text x="50%" y="96%" text-anchor="middle" font-size="{width*0.025}" fill="rgba(255,255,255,0.5)" 
                  font-family="Arial, sans-serif">
                Seed: {seed}
            </text>
        </svg>'''
        
        # Convert to base64 data URL
        svg_bytes = svg.encode('utf-8')
        svg_base64 = base64.b64encode(svg_bytes).decode('utf-8')
        return f'data:image/svg+xml;base64,{svg_base64}'

    def log_message(self, format, *args):
        """Custom log format"""
        pass  # Suppress default logging

def run_server(port=8001):
    """Run the API server"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, APIHandler)
    print(f'🚀 API Server running on http://localhost:{port}')
    print(f'📡 Endpoint: http://localhost:{port}/api/generate-stitched')
    print(f'🛑 Press Ctrl+C to stop')
    print()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n👋 Server stopped')

if __name__ == '__main__':
    run_server()
