import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '@aws-amplify/auth';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    image: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const currentUser = await getCurrentUser();
        const name = currentUser?.signInDetails?.loginId?.split('@')[0] || 'User';
        const email = currentUser?.signInDetails?.loginId || 'unknown@example.com';

        const stored = JSON.parse(localStorage.getItem('userProfile')) || {};
        setUser({
          name: stored.name || name,
          email: email,
          image: stored.image || ''
        });
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    })();
  }, []);

  const handleSave = () => {
    const updated = { ...user, image: newImage || user.image };
    setUser(updated);
    localStorage.setItem('userProfile', JSON.stringify(updated));
    setEditMode(false);
    alert('✅ Profile updated!');
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">👤 My Profile</h2>

      <div className="card shadow-sm p-4 bg-light">
        <div className="text-center mb-4">
          <img
            src={user.image || '/placeholder-profile.png'}
            alt="Profile"
            className="rounded-circle"
            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
          />
          {editMode && (
            <input
              type="text"
              className="form-control mt-2"
              placeholder="Enter Image URL"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
            />
          )}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Name</label>
          {editMode ? (
            <input
              type="text"
              className="form-control"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          ) : (
            <div className="form-control-plaintext">{user.name}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email</label>
          <div className="form-control-plaintext">{user.email}</div>
        </div>

        <div className="d-flex gap-2">
          {editMode ? (
            <>
              <button className="btn btn-primary" onClick={handleSave}>💾 Save</button>
              <button className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
            </>
          ) : (
            <button className="btn btn-outline-primary" onClick={() => setEditMode(true)}>
              ✏️ Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
