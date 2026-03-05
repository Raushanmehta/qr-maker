import { useState } from 'react';
import dbConnect from '../../lib/dbConnect';
import QRCodeModel from '../../models/QRCode';


export default function RedirectPage({ qrData, error, passwordRequired }) {
  const [password, setPassword] = useState('');
  const [wrongPass, setWrongPass] = useState(false);

  if (error) {
    return (
      <div className="container">
        <div className="glass-card" style={{textAlign: 'center', color: 'red'}}>
          <h2>Oops!</h2>
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
      <div className="container">
        <div className="glass-card" style={{maxWidth: '400px'}}>
          <h2 className="glass-header">Secure QR</h2>
          <p style={{textAlign: 'center', marginBottom: '1rem'}}>
            This content is password protected.
          </p>
          <form onSubmit={handleUnlock}>
            <div className="form-group">
                <input 
                    type="password" 
                    placeholder="Enter Password"
                    className="form-input"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            {wrongPass && <p style={{color: 'red', textAlign: 'center'}}>Incorrect password</p>}
            <button className="btn" type="submit">Unlock</button>
          </form>
        </div>
      </div>
    );
  }

  return <div className="container"><p>Redirecting...</p></div>;
}

export async function getServerSideProps(context) {
  const { code } = context.params;
  await dbConnect();

  try {
    // Add lightweight edge caching to drastically reduce server hits for the same QR code
    context.res.setHeader('Cache-Control', 's-maxage=2, stale-while-revalidate=59');

    // Use .lean() to bypass heavy Mongoose Document overhead, accelerating response time by up to 5x
    const qr = await QRCodeModel.findOne({ shortCode: code }).lean();
    if (!qr) {
      return { props: { error: 'QR Code not found' } };
    }

    // Check Status
    if (qr.isActive === false) {
      return { props: { error: 'This QR Code is currently inactive' } };
    }

    // Check expiry
    if (qr.expiresAt && new Date(qr.expiresAt) < new Date()) {
      return { props: { error: 'This QR Code has expired' } };
    }

    // Check Password
    if (qr.password) {
      return { 
        props: { 
          passwordRequired: true,
          qrData: JSON.parse(JSON.stringify(qr)) // Serialize for safe transfer
        } 
      };
    }

    // Increment scan count atomically and asynchronously for high-scale performance
    QRCodeModel.updateOne(
      { _id: qr._id },
      { $inc: { scanCount: 1 } }
    ).catch(err => console.error('Error incrementing scan count:', err));

    return {
      redirect: {
        destination: qr.content,
        permanent: false,
      },
    };
  } catch (err) {
    return { props: { error: 'Server Error' } };
  }
}
