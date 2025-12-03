import { api } from "@libs/axios.lib";

const BASE_URL = "/api/audio";

export const audioService = {
  getAll: async (status?: string) => {
    const params = status ? { status } : undefined;
    return await api.get(BASE_URL, { params });
  },

  getById: (id: string) => {
    return api.get(`${BASE_URL}/${id}`);
  },

  upload: async (formData: FormData) => {
    return await api.post(`${BASE_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  generateAta: async (id: string) => {
    return await api.post(`${BASE_URL}/${id}/gerar-ata`);
  },

  deleteById: async (id: string) => {
    return await api.delete(`${BASE_URL}/${id}`);
  },

  assinar: async (id: string, dados: Record<string, unknown>) => {
    return await api.post(`${BASE_URL}/${id}/assinar`, dados);
  },

  getAssinaturas: async (id: string) => {
    return await api.get(`${BASE_URL}/${id}/assinaturas`);
  },
};
