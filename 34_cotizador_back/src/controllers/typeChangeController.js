import axios from 'axios';

const typeChangeController = {

     getTypeChange: async (req, res) => {

          const { fecha } = req.body;
          const token = process.env.TOKEN_TYPE_CHANGE;
          const url = process.env.API_SUNAT_TYPE;

          try {
               const response = await axios.get(`${url}=${fecha}`,{
                    headers: {
                         'Referer': 'https://apis.net.pe/tipo-de-cambio-sunat-api',
                         'Authorization': `Bearer ${token}`
                    }
               });
               res.status(200).send(response.data);
          } catch (error) {
               res.status(500).json({ error: 'Error al conectar con la API de tipo de cambio' });
          }
     }
}

export default typeChangeController;