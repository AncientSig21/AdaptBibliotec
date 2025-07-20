import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const specialities = [
  'Ingeniería Electrónica',
  'Ingeniería Civil',
  'Ingeniería Industrial',
  'Ingeniería Eléctrica',
  'Ingeniería en Mantenimiento Mecánico',
  'Ingeniería en Sistemas',
];

export const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cedula, setCedula] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !speciality || !password || !confirmPassword || !cedula) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    // Aquí iría la lógica real de registro (conexión a backend)
    // Por ahora, simula éxito y redirige al login
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded shadow-lg shadow-gray-400 w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Registro</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <select
          value={speciality}
          onChange={e => setSpeciality(e.target.value)}
          className="border p-2 rounded w-full"
          required
        >
          <option value="">Selecciona tu especialidad</option>
          {specialities.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Cédula"
          value={cedula}
          onChange={e => setCedula(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Registrarse
        </button>
        <button
          type="button"
          className="text-blue-600 underline text-sm mt-2"
          onClick={() => navigate('/login')}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </form>
    </div>
  );
}; 