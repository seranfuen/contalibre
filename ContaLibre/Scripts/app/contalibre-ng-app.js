// Inicializamos la aplicación mediante el patrón modulo
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