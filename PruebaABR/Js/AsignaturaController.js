PruebaABR.controller('AsignaturaController', ['$scope', '$http', function ($scope) {
    $scope.Activo = false;
    $scope.AsignaturaSeleccionada = null;
    $scope.Init = function () {
        $.ajax({
            type: 'POST',
            url: 'ConsultaAsignaturas',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        }).done(function (response) {
            if (response) {
                var jsonObject = JSON.parse(response);
                $('#tablaAsignaturas').DataTable({
                    //dom: 'Bfrtip',
                    //buttons: [
                    //    'excel'
                    //],
                    data: jsonObject,
                    columns: [
                        { "data": "Codigo" },
                        { "data": "Nombre" },
                        { "data": "Persona" },
                        { "data": "Activo" }
                    ],
                    select: {
                        style: 'single'
                    }
                });
                var table = $('#tablaAsignaturas').DataTable();
                $('#tablaAsignaturas tbody').on('click', 'tr', function () {
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                    }
                    else {
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                    $scope.AsignaturaSeleccionada = table.row(this).data();
                    console.log($scope.AsignaturaSeleccionada);
                });
            }
        }).fail(function (a, b, c) {
            console.log(a, b, c);
            iziToast.error({
                title: 'Error',
                message: 'Se produjo un error. Contacta al administrador',
            });
        });
        $scope.ConsultarProfesores();
    }

    $scope.ConsultarProfesores = function () {
        $.ajax({
            type: 'POST',
            url: 'ConsultaProfesores',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        }).done(function (response) {
            if (response) {
                $scope.Profesores = JSON.parse(response);
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            }
        }).fail(function (a, b, c) {
            console.log(a, b, c);
            iziToast.error({
                title: 'Error',
                message: 'Se produjo un error. Contacta al administrador',
            });
        });
    }

    $scope.AbrirModalAsignatura = function () {
        $('#AsignaturaID').val('');
        $('#Codigo').val('');
        $('#Nombre').val('');
        $('#PersonaID').val('');
        $scope.Activo = false;
        $('#Activo').prop('checked', false);
        $('#asignaturaModal').modal('show');
    }

    $scope.ActivoAsignatura = function () {
        if (!$scope.Activo) {
            $scope.Activo = true;
        } else {
            $scope.Activo = false;
        }
    }

    $scope.GuardarAsignatura = function () {
        let objectAsignatura = $('#formularioPersona').serializeJSON();
        objectAsignatura.Activo = $scope.Activo;
        if (objectAsignatura.Nombre && objectAsignatura.Codigo && objectAsignatura.PersonaID) {
            console.log(objectAsignatura);
            $.ajax({
                type: 'POST',
                url: 'GuardarAsignatura',
                data: objectAsignatura
            }).done(function (response) {
                if (response) {
                    var jsonObject = JSON.parse(response);
                    if (jsonObject.Exitoso) {
                        iziToast.success({
                            title: 'Transacción Exitosa',
                            message: jsonObject.Descripcion
                        });
                        $('#asignaturaModal').modal('hide');
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

    $scope.EditarAsignatura = function () {
        if ($scope.AsignaturaSeleccionada) {
            $('#asignaturaModal').modal('show');
            $('#AsignaturaID').val($scope.AsignaturaSeleccionada.AsignaturaID);
            $('#Codigo').val($scope.AsignaturaSeleccionada.Codigo);
            $('#Nombre').val($scope.AsignaturaSeleccionada.Nombre);
            $('#PersonaID').val($scope.AsignaturaSeleccionada.PersonaID);
            if ($scope.AsignaturaSeleccionada.Activo == 'Activo') {
                $scope.Activo = true;
                $('#Activo').prop('checked', true);
            } else {
                $scope.Activo = false;
                $('#Activo').prop('checked', false);
            }
        } else {
            iziToast.error({
                title: 'Validación',
                message: 'Por favor seleccione una asignatura para editarlo',
            });
        }
    }
}]);