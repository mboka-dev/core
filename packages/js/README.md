# @mboka-dev/core

Local data and helpers for Congo-Brazzaville: +242 phone numbers, administrative divisions, FCFA amounts. Zero runtime dependencies.

```bash
npm install @mboka-dev/core
```

```ts
import { phone, money, geo, text } from '@mboka-dev/core';

phone.parse('06 123 45 67').e164;   // '+242061234567'
money.format(125000);               // '125 000 FCFA'
money.toWords(125000);              // 'cent vingt-cinq mille francs CFA'
```

Documentation (in French): https://github.com/mboka-dev/core
