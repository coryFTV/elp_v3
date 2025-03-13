'use client';

import { useEffect, useState } from 'react';
import { usePartnerSettings } from '@/contexts/PartnerSettingsContext';
import { Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function PartnerSettingsForm() {
  const { settings, saveSettings, isLoading } = usePartnerSettings();
  const { showToast } = useToast();
  const [formState, setFormState] = useState({
    partnerId: '',
    defaultCampaign: '',
    trackingDomain: '',
  });
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | 'idle';
    message: string;
  }>({
    type: 'idle',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load settings from context when available
  useEffect(() => {
    if (settings) {
      setFormState({
        partnerId: settings.partnerId || '',
        defaultCampaign: settings.defaultCampaign || '',
        trackingDomain: settings.trackingDomain || '',
      });
    }
  }, [settings]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.partnerId.trim()) {
      newErrors.partnerId = 'Partner ID is required';
    }
    
    if (formState.trackingDomain && !/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(formState.trackingDomain)) {
      newErrors.trackingDomain = 'Please enter a valid domain';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field as user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setFormStatus({ type: 'idle', message: '' });
    
    try {
      await saveSettings(formState);
      setFormStatus({
        type: 'success',
        message: 'Settings saved successfully!'
      });
      
      // Show toast notification
      showToast({
        title: 'Settings saved',
        description: 'Your partner settings have been updated successfully.',
        variant: 'success',
      });
      
    } catch (error) {
      console.error('Failed to save settings:', error);
      setFormStatus({
        type: 'error',
        message: 'Failed to save settings. Please try again.'
      });
      
      // Show error toast
      showToast({
        title: 'Error saving settings',
        description: 'There was a problem saving your settings. Please try again.',
        variant: 'error',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-testid="partner-settings-form">
      <div className="bg-white shadow-sm rounded-lg p-6 space-y-6">
        {/* Partner ID Field */}
        <div>
          <label htmlFor="partnerId" className="block text-sm font-medium text-gray-700">
            Partner ID <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="partnerId"
              name="partnerId"
              required
              value={formState.partnerId}
              onChange={handleChange}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.partnerId ? 'border-red-300' : ''
              }`}
              aria-describedby={errors.partnerId ? 'partnerId-error' : undefined}
              data-testid="partner-id-input"
            />
            {errors.partnerId && (
              <p className="mt-2 text-sm text-red-600" id="partnerId-error">
                {errors.partnerId}
              </p>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Your unique partner identifier provided by Fubo.
          </p>
        </div>

        {/* Default Campaign Field */}
        <div>
          <label htmlFor="defaultCampaign" className="block text-sm font-medium text-gray-700">
            Default Campaign
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="defaultCampaign"
              name="defaultCampaign"
              value={formState.defaultCampaign}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              data-testid="default-campaign-input"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            This campaign will be used if none is specified when generating links.
          </p>
        </div>

        {/* Tracking Domain Field */}
        <div>
          <label htmlFor="trackingDomain" className="block text-sm font-medium text-gray-700">
            Custom Tracking Domain
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="trackingDomain"
              name="trackingDomain"
              value={formState.trackingDomain}
              onChange={handleChange}
              className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.trackingDomain ? 'border-red-300' : ''
              }`}
              aria-describedby={errors.trackingDomain ? 'trackingDomain-error' : undefined}
              placeholder="e.g., go.yourdomain.com"
              data-testid="tracking-domain-input"
            />
            {errors.trackingDomain && (
              <p className="mt-2 text-sm text-red-600" id="trackingDomain-error">
                {errors.trackingDomain}
              </p>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Optional: your branded domain for tracking links.
          </p>
        </div>
      </div>

      {/* Status message */}
      {formStatus.message && (
        <div
          className={`rounded-md p-4 ${
            formStatus.type === 'success' ? 'bg-green-50' : 'bg-red-50'
          }`}
          data-testid="form-status"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              {formStatus.type === 'success' ? (
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${
                  formStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {formStatus.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="save-settings-button"
        >
          {isLoading ? (
            <>
              <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            <>
              <Save className="-ml-1 mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </form>
  );
} 