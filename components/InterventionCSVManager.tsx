import React, { useState, useRef } from 'react';

type InterventionRow = {
  'Intervention Type': string;
  'Description': string;
  'Focus': string;
  'Driver': string;
  'User Journey': string;
  'Scope': string;
  'Link': string;
  'Contact': string;
};

type UploadedData = {
  headers: string[];
  rows: InterventionRow[];
};

type ValidationResults = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  rowCount: number;
};
import { Download, Upload, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const InterventionCSVManager = () => {
  const [uploadedData, setUploadedData] = useState<UploadedData | null>(null);
  const [validationResults, setValidationResults] = useState<ValidationResults | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    'Intervention Type': '',
    'Description': '',
    'Focus': '',
    'Driver': '',
    'User Journey': '',
    'Scope': '',
    'Link': '',
    'Contact': '',
  });
  const fileInputRef = useRef(null);

  // Template CSV structure based on your exact specifications
  const csvHeaders = [
    'Intervention Type',
    'Description', 
    'Focus',
    'Driver',
    'User Journey',
    'Scope',
    'Link',
    'Contact',
  ];

  // Valid values for categorical columns
  const validValues = {
    'Focus': ['Behavioral', 'Content', 'Visibility'],
    'Driver': ['Platform-Driven', 'User-Driven'],
    'User Journey': ['Proactive', 'Retroactive'],
    'Scope': ['Systemic', 'Targeted']
  };

  // Generate template CSV
  const generateTemplateCSV = () => {
    const headers = csvHeaders.join(',');
    const exampleRow = [
      'Content Moderation',
      'Automated detection and removal of harmful content',
      'Content',
      'Platform-Driven',
      'Proactive',
      'Systemic',
      'https://example-platform.com/content-policy',
      'your@email.com'
    ].map(cell => `"${cell}"`).join(',');
    
    return `${headers}\n${exampleRow}`;
  };

  // Download template CSV
  const downloadTemplate = () => {
    const csvContent = generateTemplateCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'intervention_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Parse CSV content
  const parseCSV = (csvText: string) => {
  const lines = csvText.split('\n').filter((line: string) => line.trim());
    if (lines.length < 2) return null;

  const headers = lines[0].split(',').map((h: string) => h.replace(/"/g, '').trim());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
  const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let j = 0; j < lines[i].length; j++) {
        const char = lines[i][j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      if (values.length === headers.length) {
        const row = {};
  headers.forEach((header: string, index: number) => {
          (row as Record<string, string>)[header] = values[index].replace(/"/g, '');
        });
        rows.push(row);
      }
    }

    return { headers, rows };
  };

  // Validate CSV data
  const validateCSV = (data: { headers: string[]; rows: Record<string, string>[] }) => {
    const errors = [];
    const warnings = [];

    // Check headers
    const missingHeaders = csvHeaders.filter(h => !data.headers.includes(h));
  const extraHeaders = data.headers.filter((h: string) => !csvHeaders.includes(h));

    if (missingHeaders.length > 0) {
      errors.push(`Missing required columns: ${missingHeaders.join(', ')}`);
    }
    if (extraHeaders.length > 0) {
      warnings.push(`Extra columns detected: ${extraHeaders.join(', ')}`);
    }

    // Validate each row
  data.rows.forEach((row: Record<string, string>, index: number) => {
      const rowNum = index + 2; // +2 because index starts at 0 and we skip header

      // Check required fields (Link is optional)
      const requiredFields = ['Intervention Type', 'Description', 'Focus', 'Driver', 'User Journey', 'Scope'];
      requiredFields.forEach(field => {
        if (!row[field] || row[field].trim() === '') {
          errors.push(`Row ${rowNum}: Missing required field "${field}"`);
        }
      });

      // Validate URL format for Link field (if provided)
      if (row['Link'] && row['Link'].trim() !== '') {
        const urlPattern = /^https?:\/\/.+/;
        if (!urlPattern.test(row['Link'])) {
          warnings.push(`Row ${rowNum}: Link should be a valid URL starting with http:// or https://`);
        }
      }

      // Validate categorical fields
      Object.entries(validValues).forEach(([field, validOptions]) => {
        if (row[field] && !validOptions.includes(row[field])) {
          errors.push(`Row ${rowNum}: Invalid value for "${field}". Must be one of: ${validOptions.join(', ')}`);
        }
      });

      // Check description length
      if (row['Description'] && row['Description'].length < 10) {
        warnings.push(`Row ${rowNum}: Description seems very short`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      rowCount: data.rows.length
    };
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsValidating(true);
    setValidationResults(null);

    try {
      const text = await file.text();
      const parsedData = parseCSV(text);
      
      if (!parsedData) {
        setValidationResults({
          isValid: false,
          errors: ['Invalid CSV format or empty file'],
          warnings: [],
          rowCount: 0
        });
        setUploadedData(null);
      } else {
        const validation = validateCSV(parsedData);
  setValidationResults(validation as ValidationResults);
  setUploadedData(validation.isValid ? parsedData : null);
      }
    } catch (error) {
      setValidationResults({
  isValid: false,
  errors: [`Error reading file: ${(error as Error).message}`],
        warnings: [],
        rowCount: 0
      });
      setUploadedData(null);
    }

    setIsValidating(false);
  };

  // Reset upload
  const resetUpload = () => {
    setUploadedData(null);
    setValidationResults(null);
    if (fileInputRef.current) {
      if (fileInputRef.current) {
        (fileInputRef.current as HTMLInputElement).value = '';
      }
    }
  };

  // Handle form input changes
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Add intervention from form
  const addInterventionFromForm = () => {
    const newRow = { ...formData };
    
    if (!uploadedData) {
      setUploadedData({
  headers: csvHeaders,
        rows: [newRow]
      });
    } else {
      setUploadedData(prev => ({
  ...(prev || {}),
  rows: [...(prev?.rows || []), newRow]
      }));
    }

    // Reset form
    setFormData({
      'Intervention Type': '',
      'Description': '',
      'Focus': '',
      'Driver': '',
      'User Journey': '',
      'Scope': '',
      'Link': ''
    });
    setShowForm(false);

    // Validate the updated data
    const validation = validateCSV({
      headers: csvHeaders,
  rows: uploadedData ? [...(uploadedData.rows || []), newRow] : [newRow]
    });
  setValidationResults(validation as ValidationResults);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Intervention Contribution System
        </h1>
        <p className="text-gray-600">
          Contribute new interventions to our research database. Download the template, fill it out, and upload your contributions.
        </p>
      </div>

      {/* Template Download Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900 mb-3 flex items-center">
          <Download className="mr-2" size={20} />
          Step 1: Download Template
        </h2>
        <p className="text-blue-800 mb-4">
          Download the CSV template with the correct format and an example intervention.
        </p>
        <button
          onClick={downloadTemplate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Download className="mr-2" size={16} />
          Download Template CSV
        </button>
      </div>

      {/* Upload Section */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
          <Upload className="mr-2" size={20} />
          Step 2: Add Interventions
        </h2>
        <p className="text-gray-700 mb-4">
          Either upload a filled CSV template or use the form below to add interventions one by one.
        </p>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Option A: Upload CSV File</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="text-center">
            <span className="text-gray-500">— OR —</span>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Option B: Add Single Intervention</h3>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              {showForm ? 'Hide Form' : 'Add Intervention via Form'}
            </button>
          </div>
          
          {uploadedData && (
            <button
              onClick={resetUpload}
              className="text-gray-600 hover:text-gray-800 text-sm underline"
            >
              Clear all data
            </button>
          )}
        </div>
      </div>

      {/* Manual Entry Form */}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Add New Intervention</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intervention Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData['Intervention Type']}
                onChange={(e) => handleFormChange('Intervention Type', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="e.g., Content Moderation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData['Description']}
                onChange={(e) => handleFormChange('Description', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm h-20"
                placeholder="Describe the intervention..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Focus <span className="text-red-500">*</span>
              </label>
              <select
                value={formData['Focus']}
                onChange={(e) => handleFormChange('Focus', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select Focus...</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Content">Content</option>
                <option value="Visibility">Visibility</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver <span className="text-red-500">*</span>
              </label>
              <select
                value={formData['Driver']}
                onChange={(e) => handleFormChange('Driver', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select Driver...</option>
                <option value="Platform-Driven">Platform-Driven</option>
                <option value="User-Driven">User-Driven</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Journey <span className="text-red-500">*</span>
              </label>
              <select
                value={formData['User Journey']}
                onChange={(e) => handleFormChange('User Journey', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select User Journey...</option>
                <option value="Proactive">Proactive</option>
                <option value="Retroactive">Retroactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Scope <span className="text-red-500">*</span>
              </label>
              <select
                value={formData['Scope']}
                onChange={(e) => handleFormChange('Scope', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">Select Scope...</option>
                <option value="Systemic">Systemic</option>
                <option value="Targeted">Targeted</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link (Optional)
              </label>
              <input
                type="url"
                value={formData['Link']}
                onChange={(e) => handleFormChange('Link', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="https://platform.com/intervention-link"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData['Contact']}
                onChange={(e) => handleFormChange('Contact', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="mt-4 flex space-x-3">
            <button
              onClick={addInterventionFromForm}
              disabled={!formData['Intervention Type'] || !formData['Description'] || !formData['Focus'] || !formData['Driver'] || !formData['User Journey'] || !formData['Scope'] || !formData['Contact']}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg"
            >
              Add Intervention
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Validation Results */}
      {isValidating && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="text-yellow-600 mr-2" size={20} />
            <span className="text-yellow-800">Validating CSV format...</span>
          </div>
        </div>
      )}

      {validationResults && (
        <div className={`border rounded-lg p-6 mb-6 ${
          (validationResults as ValidationResults).isValid
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            {(validationResults as ValidationResults).isValid ? (
              <>
                <CheckCircle className="text-green-600 mr-2" size={20} />
                <span className="text-green-900">Validation Successful!</span>
              </>
            ) : (
              <>
                <XCircle className="text-red-600 mr-2" size={20} />
                <span className="text-red-900">Validation Failed</span>
              </>
            )}
          </h3>

          <div className="space-y-4">
            <p className={(validationResults as ValidationResults).isValid ? 'text-green-800' : 'text-red-800'}>
              Found {(validationResults as ValidationResults).rowCount} intervention(s) in your file.
            </p>

            {(validationResults as ValidationResults).errors.length > 0 && (
              <div>
                <h4 className="font-medium text-red-900 mb-2">Errors (must fix):</h4>
                <ul className="list-disc list-inside space-y-1">
                  {(validationResults as ValidationResults).errors.map((error: string, index: number) => (
                    <li key={index} className="text-red-800 text-sm">{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {(validationResults as ValidationResults).warnings.length > 0 && (
              <div>
                <h4 className="font-medium text-yellow-900 mb-2">Warnings:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {(validationResults as ValidationResults).warnings.map((warning: string, index: number) => (
                    <li key={index} className="text-yellow-800 text-sm">{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationResults?.isValid && (
              <div className="mt-4">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isSubmitting || submitSuccess}
                  onClick={async () => {
                    if (!uploadedData || !validationResults.isValid || isSubmitting || submitSuccess) return;
                    setIsSubmitting(true);
                    setSubmitSuccess(false);
                    try {
                      const response = await fetch("/api/interventions", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(uploadedData.rows),
                      });
                      const result = await response.json();
                      if (result.success) {
                        setSubmitSuccess(true);
                      } else {
                        setSubmitSuccess(false);
                        alert("Submission failed: " + (result.error || "Unknown error"));
                      }
                    } catch (err) {
                      setSubmitSuccess(false);
                      alert("Submission error: " + err);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  {isSubmitting ? "Submitting..." : submitSuccess ? "Submitted!" : "Submit Contributions"}
                </button>
                {submitSuccess && (
                  <div className="text-green-700 mt-2">Your contributions have been submitted successfully!</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview of uploaded data */}
  {uploadedData && validationResults?.isValid && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Preview of Uploaded Interventions
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  {csvHeaders.map((header, index) => (
                    <th key={index} className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {uploadedData.rows.map((row, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {csvHeaders.map((header, cellIndex) => (
                      <td key={cellIndex} className="border border-gray-300 px-3 py-2 text-sm text-gray-900 max-w-xs">
                        <div className="truncate" title={row[header]}>
                          {row[header] || '—'}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
        
        <div className="space-y-4 text-sm text-gray-700">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <h4 className="font-medium text-yellow-900 mb-2">📋 For CSV Upload Option:</h4>
            <ol className="list-decimal list-inside space-y-1 text-yellow-800">
              <li>Download the template CSV file using the button above</li>
              <li><strong>Delete the example intervention row</strong> (keep only the headers)</li>
              <li>Add your own intervention data to the file</li>
              <li>Save the file and upload it back here</li>
            </ol>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">📝 Field Requirements:</h4>
            <p><strong>Required Fields:</strong> Intervention Type, Description, Focus, Driver, User Journey, Scope</p>
            <p><strong>Optional Fields:</strong> Link (URL to platform intervention)</p>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">📋 Valid Options for Dropdown Fields:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <p><strong>Focus:</strong> Behavioral, Content, Visibility</p>
              <p><strong>Driver:</strong> Platform-Driven, User-Driven</p>
              <p><strong>User Journey:</strong> Proactive, Retroactive</p>
              <p><strong>Scope:</strong> Systemic, Targeted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterventionCSVManager;