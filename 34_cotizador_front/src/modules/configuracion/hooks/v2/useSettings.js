import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SettingsService from "../../services/v2/SettingsService";

const QUERY_KEY = "settings";

const useSettings = () => {
  const queryClient = useQueryClient();

  const {
    fetchAllPreferences,
    createPreference,
    updatePreference,
    deletePreference,
  } = SettingsService;

  const {
    data: preferences,
    isLoading: isLoadingPreferences,
    isError: isErrorPreferences,
  } = useQuery({
    queryKey: [QUERY_KEY, "preferences", "v2"],
    queryFn: fetchAllPreferences,
  });

  const createPreferenceMutation = useMutation({
    mutationFn: createPreference,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY, "preferences", "v2"],
      });
    },
  });

  const updatePreferenceMutation = useMutation({
    mutationFn: updatePreference,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY, "preferences", "v2"],
      });
    },
  });

  const deletePreferenceMutation = useMutation({
    mutationFn: deletePreference,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY, "preferences", "v2"],
      });
    },
  });

  return {
    // Queries
    preferences,
    isLoadingPreferences,
    isErrorPreferences,

    // Mutations
    createPreferenceMutation,
    updatePreferenceMutation,
    deletePreferenceMutation,
  };
};

export default useSettings;
