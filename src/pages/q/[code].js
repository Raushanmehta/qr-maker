import { useState } from 'react';
import dbConnect from '../../lib/dbConnect';
import QRCodeModel from '../../models/QRCode';
import ScanModel from '../../models/Scan';

export default function RedirectPage({ qrData, error, passwordRequired }) {
  const [password, setPassword] = useState('');
  const [wrongPass, setWrongPass] = useState(false);

  if (error) {
    return (
      <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{textAlign: 'center', color: '#ff4d4d', padding: '2rem', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'}}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Oops!</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (passwordRequired) {
    const handleUnlock = async (e) => {
      e.preventDefault();
      const res = await fetch(`/api/redirect_check`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ shortCode: qrData.shortCode, password })
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = data.url;
      } else {
        setWrongPass(true);
      }
    };

    return (
      <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-card" style={{maxWidth: '400px', width: '100%', padding: '2rem', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)'}}>
          <h2 className="glass-header" style={{ textAlign: 'center', color: 'white', marginBottom: '1.5rem' }}>Secure QR</h2>
          <p style={{textAlign: 'center', marginBottom: '1.5rem', color: '#ccc'}}>
            This content is password protected.
          </p>
          <form onSubmit={handleUnlock}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
                <input 
                    type="password" 
                    placeholder="Enter Password"
                    className="form-input"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            {wrongPass && <p style={{color: '#ff4d4d', textAlign: 'center', fontSize: '0.875rem', marginBottom: '1rem'}}>Incorrect password</p>}
            <button className="btn" type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: '30px', background: '#FF5722', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Unlock</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="loader" style={{ marginBottom: '1rem' }}></div>
        <p>Redirecting you safely...</p>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { code } = context.params;
  const { req } = context;
  await dbConnect();

  try {
    const qr = await QRCodeModel.findOne({ shortCode: code }).lean();
    if (!qr) {
      return { props: { error: 'QR Code not found' } };
    }

    if (qr.isActive === false) {
      return { props: { error: 'This QR Code is currently inactive' } };
    }

    if (qr.expiresAt && new Date(qr.expiresAt) < new Date()) {
      return { props: { error: 'This QR Code has expired' } };
    }

    // Capture scan details
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    
    // Basic device detection from user agent
    let device = 'Desktop';
    if (/Mobi|Android/i.test(userAgent)) device = 'Mobile';
    else if (/Tablet|iPad/i.test(userAgent)) device = 'Tablet';

    // Log the scan
    const scanPromise = ScanModel.create({
      qrId: qr._id,
      ip,
      userAgent,
      device,
      // City/Country could be added with a geo-ip library in a real app
    });

    // Increment scan count atomically
    const updatePromise = QRCodeModel.updateOne(
      { _id: qr._id },
      { $inc: { scanCount: 1 } }
    );

    // Wait for both but don't let them block for too long if you want extreme speed
    // However, for consistency we await them
    await Promise.all([scanPromise, updatePromise]);

    if (qr.password) {
      return { 
        props: { 
          passwordRequired: true,
          qrData: JSON.parse(JSON.stringify(qr))
        } 
      };
    }

    return {
      redirect: {
        destination: qr.content,
        permanent: false,
      },
    };
  } catch (err) {
    console.error('Redirection error:', err);
    return { props: { error: 'Server Error' } };
  }
}
