﻿// Inicializamos la aplicación mediante el patrón modulo
(function () {
    var app = angular.module("contalibreApp", []);
})();

// Servicios
(function () {
    var app = angular.module("contalibreApp");
    app.factory("$crudGruposPgc", function ($http) {
        var servicio = {};
        servicio.getCuentas = function () {
            return $http.get("/api/GruposPgc");
        };
        servicio.getGrupos = function () {
            return $http.get("/api/Grupos");
        };
        servicio.getSubgruposN2 = function (numGrupo) {
            return $http.get("/api/Grupos/getSubgrupo2/" + numGrupo);
        }
        servicio.getSubgruposN3 = function (numGrupo) {
            return $http.get("/api/Grupos/getSubgrupo3/" + numGrupo);
        }
        return servicio;
    });
})();

// Controladores

(function () {
    var app = angular.module("contalibreApp");
    app.controller("CuadroCuentasController", function ($scope, $crudGruposPgc) {
        $crudGruposPgc.getCuentas().then(function (response) {
            $scope.Cuentas = response.data;
        });
    });

    app.controller("CuentaNuevaController", function ($scope, $crudGruposPgc) {
        $crudGruposPgc.getGrupos().then(function (response) {
            $scope.grupos = response.data;
        });

        $scope.gruposN2 = [];
        $scope.actualizarGruposN2 = function () {
            if ($scope.grupoSeleccionado !== null) {
                if ($scope.gruposN2[$scope.grupoSeleccionado.numGrupo] !== undefined) {
                    $scope.gruposN2Seleccionados = $scope.gruposN2[$scope.grupoSeleccionado.numGrupo];
                } else {
                    $crudGruposPgc.getSubgruposN2($scope.grupoSeleccionado.numGrupo).then(function (response) {
                        $scope.gruposN2[$scope.grupoSeleccionado.numGrupo] = response.data;
                        $scope.gruposN2Seleccionados = $scope.gruposN2[$scope.grupoSeleccionado.numGrupo];
                    });
                }
            }
        };

        $scope.gruposN3 = [];
        $scope.actualizarGruposN3 = function () {
            if ($scope.grupoN2Seleccionado !== null) {
                if ($scope.gruposN3[$scope.grupoN2Seleccionado.numGrupo] !== undefined) {
                    $scope.gruposN3Seleccionados = $scope.gruposN3[$scope.grupoN2Seleccionado.numGrupo];
                } else {
                    $crudGruposPgc.getSubgruposN3($scope.grupoN2Seleccionado.numGrupo).then(function (response) {
                        $scope.gruposN3[$scope.grupoN2Seleccionado.numGrupo] = response.data;
                        $scope.gruposN3Seleccionados = $scope.gruposN3[$scope.grupoN2Seleccionado.numGrupo];
                    });
                }
            }
        };

    });
})();

// Directivas
(function () {
    var app = angular.module("contalibreApp");
    app.directive("cuadroCuentas", function () {
        return {
            restrict: "E",
            link: function (scope, element, attrs) {
                scope.$watch("Cuentas", function () {
                    var tbodyHtml = "<table class=\"cuadro-cuentas\">";
                    tbodyHtml += getHeaderTabla();
                    tbodyHtml += "<tbody>";
                    angular.forEach(scope.Cuentas, function (grupo, index) {
                        tbodyHtml += getFilaGrupo(grupo);
                        angular.forEach(grupo.subgruposN2, function (subgrupoN2, index) {
                            tbodyHtml += getFilaSubgrupoN2(subgrupoN2);
                            angular.forEach(subgrupoN2.subgruposN3, function (subgrupoN3, index) {
                                tbodyHtml += getFilaSubgrupoN3(subgrupoN3);
                                angular.forEach(subgrupoN3.cuentas, function (cuenta, index) {
                                    tbodyHtml += getFilaCuenta(cuenta);
                                });
                            });
                        });
                    });
                    tbodyHtml += "</tbody></table>";
                    element.html(tbodyHtml);

                    function getFilaGrupo(grupo) {
                        return "<tr><td></td><td>" + grupo.numGrupo + "</td><td colspan=\"4\">" + grupo.nombre + "</td></tr>";
                    }

                    function getFilaSubgrupoN2(grupo) {
                        return "<tr><td></td><td></td><td>" + grupo.numGrupo + "</td><td colspan=\"3\">" + grupo.nombre + "</td></tr>";
                    }

                    function getFilaSubgrupoN3(grupo) {
                        return "<tr><td colspan=\"2\"></td><td></td><td>" + grupo.numGrupo + "</td><td colspan=\"2\">" + grupo.nombre + "</td></tr>";
                    }

                    function getFilaCuenta(cuenta) {
                        return "<tr><td colspan=\"3\"></td><td></td><td>" + cuenta.codigo + "</td><td>" + cuenta.nombre + "</td></tr>";
                    }

                    function getHeaderTabla() {
                        return "<thead><th></th><th>Código</th><th colspan=\"4\">Nombre</th></thead>";
                    }
                });
            }
        }
    });
})();