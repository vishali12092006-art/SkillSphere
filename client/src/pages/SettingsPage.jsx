import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, BookOpen, Lightbulb, Save, Plus, Trash2, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { userService, skillService } from '../services/api';
import { SKILL_CATEGORIES, EXPERIENCE_LEVELS, AVAILABILITY_OPTIONS, getErrorMessage } from '../utils/helpers';

const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [city, setCity] = useState(user?.city || '');
  const [country, setCountry] = useState(user?.country || '');
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || 'Intermediate');
  const [availability, setAvailability] = useState(user?.availability || 'Flexible');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');

  // Skill state
  const [skillsTeach, setSkillsTeach] = useState(user?.skillsTeach || []);
  const [skillsLearn, setSkillsLearn] = useState(user?.skillsLearn || []);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState(SKILL_CATEGORIES[0]);
  const [newSkillType, setNewSkillType] = useState('teach');

  // Feedback states
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await userService.updateProfile({
        name,
        bio,
        city,
        country,
        experienceLevel,
        availability,
        avatar: avatarUrl,
      });

      updateUser(res.data.user);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await skillService.addSkill({
        name: newSkillName.trim(),
        category: newSkillCategory,
        type: newSkillType,
      });

      updateUser(res.data.user);
      if (newSkillType === 'teach') {
        setSkillsTeach(res.data.user.skillsTeach);
      } else {
        setSkillsLearn(res.data.user.skillsLearn);
      }

      setNewSkillName('');
      setSuccess(`Added "${newSkillName}" to your skills!`);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId, type) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await skillService.deleteSkill(skillId, type);
      updateUser(res.data.user);
      if (type === 'teach') {
        setSkillsTeach(res.data.user.skillsTeach);
      } else {
        setSkillsLearn(res.data.user.skillsLearn);
      }
      setSuccess('Skill removed.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await userService.uploadAvatar(formData);
      setAvatarUrl(res.data.avatarUrl);
      updateUser(res.data.user);
      setSuccess('Avatar image uploaded successfully!');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="page">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 className="text-2xl font-bold" style={{ marginBottom: '0.25rem' }}>Account Settings</h1>
            <p className="text-muted">Manage your personal profile, skills offered, and skill request preferences.</p>
          </div>

          {success && (
            <div className="alert alert-success" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
            {/* Sidebar Tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ justifyContent: 'flex-start', gap: '0.75rem', textAlign: 'left' }}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} /> Profile Information
              </button>

              <button
                className={`btn ${activeTab === 'skills' ? 'btn-primary' : 'btn-ghost'}`}
                style={{ justifyContent: 'flex-start', gap: '0.75rem', textAlign: 'left' }}
                onClick={() => setActiveTab('skills')}
              >
                <BookOpen size={18} /> Skills & Expertise
              </button>
            </div>

            {/* Content Area */}
            <div>
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSave} className="card" style={{ padding: '2rem' }}>
                  <h2 className="text-lg font-bold" style={{ marginBottom: '1.5rem' }}>Personal Profile</h2>

                  {/* Avatar upload */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <Avatar user={{ ...user, avatar: avatarUrl }} size="xl" />
                    <div>
                      <label className="btn btn-outline btn-sm" style={{ gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem', display: 'inline-flex' }}>
                        <Camera size={16} /> Change Picture
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} hidden />
                      </label>
                      <p className="text-xs text-muted">JPG, PNG or GIF up to 5MB.</p>
                    </div>
                  </div>

                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                  />

                  <div className="form-group">
                    <label className="form-label">Bio / Overview</label>
                    <textarea
                      className="form-input"
                      rows="4"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell the community about yourself, your background, and what skills you love sharing..."
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Input
                      label="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="San Francisco"
                    />
                    <Input
                      label="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="United States"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Experience Level</label>
                      <select
                        className="form-input"
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                      >
                        {EXPERIENCE_LEVELS.map((lvl) => (
                          <option key={lvl} value={lvl}>{lvl}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Availability</label>
                      <select
                        className="form-input"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                      >
                        {AVAILABILITY_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Button type="submit" loading={loading} icon={<Save size={16} />}>
                      Save Profile Changes
                    </Button>
                  </div>
                </form>
              )}

              {activeTab === 'skills' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Add New Skill Card */}
                  <form onSubmit={handleAddSkill} className="card" style={{ padding: '1.5rem' }}>
                    <h3 className="text-md font-bold" style={{ marginBottom: '1rem' }}>Add a New Skill</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <Input
                        placeholder="e.g. React.js, UI Design, Python"
                        value={newSkillName}
                        onChange={(e) => setNewSkillName(e.target.value)}
                        required
                      />
                      <div className="form-group">
                        <select
                          className="form-input"
                          value={newSkillCategory}
                          onChange={(e) => setNewSkillCategory(e.target.value)}
                        >
                          {SKILL_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <select
                          className="form-input"
                          value={newSkillType}
                          onChange={(e) => setNewSkillType(e.target.value)}
                        >
                          <option value="teach">Skill I Teach</option>
                          <option value="learn">Skill I Want</option>
                        </select>
                      </div>
                    </div>
                    <Button type="submit" loading={loading} icon={<Plus size={16} />} size="sm">
                      Add Skill
                    </Button>
                  </form>

                  {/* Skills Offering */}
                  <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 className="text-md font-bold" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BookOpen size={18} color="var(--color-primary)" /> Skills You Can Teach ({skillsTeach.length})
                    </h3>
                    {skillsTeach.length === 0 ? (
                      <p className="text-muted text-sm">No skills added yet. Add your expertise above!</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {skillsTeach.map((sk) => (
                          <div key={sk._id || sk.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                            <div>
                              <span className="font-semibold text-sm">{sk.name}</span>
                              <Badge variant="primary" style={{ marginLeft: '0.5rem' }}>{sk.category}</Badge>
                            </div>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              style={{ color: 'var(--color-danger)' }}
                              onClick={() => handleDeleteSkill(sk._id, 'teach')}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Skills Learning */}
                  <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 className="text-md font-bold" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Lightbulb size={18} color="var(--color-secondary)" /> Skills You Want to Learn ({skillsLearn.length})
                    </h3>
                    {skillsLearn.length === 0 ? (
                      <p className="text-muted text-sm">No learning goals added yet.</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {skillsLearn.map((sk) => (
                          <div key={sk._id || sk.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: 'var(--color-bg-secondary)', borderRadius: '8px' }}>
                            <div>
                              <span className="font-semibold text-sm">{sk.name}</span>
                              <Badge variant="secondary" style={{ marginLeft: '0.5rem' }}>{sk.category}</Badge>
                            </div>
                            <button
                              type="button"
                              className="btn btn-ghost btn-sm"
                              style={{ color: 'var(--color-danger)' }}
                              onClick={() => handleDeleteSkill(sk._id, 'learn')}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
