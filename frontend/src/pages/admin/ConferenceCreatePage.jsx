import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import conferenceService from "../../services/conferenceService";
import coverService from "../../services/coverService";
import CustomButton from "../../components/CustomButton";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  title: yup.string().required("El título es requerido"),
  topic: yup.string(),
  audience: yup.string(),
  type: yup
    .string()
    .oneOf(["Presencial", "Virtual"])
    .required("El tipo es requerido"),
  organizer: yup.string().required("El nombre del organizador es requerido"),
  speakers: yup.string(), // Se manejará como string y se convertirá a array
  startDate: yup.string().required("La fecha es requerida"),
  duration: yup
    .number()
    .typeError("La duración debe ser un número")
    .positive("La duración debe ser un número positivo")
    .integer()
    .required("La duración es requerida"),
  cost: yup
    .number()
    .typeError("El costo debe ser un número")
    .min(0, "El costo no puede ser negativo")
    .default(0),
  isFree: yup.boolean(),
  coverImage: yup.mixed().nullable(),
  url: yup.string().when("type", (type, schema) => {
    if (type && type[0] === "Virtual") {
      return schema
        .url("Debe ser una URL válida")
        .required("La URL es requerida para eventos virtuales");
    }
    return schema.nullable();
  }),
  phoneNumber: yup.string(),
});

const ConferenceCreatePage = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      type: "Presencial",
      isFree: true,
      cost: 0,
    },
  });

  const isAllowed = hasRole(["admin", "teacher"]);
  const selectedFile = watch("coverImage");
  const isVirtual = watch("type") === "Virtual";

  useEffect(() => {
    if (selectedFile && selectedFile[0]) {
      const file = selectedFile[0];
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setFilePreview(null);
    }
  }, [selectedFile]);

  const onSubmit = async (data) => {
    if (!isAllowed) {
      toast.error("No tienes permiso para crear congresos.");
      return;
    }

    setLoading(true);
    try {
      let coverId = null;
      if (data.coverImage && data.coverImage[0]) {
        const coverFormData = new FormData();
        coverFormData.append("image", data.coverImage[0]);
        coverFormData.append("name", `conference_cover_${Date.now()}`);
        coverFormData.append("isGeneric", "false");
        coverFormData.append("idUser", user.id);
        const uploadedCover = await coverService.createCover(coverFormData);
        coverId = uploadedCover._id;
      }

      const conferenceDataToSubmit = {
        ...data,
        speakers: data.speakers
          ? data.speakers.split(",").map((s) => s.trim())
          : [],
        cover: coverId || undefined,
      };

      if (conferenceDataToSubmit.type !== "Virtual") {
        delete conferenceDataToSubmit.url;
      }

      await conferenceService.createConference(conferenceDataToSubmit);
      toast.success("Congreso creado exitosamente.");
      navigate("/events"); // Redirigir a la página de eventos
    } catch (err) {
      console.error("Error creating conference:", err);
      toast.error(err.response?.data?.message || "Error al crear el congreso.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAllowed) {
    return (
      <div className="pt-20 p-8 min-h-[calc(100vh-80px)] bg-bg-primary text-text-primary text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-500">
          Acceso Denegado
        </h1>
        <p className="text-lg">No tienes permiso para esta acción.</p>
      </div>
    );
  }

  return (
    <div className="mt-28 p-8 min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-[1024px] mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center w-full">
          Crear Nuevo Congreso/Evento
        </h1>
        <div className="bg-bg-secondary p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto border border-border-color">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Columna 1 */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Título</label>
                <input {...register("title")} className="w-full input-class" />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Tema/Tópico
                </label>
                <input {...register("topic")} className="w-full input-class" />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Dirigido a
                </label>
                <input
                  {...register("audience")}
                  className="w-full input-class"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Organizador
                </label>
                <input
                  {...register("organizer")}
                  className="w-full input-class"
                />
                {errors.organizer && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.organizer.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Tipo</label>
                <select {...register("type")} className="w-full input-class">
                  <option value="Presencial">Presencial</option>
                  <option value="Virtual">Virtual</option>
                </select>
              </div>

              {isVirtual && (
                <div>
                  <label className="block text-sm font-bold mb-2">
                    URL del Evento
                  </label>
                  <input
                    {...register("url")}
                    className="w-full input-class"
                    placeholder="https://ejemplo.com/evento"
                  />
                  {errors.url && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.url.message}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold mb-2">
                  Ponentes (separados por comas)
                </label>
                <input
                  {...register("speakers")}
                  className="w-full input-class"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Teléfono de Contacto
                </label>
                <input
                  {...register("phoneNumber")}
                  className="w-full input-class"
                />
              </div>
            </div>

            {/* Columna 2 */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Fecha de Inicio
                </label>
                <input
                  type="datetime-local"
                  {...register("startDate")}
                  className="w-full input-class"
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Duración (en minutos)
                </label>
                <input
                  type="number"
                  {...register("duration")}
                  className="w-full input-class"
                />
                {errors.duration && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.duration.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 mt-2">
                <label className="block text-sm font-bold">¿Es Gratuito?</label>
                <Controller
                  name="isFree"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="checkbox"
                      {...field}
                      checked={field.value}
                      className="h-5 w-5"
                    />
                  )}
                />
              </div>

              <Controller
                name="cost"
                control={control}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <div>
                    <label className="block text-sm font-bold mb-2">
                      Costo
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={onChange}
                      disabled={watch("isFree")}
                      className="w-full input-class disabled:bg-gray-600"
                    />
                    {error && (
                      <p className="text-red-500 text-xs mt-1">
                        {error.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <div>
                <label className="block text-sm font-bold mb-2">
                  Imagen de Portada (Opcional)
                </label>
                <input
                  type="file"
                  {...register("coverImage")}
                  accept=".png, .jpg, .jpeg"
                  className="w-full file-input cursor-pointer"
                />
                {filePreview && (
                  <div className="mt-4">
                    <img
                      src={filePreview}
                      alt="Previsualización"
                      className="max-w-xs h-auto rounded-md shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <CustomButton
                type="button"
                className="cursor-pointer"
                onClick={() => navigate("/events")}
                disabled={loading}
              >
                Cancelar
              </CustomButton>
              <CustomButton type="submit" className="cursor-pointer" disabled={loading}>
                {loading ? <Loader /> : "Crear Congreso"}
              </CustomButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConferenceCreatePage;

// Helper para estilos de input repetidos
const styles = `
  .input-class {
    background-color: #2d3748; /* bg-input-bg */
    border: 1px solid #4a5568; /* border-input-border */
    color: #f7fafc; /* text-text-primary */
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
  }
  .file-input {
    border-radius: 9999px;
    border-width: 0px;
    font-size: 0.875rem;
    font-weight: 600;
    background-color: #4299e1; /* bg-accent-primary */
    color: white;
  }
  .file-input:hover {
    background-color: #2b6cb0;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
