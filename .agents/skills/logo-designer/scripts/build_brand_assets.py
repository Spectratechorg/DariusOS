"""
DariusOS Brand Asset Generator & Exporter
Builds the refined Concept 2 brand mark, vector wordmarks, outlines,
PNG exports across all resolutions (16 to 1024), and multi-size favicon.ico.
"""

import os
import fitz  # PyMuPDF
from PIL import Image
import matplotlib.path as mpath
from matplotlib.textpath import TextPath
from matplotlib.font_manager import FontProperties

ASSETS_DIR = r"c:\Users\USER\Downloads\dariusos\assets\logo"
PNG_DIR = os.path.join(ASSETS_DIR, "png")
os.makedirs(PNG_DIR, exist_ok=True)

# -------------------------------------------------------------
# 1. TEXT TO SVG PATH CONVERSION (Outlines with zero font deps)
# -------------------------------------------------------------
def text_to_svg_path(text, size=36, font_family='Segoe UI', weight='bold', letter_spacing=0):
    fp = FontProperties(family=font_family, weight=weight)
    tp = TextPath((0, 0), text, size=size, prop=fp)
    d = []
    verts = tp.vertices
    codes = tp.codes
    i = 0
    while i < len(codes):
        code = codes[i]
        if code == mpath.Path.MOVETO:
            d.append(f"M {verts[i][0]:.2f} {-verts[i][1]:.2f}")
            i += 1
        elif code == mpath.Path.LINETO:
            d.append(f"L {verts[i][0]:.2f} {-verts[i][1]:.2f}")
            i += 1
        elif code == mpath.Path.CURVE3:
            d.append(f"Q {verts[i][0]:.2f} {-verts[i][1]:.2f}, {verts[i+1][0]:.2f} {-verts[i+1][1]:.2f}")
            i += 2
        elif code == mpath.Path.CURVE4:
            d.append(f"C {verts[i][0]:.2f} {-verts[i][1]:.2f}, {verts[i+1][0]:.2f} {-verts[i+1][1]:.2f}, {verts[i+2][0]:.2f} {-verts[i+2][1]:.2f}")
            i += 3
        elif code == mpath.Path.CLOSEPOLY:
            d.append("Z")
            i += 1
        else:
            i += 1
    
    # Get bounding box for positioning
    xs = [v[0] for v in verts]
    ys = [-v[1] for v in verts]
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)
    return " ".join(d), min_x, max_x, min_y, max_y

darius_path, d_x1, d_x2, d_y1, d_y2 = text_to_svg_path("DARIUS", size=32, weight='bold')
os_path, os_x1, os_x2, os_y1, os_y2 = text_to_svg_path("OS", size=32, weight='bold')
subtitle_path, sub_x1, sub_x2, sub_y1, sub_y2 = text_to_svg_path("ROAD DESIGN SYSTEM", size=10.5, weight='bold')

# -------------------------------------------------------------
# 2. DEFINE ALL SVG ASSETS
# -------------------------------------------------------------

# Primary Mark (Clean, standalone vector)
MARK_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <!-- DariusOS Primary Brand Mark -->
  <!-- Survey Elevation Datum Rod (Stem) -->
  <rect x="18" y="16" width="14" height="68" rx="4" fill="#0F172A"/>
  <!-- Datum Elevation Ticks -->
  <line x1="18" y1="33" x2="25" y2="33" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="18" y1="50" x2="27" y2="50" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="18" y1="67" x2="25" y2="67" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
  
  <!-- Engineered Road Alignment Loop (Bowl) -->
  <path d="M 32 24 C 64 24 82 34 82 50 C 82 66 64 76 32 76" 
        stroke="#2563EB" stroke-width="12" stroke-linecap="round"/>
  
  <!-- Centerline Negative Space Corridor -->
  <path d="M 36 36 C 54 36 66 42 66 50 C 66 58 54 64 36 64" 
        stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-dasharray="5 4" opacity="0.95"/>
</svg>'''

# White Mark (for dark backgrounds)
LOGO_WHITE_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <!-- DariusOS Brand Mark (White Variant / Dark UI) -->
  <rect x="18" y="16" width="14" height="68" rx="4" fill="#FFFFFF"/>
  <line x1="18" y1="33" x2="25" y2="33" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="18" y1="50" x2="27" y2="50" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="18" y1="67" x2="25" y2="67" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M 32 24 C 64 24 82 34 82 50 C 82 66 64 76 32 76" 
        stroke="#38BDF8" stroke-width="12" stroke-linecap="round"/>
  <path d="M 36 36 C 54 36 66 42 66 50 C 66 58 54 64 36 64" 
        stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-dasharray="5 4" opacity="0.95"/>
</svg>'''

# Black Mark (for CAD drawings, A3 title blocks, monochrome print)
LOGO_BLACK_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <!-- DariusOS Brand Mark (Monochrome Black / CAD Title Block Print) -->
  <rect x="18" y="16" width="14" height="68" rx="4" fill="#000000"/>
  <line x1="18" y1="33" x2="25" y2="33" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="18" y1="50" x2="27" y2="50" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="18" y1="67" x2="25" y2="67" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M 32 24 C 64 24 82 34 82 50 C 82 66 64 76 32 76" 
        stroke="#000000" stroke-width="12" stroke-linecap="round"/>
  <path d="M 36 36 C 54 36 66 42 66 50 C 66 58 54 64 36 64" 
        stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-dasharray="5 4"/>
</svg>'''

# Standalone Square Icon (512x512)
LOGO_ICON_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!-- DariusOS Standalone Square Icon (512x512) -->
  <rect width="512" height="512" rx="112" fill="#0F172A"/>
  <!-- Scaled Mark Centered in 512 Canvas -->
  <g transform="translate(106, 106) scale(3.0)">
    <!-- Elevation Datum Rod -->
    <rect x="18" y="16" width="14" height="68" rx="4" fill="#FFFFFF"/>
    <line x1="18" y1="33" x2="25" y2="33" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="18" y1="50" x2="27" y2="50" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="18" y1="67" x2="25" y2="67" stroke="#0F172A" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Alignment Loop -->
    <path d="M 32 24 C 64 24 82 34 82 50 C 82 66 64 76 32 76" 
          stroke="#38BDF8" stroke-width="12" stroke-linecap="round"/>
    <path d="M 36 36 C 54 36 66 42 66 50 C 66 58 54 64 36 64" 
          stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-dasharray="5 4" opacity="0.95"/>
  </g>
</svg>'''

# Favicon SVG (Super crisp at 16x16 & 32x32)
FAVICON_SVG = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <!-- DariusOS Favicon Optimized for 16x16 / 32x32 -->
  <rect width="32" height="32" rx="7" fill="#0F172A"/>
  <!-- Vertical Survey Datum -->
  <rect x="6" y="5" width="4.5" height="22" rx="1.5" fill="#FFFFFF"/>
  <line x1="6" y1="16" x2="8.5" y2="16" stroke="#0F172A" stroke-width="1.2" stroke-linecap="round"/>
  <!-- Banked Alignment Curve -->
  <path d="M 10.5 7.5 C 20.5 7.5 25.5 11 25.5 16 C 25.5 21 20.5 24.5 10.5 24.5" 
        stroke="#38BDF8" stroke-width="4.2" stroke-linecap="round"/>
  <!-- Centerline Cutout -->
  <path d="M 11.5 11.5 C 16.5 11.5 19.5 13.5 19.5 16 C 19.5 18.5 16.5 20.5 11.5 20.5" 
        stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/>
</svg>'''

# Wordmark Only (Outlined Vectors)
WORDMARK_SVG = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60" fill="none">
  <!-- DariusOS Vector Wordmark (Outlines) -->
  <g id="wordmark-title" fill="#0F172A">
    <!-- DARIUS -->
    <path d="{darius_path}" transform="translate(10, 36)"/>
    <!-- OS -->
    <path d="{os_path}" transform="translate(138, 36)" fill="#2563EB"/>
  </g>
  <g id="wordmark-subtitle" fill="#64748B">
    <path d="{subtitle_path}" transform="translate(11, 52)"/>
  </g>
</svg>'''

# Full Combination Mark (Mark + Wordmark)
LOGO_FULL_SVG = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 100" fill="none">
  <!-- DariusOS Full Combination Mark -->
  <!-- Mark (Left) -->
  <g id="logo-mark" transform="translate(4, 0)">
    <rect x="18" y="16" width="14" height="68" rx="4" fill="#0F172A"/>
    <line x1="18" y1="33" x2="25" y2="33" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="18" y1="50" x2="27" y2="50" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="18" y1="67" x2="25" y2="67" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M 32 24 C 64 24 82 34 82 50 C 82 66 64 76 32 76" 
          stroke="#2563EB" stroke-width="12" stroke-linecap="round"/>
    <path d="M 36 36 C 54 36 66 42 66 50 C 66 58 54 64 36 64" 
          stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-dasharray="5 4" opacity="0.95"/>
  </g>
  
  <!-- Wordmark (Right) -->
  <g id="logo-wordmark" transform="translate(98, 8)">
    <g fill="#0F172A">
      <path d="{darius_path}" transform="translate(10, 44)"/>
      <path d="{os_path}" transform="translate(138, 44)" fill="#2563EB"/>
    </g>
    <g fill="#64748B">
      <path d="{subtitle_path}" transform="translate(11, 62)"/>
    </g>
  </g>
</svg>'''

# -------------------------------------------------------------
# 3. WRITE ALL SVG FILES
# -------------------------------------------------------------
files_to_write = {
    "mark.svg": MARK_SVG,
    "logo-white.svg": LOGO_WHITE_SVG,
    "logo-black.svg": LOGO_BLACK_SVG,
    "logo-icon.svg": LOGO_ICON_SVG,
    "favicon.svg": FAVICON_SVG,
    "wordmark.svg": WORDMARK_SVG,
    "logo-full.svg": LOGO_FULL_SVG,
}

for filename, content in files_to_write.items():
    filepath = os.path.join(ASSETS_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Wrote SVG: {filepath}")

# -------------------------------------------------------------
# 4. RENDER PNGS AT SPECIFIED RESOLUTIONS
# SIZES: 16, 32, 48, 64, 128, 180, 192, 512, 1024
# -------------------------------------------------------------
PNG_SIZES = [16, 32, 48, 64, 128, 180, 192, 512, 1024]

# Choose source for square exports (favicon for 16 & 32, mark for larger, or icon)
def export_png_set(svg_path, prefix, sizes):
    doc = fitz.open(svg_path)
    page = doc.load_page(0)
    rect = page.rect
    w, h = rect.width, rect.height
    
    for size in sizes:
        scale = size / max(w, h)
        mat = fitz.Matrix(scale, scale)
        pix = page.get_pixmap(matrix=mat, alpha=True)
        out_name = f"{prefix}-{size}.png" if prefix else f"logo-{size}.png"
        out_path = os.path.join(PNG_DIR, out_name)
        pix.save(out_path)
        print(f"  Rendered PNG: {out_name} ({pix.width}x{pix.height})")

print("\nRendering mark PNGs:")
export_png_set(os.path.join(ASSETS_DIR, "mark.svg"), "mark", PNG_SIZES)

print("\nRendering icon PNGs:")
export_png_set(os.path.join(ASSETS_DIR, "logo-icon.svg"), "logo", PNG_SIZES)

# -------------------------------------------------------------
# 5. GENERATE FAVICON.ICO (Multi-resolution 16, 32, 48)
# -------------------------------------------------------------
doc_fav = fitz.open(os.path.join(ASSETS_DIR, "favicon.svg"))
page_fav = doc_fav.load_page(0)

ico_images = []
for s in [16, 32, 48]:
    scale = s / max(page_fav.rect.width, page_fav.rect.height)
    pix = page_fav.get_pixmap(matrix=fitz.Matrix(scale, scale), alpha=True)
    img = Image.frombytes("RGBA", [pix.width, pix.height], pix.samples)
    ico_images.append(img)

ico_path = os.path.join(ASSETS_DIR, "favicon.ico")
ico_images[0].save(
    ico_path,
    format="ICO",
    sizes=[(16, 16), (32, 32), (48, 48)],
    append_images=ico_images[1:]
)
print(f"\nWrote multi-res ICO: {ico_path}")

print("\nAll brand assets successfully generated!")
