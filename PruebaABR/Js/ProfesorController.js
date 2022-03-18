PruebaABR.controller('ProfesorController', ['$scope', '$http', function ($scope) {
    $scope.Activo = false;
    $scope.ProfesorSeleccionado = null;
    $scope.Init = function () {
        $.ajax({
            type: 'POST',
            url: 'ConsultaProfesores',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        }).done(function (response) {
            if (response) {
                var jsonObject = JSON.parse(response);
                $('#tablaProfesores').DataTable({
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
                var table = $('#tablaProfesores').DataTable();
                $('#tablaProfesores tbody').on('click', 'tr', function () {
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                    }
                    else {
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                    $scope.ProfesorSeleccionado = table.row(this).data();
                    console.log($scope.ProfesorSeleccionado);
                });
            }
        }).fail(function () {
            iziToast.error({
                title: 'Error',
                message: 'Se produjo un error. Contacta al administrador',
            });
        });
    }

    $scope.AbrirModalProfesor = function () {
        $('#PersonaID').val('');
        $('#Nombre').val('');
        $('#Apellido').val('');
        $('#Identificacion').val('');
        $('#Edad').val('');
        $('#Direccion').val('');
        $('#Telefono').val('');
        $scope.Activo = false;
        $('#Activo').prop('checked', false);
        $('#profesorModal').modal('show');
    }

    $scope.ActivoUsuario = function () {
        if (!$scope.Activo) {
            $scope.Activo = true;
        } else {
            $scope.Activo = false;
        }
    }

    $scope.GuardarProfesor = function () {
        let objectoProfesor = $('#formularioPersona').serializeJSON();
        objectoProfesor.Activo = $scope.Activo;
        if (objectoProfesor.Nombre && objectoProfesor.Apellido && objectoProfesor.Identificacion && objectoProfesor.Telefono) {
            console.log(objectoProfesor);
            $.ajax({
                type: 'POST',
                url: 'GuardarProfesor',
                data: objectoProfesor
            }).done(function (response) {
                if (response) {
                    var jsonObject = JSON.parse(response);
                    if (jsonObject.Exitoso) {
                        iziToast.success({
                            title: 'Transacción Exitosa',
                            message: jsonObject.Descripcion
                        });
                        $('#profesorModal').modal('hide');
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

    $scope.EditarProfesor = function () {
        if ($scope.ProfesorSeleccionado) {
            $('#profesorModal').modal('show');
            $('#PersonaID').val($scope.ProfesorSeleccionado.PersonaID);
            $('#Nombre').val($scope.ProfesorSeleccionado.Nombre);
            $('#Apellido').val($scope.ProfesorSeleccionado.Apellido);
            $('#Identificacion').val($scope.ProfesorSeleccionado.Identificacion);
            $('#Edad').val($scope.ProfesorSeleccionado.Edad);
            $('#Direccion').val($scope.ProfesorSeleccionado.Direccion);
            $('#Telefono').val($scope.ProfesorSeleccionado.Telefono);
            if ($scope.ProfesorSeleccionado.Activo == 'Activo') {
                $scope.Activo = true;
                $('#Activo').prop('checked', true);
            } else {
                $scope.Activo = false;
                $('#Activo').prop('checked', false);
            }
        } else {
            iziToast.error({
                title: 'Validación',
                message: 'Por favor seleccione un profesor para editarlo',
            });
        }
    }
}]);