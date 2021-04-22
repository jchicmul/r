$(document).ready(function () {
  $('#listaTrab').DataTable();
  $('#listaUsuarios').DataTable();
  $('#trabajadorEvaluado').DataTable();
  $('#listaRenovacion').DataTable();
  $('#listaSalario').DataTable();
  $('#listaConAltaReingreso').DataTable();
});

function datoo(id){

  const app = document.getElementById(id);
  console.log(app.children[0].textContent);
  console.log(app.children[3].textContent);
  console.log(app.length);
}

function toggleForm(){
  container = document.querySelector('.containers');
  container.classList.toggle('active');
}

function llenarPuestos() {
  $.ajax({
    url: "/trabajador/add",
    method: "GET",
    dataType: "json",
    success: function (puestos) {
      console.log(puestos);
      var sel = $("#salario");
      sel.empty();
      for (var i = 0; i < puestos.length; i++) {
        sel.append('<option value="' + puestos[i].idd + '">' + puestos[i].puestod + '</option>');
      }
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}

function agregarTrabajador() {
  var paterno = $("#paterno").val();
  var materno = $("#materno").val();
  var nombre = $("#nombre").val();
  var rfc = $("#rfc").val();
  var curp = $("#curp").val();
  var direccion = $("#direccion").val();
  var colonia = $("#colonia").val();

  var newtrabajador = {
    id: $("#id").val(),
    paterno: paterno.toUpperCase(),
    materno: materno.toUpperCase(),
    nombre: nombre.toUpperCase(),
    direccion: direccion.toUpperCase(),
    colonia: colonia.toUpperCase(),
    nss: $("#nss").val(),
    rfc: rfc.toUpperCase(),
    curp: curp.toUpperCase(),
    tipoc: $("#tipoc").val(),
    ingreso: $("#ingreso").val(),
    salario: $("#salario").val(),
    tipot: $("#tipot").val(),
    tipou: "1"
  };
  $.ajax({
    data: newtrabajador,
    url: "/trabajador/add",
    method: "post",
    dataType: "json",
    success: function (respuesta) {
      window.location.replace("/trabajador/");
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });

}

function mostrarUsuario(id) {
  $.ajax({
    url: "/usuarios/usuario/" + id,
    method: "GET",
    dataType: "json",
    success: function (usuario) {
      document.getElementById("idU").innerHTML = usuario.id;
      document.getElementById("nombreU").innerHTML = usuario.username;
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}

function mostraTrabajador(id) {
  $.ajax({
    url: "/trabajador/reingreso/" + id,
    method: "GET",
    dataType: "json",
    success: function (usuario) {
      document.getElementById("numeroR").value = usuario.trabajador[0].id;
      document.getElementById("nombreR").value = usuario.trabajador[0].Nombre;
      var sel = $("#puestoR");
      for (var i = 0; i < usuario.puestos.length; i++) {
        sel.append('<option value="' + usuario.puestos[i].idd + '">' + usuario.puestos[i].puestod + '</option>');
      }
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}

function cambioNivel() {
  var newNivel = {
    id: document.getElementById("idU").innerHTML,
    nvl: document.getElementById("nvl").value
  };
  console.log(newNivel);
  $.ajax({
    data: newNivel,
    url: "/usuarios/cambioNivel",
    method: "post",
    dataType: "json",
    success: function (respuesta) {
      console.log(respuesta);
      window.location.replace("/usuarios/usuarios");
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}

function altapuesto() {
  $.ajax({
    url: "/puestos/add",
    method: "post"
  }).done(d => {
    Swal.fire('Guardado');
  });
}

function datoContrato(id) {
  $.ajax({
    url: "/trabajador/contract/" + id,
    method: "GET",
    dataType: "json",
    success: function (usuario) {
      console.log(usuario);
      document.getElementById("numeroc").value = usuario.trabajador[0].id;
      document.getElementById("nombrec").value = usuario.trabajador[0].Nombre;
      var sel = $("#puestoc");
      for (var i = 0; i < usuario.puestosc.length; i++) {
        sel.append('<option value="' + usuario.puestosc[i].idd + '">' + usuario.puestosc[i].puestod + '</option>');
      }
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}

function agregaContrato() {
  var newNivel = {
    numero: document.getElementById("numeroc").value,
    numcon: 1,
    tm: document.getElementById("tm").value,
    puestoC: document.getElementById("puestoc").value
  };
  $.ajax({
    data: newNivel,
    url: "/trabajador/newcontract",
    method: "post",
    dataType: "json",
    success: function (respuesta) {
      Swal.fire(
        'Good job!',
        'Contrato Agregado con éxito!',
        'success'
      )
      $("#addContrato").modal("hide");
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}

function mostrarUsuarios(id) {
  console.log(id);
  $.ajax({
    url: "/trabajador/supervisor/" + id,
    method: "GET",
    dataType: "json",
    success: function (usuario) {
      console.log(usuario);
      document.getElementById("numeros").value = usuario.trabajador[0].id;
      document.getElementById("nombres").value = usuario.trabajador[0].Nombre;
      document.getElementById("numeroB").value = usuario.trabajador[0].id;
      document.getElementById("nombreB").value = usuario.trabajador[0].Nombre;
      for(var i = 0 in usuario.supervisor) {
        document.getElementById("encargado").innerHTML += "<option value='"+usuario.supervisor[i].id+"'>"+usuario.supervisor[i].username+'('+usuario.supervisor[i].id+')'+"</option>";
      }
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}

function agregaSupervisor() {
  var newSup = {
    numero: document.getElementById("numeros").value,
    encargado: document.getElementById("encargado").value, 
  };
  $.ajax({
    data: newSup,
    url: "/trabajador/supervisor",
    method: "post",
    dataType: "json",
    success: function (respuesta) {
      Swal.fire(
        'Good job!',
        'Contrato Agregado con éxito!',
        'success'
      )
      $("#addContrato").modal("hide");
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}

function agregaBaja() {
  var newBaja = {
    numero: document.getElementById("numeroB").value,
    baja: document.getElementById("fbaja").value, 
    tb: document.getElementById("tb").value, 
  };
  $.ajax({
    data: newBaja,
    url: "/trabajador/baja",
    method: "post",
    dataType: "json",
    success: function (respuesta) {
      window.location.replace("/trabajador/");
      Swal.fire(
        'Good job!',
        'Contrato Agregado con éxito!',
        'success'
      )
      $("#addBaja").modal("hide");
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}

function agregaReingreso() {
  var newReingreso = {
    numero: document.getElementById("numeroR").value,
    reingreso: document.getElementById("freingreso").value,
    salario: document.getElementById("puestoR").value,
    baja: 'NULL',
    tipot:document.getElementById("tipotR").value,
    tipoc:document.getElementById("tipocR").value
  };
  $.ajax({
    data: newReingreso,
    url: "/trabajador/reingreso",
    method: "post",
    dataType: "json",
    success: function (respuesta) {
      window.location.replace("/trabajador/");
      Swal.fire(
        'Good job!',
        'Contrato Agregado con éxito!',
        'success'
      )
      $("#addBaja").modal("hide");
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}

function mostrarTrabEvaluar(id) {
  $.ajax({
    url: "/contrato/evaluacion/" + id,
    method: "GET",
    dataType: "json",
    success: function (usuario) {
      document.getElementById("renovacionId").innerHTML = usuario.id;
      document.getElementById("renovacionNombre").innerHTML = usuario.Nombre;
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}

function calificarContrato() {
  const id = document.getElementById("numero").value;
  var newCalificar = {
    id: document.getElementById("renovacionId").innerHTML,
    dc0: document.getElementById("dc0").value,
    dc1: document.getElementById("dc1").value,
    dc2: document.getElementById("dc2").value,
    dc3: document.getElementById("dc3").value,
    dc4: document.getElementById("dc4").value,
    dc5: document.getElementById("dc5").value,
    dc6: document.getElementById("dc6").value,
    dc7: document.getElementById("dc7").value,
    dc8: document.getElementById("dc8").value,
    dc9: document.getElementById("dc9").value,
    comentario: document.getElementById("comentarios").value,
    aut: document.getElementById("aut").value,
    diasr: document.getElementById("diasR").value,
  };
  $.ajax({
    data: newCalificar,
    url: "/contrato/evaluacion/",
    method: "post",
    dataType: "json",
    success: function (respuesta) {
      
      Swal.fire(
        'Good job!',
        'Contrato Agregado con éxito!',
        'success'
      )
      $("#renovacionModal").modal("hide");
      var url = "/contrato/contratos/" + id;
      window.location.replace(url);
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}

function mostrarEvaluacion(nvl) {
  $.ajax({
    url: "/contrato/evaluado/" + nvl,
    method: "GET",
    dataType: "json",
    success: function (usuario) {
      document.getElementById("idE").innerHTML = usuario.id;
      document.getElementById("nombreE").innerHTML = usuario.Nombre;
      $("#dc0 option[value="+ usuario.dc0 +"]").attr("selected",true);
      $("#dc1 option[value="+ usuario.dc1 +"]").attr("selected",true);
      $("#dc2 option[value="+ usuario.dc2 +"]").attr("selected",true);
      $("#dc3 option[value="+ usuario.dc3 +"]").attr("selected",true);
      $("#dc4 option[value="+ usuario.dc4 +"]").attr("selected",true);
      $("#dc5 option[value="+ usuario.dc5 +"]").attr("selected",true);
      $("#dc6 option[value="+ usuario.dc6 +"]").attr("selected",true);
      $("#dc7 option[value="+ usuario.dc7 +"]").attr("selected",true);
      $("#dc8 option[value="+ usuario.dc8 +"]").attr("selected",true);
      $("#dc9 option[value="+ usuario.dc9 +"]").attr("selected",true);
      $("#aut option[value="+ usuario.aut +"]").attr("selected",true);
      $("#diasR option[value="+ usuario.diasr +"]").attr("selected",true);
      document.getElementById("comentario").innerHTML= usuario.comentario;
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}

function autorizaG(nvl) {
  var autConGcia = {
    id:document.getElementById("idE").innerHTML,
    nl:nvl+1,
    aut: document.getElementById("aut").value,
    diasr: document.getElementById("diasR").value
  }
  console.log(autConGcia);
  $.ajax({
    data:autConGcia,
    url: "/contrato/autorizacion/",
    method: "POST",
    dataType: "json",
    success: function (usuario) {
      $("#vistaEvaluadoModal").modal("hide");
      var url = "/contrato/autorizacion/" + nvl;
      window.location.replace(url);
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}

function datosExpediente(id) {
  $.ajax({
    url: "/contrato/expediente/" + id,
    method: "GET",
    dataType: "json",
    success: function (usuario) {
      console.log(usuario);
      document.getElementById("idx").innerHTML = usuario.id;
      document.getElementById("nombrex").innerHTML = usuario.Nombre;
      document.getElementById("deptox").innerHTML = usuario.deptod;
      document.getElementById("puestox").innerHTML = usuario.puestod;
      
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}

function autorizaX(nvl) {
   var newExpediente = {
    id: document.getElementById("idx").innerHTML,
    diasr: document.getElementById("diasR").value,
    dias:0,
    nl: Number(nvl)+1
  };
  $.ajax({
    data: newExpediente,
    url: "/contrato/autorizaX/",
    method: "POST",
    dataType: "json",
    success: async function (usuario) {
      $("#vistaExpedientes").modal("hide");
      var url = "/contrato/autorizacionR/" + nvl;
      await window.location.replace(url);
      Swal.fire(
        'Good job!',
        'Contrato Autorizado con éxito!',
        'success'
      )
      
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}

function cancelaX(nvl) {
  var dataCanX = {
    id: document.getElementById("idx").innerHTML
  };
 $.ajax({
   data: dataCanX,
   url: "/contrato/cancelaX/",
   method: "POST",
   dataType: "json",
   success: async function (usuario) {
     $("#vistaExpedientes").modal("hide");
     var url = "/contrato/autorizacionR/" + nvl;
     await window.location.replace(url);
     Swal.fire(
       'Good job!',
       'Contrato Autorizado con éxito!',
       'success'
     )
     
   },
   error: function () {
     console.log("No se ha podido obtener la información");
   }
 });
}

// PROCESOS PARA REPORTES

function datosContrato(id) {
  $.ajax({
    url: "/reportes/datosContratos/" + id,
    method: "GET",
    dataType: "json",
    success: function (usuario) {
      console.log(usuario);
      document.getElementById("numeroCX").value = usuario.id;
      document.getElementById("nombreCX").value = usuario.Nombre;
      
    },
    error: function () {
      console.log("No se ha podido obtener la información");
    }
  });
}