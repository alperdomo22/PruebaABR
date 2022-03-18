PruebaABR.controller('AlumnoController', ['$scope', '$http', function ($scope) {
    $scope.Activo = false;
    $scope.AlumnoSeleccionado = null;
    $scope.Init = function () {
        $.ajax({
            type: 'POST',
            url: 'ConsultaAlumnos',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        }).done(function (response) {
            if (response) {
                var jsonObject = JSON.parse(response);
                $('#tablaAlumnos').DataTable({
                    //dom: 'Bfrtip',
                    //buttons: [
                    //    'excel'
                    //],
                    data: jsonObject,
                    columns: [
                        { "data": "Identificacion" },
                        { "data": "Nombre" },
                        { "data": "Apellido" },
                        { "data": "Edad" },
                        { "data": "Direccion" },
                        { "data": "Telefono" },
                        { "data": "Activo" }
                    ],
                    select: {
                        style: 'single'
                    }
                });
                var table = $('#tablaAlumnos').DataTable();
                $('#tablaAlumnos tbody').on('click', 'tr', function () {
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                    }
                    else {
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                    $scope.AlumnoSeleccionado = table.row(this).data();
                    console.log($scope.AlumnoSeleccionado);
                });
            }
        }).fail(function () {
            iziToast.error({
                title: 'Error',
                message: 'Se produjo un error. Contacta al administrador',
            });
        });
    }

    $scope.AbrirModalAlumno = function () {
        $('#PersonaID').val('');
        $('#Nombre').val('');
        $('#Apellido').val('');
        $('#Identificacion').val('');
        $('#Edad').val('');
        $('#Direccion').val('');
        $('#Telefono').val('');
        $scope.Activo = false;
        $('#Activo').prop('checked', false);
        $('#alumnoModal').modal('show');
    }

    $scope.ActivoUsuario = function () {
        if (!$scope.Activo) {
            $scope.Activo = true;
        } else {
            $scope.Activo = false;
        }
    }

    $scope.GuardarAlumno = function () {
        let objectoAlumno = $('#formularioPersona').serializeJSON();
        objectoAlumno.Activo = $scope.Activo;
        if (objectoAlumno.Nombre && objectoAlumno.Apellido && objectoAlumno.Identificacion && objectoAlumno.Telefono) {
            console.log(objectoAlumno);
            $.ajax({
                type: 'POST',
                url: 'GuardarAlumno',
                data: objectoAlumno
            }).done(function (response) {
                if (response) {
                    var jsonObject = JSON.parse(response);
                    if (jsonObject.Exitoso) {
                        iziToast.success({
                            title: 'Transacción Exitosa',
                            message: jsonObject.Descripcion
                        });
                        $('#alumnoModal').modal('hide');
                        setTimeout(function () {
                            location.reload();
                        }, 2000);
                    } else {
                        iziToast.warning({
                            title: 'Error',
                            message: jsonObject.Descripcion
                        });
                    }
                }
            }).fail(function (a, b, c) {
                console.log(a, b, c);
                iziToast.error({
                    title: 'Error',
                    message: 'Se produjo un error. Contacta al administrador',
                });
            });
        } else {
            iziToast.error({
                title: 'Validación',
                message: 'Por favor diligencie el formulario',
            });
        }
    }

    $scope.EditarAlumno = function () {
        if ($scope.AlumnoSeleccionado) {
            $('#alumnoModal').modal('show');
            $('#PersonaID').val($scope.AlumnoSeleccionado.PersonaID);
            $('#Nombre').val($scope.AlumnoSeleccionado.Nombre);
            $('#Apellido').val($scope.AlumnoSeleccionado.Apellido);
            $('#Identificacion').val($scope.AlumnoSeleccionado.Identificacion);
            $('#Edad').val($scope.AlumnoSeleccionado.Edad);
            $('#Direccion').val($scope.AlumnoSeleccionado.Direccion);
            $('#Telefono').val($scope.AlumnoSeleccionado.Telefono);
            if ($scope.AlumnoSeleccionado.Activo == 'Activo') {
                $scope.Activo = true;
                $('#Activo').prop('checked', true);
            } else {
                $scope.Activo = false;
                $('#Activo').prop('checked', false);
            }
        } else {
            iziToast.error({
                title: 'Validación',
                message: 'Por favor seleccione un alumno para editarlo',
            });
        }
    }

    $scope.EliminarAlumno = function () {
        if ($scope.AlumnoSeleccionado) {
            var ocbjectEnvio = {
                PersonaID: $scope.AlumnoSeleccionado.PersonaID
            };
            $.ajax({
                type: 'POST',
                url: 'EliminarAlumno',
                data: ocbjectEnvio
            }).done(function (response) {
                if (response) {
                    var jsonObject = JSON.parse(response);
                    if (jsonObject.Exitoso) {
                        iziToast.success({
                            title: 'Transacción Exitosa',
                            message: jsonObject.Descripcion
                        });
                        setTimeout(function () {
                            location.reload();
                        }, 2000);
                    } else {
                        iziToast.warning({
                            title: 'Error',
                            message: jsonObject.Descripcion
                        });
                    }
                }
            }).fail(function (a, b, c) {
                console.log(a, b, c);
                iziToast.error({
                    title: 'Error',
                    message: 'Se produjo un error. Contacta al administrador',
                });
            });
        } else {
            iziToast.error({
                title: 'Validación',
                message: 'Por favor seleccione un alumno para eliminarlo',
            });
        }
    }
}]);