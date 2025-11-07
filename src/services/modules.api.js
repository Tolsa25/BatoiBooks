//getDBModules    devuelve todos los registros de esa tabla
export async function getDBModules(){
    let response = await fetch('http://localhost:3000/modules'); 
        if (!response.ok) {
        let errorText = await response.text();

        throw new Error(`Error al obtener los modulos: ${response.status} ${response.statusText}. Detalle: ${errorText}`);
    }
    let tabla = await response.json();
    return tabla;
}