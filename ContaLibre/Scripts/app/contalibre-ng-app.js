// Inicializamos la aplicación mediante el patrón modulo
(function () {
    var app = angular.module("contalibreApp", []);
})();

// Servicios
(function () {
    var app = angular.module("contalibreApp");
    app.factory("$CrudGruposPgc", function ($http) {
        var servicio = {};
        servicio.getCuentas = function () {
            return $http.get("/api/GruposPgc");
        };
        return servicio;
    });
})();

// Directivas

(function () {
    var app = angular.module("contalibreApp");
    app.directive("cuadroCuentas", function () {
        restrict: "E",
        scope = {
            cuentas: "@"
        },
        function link(scope, element, attrs) {
            var tbodyHtml = "<table class=\"cuadro-cuentas\">";
            tbodyHtml += getHeaderTabla();
            tbodyHtml += "<tbody>";
            angular.forEach(Grupos, function (grupo, index) {
                tbodyHtml += getFilaGrupo(grupo);
                angular.forEach(grupo.SubgruposN2, function (subgrupoN2, index) {
                    tbodyHtml += getFilaSubgrupoN2(subgrupoN2);
                    angular.forEach(subgrupoN2.SubgruposN3, function (subgrupoN3, index) {
                        tbodyHtml += getFilaSubgrupoN3(subgrupoN3);
                        angular.forEach(subgrupoN3.Cuentas, function (cuenta, index) {
                            tbodyHtml += getFilaCUenta(cuenta);
                        });
                    });
                });
            });
            tbodyHtml += "</tbody></table>";
            element.replaceWith(tbodyHtml);

            function getFilaGrupo(grupo) {
                return "<tr><td></td><td>" + grupo.NumGrupo + "</td><td colspan=\"4\"" + grupo.Nombre + "</td></tr>";
            }

            function getFilaSubgrupoN2(grupo) {
                return "<tr><td></td><td></td><td>" + grupo.NumGrupo + "</td><td colspan=\"3\"" + grupo.Nombre + "</td></tr>";
            }

            function getFilaSubgrupoN3(grupo) {
                return "<tr><td colspan=\"2\"></td><td></td><td>" + grupo.NumGrupo + "</td><td colspan=\"2\"" + grupo.Nombre + "</td></tr>";
            }

            function getFilaCuenta(cuenta) {
                return "<tr><td colspan=\"3\"></td><td></td><td>" + cuenta.Codigo + "</td><td>" + cuenta.Nombre + "</td></tr>";
            }

            function getHeaderTabla() {
                return "<thead><th></th><th>Código</th><th colspan=\"4\">Nombre</th></thead";
            }
        }
    });
})();