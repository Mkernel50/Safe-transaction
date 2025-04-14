import React, { useState } from 'react';
import { Copy } from 'lucide-react';

function App() {
  const [userFriendlyAddress, setUserFriendlyAddress] = useState('');
  const [rawAddress, setRawAddress] = useState('');
  const [copied, setCopied] = useState(false);

  const base64ToHex = (str: string): string => {
    const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    const base64Lookup = new Map(Array.from(base64Chars).map((char, i) => [char, i]));
    
    let bits = '';
    for (const char of str.replace(/_/g, '/').replace(/-/g, '+')) {
      const value = base64Lookup.get(char);
      if (value === undefined) continue;
      bits += value.toString(2).padStart(6, '0');
    }

    // Convert bits to hex
    const hex = [];
    for (let i = 0; i < bits.length; i += 4) {
      const chunk = bits.slice(i, i + 4);
      if (chunk.length === 4) {
        hex.push(parseInt(chunk, 2).toString(16));
      }
    }
    
    return hex.join('');
  };

  const convertToRaw = (address: string): string => {
    if (!address.startsWith('UQ') && !address.startsWith('EQ')) {
      return 'Invalid address format';
    }

    try {
      // Remove the prefix and convert to hex
      const hexData = base64ToHex(address.slice(2));
      return hexData;
    } catch (error) {
      return 'Invalid address format';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserFriendlyAddress(input);
    setRawAddress(convertToRaw(input));
  };

  const copyToClipboard = async () => {
    if (rawAddress) {
      await navigator.clipboard.writeText(rawAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-2xl mx-auto pt-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">TON Address Converter</h1>
          <p className="text-gray-600 mb-8">Convert user-friendly TON addresses to raw format</p>

          <div className="space-y-6">
            <div>
              <label htmlFor="friendly-address" className="block text-sm font-medium text-gray-700 mb-2">
                User-friendly Address
              </label>
              <input
                id="friendly-address"
                type="text"
                value={userFriendlyAddress}
                onChange={handleInputChange}
                placeholder="Enter TON address (starts with EQ or UQ)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raw Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={rawAddress}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-700 font-mono"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-600 mt-1">Copied to clipboard!</p>
              )}
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-sm font-semibold text-blue-800 mb-2">How it works</h2>
            <p className="text-sm text-blue-600">
              Enter a user-friendly TON address that starts with 'EQ' or 'UQ'. 
              The converter will automatically generate the raw format.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;