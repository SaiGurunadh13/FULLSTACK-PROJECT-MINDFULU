import { useEffect, useState } from 'react';
import AddUser from '../../components/users/AddUser';
import UpdateUser from '../../components/users/UpdateUser';
import UserList from '../../components/users/UserList';
import userApi from '../../services/userApi';

function parseApiError(error, fallbackMessage) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallbackMessage
  );
}

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userApi.get('/users');
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (loadError) {
      setError(parseApiError(loadError, 'Unable to fetch users.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAdd = async (payload) => {
    try {
      setSaving(true);
      setError('');
      setSuccessMessage('');
      await userApi.post('/users', payload);
      setSuccessMessage('User added successfully.');
      await loadUsers();
    } catch (addError) {
      const message = parseApiError(addError, 'Unable to add user.');
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id, payload) => {
    try {
      setSaving(true);
      setError('');
      setSuccessMessage('');
      await userApi.put(`/users/${id}`, payload);
      setEditingUser(null);
      setSuccessMessage('User updated successfully.');
      await loadUsers();
    } catch (updateError) {
      const message = parseApiError(updateError, 'Unable to update user.');
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this user?');
    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      await userApi.delete(`/users/${id}`);
      setSuccessMessage('User deleted successfully.');
      await loadUsers();
    } catch (deleteError) {
      setError(parseApiError(deleteError, 'Unable to delete user.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <h1 className="page-title">User Management</h1>
        <p className="page-subtitle">Create, update, and delete users from the Spring Boot backend.</p>
      </header>

      {error ? <p className="state-error">{error}</p> : null}
      {successMessage ? <p className="state-info">{successMessage}</p> : null}

      <AddUser onAdd={handleAdd} loading={saving} />

      {editingUser ? (
        <UpdateUser
          user={editingUser}
          onUpdate={handleUpdate}
          onCancel={() => setEditingUser(null)}
          loading={saving}
        />
      ) : null}

      <UserList users={users} onEdit={setEditingUser} onDelete={handleDelete} loading={loading} />
    </div>
  );
}

export default UserManagement;
