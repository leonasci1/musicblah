import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

const SignupForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post<{ message: string }>(
        'http://localhost:5000/signup',
        { username, password, email },
        { headers: { 'Content-Type': 'application/json' } }
      );

      alert(response.data.message);
      setUsername('');
      setPassword('');
      setEmail('');
    } catch (error: unknown) {
      if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
        // Aqui, o "error" já é do tipo AxiosError<unknown>
        const msg =
          error.response.data?.error ||
          error.response.data?.message ||
          'Erro ao cadastrar usuário';
        alert(msg);
      } else {
        console.error('Erro inesperado:', error);
        alert('Erro inesperado ao cadastrar usuário');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="p-2 border border-gray-300 rounded"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="p-2 border border-gray-300 rounded"
      />
      <button
        type="submit"
        disabled={loading}
        className={`p-2 text-white rounded ${
          loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  );
};

export default SignupForm;
