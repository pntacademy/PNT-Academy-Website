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
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <img src={logoBase64} height={180} />
            </div>
        ),
        { ...size }
    );
}
