import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import CustomButton from "../../components/CustomButton";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  name: yup.string().required("El nombre es requerido"),
  last_name: yup.string().required("El apellido es requerido"),
  email: yup
    .string()
    .email("Debe ser un email válido")
    .required("El email es requerido"),
  role: yup.string().required("El rol es requerido"),
  address: yup.string().nullable(),
  phoneNumber: yup.string().nullable(),
});

const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [loading, setLoading] = useState(true);
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
    const fetchUser = async () => {
      if (!isAdmin) {
        setLoading(false);
        setError("No tienes permiso para editar usuarios.");
        return;
      }
      try {
        setLoading(true);
        const userToEdit = await userService.getUserById(id);
        setValue("name", userToEdit.name || "");
        setValue("last_name", userToEdit.last_name || "");
        setValue("email", userToEdit.email || "");
        setValue("role", userToEdit.role || "");
        setValue("address", userToEdit.address || "");
        setValue("phoneNumber", userToEdit.phoneNumber || "");
        setError(null);
      } catch (err) {
        console.error("Error fetching user for edit:", err);
        setError("No se pudo cargar el usuario para edición.");
        toast.error("Error al cargar el usuario.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, isAdmin, setValue]);

  const onSubmit = async (data) => {
    if (!isAdmin) {
      toast.error("No tienes permiso para modificar usuarios.");
      return;
    }
    try {
      setLoading(true);
      await userService.updateUser(id, data);
      toast.success("Usuario actualizado exitosamente.");
      navigate("/admin/users"); // Redirigir a la gestión de usuarios
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error(
        err.response?.data?.message || "Error al actualizar el usuario."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando usuario para edición...</p>
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
        <p className="text-lg">No tienes permiso para editar usuarios.</p>
      </div>
    );
  }

  return (
    <div className="mt-28 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <div className="max-w-[1024px] mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Editar Usuario</h1>

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
                Nombre:
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
                htmlFor="last_name"
              >
                Apellido:
              </label>
              <input
                type="text"
                id="last_name"
                {...register("last_name")}
                className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border"
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-text-primary text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-text-primary text-sm font-bold mb-2"
                htmlFor="role"
              >
                Rol:
              </label>
              <select
                id="role"
                {...register("role")}
                className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border"
              >
                <option value="student">Estudiante</option>
                <option value="teacher">Profesor</option>
                <option value="admin">Administrador</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>
            <div>
              <label
                className="block text-text-primary text-sm font-bold mb-2"
                htmlFor="address"
              >
                Dirección:
              </label>
              <input
                type="text"
                id="address"
                {...register("address")}
                className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border"
              />
            </div>
            <div>
              <label
                className="block text-text-primary text-sm font-bold mb-2"
                htmlFor="phoneNumber"
              >
                Teléfono:
              </label>
              <input
                type="text"
                id="phoneNumber"
                {...register("phoneNumber")}
                className="w-full px-3 py-2 border rounded-md bg-input-bg text-text-primary border-input-border"
              />
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <CustomButton
                variant="secondary"
                className="cursor-pointer"
                onClick={() => navigate("/admin/users")}
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

export default UserEditPage;
