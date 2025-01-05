'use client';

import { useEffect, useState, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Settings, Wallet, Shield, Zap } from 'lucide-react';
import { useWallet } from '../providers/WalletProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { userService, UserProfile } from '../lib/services/user.service';
import ClientOnly from './ClientOnly';

export default function ProfileSettings() {
  const { publicKey, connect, isConnected } = useWallet();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      if (!publicKey) return;
      try {
        const userProfile = await userService.getOrCreateProfile(publicKey.toString());
        setProfile(userProfile);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [publicKey]);

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!publicKey || !profile) return;
    try {
      const updatedProfile = await userService.updateProfile(publicKey.toString(), updates);
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!publicKey) {
    return (
      <ClientOnly>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center min-h-[60vh] max-w-xl mx-auto text-center p-6"
        >
          <Settings className="w-24 h-24 mb-8 text-primary animate-pulse" />
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Connect Your Wallet
          </h1>
          <p className="text-lg text-gray-400 mb-8">
            Connect your Phantom wallet to access your profile settings and start tracking your progress
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-card p-6 rounded-lg shadow-lg"
            >
              <Wallet className="w-8 h-8 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Secure Profile</h3>
              <p className="text-sm text-gray-400">Your profile is securely linked to your wallet</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-card p-6 rounded-lg shadow-lg"
            >
              <Shield className="w-8 h-8 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Privacy Control</h3>
              <p className="text-sm text-gray-400">Full control over your profile visibility</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-card p-6 rounded-lg shadow-lg"
            >
              <Zap className="w-8 h-8 mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Track Progress</h3>
              <p className="text-sm text-gray-400">Monitor your learning and trading journey</p>
            </motion.div>
          </div>
          <Button
            size="lg"
            onClick={() => connect()}
            className="bg-primary hover:bg-primary/90 text-white px-8"
          >
            Connect Wallet
          </Button>
        </motion.div>
      </ClientOnly>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Settings className="w-12 h-12 mb-4 text-gray-400" />
        <h3 className="text-xl font-semibold mb-2">Profile Not Found</h3>
        <p className="text-gray-500">There was an error loading your profile</p>
      </div>
    );
  }

  return (
    <ClientOnly>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-8 max-w-2xl mx-auto p-6"
      >
        {/* Profile Information */}
        <div className="bg-card rounded-lg p-6 shadow-lg space-y-6">
          <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profile.username || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleUpdateProfile({ username: e.target.value })}
                placeholder="Enter your username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={profile.avatar || ''}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleUpdateProfile({ avatar: e.target.value })}
                placeholder="Enter avatar URL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio || ''}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleUpdateProfile({ bio: e.target.value })}
                placeholder="Tell us about yourself"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-card rounded-lg p-6 shadow-lg space-y-6">
          <h3 className="text-xl font-semibold mb-4">Settings</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifications</Label>
                <p className="text-sm text-gray-500">Receive updates about your progress</p>
              </div>
              <Switch
                id="notifications"
                checked={profile.settings.notifications}
                onCheckedChange={(checked) =>
                  handleUpdateProfile({
                    settings: { ...profile.settings, notifications: checked }
                  })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="theme">Theme</Label>
                <p className="text-sm text-gray-500">Choose your preferred theme</p>
              </div>
              <div className="space-x-2">
                <Button
                  variant={profile.settings.theme === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    handleUpdateProfile({
                      settings: { ...profile.settings, theme: 'light' }
                    })
                  }
                >
                  Light
                </Button>
                <Button
                  variant={profile.settings.theme === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() =>
                    handleUpdateProfile({
                      settings: { ...profile.settings, theme: 'dark' }
                    })
                  }
                >
                  Dark
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="language">Language</Label>
                <p className="text-sm text-gray-500">Select your preferred language</p>
              </div>
              <select
                id="language"
                value={profile.settings.language}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  handleUpdateProfile({
                    settings: { ...profile.settings, language: e.target.value }
                  })
                }
                className="bg-background border border-input rounded-md px-3 py-1"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>
    </ClientOnly>
  );
} 