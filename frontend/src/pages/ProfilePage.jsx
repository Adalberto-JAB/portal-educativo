import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import Loader from "../components/Loader";
import CustomButton from "../components/CustomButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated || !user?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const fetchedProfile = await userService.getUserById(user.id);
        setProfile(fetchedProfile);
        setError(null);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("No se pudo cargar la información del perfil.");
        toast.error("Error al cargar el perfil.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [isAuthenticated, user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="pt-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
        <Loader />
        <p className="mt-4">Cargando perfil...</p>
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

  if (!isAuthenticated || !profile) {
    return (
      <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4">Acceso Denegado</h1>
        <p className="text-lg">Por favor, inicia sesión para ver tu perfil.</p>
      </div>
    );
  }

  return (
    <div className="mt-20 md:mt-28 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary">
      <div className="max-w-[1024px] mx-auto">
        <h1 className="text-3xl font-bold mb-9 text-center">Mi Perfil</h1>
        <div className="bg-bg-secondary p-8 rounded-lg shadow-lg w-full max-w-2xl mx-auto border border-border-color">
          <div>
            {profile.profilePictureURL ? (
              <img
                src={profile.profilePictureURL}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-accent-primary"
              />
            ) : (
              <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-700 flex items-center justify-center text-text-primary text-5xl font-bold">
                {profile.name ? profile.name.charAt(0).toUpperCase() : ""}
              </div>
            )}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">
                {profile.name} {profile.last_name}
              </h2>
              <p className="text-text-secondary">{profile.email}</p>
            </div>
            <div className="border-t border-border-color pt-4">
              <p className="text-lg mb-2">
                <span className="font-semibold">Rol:</span> {profile.role}
              </p>
              <p className="text-lg mb-2">
                <span className="font-semibold">Dirección:</span>{" "}
                {profile.address || "No especificada"}
              </p>
              <p className="text-lg mb-2">
                <span className="font-semibold">Teléfono:</span>{" "}
                {profile.phoneNumber || "No especificado"}
              </p>
            </div>
            <div className="flex justify-end mt-6 gap-4">
              <CustomButton
                variant="secondary"
                type="button"
                className="cursor-pointer"
                onClick={() => navigate("/profile/change-password")}
              >
                Cambiar Contraseña
              </CustomButton>
              <CustomButton
                variant="primary"
                type="button"
                className="cursor-pointer"
                onClick={() => navigate("/profile/edit")}
              >
                Editar Perfil
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
