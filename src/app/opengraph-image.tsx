import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs';
export const alt = 'PNT Academy';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
    const logoData = readFileSync(join(process.cwd(), 'public', 'logo.png'));
    const logoBase64 = `data:image/png;base64,${logoData.toString('base64')}`;

    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #020617, #0f172a, #1e1b4b)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <img src={logoBase64} height={160} style={{ marginBottom: 40 }} />
                <div style={{ fontSize: 60, fontWeight: 700, color: 'white', letterSpacing: '-0.02em', marginBottom: 16 }}>
                    Shape the Future of Robotics
                </div>
                <div style={{ fontSize: 32, fontWeight: 500, color: '#94a3b8' }}>
                    Explore Hands-On STEM & AI Programs Today
                </div>
            </div>
        ),
        { ...size }
    );
}
