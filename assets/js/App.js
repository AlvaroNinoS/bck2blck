// Variables Globales
let carrito       = [];
let productos     = [];

let gestor;

// Evento que se dispara cuadno se carga la pagina
document.addEventListener('DOMContentLoaded', () => {

    // Cargar el carrito con el localstorage, si no hay nada asignarle un array vacio
    carrito = JSON.parse( localStorage.getItem('carrito') ) || [];

    gestor = new GestionDeProductos();
    gestor.iniciar();
})

// Funcion para agregar al carrito un articulo
function addCarrito( id ) {
    
    const prod = document.querySelector('#row_'+id);
    let producto = new Producto (   id,
                                    prod.querySelector('h3').textContent,
                                    prod.querySelector('.precio').textContent.substring(1,6),
                                    prod.querySelector('img').src
                                );

   
    gestor.addCart( producto );
}

// Eliminar un articulo del carrito
function eliminar( id ) {   
    gestor.eliminarArticulo( id );
}


class GestionDeProductos {

    iniciar() {

        //Arreglo de productos
        productos = [

            {
                "id": 1,
                "nombre": "Cadena Lingot",
                "descripcion": "Cadena de plata",
                "precio": 60,
                "stock": 50,
                "img": "cadena.jpg",
            },
            {
                "id": 2,
                "nombre": "Backpack Verde",
                "descripcion": "Mochila de cuero",
                "precio": 100,
                "stock": 50,
                "img": "mochila.jpg",
            },

            {
                "id": 3,
                "nombre": "Hawkers X Anuel",
                "descripcion": "Gafas oscuras polarizadas",
                "precio": 80,
                "stock": 50,
                "img": "gafas.jpg",
            },
            {
                "id": 4,
                "nombre": "Joggers Zara",
                "descripcion": "Joggers Negros de colección",
                "precio": 74,
                "stock": 50,
                "img": "joggers.jpg",
            },
            {
                "id": 5,
                "nombre": "Cassio G-Shock",
                "descripcion": "Serie Blackout",
                "precio": 117,
                "stock": 50,
                "img": "reloj.jpg",
            },
            {
                "id": 6,
                "nombre": "Blck Rings",
                "descripcion": "Anillos en acero inoxidable",
                "precio": 17,
                "stock": 50,
                "img": "anillos.jpg",
            },
            {
                "id": 7,
                "nombre": "Leather Jacket",
                "descripcion": "Chamarra en cuero",
                "precio": 200,
                "stock": 50,
                "img": "chamarra.jpg",
            },
            {
                "id": 8,
                "nombre": "Lion Pin",
                "descripcion": "Pin de León",
                "precio": 20,
                "stock": 50,
                "img": "pin.jpg",
            }
        ]

        

        this.cargarProductos( productos );
        
        this.mostrarCarrito();
        
        this.actualizarContador();
             
    }


    // Funcion encargada de cargar los productos en la pagina
    cargarProductos( productos ) { 
        
        const divProductos    = document.querySelector('#productos');
        divProductos.innerHTML = '';

        if( productos.length === 0 ) {

            this.mostrarHeader('No se han encontrado productos para su búsqueda');
            return false;
        } 
        else {          

            productos.forEach( (producto) => {
    
                let prod = document.createElement('div');
                prod.classList.add( 'border', 'bg-white', 'rounded', 'mt-3', 'd-flex', 'align-items-center', 'p-3', 'flex-column', 'producto');
                prod.setAttribute('id', 'row_'+producto.id);    
               
        
                prod.innerHTML = `      <div>
                                            <img src="./assets/img/${producto.img}" alt="" class="producto-wrapper" >
                                        </div>
    
                                        <div class="p-3 d-flex flex-column text-center">
                                            <h3>${producto.nombre}</h3>                                            
                                            <p>${producto.descripcion.substring(0,120)}</p>
                                        </div>
    
                                        <div class="d-flex align-items-center justify-content-center flex-column">
                                            <p class="precio">$${producto.precio}</p>
                                            <a href="javascript:addCarrito(${producto.id})" class="btn btn-primary">Agregar al carrito</a>
                                        </div>`;
    
                divProductos.appendChild( prod );
    
            } )    
        }
    }



    addCart( infoProducto ) {
        
        
       const existe = carrito.some( producto => producto.id === infoProducto.id );

       // si ya existe necesito aumentar el contador
       if(existe) 
       {
          
           const articulos = carrito.map( producto => {

               if(producto.id === infoProducto.id)
               {
                   producto.cantidad++;
                   return producto;
               }
               else
               {
                   return producto;
               }

               carrito = articulos;               

           })

            Toastify({
                
                text: "Se actualizó la cantidad del producto",
                duration: 2000,
                gravity: "bottom"

            }).showToast();


    
       }
       else 
       {
           // Como no existe lo agrego
           carrito.push(infoProducto);
           Toastify({
                
                text: "Se agregó el producto",
                duration: 2000,
                gravity: "bottom"

            }).showToast();

       }

       this.actualizarCarrito();
    }

    //Contabilizo las cantidad de productos
    contarProductos() { 

        let contadorProductos = 0;

        carrito.forEach(( producto ) => {

            contadorProductos = contadorProductos + parseInt(producto.cantidad);
        })

        return contadorProductos;
    }

    //Actualizo el carrito
    actualizarCarrito() {

        
        this.actualizarContador();

        
        this.mostrarCarrito();

        
        this.guardarCarrito();
    }

    // Actualizar contador carrito
    actualizarContador() { 

        let totalArticulos = this.contarProductos();

        let countCarrito = document.querySelector('#badgeCarrito');

        // Actualizar contador del carrito
        countCarrito.innerHTML = totalArticulos;

    }

    // Actualizar detalle del carrito
    mostrarCarrito() { 

        let detalleCarrito = document.querySelector('#idCarrito');
    
        detalleCarrito.innerHTML = '';

        let total = 0;

        carrito.forEach( ( producto ) => {
           

            const row = document.createElement('div');
            row.classList.add('row');
            
            total += parseInt(producto.precio);

            row.innerHTML = `
                
                        <div class="col-3 d-flex align-items-center p-2 border-bottom">
                            <img src="${producto.img}" width="80"/>
                        </div>

                        <div class="col-3 d-flex align-items-center p-2 border-bottom bold">
                            ${producto.nombre}
                        </div>

                        <div class="col-3 d-flex align-items-center justify-content-end p-2 border-bottom">
                            $ ${producto.precio}
                        </div>

                        <div class="col-1 d-flex align-items-center justify-content-end p-2 border-bottom">
                            ${producto.cantidad}
                        </div>

                        <div class="col-2 d-flex align-items-center justify-content-center p-2 border-bottom">
                            <a href="javascript:eliminar(${producto.id})">
                                <i class="fa-solid fa-square-minus fa-2x"></i>
                            </a>
                        </div>
            `;
    
            
            detalleCarrito.appendChild(row);

        })

        let row = document.createElement('div');
        row.classList.add('row');
        
        row.innerHTML = `   <div class="col-4 d-flex align-items-center justify-content-start p-2 border-bottom">
                                Total a pagar:
                            </div>
                            <div class="col-8 d-flex align-items-center justify-content-end p-2 border-bottom">
                                <b> $ ${total}</b>
                            </div>`;

        // Agrega el HTML del carrito en el tbody
        detalleCarrito.appendChild(row);
    }

  
    // A partir de un id se elimina el producto
    // eliminarArticulo( id ) { 

    //         let resp = confirm("Esta seguro de eliminar el producto ?")
    //         if (resp)  {
    //             carrito = carrito.filter( producto => producto.id != id);
    //             this.actualizarCarrito();

    //             alert("El articulo fue eliminado del carrito");
       
    //         }            
          
    // }

     /* Si el usuario hace clic en el botón 'Sí, eliminar', el producto se elimina del carrito.  */
     eliminarArticulo(id){

        Swal.fire({

            title:'Está seguro de eliminar el producto',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, cancelar',
            cancelButtonColor: "#d33"

        }).then ((result) => {

            if (result.isConfirmed) {

                carrito = carrito.filter(producto => producto.id != id) ;
                this.actualizarCarrito();
            }


        })
    }
    
    // Guardar en Storage
    guardarCarrito() { 
       
        localStorage.setItem('carrito', JSON.stringify( carrito ));        
    }

    //Muestra un detalle de lo mostrado en pantalla
    mostrarHeader( msg ) { 
        const headerProductos = document.querySelector('#headerProductos');
        headerProductos.innerHTML = msg;
    }



}



