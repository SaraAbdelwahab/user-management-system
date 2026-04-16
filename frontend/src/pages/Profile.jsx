import { useState } from 'react';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import useAuthStore from '../store/authStore';
import userService from '../services/userService';
import { format } from 'date-fns';

const Profile = () => {
  const { user, fetchProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required';
      }
      if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters';
      }
      if (formData.newPassword !== formData.confirmNewPassword) {
        newErrors.confirmNewPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const updateData = {
        fullName: formData.fullName,
      };
      
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      await userService.updateProfile(updateData);
      await fetchProfile();
      
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <Card className="lg:col-span-1">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
              <span className="text-white text-3xl font-medium">
                {user?.fullName?.charAt(0) || 'U'}
              </span>
            </div>
            <h2 className="mt-4 text-xl font-semibold text-gray-900">{user?.fullName}</h2>
            <p className="text-gray-600">{user?.email}</p>
            
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Shield className="w-4 h-4 mr-2" />
                {user?.isAdmin ? 'Administrator' : 'User'}
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                Joined {user?.createdAt && format(new Date(user.createdAt), 'MMMM yyyy')}
              </div>
            </div>
          </div>
        </Card>

        {/* Edit Form Card */}
        <Card className="lg:col-span-2">
          {!isEditing ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit Profile
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium text-gray-900">{user?.fullName}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium text-gray-900">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Edit Profile</h3>
              
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
                
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium text-gray-900 mb-4">Change Password</h4>
                  
                  <Input
                    label="Current Password"
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    error={errors.currentPassword}
                  />
                  
                  <Input
                    label="New Password"
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    error={errors.newPassword}
                  />
                  
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={formData.confirmNewPassword}
                    onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
                    error={errors.confirmNewPassword}
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <Button 
                  variant="secondary" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={loading}>
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;