import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import carreraService from "../../services/carreraService";
import facultadService from "../../services/facultadService";
import CustomButton from "../../components/CustomButton";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  name: yup.string().required("El nombre de la carrera es requerido"),
  description: yup.string().nullable(),
  facultad: yup.string().required("La facultad es requerida"),
});

const CarreraEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [facultades, setFacultades] = useState([]);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const isAdmin = hasRole(["admin"]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) {
        setLoading(false);
        setError("No tienes permiso para editar carreras.");
        return;
      }
      try {
        setLoading(true);
        const [carrera, fetchedFacultades] = await Promise.all([
          carreraService.getCarreraById(id),
          facultadService.getFacultades(),
        ]);

        setFacultades(fetchedFacultades);
        setValue("name", carrera.name);
        setValue("description", carrera.description || "");
        setValue("facultad", carrera.facultad._id);
        setError(null);
      } catch (err) {
        console.error("Error fetching carrera for edit:", err);
        setError("No se pudo cargar la carrera para edición o las facultades.");
        toast.error("Error al cargar la carrera o las facultades.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isAdmin, setValue]);

  const onSubmit = async (data) => {
    if (!isAdmin) {
      toast.error("No tienes permiso para modificar carreras.");
      return;
    }
    try {
      setLoading(true);
      await carreraService.updateCarrera(id, data);
      toast.success("Carrera actualizada exitosamente.");
      navigate("/admin/carreras");
    } catch (err) {
      console.error("Error updating carrera:", err);
      toast.error(
        err.response?.data?.message || "Error al actualizar la carrera."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando carrera para edición...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">Error</h1>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">
          Acceso Denegado
        </h1>
        <p className="text-lg">No tienes permiso para editar carreras.</p>
      </div>
    );
  }

  return (
    <div className="mt-28 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <div className="max-w-[1024px] mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center w-full">
          Editar Carrera
        </h1>

        <div className="bg-bg-secondary p-8 rounded-lg shadow-lg w-full max-w-md mx-auto border border-border-color">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div>
              <label
                className="block text-text-primary text-sm font-bold mb-2"
                htmlFor="name"
              >
                Nombre de la Carrera:
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-text-primary text-sm font-bold mb-2"
                htmlFor="description"
              >
                Descripción (opcional):
              </label>
              <textarea
                id="description"
                {...register("description")}
                className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border"
                rows="3"
              ></textarea>
            </div>
            <div>
              <label
                className="block text-text-primary text-sm font-bold mb-2"
                htmlFor="facultad"
              >
                Facultad:
              </label>
              <select
                id="facultad"
                {...register("facultad")}
                className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border"
              >
                {facultades.length === 0 ? (
                  <option value="">Cargando facultades...</option>
                ) : (
                  <>
                    <option value="">Selecciona una facultad</option>
                    {facultades.map((facultad) => (
                      <option key={facultad._id} value={facultad._id}>
                        {facultad.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {errors.facultad && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.facultad.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <CustomButton
                variant="secondary"
                className="cursor-pointer"
                onClick={() => navigate("/admin/carreras")}
                disabled={loading}
              >
                Cancelar
              </CustomButton>
              <CustomButton
                variant="primary"
                className="cursor-pointer"
                type="submit"
                disabled={loading}
              >
                {loading ? <Loader /> : "Guardar Cambios"}
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CarreraEditPage;
