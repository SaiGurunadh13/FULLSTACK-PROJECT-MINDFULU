function UserList({ users, onEdit, onDelete, loading }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Users</h2>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-600">
              <th className="px-3 py-2 font-semibold">ID</th>
              <th className="px-3 py-2 font-semibold">Name</th>
              <th className="px-3 py-2 font-semibold">Email</th>
              <th className="px-3 py-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-slate-500">
                  Loading users...
                </td>
              </tr>
            ) : null}

            {!loading && users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-4 text-slate-500">
                  No users found.
                </td>
              </tr>
            ) : null}

            {!loading
              ? users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100">
                    <td className="px-3 py-2 text-slate-700">{user.id}</td>
                    <td className="px-3 py-2 text-slate-700">{user.name}</td>
                    <td className="px-3 py-2 text-slate-700">{user.email}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(user)}
                          className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-600"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(user.id)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default UserList;
