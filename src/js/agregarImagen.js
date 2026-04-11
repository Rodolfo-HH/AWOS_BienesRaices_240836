import { Dropzone } from "dropzone";

Dropzone.autoDiscover = false;

document.addEventListener('DOMContentLoaded', () => {
    const tokenMeta = document.querySelector('meta[name="csrf-token"]');
    
    if (!tokenMeta) {
        console.error('❌ No se encontró el meta tag csrf-token');
        return;
    }
    
    const token = tokenMeta.getAttribute('content');
    console.log('✅ Token CSRF encontrado:', token);

    const formElement = document.querySelector('#imagen');
    
    const dz = new Dropzone('#imagen', {
        url: formElement.action,
        method: 'POST',
        
        // IMPORTANTE: Enviar credenciales (cookies de sesión)
        withCredentials: true,
        
        // Enviar el token en el header
        headers: {
            'CSRF-Token': token,
            'X-CSRF-Token': token
        },
        
        dictDefaultMessage: 'Arrastra tu imagen aquí o haz click para seleccionar',
        dictRemoveFile: 'Eliminar imagen',
        dictCancelUpload: 'Cancelar',
        dictMaxFilesExceeded: 'Solo puedes subir una imagen',
        
        acceptedFiles: '.png,.jpg,.jpeg,.webp',
        maxFiles: 1,
        autoProcessQueue: false,
        addRemoveLinks: true,
        paramName: 'imagen',
        uploadMultiple: false,
        parallelUploads: 1,
        maxFilesize: 5, // MB

        init: function() {
            const dropzone = this;
            const btnPublicar = document.querySelector('#publicar');

            // Prevenir que el botón submita el form tradicionalmente
            btnPublicar.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (dropzone.files.length === 0) {
                    alert('Por favor selecciona una imagen primero');
                    return;
                }
                
                console.log('🚀 Procesando cola...');
                dropzone.processQueue();
            });

            // Debug: antes de enviar
            this.on('sending', function(file, xhr, formData) {
                console.log('📤 Enviando archivo...');
                console.log('Token en header:', token);
                
                // También añadir al formData por si acaso
                formData.append('_csrf', token);
                
                // Debug: mostrar todo el formData
                console.log('FormData contenido:');
                for (let pair of formData.entries()) {
                    console.log(`  ${pair[0]}: ${pair[1]}`);
                }
            });

            this.on('success', function(file, response) {
                console.log('✅ Éxito:', response);
                // Redirigir después de éxito
                window.location.href = '/mis-propiedades';
            });

            this.on('error', function(file, errorMessage, xhr) {
                console.error('❌ Error:', errorMessage);
                console.error('XHR:', xhr);
                
                if (typeof errorMessage === 'string' && errorMessage.includes('CSRF')) {
                    alert('Error de seguridad: Token CSRF inválido. Recarga la página e intenta de nuevo.');
                } else {
                    alert('Error al subir la imagen: ' + errorMessage);
                }
            });

            this.on('maxfilesexceeded', function(file) {
                this.removeAllFiles();
                this.addFile(file);
            });

            this.on('addedfile', function(file) {
                const mensaje = document.querySelector('.dz-message');
                if (mensaje) mensaje.style.display = 'none';
                
                // Validar tipo de archivo
                const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
                if (!validTypes.includes(file.type)) {
                    this.removeFile(file);
                    alert('Solo se permiten imágenes JPG, PNG o WEBP');
                }
            });

            this.on('removedfile', function() {
                if (this.files.length === 0) {
                    const mensaje = document.querySelector('.dz-message');
                    if (mensaje) mensaje.style.display = 'block';
                }
            });
        }
    });
});