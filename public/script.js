document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Soumettre le formulaire de connexion
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `username=${username}&password=${password}`,
  })
  .then((response) => {
    if (response.ok) {
      window.location.href = '/accueil';  // Rediriger vers la page d'accueil
    } else {
      alert('Identifiants invalides');
    }
  })
  .catch((error) => {
    console.error('Erreur de connexion:', error);
  });
});
