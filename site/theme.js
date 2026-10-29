try {
  const theme = localStorage.getItem('mboka-theme');
  if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
} catch { /* The default theme also works when storage is unavailable. */ }
