function cambiarBotonSinStock(){
    productos.forEach((producto, index) => {
        if (producto.stock === 0) {
            btnStock.forEach(boton => {
                if (boton.getAttribute("value") == producto.id) {
                    boton.innerHTML = '<span class="no-stock">Sin stock</span>'
                }
            })
        }
    })
}

function agregarAlCarrito(id){
    const productoEncontrado = productos.findIndex((Element) => Element.id == id)
    if(productoEncontrado !== -1 && productos[productoEncontrado].stock > 0){
        productos[productoEncontrado].stock --
        const iCarrito = carrito.findIndex(item => item.id == id)
        if(iCarrito !== -1){
            carrito[iCarrito].cantidad++
        }else{
            const nuevoProducto = {...productos[productoEncontrado], cantidad: 1}
            carrito.push(nuevoProducto)
        }
        acumuladorCarrito()
        localStorage.setItem('productos', JSON.stringify(productos))
        localStorage.setItem('carrito', JSON.stringify(carrito))
        mostrarMensajeAgregadoAlCarrito(productoEncontrado)
    }
    cambiarBotonSinStock()
}

function acumuladorCarrito(){
    let totalProductos = 0
    carrito.forEach(item => {
        totalProductos += item.cantidad
    })
    contadorCarrito.innerText = totalProductos
}

function mostrarMensajeAgregadoAlCarrito(id){
    msgAgregado[id].innerText = 'AGREGADO AL CARRITO'
    setTimeout(() => {
        msgAgregado[id].innerText = ' '
    }, 500)
}

function actualizarCarrito() {
    listaCarrito.innerHTML = ''
    let totalAPagar = 0
    let descontar = 0
    
    if (carrito.length > 0) {
        carrito.forEach(item => {
            const precioUnidad = item.precio
            const cantidadProducto = item.cantidad
            let totalPorProducto = precioUnidad * cantidadProducto
            const productoLista = document.createElement('article')
            
            productoLista.classList.add('art-carrito')
            productoLista.innerHTML = `
            <img class="muestra-carrito" src="${item.imagen}" alt="${item.nombre}">
            <span class="descripcion-carrito">${item.nombre}</span>
            <span class="descripcion-carrito text-center">Precio<br>$${totalPorProducto}</span>
            <span class="descripcion-carrito text-center">Cantidad<br>${item.cantidad} Un.</span>
            <button class="btn-eliminar" value=${item.id}><img class="img-eliminar" src="./imagenes/eliminar.png" alt="Eliminar"></button>
            `
            listaCarrito.appendChild(productoLista)
            
            const subtotal = item.precio * item.cantidad
            totalAPagar += subtotal
        })

        const codigoDescuento = document.createElement('span')
        codigoDescuento.classList.add('descuento')
        codigoDescuento.innerHTML = `<span>Codigo de descuento: </span>
        <input class="codigo-ingresado" type="text" placeholder="CODIGO">
        <button class="btn-codigo">Enviar</button>`
        listaCarrito.appendChild(codigoDescuento)
        validarCodigo(totalAPagar)
        const totalAPagarDiv = document.createElement('div')
        totalAPagarDiv.classList.add('total-precio', 'pt-3')
        totalAPagarDiv.innerHTML = `Total a pagar: $${totalAPagar}`
        listaCarrito.appendChild(totalAPagarDiv)
    }else{
        mostrarErrorCarrito()
    }   
} 

function mostrarErrorCarrito(){
        const nuevoItem = document.createElement('article')
        nuevoItem.classList.add('no-stock', 'p-5', 'h1', 'text-center')
        nuevoItem.innerHTML = `<img class="apagado text-center" src="./imagenes/carrito.png"></img>
        <br><br><span class="text-center">NO EXISTEN PRODUCTOS EN EL CARRITO</span><br><br>
        <a class="nav-link" href="./index.html"><button class="agregarAlCarrito">Ir a la tienda</button></a>`
        listaCarrito.appendChild(nuevoItem)
}

function eliminarDelCarrito(id) {
    const indiceProductoOriginal = carrito.findIndex(item => item.id === id)
    if (indiceProductoOriginal !== -1) {
        if (carrito[indiceProductoOriginal].cantidad > 1) {
            carrito[indiceProductoOriginal].cantidad--
        } else {
            carrito.splice(indiceProductoOriginal, 1)
        }
        const indiceProducto = productos.findIndex(item => item.id === id)
        productos[indiceProducto].stock++
        acumuladorCarrito()
        localStorage.setItem('productos', JSON.stringify(productos))
        localStorage.setItem('carrito', JSON.stringify(carrito))
        actualizarCarrito()
    }
}

function crearCodigo(){
    const newsDiv = document.querySelector('.total-precio');
    const nuevoMensaje = document.createElement('div')
    nuevoMensaje.classList.add('newsletter-texto')
    nuevoMensaje.innerHTML = `TU CODIGO ES: NIKE10OFF`
    newsDiv.appendChild(nuevoMensaje)

}

function validarCodigo(precio){
    if(localStorage.getItem('email') !== null){
        const emailOriginal = localStorage.getItem('email')
        const btnCodigo = document.querySelector('.btn-codigo')
        const codigoIngresado = document.querySelector('.codigo-ingresado')
        const codigoOff = 'NIKE10OFF'
        btnCodigo.addEventListener('click', () => {
            const codigoValue = codigoIngresado.value.toUpperCase()
            if(codigoValue === codigoOff){
                const msgExito = document.createElement('span')
                msgExito.classList.add('total-precio')
                msgExito.innerHTML = `<span>Codigo Correcto</span>`
                listaCarrito.appendChild(msgExito)
                setTimeout(() => {
                    listaCarrito.removeChild(msgExito)
                }, 1000)
                setTimeout(()=>{
                    const msgDescuento = document.createElement('span')
                    msgDescuento.classList.add('total-precio')
                    msgDescuento.innerHTML = `Precio con descuento: $${(precio * 0.90)}`
                    listaCarrito.appendChild(msgDescuento)
                },1000)
            }
            else{
                const msgError = document.createElement('span')
                msgError.classList.add('total-precio')
                msgError.innerHTML = `<span>Codigo Incorrecto</span>`
                listaCarrito.appendChild(msgError)
                setTimeout(()=>{
                    listaCarrito.removeChild(msgError)
                }, 1000)
            }
        })
    }
}