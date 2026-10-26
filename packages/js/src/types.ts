// Shapes of the files in /data. Keep in sync with /data/schema/*.schema.json.

export interface Verification {
  status: 'verifie' | 'a_verifier';
  source?: string;
  sourceUrl?: string;
  verifiedAt?: string;
  verifiedBy?: string;
  note?: string;
}

interface Validity {
  validFrom?: string;
  validUntil?: string;
  replacedBy?: string[];
}

export interface Departement extends Validity {
  id: string;
  nom: string;
  iso3166_2?: string;
  chefLieu?: string;
  aliases: string[];
  verification: Verification;
}

export interface Commune extends Validity {
  id: string;
  nom: string;
  departement: string;
  aliases: string[];
  verification: Verification;
}

export interface Arrondissement extends Validity {
  id: string;
  nom: string;
  numero?: number;
  commune: string;
  aliases: string[];
  verification: Verification;
}

export interface PhonePrefix {
  prefix: string;
  type: 'mobile' | 'fixe' | 'special';
  operator?: string;
  mobileMoney?: string;
  note?: string;
  verification: Verification;
}

export interface DepartementsFile { items: Departement[] }
export interface CommunesFile { items: Commune[] }
export interface ArrondissementsFile { items: Arrondissement[] }
export interface NumerotationFile {
  countryCode: '242';
  nationalNumberLength: number;
  nationalGrouping?: number[];
  verification: Verification;
  prefixes: PhonePrefix[];
}
