const LIBRARY_URL = 'https://cdn.jsdelivr.net/npm/@mboka-dev/core@0.0.2/dist/esm/index.js';
const LOAD_TIMEOUT_MS = 15_000;
const PHONE_ERRORS = {
  empty: 'Saisissez un numéro, par exemple 06 123 45 67.',
  invalid_characters: 'Utilisez des chiffres, avec éventuellement +242, des espaces, des points ou des tirets.',
  foreign_number: 'Cette démonstration concerne les numéros du Congo-Brazzaville (+242).',
  length: 'Le numéro national doit contenir 9 chiffres, sans compter +242.',
  unknown_prefix: 'Ce préfixe ne figure pas dans les données actuelles, encore provisoires. Cela ne prouve pas que le numéro est invalide.',
};

let controller;

function element(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Missing demonstration element: ${id}`);
  return node;
}

function getElements() {
  const ids = [
    'phone-form', 'phone-input', 'phone-submit', 'phone-error',
    'phone-result', 'phone-e164', 'phone-national', 'phone-json',
    'money-form', 'money-input', 'money-label', 'money-submit',
    'money-error', 'money-result', 'money-output',
    'geo-empty', 'departments-list', 'geo-status',
    'library-status', 'library-retry',
    'phone-js', 'phone-py', 'money-js', 'money-py', 'geo-js', 'geo-py',
  ];
  return Object.fromEntries(ids.map((id) => [id, element(id)]));
}

function setSnippet(nodes, name, javascript, python) {
  nodes[`${name}-js`].textContent = javascript;
  nodes[`${name}-py`].textContent = python;
}

function createController(nodes) {
  let library = null;
  let attempt = 0;
  let pending = null;

  function setBusy(busy) {
    for (const name of ['phone', 'money']) {
      nodes[`${name}-submit`].disabled = busy;
      nodes[`${name}-form`].setAttribute('aria-busy', String(busy));
    }
  }

  function clearResult(name) {
    nodes[`${name}-result`].hidden = true;
    nodes[`${name}-error`].textContent = '';
    nodes[`${name}-input`].setAttribute('aria-invalid', 'false');
  }

  function markEdited(name) {
    clearResult(name);
    if (!library) return;
    nodes[`${name}-error`].textContent = name === 'phone'
      ? 'Saisie modifiée. Analysez à nouveau le numéro pour actualiser le résultat.'
      : 'Saisie modifiée. Formatez à nouveau le montant pour actualiser le résultat.';
  }

  function showError(name, message, focus) {
    nodes[`${name}-result`].hidden = true;
    nodes[`${name}-error`].textContent = message;
    nodes[`${name}-input`].setAttribute('aria-invalid', 'true');
    if (focus) nodes[`${name}-input`].focus();
  }

  function runPhone(focus = false) {
    if (!library) return;
    clearResult('phone');
    const input = nodes['phone-input'].value;
    const quoted = JSON.stringify(input);
    setSnippet(nodes, 'phone',
      `import { phone } from '@mboka-dev/core';\n\nconst numero = phone.parse(${quoted});`,
      `from mboka import phone\n\nnumero = phone.parse(${quoted})`,
    );

    try {
      const parsed = library.phone.parse(input);
      if (!parsed.valid) {
        showError('phone', PHONE_ERRORS[parsed.reason] ?? 'Ce format ne peut pas être interprété. Vérifiez la saisie.', focus);
        return;
      }
      nodes['phone-e164'].textContent = parsed.e164;
      nodes['phone-national'].textContent = parsed.national;
      nodes['phone-json'].textContent = JSON.stringify(parsed, null, 2);
      nodes['phone-result'].hidden = false;
    } catch {
      showError('phone', 'L’analyse n’a pas pu aboutir. Vérifiez la saisie, puis réessayez.', focus);
    }
  }

  function runMoney(focus = false) {
    if (!library) return;
    clearResult('money');
    const raw = nodes['money-input'].value.trim();
    const label = nodes['money-label'].value;
    if (!/^-?\d+$/.test(raw)) {
      showError('money', 'Saisissez un montant entier, sans séparateur ni libellé. Exemple : 125000.', focus);
      return;
    }
    const amount = Number(raw);
    if (!Number.isSafeInteger(amount)) {
      showError('money', 'Ce montant dépasse la précision numérique disponible. Utilisez un entier entre −9 007 199 254 740 991 et 9 007 199 254 740 991.', focus);
      return;
    }
    if (!['FCFA', 'XAF', ''].includes(label)) {
      showError('money', 'Choisissez un libellé proposé dans la liste.', focus);
      return;
    }

    try {
      nodes['money-output'].textContent = library.money.format(amount, { label });
      setSnippet(nodes, 'money',
        `import { money } from '@mboka-dev/core';\n\nmoney.format(${amount}, { label: ${JSON.stringify(label)} });`,
        `from mboka import money\n\nmoney.format(${amount}, label=${JSON.stringify(label)})`,
      );
      nodes['money-result'].hidden = false;
    } catch {
      showError('money', 'Le montant ne peut pas être formaté. Utilisez un entier, sans centimes.', focus);
    }
  }

  function renderGeography() {
    nodes['departments-list'].replaceChildren();
    nodes['departments-list'].hidden = true;
    nodes['geo-empty'].hidden = true;
    setSnippet(nodes, 'geo',
      "import { geo } from '@mboka-dev/core';\n\ngeo.departements();",
      'from mboka import geo\n\ngeo.departements()',
    );

    try {
      const departments = library.geo.departements();
      if (departments.length === 0) {
        nodes['geo-status'].textContent = 'La version chargée ne contient pas encore de départements.';
        nodes['geo-empty'].hidden = false;
        return;
      }
      const fragment = document.createDocumentFragment();
      for (const department of departments) {
        const item = document.createElement('li');
        const name = document.createElement('strong');
        name.textContent = department.nom;
        item.append(name);
        if (department.chefLieu) {
          const capital = document.createElement('span');
          capital.textContent = `Chef-lieu : ${department.chefLieu}`;
          item.append(capital);
        }
        const verification = document.createElement('small');
        verification.textContent = department.verification?.status === 'verifie' ? 'Donnée vérifiée' : 'Donnée à vérifier';
        item.append(verification);
        fragment.append(item);
      }
      nodes['departments-list'].append(fragment);
      nodes['departments-list'].hidden = false;
      nodes['geo-status'].textContent = `${departments.length} département${departments.length > 1 ? 's' : ''} dans la version chargée.`;
    } catch {
      nodes['geo-status'].textContent = 'Les données géographiques ne peuvent pas être affichées. Réessayez le chargement de la bibliothèque.';
      nodes['library-status'].hidden = false;
      nodes['library-status'].textContent = 'Le chargement des données géographiques a échoué.';
      nodes['library-retry'].hidden = false;
    }
  }

  async function load() {
    if (pending) return pending;
    const currentAttempt = ++attempt;
    library = null;
    setBusy(true);
    clearResult('phone');
    clearResult('money');
    nodes['library-status'].hidden = false;
    nodes['library-status'].textContent = 'Chargement des démonstrations…';
    nodes['library-retry'].hidden = true;
    nodes['geo-status'].textContent = 'Chargement des données géographiques…';
    nodes['geo-empty'].hidden = true;
    nodes['departments-list'].hidden = true;

    pending = (async () => {
      let timeout;
      try {
        // A new entry URL allows retrying a failed initial network request.
        const url = currentAttempt === 1 ? LIBRARY_URL : `${LIBRARY_URL}?retry=${currentAttempt}`;
        const loaded = await Promise.race([
          import(url),
          new Promise((_, reject) => {
            timeout = setTimeout(() => reject(new Error('Library load timed out')), LOAD_TIMEOUT_MS);
          }),
        ]);
        if (currentAttempt !== attempt) return;
        if (typeof loaded.phone?.parse !== 'function'
          || typeof loaded.money?.format !== 'function'
          || typeof loaded.geo?.departements !== 'function') {
          throw new Error('Unsupported library exports');
        }
        library = loaded;
        setBusy(false);
        nodes['library-status'].hidden = true;
        nodes['library-status'].textContent = '';
        runPhone();
        runMoney();
        renderGeography();
      } catch {
        if (currentAttempt !== attempt) return;
        library = null;
        nodes['phone-form'].setAttribute('aria-busy', 'false');
        nodes['money-form'].setAttribute('aria-busy', 'false');
        nodes['library-status'].hidden = false;
        nodes['library-status'].textContent = 'Les démonstrations sont indisponibles : la bibliothèque n’a pas pu être chargée. Vérifiez votre connexion, puis réessayez.';
        nodes['library-retry'].hidden = false;
        nodes['geo-status'].textContent = 'Les données n’ont pas pu être chargées.';
      } finally {
        clearTimeout(timeout);
        if (currentAttempt === attempt) pending = null;
      }
    })();
    return pending;
  }

  nodes['phone-form'].addEventListener('submit', (event) => {
    event.preventDefault();
    runPhone(true);
  });
  nodes['money-form'].addEventListener('submit', (event) => {
    event.preventDefault();
    runMoney(true);
  });
  nodes['phone-input'].addEventListener('input', () => markEdited('phone'));
  nodes['money-input'].addEventListener('input', () => markEdited('money'));
  nodes['money-label'].addEventListener('change', () => markEdited('money'));
  nodes['library-retry'].addEventListener('click', () => { void load(); });

  return { load };
}

export async function initDemos() {
  try {
    controller ??= createController(getElements());
    await controller.load();
  } catch {
    const status = document.getElementById('library-status');
    if (status) {
      status.hidden = false;
      status.textContent = 'Les démonstrations ne peuvent pas être initialisées. Rechargez la page pour réessayer.';
    }
  }
}
