PruebaABR.controller('AsignarController', ['$scope', '$http', function ($scope) {
    $scope.Activo = false;
    $scope.AsignaturaSeleccionada = null;
    $scope.ProfesorSeleccionado = null;
    $scope.listaMateriasAsociadas = [];
    $scope.Init = function () {
        $.ajax({
            type: 'POST',
            url: 'ConsultaAsignaturas',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        }).done(function (response) {
            if (response) {
                var jsonObject = JSON.parse(response);
                $scope.listaAsignaturas = _.where(jsonObject, { Activo: 'Activo' });
                $scope.ConsultarAlumnos();
            }
        }).fail(function (a, b, c) {
            console.log(a, b, c);
            iziToast.error({
                title: 'Error',
                message: 'Se produjo un error. Contacta al administrador',
            });
        });
    }

    $scope.ConsultarAlumnos = function () {
        $.ajax({
            type: 'POST',
            url: 'ConsultaAlumnos',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        }).done(function (response) {
            if (response) {
                var listaAlumnos = JSON.parse(response);
                $scope.listaAlumnosScope = _.where(listaAlumnos, { Activo: 'Activo' });
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

    $scope.AgregarNota = function () {
        var AsignaturaSeleccionada = $('#AsignaturaID').val();
        if (AsignaturaSeleccionada) {
            var AsignaturaSeleccionada = parseInt(AsignaturaSeleccionada);
            var objectoAsignatura = _.findWhere($scope.listaAsignaturas, { AsignaturaID: AsignaturaSeleccionada });
            if (objectoAsignatura) {
                var validacionAsignatura = _.findWhere($scope.listaMateriasAsociadas, { AsignadoID: AsignaturaSeleccionada });
                if (!validacionAsignatura) {
                    $scope.listaMateriasAsociadas.push(objectoAsignatura);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                } else {
                    iziToast.warning({
                        title: 'Validación',
                        message: 'Ya se encuentra está materia asociada'
                    });
                }
            }
        }
    }

    $scope.ActualizarLista = function () {
        $scope.listaMateriasAsociadas = [];
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    }

    $scope.GuardarNotas = function () {
        if ($scope.listaMateriasAsociadas.length > 0) {
            $scope.listaNotasGuardar = [];
            var PersonaID = parseInt($('#PersonaID').val());
            for (var i = 0; i < $scope.listaMateriasAsociadas.length; i++) {
                var objectMateriaSeleccionada = $scope.listaMateriasAsociadas[i];
                var nota = $('#Nota' + objectMateriaSeleccionada.AsignaturaID).val();
                var objectAlmacenamiento = {
                    PersonaID: PersonaID,
                    AsignaturaID: objectMateriaSeleccionada.AsignaturaID,
                    Nota: nota
                };
                $scope.listaNotasGuardar.push(objectAlmacenamiento);
            }
        } else {
            iziToast.warning({
                title: 'Validación',
                message: 'No tiene materias agregadas para asignar'
            });
        }
    }
}]);

function SeleccionAlumno() {
    var scope = angular.element(document.getElementById('AsignarController')).scope();
    scope.ActualizarLista();
    console.log('HOLA');
}