import { useState } from "react";
import "./AdminView.css"

export default function AdminView() {
  const [users, setUsers] = useState([
    { id: 1, username: "user1", email: "user1@example.com" },
    { id: 2, username: "user2", email: "user2@example.com" },
  ]);
  
  const [hobbies, setHobbies] = useState([
    { id: 1, name: "Guitar Lessons" },
    { id: 2, name: "Photography" },
  ]);

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newHobbyName, setNewHobbyName] = useState("");

  // Muokkaustilat id:n perusteella (tai null jos ei muokata)
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingHobbyId, setEditingHobbyId] = useState(null);

  // Temporary state muokkauksia varten
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editHobbyName, setEditHobbyName] = useState("");

  // Lisää käyttäjä
  const addUser = () => {
    if (!newUserName || !newUserEmail) return alert("Fill in username and email");
    const newUser = {
      id: Date.now(),
      username: newUserName,
      email: newUserEmail,
    };
    setUsers([...users, newUser]);
    setNewUserName("");
    setNewUserEmail("");
  };

  // Poista käyttäjä
  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  // Aloita muokkaus käyttäjälle
  const startEditUser = (user) => {
    setEditingUserId(user.id);
    setEditUserName(user.username);
    setEditUserEmail(user.email);
  };

  // Peruuta muokkaus käyttäjälle
  const cancelEditUser = () => {
    setEditingUserId(null);
  };

  // Tallenna käyttäjän muokkaus
  const saveEditUser = () => {
    setUsers(users.map(user => {
      if (user.id === editingUserId) {
        return { ...user, username: editUserName, email: editUserEmail };
      }
      return user;
    }));
    setEditingUserId(null);
  };

  // Lisää harrastus
  const addHobby = () => {
    if (!newHobbyName) return alert("Fill in hobby name");
    const newHobby = { id: Date.now(), name: newHobbyName };
    setHobbies([...hobbies, newHobby]);
    setNewHobbyName("");
  };

  // Poista harrastus
  const deleteHobby = (id) => {
    setHobbies(hobbies.filter(hobby => hobby.id !== id));
  };

  // Aloita muokkaus harrastukselle
  const startEditHobby = (hobby) => {
    setEditingHobbyId(hobby.id);
    setEditHobbyName(hobby.name);
  };

  // Peruuta muokkaus harrastukselle
  const cancelEditHobby = () => {
    setEditingHobbyId(null);
  };

  // Tallenna harrastuksen muokkaus
  const saveEditHobby = () => {
    setHobbies(hobbies.map(hobby => {
      if (hobby.id === editingHobbyId) {
        return { ...hobby, name: editHobbyName };
      }
      return hobby;
    }));
    setEditingHobbyId(null);
  };

  return (
    <div className="admin-view">
      <h1>Admin Panel</h1>

      <section>
        <h2>Manage Users</h2>
        <input 
          type="text" 
          placeholder="Username" 
          value={newUserName} 
          onChange={e => setNewUserName(e.target.value)} 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={newUserEmail} 
          onChange={e => setNewUserEmail(e.target.value)} 
        />
        <button onClick={addUser}>Add User</button>

        <ul>
          {users.map(user => (
            <li key={user.id}>
              {editingUserId === user.id ? (
                <>
                  <input 
                    type="text" 
                    value={editUserName} 
                    onChange={e => setEditUserName(e.target.value)} 
                  />
                  <input 
                    type="email" 
                    value={editUserEmail} 
                    onChange={e => setEditUserEmail(e.target.value)} 
                  />
                  <button onClick={saveEditUser}>Save</button>
                  <button onClick={cancelEditUser}>Cancel</button>
                </>
              ) : (
                <>
                  {user.username} ({user.email}) 
                  <button onClick={() => startEditUser(user)}>Edit</button>
                  <button onClick={() => deleteUser(user.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Manage Hobbies</h2>
        <input 
          type="text" 
          placeholder="Hobby name" 
          value={newHobbyName} 
          onChange={e => setNewHobbyName(e.target.value)} 
        />
        <button onClick={addHobby}>Add Hobby</button>

        <ul>
          {hobbies.map(hobby => (
            <li key={hobby.id}>
              {editingHobbyId === hobby.id ? (
                <>
                  <input 
                    type="text" 
                    value={editHobbyName} 
                    onChange={e => setEditHobbyName(e.target.value)} 
                  />
                  <button onClick={saveEditHobby}>Save</button>
                  <button onClick={cancelEditHobby}>Cancel</button>
                </>
              ) : (
                <>
                  {hobby.name}
                  <button onClick={() => startEditHobby(hobby)}>Edit</button>
                  <button onClick={() => deleteHobby(hobby.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
