# Documentación del Sistema de Autenticación – Bienes Raíces

## Introducción
El presente proyecto consiste en el desarrollo de un sistema de autenticación para una plataforma de bienes raíces, el cual permite a los usuarios registrarse, iniciar sesión, recuperar su contraseña y gestionar sus propiedades.
El sistema fue desarrollado utilizando tecnologías como Node.js, Express, Sequelize y MySQL, implementando buenas prácticas de seguridad como encriptación de contraseñas, uso de tokens y validaciones tanto en frontend como en backend.

## Funcionalidades Implementadas

### Validación de Datos en Frontend
Se implementaron validaciones en los formularios para asegurar que los datos ingresados por el usuario cumplan con los requisitos antes de ser enviados al servidor.

Ejemplos:
•	Campos obligatorios 
•	Formato correcto de correo electrónico 
•	Confirmación de contraseña 

### Validación de Datos en Backend
Se utilizó la librería express-validator para validar la información recibida en el servidor.

Ejemplos:
•	Validación de email 
•	Longitud mínima de contraseña 
•	Comparación de contraseñas 
Esto garantiza que los datos sean seguros y correctos antes de almacenarse en la base de datos.

### Estilización de Correos Electrónicos
Se implementó el envío de correos electrónicos para:
•	Confirmación de cuenta 
•	Recuperación de contraseña

Los correos incluyen:
•	Nombre del usuario 
•	Enlaces con tokens únicos 
•	Diseño claro y entendible 

### Manejo de Errores Dinámicos
El sistema muestra errores de forma dinámica en pantalla con:
•	Animaciones 
•	Colores tipo semáforo (verde = éxito, rojo = error) 
•	Tiempo de visualización automático 

Esto mejora la experiencia del usuario al interactuar con el sistema.

### Página de Mis Propiedades
Después de un inicio de sesión exitoso:
•	El usuario es redirigido a la sección de Mis Propiedades 
•	Se muestra un encabezado global 
•	Incluye información del usuario autenticado 

### Bloqueo de Cuenta por Intentos Fallidos
El sistema implementa un mecanismo de seguridad:
•	Después de 5 intentos fallidos, la cuenta se bloquea 
•	El bloqueo se guarda en base de datos 
•	Se genera un token de desbloqueo 
•	Se envía un correo al usuario para recuperar el acceso 

# Pruebas del Sistema

## 🔹 Test: Interacción Rotativa
Se probó el flujo completo:
•	Registro 
•	Login 
•	Recuperación de contraseña

<img src="/public/img/Crear Cuenta.png" width="600">
<img src="/public/img/Iniciar Sesion.png" width="600">
<img src="/public/img/Recuperar Contraseña.png" width="600">

## 🔹 Test: Registro Exitoso
•	Usuario registrado correctamente 
•	Se genera token 
•	Se envía correo de confirmación

<img src="/public/img/LoginRegistro.png" width="600">
<img src="/public/img/registroExitoso.png" width="600">
<img src="/public/img/Estilizacion de correos 1.png" width="600">
<img src="/public/img/DB01.png" width="600">

## 🔹 Test: Registro Fallido por Formulario
•	Campos vacíos o inválido

<img src="/public/img/Error Formulario Registro.png" width="600">

## 🔹 Test: Registro Fallido por Correo Duplicado
•	Se detecta duplicidad en base de datos

<img src="/public/img/Error Usuario Duplicado.png" width="600">

## 🔹 Test: Cambio de Contraseña Exitoso
•	Usuario validado cambia contraseña

<img src="/public/img/DBPassOld.png" width="600">
<img src="/public/img/For.png" width="600">
<img src="/public/img/CorreoPass.png" width="600">
<img src="/public/img/ForRess.png" width="600">
<img src="/public/img/Nueva Contraseña.png" width="600">
<img src="/public/img/DBPassNew.png" width="600">

## 🔹 Test: Cambio Fallido (Usuario no validado)
•	Usuario no confirmado intenta cambiar contraseña

<img src="/public/img/usuarionoconfirmado.png" width="600">

## 🔹 Test: Login Exitoso
•	Usuario inicia sesión correctamente

<img src="/public/img/Inicio de sesion exitoso.png" width="600">
<img src="/public/img/Pantalla de Propiedades.png" width="600">

## 🔹 Test: Bloqueo de Cuenta
•	Después de 5 intentos fallidos

<img src="/public/img/Cuenta bloqueada.png" width="600">
<img src="/public/img/DB01.png" width="600">

## Seguridad Implementada
•	Encriptación de contraseñas con bcrypt 
•	Uso de tokens para autenticación y recuperación 
•	Protección mediante cookies seguras 
•	Validación en frontend y backend 
•	Bloqueo de cuentas por intentos fallidos 

## Conclusión
El sistema cumple con los requisitos de autenticación segura para una aplicación web moderna, proporcionando mecanismos robustos de validación, recuperación de acceso y protección contra intentos indebidos.
Además, se mejora la experiencia del usuario mediante mensajes dinámicos, interfaz clara y procesos automatizados como el envío de correos.

