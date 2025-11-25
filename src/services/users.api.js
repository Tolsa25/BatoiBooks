export async function getDBUsers() {
    let response = await fetch ('http://localhost:3000/users');
    if(!response.ok){
        let errorText = await response.text();
        throw new Error(`Error al obtener los usuarios: ${response.status} ${response.statusText}. Detalle: ${errorText}`);
    }
    let tabla = await response.json();
    return tabla;
}

export async function getDBUser(id){
   let url = `http://localhost:3000/users/${id}`;
   let response = await fetch (url);

   if(!response.ok){
        let errorText = await response.text();
        throw new Error(`Error al obtener el usuario: ${response.status} ${response.statusText}. Detalle: ${errorText}`);
    }
    let user = await response.json();
    return user;
}

export async function addDBUser(newUser) {
    let url = 'http://localhost:3000/users';
    let options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    };

    let response = await fetch(url, options);

    if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Error al crear el usuario: ${response.status} ${response.statusText}. Detalle: ${errorText}`);
    }
    
    let createdUser = await response.json(); 
    return createdUser; 
}

export async function removeDBUser(idUser) {
    let url = `http://localhost:3000/users/${idUser}`;
    let options = {
        method: 'DELETE'
    };

    let response = await fetch(url, options);

    if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Error al eliminar el usuario: ${response.status} ${response.statusText}. Detalle: ${errorText}`);
    }
    
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        let delUser = await response.json();
        return delUser;
    }
    
    return response.status; 
}

export async function changeDBUser(user) {
    let url = `http://localhost:3000/users/${user.id}`;
        let options = {
        method: 'PUT', 
        headers: {
        'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(user)
    };

    let response = await fetch(url, options);

    if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Error al actualizar el usuario (ID: ${user.id}): ${response.status} ${response.statusText}. Detalle: ${errorText}`);
    }
    
    let updatedUser = await response.json();
    return updatedUser; 
}

export async function changeDBUserPassword(idUser, newPassword) {
    let url = `http://localhost:3000/users/${idUser}`;
    
    let psw = {
        password: newPassword 
    };
    
    const options = {
        method: 'PATCH', 
            headers: {
            'Content-Type': 'application/json'
        },
        
        body: JSON.stringify(psw)
    };

    let response = await fetch(url, options);

    if (!response.ok) {
        let errorText = await response.text();
        throw new Error(`Error al cambiar la contraseña del usuario (ID: ${idUser}): ${response.status} ${response.statusText}. Detalle: ${errorText}`);
    }
    
    let newUserPassw = await response.json();
    return newUserPassw;
}