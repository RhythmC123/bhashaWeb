import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Save, RefreshCw, Bell, Shield, Palette, Database } from 'lucide-react';
import supabase from '@/lib/supabaseClient';

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'Bhasha',
    siteDescription: 'Learn Indian Languages',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    theme: 'dark',
    maxFileSize: '10',
    backupFrequency: 'daily',
    adminEmail: 'bhashaAdmin@bhashagroup.com',
    supportEmail: 'support@bhasha.com',
    analyticsEnabled: true,
    debugMode: false
  });

  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Load settings from localStorage or database
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('adminSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save to localStorage for now (can be extended to save to database)
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setSettings({
        siteName: 'Bhasha',
        siteDescription: 'Learn Indian Languages',
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true,
        theme: 'dark',
        maxFileSize: '10',
        backupFrequency: 'daily',
        adminEmail: 'bhashaAdmin@bhashagroup.com',
        supportEmail: 'support@bhasha.com',
        analyticsEnabled: true,
        debugMode: false
      });
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="text-orange-500" size={32} />
        <h1 className="text-3xl font-bold text-white">Admin Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="bg-[#1a1a1a] border-gray-700">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Palette className="text-orange-400" size={20} />
              General Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Site Name</Label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Site Description</Label>
                <Textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleChange('siteDescription', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Theme</Label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleChange('theme', e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card className="bg-[#1a1a1a] border-gray-700">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="text-green-400" size={20} />
              System Settings
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Maintenance Mode</Label>
                  <p className="text-sm text-gray-400">Temporarily disable public access</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleChange('maintenanceMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Allow Registration</Label>
                  <p className="text-sm text-gray-400">Allow new user registrations</p>
                </div>
                <Switch
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked) => handleChange('allowRegistration', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Debug Mode</Label>
                  <p className="text-sm text-gray-400">Enable debug logging</p>
                </div>
                <Switch
                  checked={settings.debugMode}
                  onCheckedChange={(checked) => handleChange('debugMode', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-[#1a1a1a] border-gray-700">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Bell className="text-yellow-400" size={20} />
              Notifications
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Email Notifications</Label>
                  <p className="text-sm text-gray-400">Send email alerts</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleChange('emailNotifications', checked)}
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Admin Email</Label>
                <Input
                  value={settings.adminEmail}
                  onChange={(e) => handleChange('adminEmail', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  type="email"
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Support Email</Label>
                <Input
                  value={settings.supportEmail}
                  onChange={(e) => handleChange('supportEmail', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  type="email"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Settings */}
        <Card className="bg-[#1a1a1a] border-gray-700">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="text-purple-400" size={20} />
              Data & Storage
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Max File Size (MB)</Label>
                <Input
                  value={settings.maxFileSize}
                  onChange={(e) => handleChange('maxFileSize', e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                  type="number"
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Backup Frequency</Label>
                <select
                  value={settings.backupFrequency}
                  onChange={(e) => handleChange('backupFrequency', e.target.value)}
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-gray-300">Analytics</Label>
                  <p className="text-sm text-gray-400">Track user analytics</p>
                </div>
                <Switch
                  checked={settings.analyticsEnabled}
                  onCheckedChange={(checked) => handleChange('analyticsEnabled', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8 justify-end">
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <RefreshCw size={16} className="mr-2" />
          Reset to Default
        </Button>
        
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : saved ? (
            <>
              <Save size={16} className="mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save size={16} className="mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {/* Status Message */}
      {saved && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 text-sm">
          ✅ Settings saved successfully!
        </div>
      )}
    </div>
  );
}
