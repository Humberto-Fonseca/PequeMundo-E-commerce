document.addEventListener('DOMContentLoaded', () => {
    // 1. Actualizar contador del carrito globalmente
    actualizarContadorCarrito();

    // 2. Validación de Formulario (Registro)
    const formularioRegistro = document.getElementById('registro-form');
    const checkboxTerminos = document.getElementById('terminos');
    const botonRegistrarse = document.getElementById('btn-registrarse');

    if (checkboxTerminos && botonRegistrarse) {
        checkboxTerminos.addEventListener('change', function () {
            botonRegistrarse.disabled = !this.checked;
        });
    }

    if (formularioRegistro) {
        formularioRegistro.addEventListener('submit', function (e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const email = document.getElementById('email').value.trim();
            const contrasena = document.getElementById('password').value.trim();
            const terminos = document.getElementById('terminos').checked;

            if (!nombre || !email || !contrasena) {
                alert('Por favor, complete todos los campos obligatorios (Nombre, Email, Contraseña).');
                return;
            }

            if (!terminos) {
                alert('Debe aceptar los términos y condiciones.');
                return;
            }

            alert('¡Registro exitoso!');
            this.reset();
        });
    }

    // 3. Funcionalidad Agregar al Carrito (Catálogo)
    const botonesAgregarCarrito = document.querySelectorAll('.add-to-cart');
    if (botonesAgregarCarrito.length > 0) {
        botonesAgregarCarrito.forEach(boton => {
            boton.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                const nombreProducto = this.getAttribute('data-name');
                const precio = parseFloat(this.getAttribute('data-price'));

                let carrito = JSON.parse(localStorage.getItem('cart')) || [];

                const articuloExistente = carrito.find(articulo => articulo.id === id);
                if (articuloExistente) {
                    articuloExistente.cantidad = (articuloExistente.cantidad || articuloExistente.quantity || 0) + 1;
                } else {
                    carrito.push({ id, name: nombreProducto, price: precio, cantidad: 1 });
                }

                localStorage.setItem('cart', JSON.stringify(carrito));
                alert(`${nombreProducto} agregado al carrito.`);
                actualizarContadorCarrito();
            });
        });
    }

    // 4. Renderizar Carrito (Carrito)
    const contenedorArticulosCarrito = document.getElementById('cart-items');
    const elementoTotalCarrito = document.getElementById('cart-total');
    const botonVaciarCarrito = document.getElementById('clear-cart-btn');
    const botonPagar = document.getElementById('checkout-btn');

    if (contenedorArticulosCarrito) {
        mostrarCarrito();

        botonVaciarCarrito.addEventListener('click', () => {
            localStorage.removeItem('cart');
            mostrarCarrito();
            actualizarContadorCarrito();
        });
    }

    function mostrarCarrito() {
        if (!contenedorArticulosCarrito) return;

        let carrito = JSON.parse(localStorage.getItem('cart')) || [];
        contenedorArticulosCarrito.innerHTML = '';
        let total = 0;

        if (carrito.length === 0) {
            contenedorArticulosCarrito.innerHTML = '<li>El carrito está vacío.</li>';
            elementoTotalCarrito.textContent = '0.00';
            botonPagar.disabled = true;
            return;
        }

        carrito.forEach(articulo => {
            const cantidad = articulo.cantidad || articulo.quantity || 1;
            const li = document.createElement('li');
            const totalArticulo = articulo.price * cantidad;
            total += totalArticulo;
            li.innerHTML = `
                <span>${articulo.name} <input type="number" class="cart-qty-input" data-id="${articulo.id}" value="${cantidad}" min="1" style="width: 60px; margin-left: 10px; padding: 2px;"></span>
                <span>$${totalArticulo.toFixed(2)}</span>
            `;
            contenedorArticulosCarrito.appendChild(li);
        });

        elementoTotalCarrito.textContent = total.toFixed(2);
        botonPagar.disabled = false;

        // Añadir listeners para los inputs de cantidad
        const inputsCantidad = document.querySelectorAll('.cart-qty-input');
        inputsCantidad.forEach(input => {
            input.addEventListener('change', function () {
                const id = this.getAttribute('data-id');
                let nuevaCantidad = parseInt(this.value);
                if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
                    nuevaCantidad = 1;
                    this.value = 1;
                }

                let carritoActual = JSON.parse(localStorage.getItem('cart')) || [];
                const articulo = carritoActual.find(i => i.id === id);
                if (articulo) {
                    articulo.cantidad = nuevaCantidad;
                    // Limpiar 'quantity' antiguo si existiera
                    if (articulo.quantity !== undefined) delete articulo.quantity;
                    localStorage.setItem('cart', JSON.stringify(carritoActual));
                    mostrarCarrito();
                    actualizarContadorCarrito();
                }
            });
        });
    }

    function actualizarContadorCarrito() {
        const contadores = document.querySelectorAll('#cart-counter');
        let carrito = JSON.parse(localStorage.getItem('cart')) || [];
        const totalArticulos = carrito.reduce((suma, articulo) => suma + (articulo.cantidad || articulo.quantity || 0), 0);
        contadores.forEach(contador => {
            contador.textContent = totalArticulos;
        });
    }

    // 5. Búsqueda 🔍 simple (Busqueda)
    const botonBuscar = document.getElementById('search-btn');
    const inputBusqueda = document.getElementById('search-input');
    const listaResultados = document.getElementById('results-list');

    // Datos simulados para búsqueda
    const productosSimulados = [
        { name: "Short mickey azul", img: "assets/images/short_mickey_azul.jpg" },
        { name: "Camisa amarilla pooh", img: "assets/images/camisa_amarilla_pooh.jpg" },
        { name: "Camisa roja pooh", img: "assets/images/camisa_roja_pooh.jpg" },
        { name: "Playera azul-blanco mickey", img: "assets/images/playera_azul_blanco_mickey.jpg" },
        { name: "Conjunto goofy rojo", img: "assets/images/conjunto_goofy_rojo.jpg" },
        { name: "Pantalon tiger", img: "assets/images/pantalon_tiger.jpg" },
        { name: "Pantalon mickey", img: "assets/images/pantalon_mickey.jpg" },
        { name: "Short mickey celeste", img: "assets/images/short_mickey_celeste.jpg" }
    ];

    if (botonBuscar && inputBusqueda && listaResultados) {
        function realizarBusqueda() {
            const tituloBusqueda = document.getElementById('search-title');
            const consulta = inputBusqueda.value.toLowerCase().trim();
            listaResultados.innerHTML = '';

            if (consulta === '') {
                if (tituloBusqueda) tituloBusqueda.textContent = 'Resultados de búsqueda:';
                listaResultados.innerHTML = '<li>Por favor ingresa un término de búsqueda.</li>';
                return;
            }

            if (tituloBusqueda) {
                tituloBusqueda.textContent = `Resultados para la búsqueda de ${consulta}`;
            }

            const resultadosBusqueda = productosSimulados.filter(prod => prod.name.toLowerCase().includes(consulta));

            if (resultadosBusqueda.length > 0) {
                resultadosBusqueda.forEach(res => {
                    const li = document.createElement('li');
                    li.style.display = 'flex';
                    li.style.alignItems = 'center';
                    li.style.gap = '10px';
                    li.innerHTML = `<img src="${res.img}" alt="${res.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"> <span>${res.name}</span>`;
                    listaResultados.appendChild(li);
                });
            } else {
                listaResultados.innerHTML = '<li>No se encontraron productos.</li>';
            }
        }

        botonBuscar.addEventListener('click', realizarBusqueda);

        inputBusqueda.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                realizarBusqueda();
            }
        });
    }

    // 6. Botón Ver Más en Quiénes somos
    const botonVerMas = document.getElementById('ver-mas-btn');
    const masInfo = document.getElementById('more-info');
    if (botonVerMas && masInfo) {
        botonVerMas.addEventListener('click', function () {
            if (masInfo.style.display === 'none' || masInfo.style.display === '') {
                masInfo.style.display = 'block';
                botonVerMas.textContent = 'Ver menos';
            } else {
                masInfo.style.display = 'none';
                botonVerMas.textContent = 'Ver más';
            }
        });
    }
});
