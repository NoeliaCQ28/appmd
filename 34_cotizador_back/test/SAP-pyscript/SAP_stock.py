import json
import requests
import pandas as pd

# Ruta al archivo JSON con los modelos
JSON_FILE = './models.json'

# Centro
werks = "1206"

# Excel Name
excel_name = 'stock_resultados_mp_trujillo.xlsx'

SAP_PROXY_ENDPOINT = "http://161.132.97.156:9035/sap-proxy"

# Endpoint base, con placeholders para el material (matnr) y werks
BASE_URL = SAP_PROXY_ENDPOINT+"/materials/stock?matnr={matnr}&werks={werks}"

def cargar_modelos(file_path):
    """Carga la lista de modelos desde un archivo JSON."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            modelos = json.load(f)
        return modelos
    except Exception as e:
        print(f"Error al cargar el archivo JSON: {e}")
        return []

def verificar_stock(modelos):
    """
    Itera sobre los modelos y realiza la petición para cada uno.
    Si el endpoint retorna datos en 'items', se genera una fila por cada item,
    de lo contrario, se genera una fila única sin detalles de item.
    Retorna una lista de diccionarios con los resultados.
    """
    
    resultados = []
    
    for modelo in modelos:
        # Obtenemos el código del material del modelo
        matnr_modelo = modelo.get("sModNombre")
        if not matnr_modelo:
            print("Modelo sin código 'sModNombre', omitiendo.")
            continue
        
        # Construimos la URL para el request
        url = BASE_URL.format(matnr=matnr_modelo, werks=werks)

        print(f"URL: {url}")
        try:
            response = requests.get(url)
            response.raise_for_status()  # Verifica que la respuesta sea exitosa
            data = response.json()
            
            # Si hay items en la respuesta, se genera una fila por cada uno
            items = data.get("items", [])
            if items:
                for item in items:
                    registro = {
                        "Modelo": matnr_modelo,
                        "CantSd": data.get("CantSd"),
                        "CantSr": data.get("CantSr"),
                        "CantSt": data.get("CantSt"),
                        "Item_Matnr": item.get("Matnr"),
                        "Item_Werks": item.get("Werks"),
                        "Item_Lgort": item.get("Lgort"),
                        "Item_StockDisp": item.get("StockDisp"),
                        "Item_StockReservado": item.get("StockReservado"),
                        "Item_StockEnCurso": item.get("StockEnCurso")
                    }
                    resultados.append(registro)
            else:
                # Si no hay items, se registra la info sin detalle de items
                registro = {
                    "Modelo": matnr_modelo,
                    "CantSd": data.get("CantSd"),
                    "CantSr": data.get("CantSr"),
                    "CantSt": data.get("CantSt"),
                    "Item_Matnr": None,
                    "Item_Werks": None,
                    "Item_Lgort": None,
                    "Item_StockDisp": None,
                    "Item_StockReservado": None,
                    "Item_StockEnCurso": None
                }
                resultados.append(registro)
            
            print(f"Stock para {matnr_modelo}: {data}")
        except requests.exceptions.RequestException as e:
            print(f"Error al obtener stock para {matnr_modelo}: {e}")
        except json.JSONDecodeError:
            print(f"Error al decodificar la respuesta JSON para {matnr_modelo}")
    
    return resultados

def guardar_en_excel(resultados, archivo_salida=excel_name):
    """Guarda la lista de resultados en un archivo Excel."""
    df = pd.DataFrame(resultados)
    try:
        df.to_excel(archivo_salida, index=False)
        print(f"Resultados guardados en {archivo_salida}")
    except Exception as e:
        print(f"Error al guardar en Excel: {e}")

def main():
    modelos = cargar_modelos(JSON_FILE)
    if modelos:
        resultados = verificar_stock(modelos)
        if resultados:
            guardar_en_excel(resultados)
        else:
            print("No se obtuvieron resultados de stock.")
    else:
        print("No se encontraron modelos para procesar.")

if __name__ == "__main__":
    main()
