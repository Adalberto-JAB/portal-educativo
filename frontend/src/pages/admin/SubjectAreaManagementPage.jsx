import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSubjectAreas, deleteSubjectArea } from '../../services/subjectAreaService';
import Loader from '../../components/Loader';

const SubjectAreaManagementPage = () => {
  const [subjectAreas, setSubjectAreas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjectAreas = async () => {
      try {
        const data = await getAllSubjectAreas();
        setSubjectAreas(data);
      } catch (error) {
        console.error('Error al obtener las áreas temáticas:', error);
      }
      setLoading(false);
    };
    fetchSubjectAreas();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta área temática?')) {
      try {
        await deleteSubjectArea(id);
        setSubjectAreas(subjectAreas.filter(sa => sa._id !== id));
      } catch (error) {
        console.error('Error al eliminar el área temática:', error);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Áreas Temáticas</h1>
      <Link to="/admin/subject-areas/create" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">Crear Nueva Área</Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Descripción</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {subjectAreas.map(sa => (
              <tr key={sa._id}>
                <td className="py-2 px-4 border-b">{sa.name}</td>
                <td className="py-2 px-4 border-b">{sa.description}</td>
                <td className="py-2 px-4 border-b">
                  <Link to={`/admin/subject-areas/edit/${sa._id}`} className="text-blue-500 hover:underline mr-2">Editar</Link>
                  <button onClick={() => handleDelete(sa._id)} className="text-red-500 hover:underline">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectAreaManagementPage;
