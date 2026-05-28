import type { CalculatorConfig } from '../calculatorConfigs';

export const technologyCalculators: CalculatorConfig[] = [
  {
  id: 'subnet',
  slug: 'subnet-calculator',
  cat: 'technology',
  name: 'Subnet Calculator',
  icon: '🌐',
  desc: 'IP subnet mask, network/broadcast address, usable hosts and CIDR notation',
  popular: true,
  hasChart: false,
  isNew: true,
  tips: [
    'CIDR /24 = 254 usable hosts, /16 = 65,534 hosts, /8 = 16,777,214 hosts.'
  ],
      about: `The Subnet Calculator is an essential resource for anyone needing to iP subnet mask, network/broadcast address, usable hosts and CIDR notation. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'hex-calc',
  slug: 'hexadecimal-calculator',
  cat: 'technology',
  name: 'Hexadecimal Calculator',
  icon: '0x',
  desc: 'Hex arithmetic and conversion between hex, decimal, binary and octal',
  popular: false,
  hasChart: false,
  isNew: true,
      about: `If you want to hex arithmetic and conversion between hex, decimal, binary and octal, the Hexadecimal Calculator is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'ascii',
  slug: 'ascii-converter',
  cat: 'technology',
  name: 'ASCII / Unicode Converter',
  icon: '🔤',
  desc: 'Convert text to ASCII codes, Unicode code points and UTF-8 bytes',
  popular: false,
  hasChart: false,
  isNew: true,
      about: `If you want to convert text to ASCII codes, Unicode code points and UTF-8 bytes, the ASCII / Unicode Converter is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'data-transfer',
  slug: 'data-transfer-calculator',
  cat: 'technology',
  name: 'Data Transfer Calculator',
  icon: '📡',
  desc: 'File download/upload time at any internet speed with unit conversions',
  popular: true,
  hasChart: false,
  isNew: true,
  formula: 'Time = File Size / Transfer Speed',
      about: `The Data Transfer Calculator is an essential resource for anyone needing to file download/upload time at any internet speed with unit conversions. Designed with simplicity and speed in mind, it performs the heavy lifting behind the scenes so you can focus on making informed decisions. It's completely free, requires no signups, and works seamlessly on any device.`
},
  {
  id: 'bandwidth',
  slug: 'bandwidth-calculator',
  cat: 'technology',
  name: 'Bandwidth Calculator',
  icon: '📶',
  desc: 'Network bandwidth requirements for concurrent users and usage patterns',
  popular: false,
  hasChart: false,
  isNew: true,
      about: `Whether you're a professional or just looking for quick answers, the Bandwidth Calculator provides an instant solution for your needs. It helps you network bandwidth requirements for concurrent users and usage patterns. This specialized tool is designed to eliminate manual computation errors and streamline your workflow with precise, step-by-step breakdowns.`
},
  {
  id: 'hash-generator',
  slug: 'hash-generator',
  cat: 'technology',
  name: 'Hash Generator',
  icon: '🔐',
  desc: 'Generate MD5, SHA-1, SHA-256, SHA-512 hashes from any text input',
  popular: false,
  hasChart: false,
  isNew: true,
      about: `Stop guessing and start using the Hash Generator to get immediate, accurate data. Specifically engineered to generate MD5, SHA-1, SHA-256, SHA-512 hashes from any text input, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'password-strength',
  slug: 'password-strength-calculator',
  cat: 'technology',
  name: 'Password Strength',
  icon: '🛡️',
  desc: 'Password entropy, strength score, crack time estimate and improvement tips',
  popular: true,
  hasChart: false,
  isNew: true,
  tips: [
    'A 12-character password with mixed case, numbers and symbols would take centuries to crack by brute force.'
  ],
      about: `If you want to password entropy, strength score, crack time estimate and improvement tips, the Password Strength is your perfect companion. Our advanced online tool replaces tedious manual spreadsheets by delivering instant outputs based on industry-standard formulas. You can use it repeatedly to test different scenarios and optimize your outcomes.`
},
  {
  id: 'ip-range',
  slug: 'ip-range-calculator',
  cat: 'technology',
  name: 'IP Range Calculator',
  icon: '🔌',
  desc: 'Calculate IP address range from network address and subnet mask',
  popular: false,
  hasChart: false,
  isNew: true,
      about: `Stop guessing and start using the IP Range Calculator to get immediate, accurate data. Specifically engineered to calculate IP address range from network address and subnet mask, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
  {
  id: 'number-base',
  slug: 'number-base-converter',
  cat: 'technology',
  name: 'Number Base Converter',
  icon: '🔢',
  desc: 'Convert between binary, octal, decimal and hexadecimal number systems',
  popular: false,
  hasChart: false,
  isNew: true,
      about: `We built the Number Base Converter specifically to convert between binary, octal, decimal and hexadecimal number systems. By offering a clean, straightforward interface, it empowers users to generate reliable calculations in seconds. Discover exactly how the numbers align and take advantage of our built-in tips and formulas for complete transparency.`
},
  {
  id: 'random-string',
  slug: 'random-string-generator',
  cat: 'technology',
  name: 'Random String Generator',
  icon: '🎲',
  desc: 'Generate random strings for testing, tokens and security applications',
  popular: false,
  hasChart: false,
  isNew: true,
      about: `Stop guessing and start using the Random String Generator to get immediate, accurate data. Specifically engineered to generate random strings for testing, tokens and security applications, this utility takes the complexity out of everyday equations. You can easily plug in your values and instantly see the results without needing any advanced knowledge.`
},
];
