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
  intro: `The Subnet Calculator breaks down any IPv4 address and CIDR prefix into its network address, broadcast address, subnet mask, and usable host range. Network engineers, system administrators, and students preparing for CCNA or CompTIA Network+ exams use it to plan IP address allocation without manual binary arithmetic. Enter an address like 192.168.1.0/24 and get every value you need in under a second.`,
  workedExample: {
    title: 'Subnetting a /26 network for an office floor',
    inputs: ['IP Address: 10.0.0.64', 'Prefix Length: /26 (subnet mask 255.255.255.192)'],
    steps: [
      'Block size = 256 − 192 = 64',
      'Network address = 10.0.0.64 (first address in block)',
      'Broadcast address = 10.0.0.127 (last address in block: 64 + 64 − 1)',
      'Usable host range = 10.0.0.65 → 10.0.0.126',
      'Total usable hosts = 2^(32−26) − 2 = 64 − 2 = 62 hosts',
    ],
    result: 'The /26 subnet 10.0.0.64/26 provides 62 usable host addresses, from 10.0.0.65 to 10.0.0.126, with broadcast at 10.0.0.127.',
  },
  relatedCalculators: ['ip-range-calculator', 'bandwidth-calculator', 'data-transfer-calculator', 'data-storage-converter'],
  about: `Subnetting is the practice of dividing a single IP network into smaller, logically isolated segments. A /24 network gives 254 usable addresses, while a /26 gives 62 — choosing the right size prevents wasted addresses and limits broadcast traffic that degrades network performance.

Network engineers use subnets to implement security zones, separate VLANs, and control routing between departments. Getting the math wrong — even by one bit — can cause IP conflicts or unreachable hosts. This calculator eliminates that risk by computing every derived value from the CIDR notation you already know.

Whether you're planning a home lab, sitting for a certification exam, or designing a corporate LAN, the Subnet Calculator gives you the network address, broadcast address, subnet mask in both dotted-decimal and binary, wildcard mask, and the exact count of usable hosts — all without touching a calculator or opening a subnet cheat sheet.`,
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
  intro: `The Hexadecimal Calculator performs addition, subtraction, multiplication, and division directly in base-16, while also converting values to decimal, binary, and octal instantly. Programmers working with memory addresses, color codes, bitmasks, and hardware registers use it to skip error-prone manual conversion. Results update as you type, showing all four number bases side by side.`,
  workedExample: {
    title: 'Adding two hex values used as bitmask flags',
    inputs: ['First operand: 0x3A (binary: 0011 1010, decimal: 58)', 'Second operand: 0x15 (binary: 0001 0101, decimal: 21)', 'Operation: Addition'],
    steps: [
      'Decimal equivalent: 58 + 21 = 79',
      'Convert 79 to hex: 79 ÷ 16 = 4 remainder 15 (F) → 4F',
      'Hex result: 0x4F',
      'Binary check: 0011 1010 + 0001 0101 = 0100 1111 = 0x4F ✓',
    ],
    result: '0x3A + 0x15 = 0x4F (decimal 79, binary 0100 1111, octal 117).',
  },
  relatedCalculators: ['number-base-converter', 'ascii-converter', 'binary-calculator'],
  about: `Hexadecimal (base-16) is the native language of low-level computing. Memory addresses in debuggers, HTML/CSS color values (#FF5733), Unix file permissions, and CPU register dumps are all expressed in hex because it maps cleanly to binary nibbles — four binary digits equal exactly one hex digit.

Doing hex arithmetic by hand means mentally converting to decimal, performing the operation, then converting back — a process prone to mistakes that wastes time in debugging sessions. This calculator handles the full round-trip: enter values in any base and it computes the result in all four simultaneously.

The tool supports both unsigned hex integers and the common operations needed for bitmask manipulation, bitwise flag checking, and address offset calculations. Developers debugging embedded systems, writing assembly, or inspecting packet captures will find it especially useful alongside the Number Base Converter.`,
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
  intro: `The ASCII / Unicode Converter translates any text string into its ASCII decimal codes, Unicode code points (U+xxxx format), and UTF-8 byte sequences — and reverses the process from codes back to readable text. Developers debugging encoding issues, students learning character encoding, and anyone working with internationalization or protocol-level data will find it immediately useful.`,
  workedExample: {
    title: 'Encoding the string "Hi!" to ASCII and UTF-8',
    inputs: ['Input text: Hi!'],
    steps: [
      '"H" → ASCII 72 → Unicode U+0048 → UTF-8 byte: 0x48',
      '"i" → ASCII 105 → Unicode U+0069 → UTF-8 byte: 0x69',
      '"!" → ASCII 33 → Unicode U+0021 → UTF-8 byte: 0x21',
      'Full UTF-8 byte sequence: 48 69 21 (hex) = 72 105 33 (decimal)',
    ],
    result: '"Hi!" encodes to ASCII codes [72, 105, 33], Unicode points [U+0048, U+0069, U+0021], and UTF-8 bytes [0x48, 0x69, 0x21].',
  },
  relatedCalculators: ['hexadecimal-calculator', 'number-base-converter', 'base64-encoder'],
  about: `ASCII (American Standard Code for Information Interchange) assigns numeric values to 128 characters — letters, digits, punctuation, and control codes. Every text file, network packet, and database string ultimately resolves to these codes. Understanding the mapping between characters and their numeric representations is foundational for debugging encoding bugs, writing parsers, and working with binary protocols.

Unicode extended this idea to over a million code points, covering scripts from Arabic to emoji. UTF-8 encodes those code points into one to four bytes, maintaining full backward compatibility with ASCII for the first 128 characters. Mismatched encoding assumptions are among the most common sources of garbled text in web applications and data pipelines.

This converter lets you inspect any text character by character, see the hex and decimal representations in every relevant encoding, and reverse-engineer code points back to their glyphs. It's a practical reference tool for backend developers, security researchers testing input validation, and students studying how computers represent text internally.`,
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
  intro: `The Data Transfer Calculator tells you exactly how long a file will take to download or upload at a given connection speed, handling all unit conversions between bits, bytes, kilobits, megabits, and gigabits automatically. It's useful for planning large backups, estimating video upload times, and comparing ISP speed tiers against your actual file sizes.`,
  workedExample: {
    title: 'Estimating upload time for a 4K video file',
    inputs: ['File size: 8 GB (gigabytes)', 'Upload speed: 50 Mbps (megabits per second)'],
    steps: [
      'Convert file size to bits: 8 GB × 8 bits/byte × 1,000 MB/GB × 1,000 KB/MB × 1,000 B/KB = 64,000,000,000 bits = 64 Gbits',
      'Upload speed: 50 Mbps = 50,000,000 bits per second',
      'Time = 64,000,000,000 ÷ 50,000,000 = 1,280 seconds',
      '1,280 seconds ÷ 60 = 21 minutes 20 seconds',
    ],
    result: 'An 8 GB file uploads in approximately 21 minutes 20 seconds on a 50 Mbps connection (real-world time will be slightly longer due to protocol overhead).',
  },
  relatedCalculators: ['bandwidth-calculator', 'data-storage-converter', 'subnet-calculator'],
  about: `Internet speed is advertised in megabits per second (Mbps) while file sizes are measured in megabytes (MB) or gigabytes (GB). The difference — bits versus bytes — means a 100 Mbps connection transfers data at roughly 12.5 MB/s, not 100 MB/s. This persistent unit mismatch causes people to underestimate transfer times and overestimate what their connection can do.

The calculator accounts for this conversion precisely, accepting file sizes and speeds in any combination of units — bits, bytes, kilo, mega, giga, or tera — and producing an accurate time in hours, minutes, and seconds. It also estimates realistic throughput by factoring in typical protocol overhead.

Common use cases include: planning nightly database backups to cloud storage, estimating how long a drone video will take to sync, calculating whether a remote server can stream raw data in real-time, and comparing cable versus fiber plans for specific workflow needs.`,
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
  intro: `The Bandwidth Calculator estimates the total network bandwidth your infrastructure needs to support a given number of concurrent users across different activity types — video streaming, VoIP calls, web browsing, and file transfers. IT managers and network architects use it to size internet connections, plan capacity upgrades, and justify bandwidth purchases to stakeholders.`,
  workedExample: {
    title: 'Sizing office internet for 50 simultaneous users',
    inputs: [
      '30 users: general web browsing (avg 2 Mbps each)',
      '15 users: video conferencing HD (avg 3.5 Mbps each)',
      '5 users: large file uploads (avg 10 Mbps each)',
    ],
    steps: [
      'Web browsing: 30 × 2 Mbps = 60 Mbps',
      'Video conferencing: 15 × 3.5 Mbps = 52.5 Mbps',
      'File uploads: 5 × 10 Mbps = 50 Mbps',
      'Raw total: 60 + 52.5 + 50 = 162.5 Mbps',
      'Add 20% headroom for bursts and overhead: 162.5 × 1.20 = 195 Mbps',
    ],
    result: 'A minimum 200 Mbps symmetrical business line is recommended for this office scenario.',
  },
  relatedCalculators: ['data-transfer-calculator', 'subnet-calculator', 'data-storage-converter'],
  about: `Underestimating bandwidth leads to congestion, sluggish video calls, and frustrated users. Overestimating means paying monthly for capacity you never use. Accurate bandwidth planning requires knowing not just how many users you have, but what they're doing simultaneously — streaming, calling, downloading, or browsing each have dramatically different bandwidth profiles.

This calculator models multiple user groups with different usage patterns and aggregates them into a total bandwidth requirement, automatically adding a configurable headroom percentage for traffic bursts and protocol overhead. The calculation is based on industry-standard average bandwidth figures for each activity type.

Network engineers and office managers use this tool when evaluating ISP contracts, designing remote office connectivity, or documenting requirements for IT procurement. It pairs naturally with the Subnet Calculator when planning the IP address space for the same network segment.`,
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
  intro: `The Hash Generator computes MD5, SHA-1, SHA-256, and SHA-512 cryptographic hashes from any text input directly in your browser — no data leaves your device. Developers use it to verify file integrity, generate checksums for API signatures, test hash functions during development, and compare hashes without running code locally.`,
  workedExample: {
    title: 'Generating a SHA-256 hash for API request signing',
    inputs: ['Input string: "user_id=1234&amount=99.99&timestamp=1717660800"'],
    steps: [
      'Apply SHA-256 algorithm to the UTF-8 encoded input string',
      'SHA-256 processes the input in 512-bit blocks using a Merkle–Damgård construction',
      'Output is always 256 bits regardless of input length',
      'Hex-encoded result: a4c7b2e91f... (64 hex characters)',
    ],
    result: 'SHA-256 produces a fixed 64-character hex string. Any change to the input — even a single space — produces a completely different hash.',
  },
  relatedCalculators: ['password-strength-calculator', 'password-generator', 'base64-encoder'],
  about: `A cryptographic hash function transforms any input into a fixed-length fingerprint. The same input always produces the same hash; even a one-character change produces a completely different output. This deterministic but irreversible property makes hashes invaluable for verifying data integrity without exposing the original content.

MD5 and SHA-1 are legacy algorithms, still used for non-security checksums and file verification but no longer considered safe for cryptographic authentication. SHA-256 is the current standard for digital signatures, certificate authorities, and API request signing. SHA-512 offers higher security margins for long-lived credentials and blockchain applications.

This generator runs entirely client-side using the Web Crypto API, so sensitive strings like passwords or private keys never transit a network. Use it to verify downloads match their published checksums, prototype HMAC signing logic, or quickly compare whether two files have identical content.`,
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
  intro: `The Password Strength Calculator measures your password's entropy in bits, assigns a strength score from 0–100, and estimates how long it would take to crack using a brute-force attack at modern GPU speeds. Security professionals, IT policy writers, and anyone curious about whether their passwords actually stand up to attack will find the detailed breakdown useful.`,
  workedExample: {
    title: 'Comparing two passwords of the same length',
    inputs: ['Password A: "password123" (11 chars, lowercase + digits)', 'Password B: "kR7@mP2#xL9" (11 chars, mixed case + digits + symbols)'],
    steps: [
      'Password A character set: 26 lowercase + 10 digits = 36 characters',
      'Password A entropy: 11 × log₂(36) = 11 × 5.17 = 56.9 bits',
      'Password B character set: 26 + 26 + 10 + 32 symbols = 94 characters',
      'Password B entropy: 11 × log₂(94) = 11 × 6.55 = 72.1 bits',
      'Crack time at 10 billion guesses/sec: A ≈ 3.7 hours | B ≈ 62 years',
    ],
    result: 'Same length, but Password B is roughly 167,000× harder to brute-force due to a larger character set. Adding symbols and mixed case has a larger impact than adding extra characters.',
  },
  relatedCalculators: ['password-generator', 'hash-generator', 'random-string-generator'],
  about: `Password strength is not about how complex a password looks to a human — it's about entropy: the mathematical measure of how many possible combinations an attacker must try. A password that seems complex ("P@ssw0rd!") can be trivially cracked because attackers use rule-based mutation lists that already include common substitutions.

This calculator evaluates entropy based on character set size and length, checks for common patterns and dictionary words, and translates the result into an estimated crack time at realistic attack speeds (10 billion guesses/second for a dedicated GPU rig). The strength score accounts for both raw entropy and pattern vulnerabilities.

IT administrators use this to enforce evidence-based password policies — replacing arbitrary "must include a number" rules with minimum-entropy requirements. Individuals use it to understand which of their stored passwords are weakest and should be replaced first.`,
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
  intro: `The IP Range Calculator takes a network address and subnet mask (or CIDR prefix) and returns the complete range of IP addresses in that subnet — the first host, last host, broadcast address, and total address count. Network administrators use it to verify firewall rules, document DHCP pool boundaries, and check whether a specific IP falls within a given subnet.`,
  workedExample: {
    title: 'Finding the host range for a /28 subnet',
    inputs: ['Network address: 192.168.10.48', 'Subnet mask: 255.255.255.240 (/28)'],
    steps: [
      '/28 means 4 bits for hosts: 2^4 = 16 total addresses',
      'Network address: 192.168.10.48 (given)',
      'Broadcast: 192.168.10.48 + 16 − 1 = 192.168.10.63',
      'First usable host: 192.168.10.49',
      'Last usable host: 192.168.10.62',
      'Usable host count: 16 − 2 = 14',
    ],
    result: 'The /28 subnet 192.168.10.48/28 spans 192.168.10.48–192.168.10.63, with 14 usable host addresses (192.168.10.49 to 192.168.10.62).',
  },
  relatedCalculators: ['subnet-calculator', 'bandwidth-calculator'],
  about: `Every IP subnet has a defined range of addresses, bounded by its network address at the bottom and broadcast address at the top. The hosts within that range — everything in between — are the only addresses that devices can actually use. Knowing the precise boundaries matters when writing access control lists, configuring DHCP, or verifying that two subnets don't overlap.

This calculator works from both directions: enter the network address and mask in dotted-decimal, or use CIDR notation, and it resolves the full range in either case. It also accepts an arbitrary IP and mask and identifies which network that IP belongs to.

Use it alongside the Subnet Calculator when designing address plans, or to quickly answer questions like "does 10.0.5.200 fall in the 10.0.5.192/27 subnet?" without needing to do binary arithmetic in your head.`,
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
  intro: `The Number Base Converter instantly translates any integer between binary (base-2), octal (base-8), decimal (base-10), and hexadecimal (base-16). Computer science students, embedded developers, and anyone working with bitfields, permissions, or memory layouts use it to cross-check conversions that are easy to get wrong by hand.`,
  workedExample: {
    title: 'Converting Unix file permission 755 (octal) to all bases',
    inputs: ['Input: 755 (octal)'],
    steps: [
      'Octal 755 to decimal: 7×64 + 5×8 + 5×1 = 448 + 40 + 5 = 493',
      'Decimal 493 to binary: 493 = 256+128+64+32+8+4+1 = 0001 1110 1101 → 111 101 101',
      'Decimal 493 to hex: 493 ÷ 16 = 30 remainder 13 (D) → 1E in next step → 0x1ED',
      'Grouped binary: 111 101 101 (rwxr-xr-x)',
    ],
    result: 'Octal 755 = Decimal 493 = Binary 111101101 = Hex 1ED. The binary groups (111)(101)(101) directly show read/write/execute for owner/group/other.',
  },
  relatedCalculators: ['hexadecimal-calculator', 'ascii-converter', 'binary-calculator'],
  about: `Number base conversions appear constantly in computing: Unix permissions are written in octal, memory addresses in hex, CPU registers in binary, and user-facing values in decimal. Switching between them mentally — or on paper — requires careful positional arithmetic that's prone to transposition errors, especially under time pressure.

This converter accepts input in any base and simultaneously displays the equivalent in all four bases. For binary, it also groups digits into nibbles (groups of four) for easier reading, and shows how the bit pattern relates to hex digits. For large numbers, it handles values up to the browser's safe integer limit.

Beyond simple conversion, understanding how the same number looks in different bases builds intuition for low-level programming concepts like bitmasks, color channels (RGB in hex), and network address arithmetic. Students preparing for CS fundamentals exams and developers debugging hardware interfaces use this tool daily.`,
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
  intro: `The Random String Generator creates cryptographically random strings of any length using a configurable character set — letters, digits, symbols, or any custom mix. Developers use it to generate API keys, session tokens, test data seeds, temporary passwords, and unique identifiers without writing throwaway scripts or reaching for a UUID library.`,
  workedExample: {
    title: 'Generating a 32-character API token with high entropy',
    inputs: ['Length: 32 characters', 'Character set: uppercase + lowercase + digits (62 characters total)'],
    steps: [
      'Entropy per character = log₂(62) ≈ 5.95 bits',
      'Total entropy = 32 × 5.95 = 190.4 bits',
      'At 10^12 guesses/second: 2^190 / 10^12 ≈ 10^45 years to brute force',
      'Generated token (example): kR9mXp2Lw7TnQdAu4sFjHbVeZy1CgN6o',
      'Each generation uses crypto.getRandomValues() — not Math.random()',
    ],
    result: 'A 32-character alphanumeric string has ~190 bits of entropy — effectively unguessable. Use it as a session token, API key, or any secret identifier.',
  },
  relatedCalculators: ['password-generator', 'hash-generator', 'password-strength-calculator'],
  about: `"Random" strings generated with Math.random() or similar non-cryptographic functions are predictable — if an attacker knows the seed or timing, they can reproduce the sequence. For anything security-sensitive, cryptographically secure randomness (CSPRNG) is required, which this generator uses via the browser's Web Crypto API.

The character set composition directly controls the entropy per character: using only digits (10 chars) gives 3.32 bits per character, while using all printable ASCII (95 chars) gives 6.57 bits. For a given security requirement in bits, you can either use a larger character set or increase the length — the tradeoffs are shown alongside every generated string.

Typical use cases include generating one-time tokens for email verification links, creating test fixtures with realistic-looking but meaningless data, generating webhook secrets, producing random slugs for URL shorteners, and creating initial passwords that users must change on first login.`,
},
];
