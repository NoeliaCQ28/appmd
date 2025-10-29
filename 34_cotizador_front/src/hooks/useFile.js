import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import FileService from "../services/fileService";

const QUERY_KEY = "files";

export const useFile = () => {
  const { uploadFile, getFileUrl, getFileBuffer, deleteFile } = FileService;

  const queryClient = useQueryClient();

  const { mutate: uploadFileMutate, isLoading: isPendingUploadFile } =
    useMutation({
      mutationFn: uploadFile,
      onError: (error) => {
        toast.error("Error al subir el archivo");
      },
      // Remove the default onSuccess handler so it doesn't override custom handlers
    });

  const { mutate: getFileUrlMutate, isLoading: isPendingGetFileUrl } =
    useMutation({
      mutationFn: getFileUrl,
      onError: (error) => {
        toast.error("Error al obtener la URL del archivo: " + error.message);
      },
    });

  const { mutate: getFileBufferMutate, isLoading: isPendingGetFileBuffer } =
    useMutation({
      mutationFn: getFileBuffer,
      onError: (error) => {
        toast.error("Error al obtener el buffer del archivo: " + error.message);
      },
    });

  const { mutate: deleteFileMutate, isLoading: isPendingDeleteFile } =
    useMutation({
      mutationFn: deleteFile,
      onSuccess: () => {
        toast.success("Archivo eliminado con éxito");
        queryClient.invalidateQueries([QUERY_KEY]);
      },
      onError: (error) => {
        toast.error("Error al eliminar el archivo");
      },
    });

  return {
    uploadFileMutate,
    isPendingUploadFile,
    deleteFileMutate,
    isPendingDeleteFile,
    getFileBufferMutate,
    isPendingGetFileBuffer,
    getFileUrlMutate,
    isPendingGetFileUrl,
  };
};
