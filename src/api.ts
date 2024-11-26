const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export async function checkAuth() {
  const response = await fetch(`${API_BASE_URL}/check-auth`, { credentials: 'include' });
  if (!response.ok) throw new Error('Authentication check failed');
  return response.json();
}

export async function getDashboard() {
  const response = await fetch(`${API_BASE_URL}/dashboard`, { credentials: 'include' });
  if (!response.ok) throw new Error('Failed to fetch dashboard data');
  return response.json();
}

export async function startServer() {
  const response = await fetch(`${API_BASE_URL}/start-server`, { 
    method: 'POST',
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to start server');
  return response.json();
}

export async function stopServer() {
  const response = await fetch(`${API_BASE_URL}/stop-server`, { 
    method: 'POST',
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Failed to stop server');
  return response.json();
}

export async function logout() {
  const response = await fetch(`${API_BASE_URL}/logout`, { 
    method: 'GET',
    credentials: 'include'
  });
  if (!response.ok) throw new Error('Logout failed');
  return response.json();
}

